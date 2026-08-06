import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation, effect, runInInjectionContext, Injector, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { Company, Payperiodclass } from '../../Models/Common';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
import { OnboardingStateService } from '../../onboarding-state.service';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'PayPeriod',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './payperiod.component.html',
  styleUrl: './payperiod.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{

    provide: COMM_TOKEN,
    useClass: CommonService,

  }]
})
export class PayPeriodComponent implements OnChanges {
  @Input() selectedCompanyId?: number;
  @Input() payPeriodType?: string;

  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Payperiodclass>('');
  payPeriod: Payperiodclass[] = [];
  filteredOptions$!: Observable<Payperiodclass[]>;
  selectedOption?: Payperiodclass;
  @Output() payperiodEmit = new EventEmitter<Payperiodclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService, private injector: Injector
    , private stateService: OnboardingStateService) {

    effect(() => {
      const payperiodvalue = this.stateService.getPayperiod();

      if (payperiodvalue &&
        this.payPeriodType !== 'SalaryRelease') {
        this.myControl.setValue(payperiodvalue);  // update the FormControl
        this.payperiodEmit.emit(payperiodvalue);    // emit to parent
      }
    });

  }
  ngOnChanges(changes: SimpleChanges) {

    if (changes['selectedCompanyId'] || changes['payPeriodType']) {


      this.myControl.reset();


      this.payperiodEmit.emit();
    }

    if (this.selectedCompanyId) {
      this.BindPayperiod(this.selectedCompanyId);
    }
    else {
      this.BindPayperiod(0)
    }
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const payperiodvalue = this.stateService.getPayperiod();
        if (payperiodvalue) {
          this.myControl.setValue(payperiodvalue);  // update the FormControl
          this.payperiodEmit.emit(payperiodvalue);    // emit to parent
        }
      });
    });
  }



  BindPayperiod(selectedCompanyId: any) {
    if (this.payPeriodType === "Current") {
      this._commonService.GetCurrentPayperiod(selectedCompanyId).subscribe({
        next: res => {
          this.payPeriod = res.Data;
          //console.log(this.payPeriod);

          if (this.payPeriod.length > 0) {

            this.myControl.setValue(this.payPeriod[0]);
            this.payperiodEmit.emit(this.payPeriod[0]);

          } else {

            this.myControl.reset();
            this.payperiodEmit.emit();

          }

          // this.myControl.setValue(this.payPeriod[0]);
          // this.payperiodEmit.emit(this.payPeriod[0]);
          this.filteredOptions$ = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
              let searchText = '';

              if (typeof value === 'string') {
                searchText = value;
              } else if (value && typeof value === 'object' && 'payPeriod' in value) {
                searchText = value?.payPeriod;
              }

              return this._filter(searchText);
            })
          );
        },
        error: err => console.error(err.message)
      });
    }
    else if (this.payPeriodType === "All") {
      this._commonService.GetPayperiodbyCompany(selectedCompanyId).subscribe({
        next: res => {
          this.payPeriod = res.Data;
          this.filteredOptions$ = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
              let searchText = '';
              if (typeof value === 'string') {
                searchText = value;
              } else if (value && typeof value === 'object' && 'payPeriod' in value) {
                searchText = value?.payPeriod;
              }

              return this._filter(searchText);
            })
          );
        },
        error: err => console.error(err.message)
      });
    }
    else if (this.payPeriodType === "SalaryRelease") {
      this._commonService.GetPayperiodbyCompanySalaryRelease(selectedCompanyId).subscribe({
        next: res => {
          this.payPeriod = res.Data;
          this.filteredOptions$ = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => {
              let searchText = '';
              if (typeof value === 'string') {
                searchText = value;
              } else if (value && typeof value === 'object' && 'payPeriod' in value) {
                searchText = value?.payPeriod;
              }

              return this._filter(searchText);
            })
          );
        },
        error: err => console.error(err.message)
      });
    }
  }

  private _filter(value: string): Payperiodclass[] {
    const filterValue = value.toLowerCase();
    return this.payPeriod.filter(option =>
      option.payPeriod.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: Payperiodclass | null): string => {
    return option?.payPeriod ?? '';
  };


  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.payperiodEmit.emit(this.selectedOption);
  }

  clearSelection(input: HTMLInputElement) {
    console.log(input);
    this.myControl.setValue('');
    input.focus();
  }
}
