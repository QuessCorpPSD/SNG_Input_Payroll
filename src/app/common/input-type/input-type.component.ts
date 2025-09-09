import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output,ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { InputTypeclass } from '../../Models/Common';
export  const COMM_TOKEN=new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'inputType',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './input-type.component.html',
  styleUrl: './input-type.component.css',
    encapsulation: ViewEncapsulation.None ,
    providers:[{
      
              provide: COMM_TOKEN,
              useClass: CommonService,
            
    }]
})
export class InputTypeComponent implements OnInit {
  searchText: string = '';
myControl = new FormControl<string | InputTypeclass>('');
 inputType: InputTypeclass[] = [];
  filteredOptions$!: Observable<InputTypeclass[]>;
  selectedOption?: InputTypeclass;
  @Output() inputTypeEmit = new EventEmitter<InputTypeclass>();
constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService)
{

}

  ngOnInit(): void {
    this.BindInputType();
    
  }
BindInputType() {
    this._commonService.GetInputType().subscribe({
      next: res => {
        this.inputType = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
  startWith(''),
  map(value => {
    let searchText = '';

    if (typeof value === 'string') {
      searchText = value;
    } else if (value && typeof value === 'object' && 'inputType' in value) {
      searchText = value?.inputType;
    }

    return this._filter(searchText);
  })
);
      },
      error: err => console.error(err.message)
    });
  }

private _filter(value: string): InputTypeclass[] {
  const filterValue = value.toLowerCase();
  return this.inputType.filter(option =>
    option.inputType.toLowerCase().includes(filterValue)
  );
}

  displayFn = (option: any): string => option?.inputType ??option.inputType;

  onOptionSelected(option: any) {
    this.selectedOption = option;
   this.inputTypeEmit.emit(this.selectedOption);
  }
}