import { Component, EventEmitter, forwardRef, InjectionToken, Output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { ICommonService } from '../../Repository/ICommonService';
import { CommonService } from '../../Service/CommonService';
import { MatInputModule } from "@angular/material/input";
import { CommonModule } from '@angular/common';

// Define ItemType interface if not imported from elsewhere
export interface ItemType {
  itemName: any;
  id: number;
  code: string;
  description: string;
}

@Component({
  selector: 'app-poitemtype',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './poitemtype.component.html',
  styleUrl: './poitemtype.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => POItemtypeComponent),
      multi: true
    },
    { provide: new InjectionToken<ICommonService>('COMM_TOKEN'), useClass: CommonService }
  ],
  encapsulation: ViewEncapsulation.None,
})
export class POItemtypeComponent {
  myControl = new FormControl<ItemType | string>('');
  itemTypeList: ItemType[] = [];
  filteredOptions$!: Observable<ItemType[]>;
  selectedItemType!: ItemType | null;

  @Output() itemTypeEmit = new EventEmitter<ItemType>();

  constructor(private service: CommonService) { }

  ngOnInit(): void {
    this.service.GetPOItemType().subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);  
        this.itemTypeList = res.data || [];

        // console.log('Item Type List:', this.itemTypeList);  

        this.filteredOptions$ = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || ''))
        );
      },
      error: (err) => console.error('Error fetching Item Type:', err)
    });
  }


  private _filter(value: string | ItemType): ItemType[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.description?.toLowerCase() || '';

    return this.itemTypeList.filter(option =>
      option.description.toLowerCase().includes(filterValue)
    );
  }



  displayFn(item: ItemType): string {
    return item ? item.description : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selected: ItemType = event.option.value;
    if (selected) {
      // console.log('Selected option:', selected);
      this.selectedItemType = selected;
      this.itemTypeEmit.emit(selected);
    } else {
      console.warn('Selected option is undefined');
    }
  }
  selectByDescription(description: string) {
    if (!description) return;

    const match = this.itemTypeList.find(i => {
      const itemDesc = i.description?.toLowerCase() || '';
      return itemDesc.includes(description.toLowerCase());
    });

    if (match) {
      this.myControl.setValue(match); // ✅ sets autocomplete field
      this.selectedItemType = match;
      this.itemTypeEmit.emit(match);
    } else {
      console.warn('No matching ItemType found for description:', description);
    }
  }


}
