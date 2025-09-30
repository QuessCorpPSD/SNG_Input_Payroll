import { Component, EventEmitter, Inject, InjectionToken, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InvoiceType } from '../../Models/invoicetype';
import { ICommonService } from '../../Repository/ICommonService';
import { map, Observable, startWith } from 'rxjs';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { CommonService } from '../../Service/CommonService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';

export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'invoicetype',
  standalone: true,
  imports: [CommonModule,
      ReactiveFormsModule,
      MatAutocompleteModule,
      MatInputModule,
      MatFormFieldModule],
  templateUrl: './invoicetype.component.html',
  styleUrl: './invoicetype.component.css',
  providers:[ {
    
          provide: COMM_TOKEN,
          useClass: CommonService,
    
        }]
})
export class InvoicetypeComponent {
searchText: string = '';
  myControl = new FormControl<string | InvoiceType>('');
  companyCode: InvoiceType[] = [];
  filteredOptions$!: Observable<InvoiceType[]>;
  selectedOption?: InvoiceType;
  userdetail!: any;
  @Output() invoicetypeEmit = new EventEmitter<InvoiceType>();

  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService
    , private _sessionStoreage: SessionStorageService, private decry: EncryptionService) {
  }

  value: string = '';

  // callbacks from Angular forms
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional, in case you need disable support
  }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindCompanyCode();
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
  }

  BindCompanyCode() {
    this._commonService.GetInvoiceType().subscribe({
      next: res => {
        //console.log(res);
        this.companyCode = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'geN_vDescription' in value) {
              searchText = value?.geN_vDescription;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): InvoiceType[] {
    const filterValue = value.toLowerCase();
    return this.companyCode.filter(option =>
      option.geN_vDescription.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.geN_vDescription ?? option.geN_vDescription;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.onChange(option); // update parent form
    this.onTouched();
    this.invoicetypeEmit.emit(this.selectedOption);
  }
}
