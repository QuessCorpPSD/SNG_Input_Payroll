import { Component, EventEmitter, Inject, InjectionToken, Injector, Input, OnChanges, Output } from '@angular/core';
import { Payperiodclass } from '../../Models/Common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonService } from '../../Service/CommonService';

export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'payperiodsequence',
  standalone:true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './payperiodsequence.component.html',
  styleUrl: './payperiodsequence.component.css',
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService,
  }]
})
export class PayperiodsequenceComponent implements OnChanges {
 @Input() selectedCompanyId?: number;
  @Input() payPeriodType?: string;

  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Payperiodclass>('');
  payPeriod: Payperiodclass[] = [];
  filteredOptions$!: Observable<Payperiodclass[]>;
  selectedOption?: Payperiodclass;
  @Output() payperiodEmit = new EventEmitter<Payperiodclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService,  private injector: Injector
      ) {

  

  }
  ngOnChanges() {
    if (this.selectedCompanyId) {
      this.BindPayperiod(this.selectedCompanyId);
    }
      
  }



  BindPayperiod(selectedCompanyId: any) {
    
    if (this.payPeriodType === "Current") {
      this._commonService.GetCurrentPayperiod(selectedCompanyId).subscribe({
        next: res => {
          this.payPeriod = res.Data;
          //console.log(this.payPeriod);
          this.myControl.setValue(this.payPeriod[0]);
          this.payperiodEmit.emit(this.payPeriod[0]);
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
         // console.log(this.payPeriod);
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

  displayFn = (option: any): string => option?.payPeriod ?? option.payPeriod;


  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.payperiodEmit.emit(this.selectedOption);
  }
}


