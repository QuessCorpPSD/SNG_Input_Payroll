import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { Cityclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'city',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: COMM_TOKEN,
    useClass: CommonService,
  }]
})
export class CityComponent {
  @Input() selectedCompanyId?: string;
  @Input() selectedGroupId?: string;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Cityclass>('');
  cityName: Cityclass[] = [];
  filteredOptions$!: Observable<Cityclass[]>;
  selectedOption?: Cityclass;
  @Output() citynameEmit = new EventEmitter<Cityclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnChanges() {
    if (this.selectedCompanyId && this.selectedGroupId) {
      this.Bindmapname(this.selectedCompanyId, this.selectedGroupId);
    }
  }

  Bindmapname(selectedCompanyId: any, selectedGroupId: any) {
    this._commonService.GetCityByCompanyCode(selectedCompanyId, selectedGroupId).subscribe({
      next: res => {
        this.cityName = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'city_Name' in value) {
              searchText = value?.city_Name;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Cityclass[] {
    const filterValue = value.toLowerCase();
    return this.cityName.filter(option =>
      option.city_Name.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.city_Name ?? option.city_Name;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.citynameEmit.emit(this.selectedOption);
  }
}


