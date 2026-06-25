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
import { OnboardingStateService } from "../../onboarding-state.service";
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
import { EncryptionService } from '../../Shared/encryption.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'CompanyPicker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {

      provide: COMM_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanyComponent),
      multi: true
    }
  ]
})
export class CompanyComponent implements OnInit, OnChanges {
  searchText: string = '';
  myControl = new FormControl<string | Company>('');
  companyCode: Company[] = [];
  filteredOptions$!: Observable<Company[]>;
  userdetail!: any;
  user_id?: string | null;
  selectedOption?: Company | null;
  @Input() disabled: boolean = false;
  @Output() companyEmit = new EventEmitter<Company | null>();

  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService, private injector: Injector
    , private _sessionStoreage: SessionStorageService, private stateService: OnboardingStateService,
    private decry: EncryptionService) {

    effect(() => {
      const companyValue = this.stateService.getCompany();

      if (companyValue) {
        this.myControl.setValue(companyValue);  // update the FormControl
        this.companyEmit.emit(companyValue);    // emit to parent
      }
    });
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
      //console.log(this.userdetail.user_Id);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindCompanyCode();
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const companyValue = this.stateService.getCompany();
        if (companyValue) {
          this.myControl.setValue(companyValue);  // update the FormControl
          this.companyEmit.emit(companyValue);    // emit to parent
        }
      });
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    const companyvalue = this.stateService.getCompany()
    //   const companyvalue = this.stateService.companySignal();
    if (companyvalue) {
      //alert("Hi");
      this.myControl.setValue(companyvalue);
      this.companyEmit.emit(companyvalue);
    }
  }


  BindCompanyCode() {
    this._commonService.GetCompanyCodes(this.userdetail.user_Id).subscribe({
      next: res => {
        console.log(res);
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

  clearSelection(input: HTMLInputElement) {
    this.selectedOption = null;

    this.myControl.setValue(null);

    this.onChange(null);
    this.onTouched();
    this.companyEmit.emit(null);

    input.blur();

    console.log('Selection cleared:', this.selectedOption, this.myControl.value);
  }
}
