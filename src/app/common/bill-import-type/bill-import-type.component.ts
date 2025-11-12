import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { map, Observable, startWith } from "rxjs";


@Component({
  selector: 'import-type',
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
    standalone:true,
  templateUrl: './bill-import-type.component.html',
  styleUrl: './bill-import-type.component.css'
})
export class BillImportTypeComponent {
  @Output() importType = new EventEmitter<any>();
myControl = new FormControl<ImportTypeUI | string>('');   // <-- typed control
  options: ImportTypeUI[] = [
    { value: 0, Text: "Billable Days" },
    { value: 1, Text: "Arrear Billable Days" },
    { value: 2, Text: "Billable Report" }
  ];

  filteredOptions$!: Observable<ImportTypeUI[]>;
onOptionSelected(event){
this.importType.emit(event);
}
  ngOnInit() {
    this.filteredOptions$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.Text || '')),
      map(name => this._filter(name))
    );
  }

  private _filter(value: string): ImportTypeUI[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.Text.toLowerCase().includes(filterValue));
  }

  // For displaying selected option text
  displayFn(option: ImportTypeUI): string {
    return option && option.Text ? option.Text : '';
  }
}

export interface ImportTypeUI {
  value: number;
  Text: string;
}
