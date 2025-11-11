import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { Payperiodclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');


@Component({
  selector: 'payperiod-salary',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './payperiod-salary.component.html',
  styleUrl: './payperiod-salary.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService
  }]
})
export class PayperiodSalaryComponent {
@Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Payperiodclass>('');
  PayPeriod: Payperiodclass[] = [];
  filteredOptions$!: Observable<Payperiodclass[]>;
  selectedOption?: Payperiodclass;
  @Output() payperiodEmit = new EventEmitter<Payperiodclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnChanges() {
    if (this.selectedCompanyId) {
      this.BindPayperiod(this.selectedCompanyId);
    }
  }

  BindPayperiod(selectedCompanyId: any) {
    this._commonService.GetPayperiodbyCompany(selectedCompanyId).subscribe({
      next: res => {
        this.PayPeriod = res.Data;
        console.log(res.Data);
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

  private _filter(value: string): Payperiodclass[] {
    const filterValue = value.toLowerCase();
    return this.PayPeriod.filter(option =>
      option.payPeriod.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.payPeriod ?? option.payPeriod;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.payperiodEmit.emit(this.selectedOption);
  }
}