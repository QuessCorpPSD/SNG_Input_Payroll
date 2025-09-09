import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnChanges, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, startWith, map } from 'rxjs';
import { Groupnameclass } from '../../Models/Common';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

@Component({
  selector: 'groupname',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './groupname.component.html',
  styleUrl: './groupname.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{

    provide: COMM_TOKEN,
    useClass: CommonService,

  }]
})
export class GroupnameComponent {
@Input() selectedCompanyId?: number;
  options: string[] = [];
  searchText: string = '';
  myControl = new FormControl<string | Groupnameclass>('');
  siteName: Groupnameclass[] = [];
  filteredOptions$!: Observable<Groupnameclass[]>;
  selectedOption?: Groupnameclass;
  @Output() sitenameEmit = new EventEmitter<Groupnameclass>();
  constructor(@Inject(COMM_TOKEN) private _commonService: ICommonService) {

  }
  ngOnChanges() {
    if (this.selectedCompanyId) {
      this.Bindmapname(this.selectedCompanyId);
    }
  }

  Bindmapname(selectedCompanyId: any) {
    this._commonService.GetSitesByCompanyId(selectedCompanyId).subscribe({
      next: res => {
        this.siteName = res.Data;
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            let searchText = '';

            if (typeof value === 'string') {
              searchText = value;
            } else if (value && typeof value === 'object' && 'siteName' in value) {
              searchText = value?.siteName;
            }

            return this._filter(searchText);
          })
        );
      },
      error: err => console.error(err.message)
    });
  }

  private _filter(value: string): Groupnameclass[] {
    const filterValue = value.toLowerCase();
    return this.siteName.filter(option =>
      option.siteName.toLowerCase().includes(filterValue)
    );
  }

  displayFn = (option: any): string => option?.siteName ?? option.siteName;

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.sitenameEmit.emit(this.selectedOption);
  }
}

