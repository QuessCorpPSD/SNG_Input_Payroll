import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, EventEmitter, forwardRef, Inject, InjectionToken, Injector, Input, OnChanges, OnInit, Output, runInInjectionContext, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { Company } from '../../Models/Common';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { OnboardingStateService } from "../../onboarding-state.service";
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'companyall',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './companyall.component.html',
  styleUrl: './companyall.component.css',
  encapsulation: ViewEncapsulation.None,
    providers: [
      {
  
        provide: COMM_TOKEN,
        useClass: CommonService,
  
      },
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CompanyallComponent),
        multi: true
      }
    ]
})
export class CompanyallComponent {
searchText: string = '';
  myControl = new FormControl<string | Company>('');
  companyCode: Company[] = [];
  filteredOptions$!: Observable<Company[]>;
  selectedOption?: Company;
  userdetail!: any;
  @Output() companyEmit = new EventEmitter<Company>();

  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService
    , private _sessionStoreage: SessionStorageService, private decry: EncryptionService, private stateService: OnboardingStateService) {
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
  }

  BindCompanyCode() {
    this._commonService.GetCompanyCodes(this.userdetail.user_Id).subscribe({
      next: res => {
        //console.log(res);
        this.companyCode = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'displayName' in value) {
              searchText = value?.displayName;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Company[] {
    const filterValue = value.toLowerCase();
    return this.companyCode.filter(option =>
      option.displayName.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.displayName ?? option.displayName;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.onChange(option); // update parent form
    this.onTouched();
    this.companyEmit.emit(this.selectedOption);
  }
}
