import { Component, EventEmitter, Inject, InjectionToken, Input, OnChanges, OnInit, Output,ViewEncapsulation} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { CommonService } from '../../Service/CommonService';
import { Company } from '../../Models/Common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { IPORespository } from '../../Repository/IPORepository';
import { PoRespository } from '../../Service/PoRespository';
export  const COMM_TOKEN=new InjectionToken<IPORespository>('COMM_TOKEN');
@Component({
  selector: 'ponumbersearch',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './ponumbersearch.component.html',
  styleUrl: './ponumbersearch.component.css',
  providers:[{
      
              provide: COMM_TOKEN,
              useClass: PoRespository,
            
    }]
})
export class PonumbersearchComponent implements OnInit,OnChanges {
  searchText: string = '';
  myControl = new FormControl<string | PONumber>('');
  ponumber: PONumber[] = [];
  filteredOptions$!: Observable<PONumber[]>;
  selectedOption?: Company;
  userdetail! : any;
  companyCode: PONumber[] = [];
  @Input() comapnyId!:number;
  constructor(@Inject(COMM_TOKEN) private _commonService: IPORespository){}
  @Output() ponumbersearchEmit = new EventEmitter<any>();

  displayFn = (option: any): string => option?.ponumber ??option.ponumber;
ngOnInit(): void {
  this.BindCompanyCode(this.comapnyId);
}
ngOnChanges(){
    this.BindCompanyCode(this.comapnyId);
}
BindCompanyCode(companyId) {
  
    this._commonService.POSearch(companyId).subscribe({
      next: res => {
        //console.log(res);
        this.companyCode = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
  startWith(''),
  map(value => {
    let searchText = '';

    if (typeof value === 'string') {
      searchText = value;
    } else if (value && typeof value === 'object' && 'ponumber' in value) {
      searchText = value?.ponumber;
    }

    return this._filter(searchText);
  })
);
      },
      error: err => console.error(err.message)
    });
  }

private _filter(value: string): PONumber[] {
  const filterValue = value.toLowerCase();
  return this.companyCode.filter(option =>
    option.ponumber.toLowerCase().includes(filterValue)
  );
}
  onOptionSelected(option: any) {
    this.selectedOption = option;
   this.ponumbersearchEmit.emit(this.selectedOption);
  }
}
export interface PONumber{
  poid:number;
  ponumber:string;
}
