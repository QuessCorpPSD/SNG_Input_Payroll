import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { AttributeAddComponent } from '../attribute-add/attribute-add.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

export interface IListBoxItem {
  value: string;
  text: string;
}

export interface AttributeParams {
  CompanyId: number;
  PayPeriodId: number;
  LotNo: string;
  Map_Name_Id: number;
  Invoice_Category_Id: number;
  CreatedBy: string;
}
/**
* Helper interface to emit event when
* items are moved between boxes
*/
export interface AttributeItem {
  text: string;
  value?: any;   // optional if needed
}
export interface IItemsMovedEvent {
  available: Array<{}>;
  selected: Array<{}>;
  movedItems: Array<{}>;
  from: 'selected' | 'available';
  to: 'selected' | 'available';
}
@Component({
  selector: 'attribute',
  standalone: true,
  imports: [CommonModule, AttributeAddComponent, ReactiveFormsModule, MatIconModule, DragDropModule, MatCardModule],
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.css'
})
export class AttributeComponent implements OnInit, OnChanges {
  availableItems: Array<IListBoxItem> = [];
  filteredAvailableItems: Array<IListBoxItem> = [];
  selectedItems: Array<IListBoxItem> = [];
  listBoxForm!: FormGroup;
  finalHeaders: any;
  SelectedRows: Array<AttributeParams> = [];
  isLoading = false;

  @Output() close = new EventEmitter<void>();
  @Input() Company_Code?: string;
  @Input() pay_period?: string;
  IsAdd: boolean = false;
  @Input() set availables(items: Array<{}>) {
    this.availableItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
    }))];
  }

  @Input() set selects(items: Array<{}>) {
    this.selectedItems = [...(items || []).map((item: {}, index: number) => ({
      value: item[this.valueField].toString(),
      text: item[this.textField],
    }))];
  }

  // field to use for value of option
  @Input() valueField = 'value';
  // field to use for displaying option text
  @Input() textField = 'text';
  // text displayed over the available items list box
  availableText = 'Available UserNames';
  // text displayed over the selected items list box
  @Input() selectedText = 'Selected UserNames';
  // set placeholder text in available items list box
  @Input() availableFilterPlaceholder = 'Search & Select available Attribute';
  // set placeholder text in selected items list box
  @Input() selectedFilterPlaceholder = ' Search & Selected Attribute';
  @Input() AttributeType?: string;
  @Input() ScreenName?: string;
  @Input() SelectedAttributeRows: any[] = [];

  // event called when items are moved between boxes, returns state of both boxes and item moved
  @Output() itemsMoved: EventEmitter<IItemsMovedEvent> = new EventEmitter<IItemsMovedEvent>();

  constructor(public fb: FormBuilder) {
    this.listBoxForm = this.fb.group({
      availableSearchInput: [''],
      selectedSearchInput: [''],
    });
  }
  ngOnInit(): void {

    this.filteredAvailableItems = [...this.availableItems]

    console.log('1', this.filteredAvailableItems);

    this.listBoxForm.get("availableSearchInput")?.valueChanges.subscribe(response => {

      const searchText = response?.trim().toLowerCase() ?? "";

      // Step 1: Start from all available items
      let filtered = [...this.availableItems];

      // Step 2: Apply search filter (if any)
      if (searchText !== "") {
        filtered = filtered.filter(x =>
          x.text.toLowerCase().includes(searchText)
        );
      }

      // Step 3: Remove items that are already selected
      filtered = filtered.filter(a =>
        !this.selectedItems.some(s => s.value === a.value)
      );

      // Step 4: Assign to UI list
      this.filteredAvailableItems = filtered;

      console.log('2', this.filteredAvailableItems);
    });

  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  drop(event: CdkDragDrop<IListBoxItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    // clear marked available items and emit event
    this.itemsMoved.emit({
      available: this.availableItems,
      selected: this.selectedItems,
      movedItems: event.container.data.filter((v, i) => i === event.currentIndex),
      from: 'available',
      to: 'selected',
    });
  }
  AttributeAdd() {
    this.IsAdd = true;
  }

  closeclick() {

    this.close.emit();
  }
  AttributesTemplateclick() {

    if (this.selectedItems.length == 0) {
      alert('Please select atleast one Attributes');
      return;
    }

    const selectedAttributes = this.selectedItems
      .map(attr => attr.value);

    const baseHeaders = ["LotNo", "Employee_Code"];
    const GSTheaders = ["Invoice_Number"];

    this.finalHeaders = [...GSTheaders, ...selectedAttributes];
    const data: any[][] = [this.finalHeaders];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "Attributes_Template.xlsx");

  }


  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  //   }
  // }
  closeDialog() {
    //this.dialogRef.close();
  }
}



