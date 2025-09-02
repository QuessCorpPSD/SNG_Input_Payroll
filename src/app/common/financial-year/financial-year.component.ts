import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output,ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { FinancialYear } from '../../Models/Financeyear';
export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'financial-year',
  standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './financial-year.component.html',
  styleUrl: './financial-year.component.css',
  encapsulation: ViewEncapsulation.None ,
  providers:[{
    
            provide: COMM_TOKEN,
            useClass: CommonService,
          
  }]
})
export class FinancialYearComponent implements OnInit {
  searchText: string = '';
myControl = new FormControl<string | FinancialYear>('');
 financialYear: FinancialYear[] = [];
  filteredOptions$!: Observable<FinancialYear[]>;
  selectedOption?: FinancialYear;
  @Output() financialEmit = new EventEmitter<FinancialYear>();
constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService)
{

}

  ngOnInit(): void {
    this.BindFinancialYear();
    
  }
BindFinancialYear() {
    this._commonService.GetFinancialYears().subscribe({
      next: res => {
        this.financialYear = res.Data;

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
  startWith(''),
  map(value => {
    let searchText = '';

    if (typeof value === 'string') {
      searchText = value;
    } else if (value && typeof value === 'object' && 'financial_Year_Name' in value) {
      searchText = value?.financial_Year_Name;
    }

    return this._filter(searchText);
  })
);
      },
      error: err => console.error(err.message)
    });
  }

private _filter(value: string): FinancialYear[] {
  const filterValue = value.toLowerCase();
  return this.financialYear.filter(option =>
    option.financial_Year_Name.toLowerCase().includes(filterValue)
  );
}

  displayFn = (option: any): string => option?.financial_Year_Name ??option.financial_Year_Name;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    console.log(option);
   this.financialEmit.emit(this.selectedOption);
  }
}
