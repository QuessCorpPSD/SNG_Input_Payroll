import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { Company, CompanyGSTInvoice } from '../../Models/Common';
import { OnboardingStateService } from '../../onboarding-state.service';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { COMM_TOKEN } from '../financial-year/financial-year.component';

@Component({
  selector: 'companygstinvoice',
  standalone:true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule, FormsModule],
  templateUrl: './companygstinvoice.component.html',
  styleUrl: './companygstinvoice.component.css',
  providers: [
    {

      provide: COMM_TOKEN,
      useClass: CommonService,

    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CompanygstinvoiceComponent),
      multi: true
    }
  ]

})
export class CompanygstinvoiceComponent {
  searchText: string = '';
  myControl = new FormControl<CompanyGSTInvoice | null>(null);
  companyCode: CompanyGSTInvoice[] = [];
  filteredOptions$!: Observable<CompanyGSTInvoice[]>;
  selectedOption?: CompanyGSTInvoice | null;
  @Input() CompanyId: any;
  userdetail!: any;

  @Output() companyEmit = new EventEmitter<CompanyGSTInvoice | null>();


  constructor(
    @Inject(COMM_TOKEN) private _commonService: ICommonService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private stateService: OnboardingStateService
  ) {
    effect(() => {
      const companyValue = this.stateService.getCompanyGST();

      if (companyValue) {
        this.myControl.setValue(companyValue);
        this.companyEmit.emit(companyValue);
      }
    });
  }

  value: string = '';

  // Angular forms callbacks
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    if (!value) return;

    // CASE 1: only ID comes from parent
    if (typeof value === 'number') {
      const match = this.resolveCompany(value);

      if (match) {
        this.selectedOption = match;
        this.myControl.setValue(match, { emitEvent: false });
      }
      return;
    }

    // CASE 2: full object
    this.selectedOption = value;
    this.myControl.setValue(value);
  }
  private resolveCompany(companyId: number): CompanyGSTInvoice | null {
    return (
      this.companyCode.find(c => Number(c.companyId) === Number(companyId)) || null
    );
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindCompanyCode();
  }

BindCompanyCode() {
  this._commonService.GetCompanyCodes(this.userdetail.user_Id).subscribe({
    next: res => {
      this.companyCode = res.Data;

      // 🔥 rebind after data load
      if (this.CompanyId) {
        const match = this.resolveCompany(this.CompanyId);

        if (match) {
          this.selectedOption = match;
          this.myControl.setValue(match, { emitEvent: false });
          this.companyEmit.emit(match);
        }
      }

      this.filteredOptions$ = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const text =
            typeof value === 'string'
              ? value
              : value?.displayName || '';

          return this._filter(text);
        })
      );
    }
  });
}

  setCompanyById(id: any) {
    const match = this.companyCode.find(
      c => Number(c.companyId) === Number(id)
    );

    if (match) {
      this.selectedOption = match;
      this.myControl.setValue(match, { emitEvent: false });

      this.onChange(match.companyId);
      this.companyEmit.emit(match);
    }
  }

  private _filter(value: string): CompanyGSTInvoice[] {
    const filterValue = value.toLowerCase();
    return this.companyCode.filter(option =>
      option.displayName.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: CompanyGSTInvoice | null): string => option?.displayName ?? '';

  onOptionSelected(option: CompanyGSTInvoice) {
    this.selectedOption = option;
    this.myControl.setValue(option);
    this.onChange(option);
    this.onTouched();
    this.companyEmit.emit(option);
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
  ngOnChanges() {
    if (this.CompanyId && this.companyCode.length) {
      this.setCompanyById(this.CompanyId);
    }
  }
}
