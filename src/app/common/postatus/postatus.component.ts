import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Inject, InjectionToken, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';

export interface POStatus {
  posid: number;
  statuS_ID: number;
  statuS_NAME: string;
  isactive: number;
}

@Component({
  selector: 'app-po-status',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => POStatusComponent),
      multi: true
    },
    { provide: new InjectionToken<ICommonService>('COMM_TOKEN'), useClass: CommonService }
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './postatus.component.html',
  styleUrls: ['./postatus.component.css']
})
export class POStatusComponent implements OnInit {
  myControl = new FormControl('');
  poStatusList: POStatus[] = [];
  filteredOptions$!: Observable<POStatus[]>;
  selectedStatus!: POStatus | null;

  @Output() postatusEmit = new EventEmitter<POStatus>();

  constructor(private service: CommonService) {}

  ngOnInit(): void {
    this.service.GetPOStatus().subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);
        this.poStatusList = res.Data || [];   // API returns {data: [...]}
        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      },
      error: (err) => console.error('Error fetching PO Status:', err)
    });
  }

  private _filter(value: string | POStatus): POStatus[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.statuS_NAME?.toLowerCase() || '';

    return this.poStatusList.filter(option =>
      option.statuS_NAME.toLowerCase().includes(filterValue)
    );
  }

  displayFn(po: POStatus): string {
    return po ? po.statuS_NAME : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selected: POStatus = event.option.value;
    if (selected) {
      // console.log('Selected option:', selected);
      this.selectedStatus = selected;
      this.postatusEmit.emit(selected);
    } else {
      console.warn('Selected option is undefined');
    }
  }
}
