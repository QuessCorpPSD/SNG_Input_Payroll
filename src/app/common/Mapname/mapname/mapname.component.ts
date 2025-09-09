import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { Company, Mapnameclass } from '../../../Models/Common';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'mapname',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './mapname.component.html',
  styleUrl: './mapname.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{

    provide: COMM_TOKEN,
    useClass: CommonService,

  }]
})
export class MapnameComponent implements OnChanges {
  @Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Mapnameclass>('');
  mapName: Mapnameclass[] = [];
  filteredOptions$!: Observable<Mapnameclass[]>;
  selectedOption?: Mapnameclass;
  @Output() mapnameEmit = new EventEmitter<Mapnameclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnChanges() {
    if (this.selectedCompanyId) {
      this.Bindmapname(this.selectedCompanyId);
    }
  }

  Bindmapname(selectedCompanyId: any) {
    this._commonService.GetMapNamebyCompany(selectedCompanyId).subscribe({
      next: res => {
        this.mapName = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'mapName' in value) {
              searchText = value?.mapName;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Mapnameclass[] {
    const filterValue = value.toLowerCase();
    return this.mapName.filter(option =>
      option.mapName.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.mapName ?? option.mapName;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.mapnameEmit.emit(this.selectedOption);
  }
}
