
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output,ViewEncapsulation} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Company } from '../../Models/Common';
import { map, Observable, startWith } from 'rxjs';
import { CommonService } from '../../Service/CommonService';
import { ICommonService } from '../../Repository/ICommonService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');
@Component({
  selector: 'potype',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './potype.component.html',
  styleUrl: './potype.component.css',
    providers:[{
        
                provide: COMM_TOKEN,
                useClass: CommonService,
              
      }]
})
export class PotypeComponent {
  searchText: string = '';
  myControl = new FormControl<string | Company>('');
  ponumber: Company[] = [{"company_Id":1,"companyName":"REGULAR","companyCode":"","displayName":"Regular"},{"company_Id":2,"companyName":"THIRDPARTY","companyCode":"THIRDPARTY","displayName":"ThirdParty"}];
  //$!: Observable<Company[]>; 
  selectedOption?: Company;
  userdetail! : any;
  @Output() potypeEmit = new EventEmitter<any>();

  displayFn = (option: any): string => option?.displayName ??option.displayName;
  
  private _filter(value: string): Company[] {
  const filterValue = value.toLowerCase();
  return this.ponumber.filter(option =>
    option.displayName.toLowerCase().includes(filterValue)
  );
}

      filteredOptions$ = this.myControl.valueChanges.pipe(
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

  onOptionSelected(option: any) {
    this.selectedOption = option;
    console.log('POType', JSON.stringify(this.selectedOption));
   this.potypeEmit.emit(this.selectedOption);
  }
}
