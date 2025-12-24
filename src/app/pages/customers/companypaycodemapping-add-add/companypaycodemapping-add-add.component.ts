import { Component, EventEmitter, Inject, InjectionToken, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from "@angular/material/checkbox";
import { CompanypaycodemappingService } from '../../../Service/customersserv/companypaycodemapping.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { ICompanypaycodemapping } from '../../../Repository/customer/ICompanypaycodemapping';
export const Pay_TOKEN = new InjectionToken<ICompanypaycodemapping>('Pay_TOKEN');

@Component({
  selector: 'app-companypaycodemapping-add-add',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatCardModule, MatTooltipModule, CommonModule, MatCheckbox, FormsModule, ReactiveFormsModule, MatPaginatorModule, AlertpopupComponent],
  templateUrl: './companypaycodemapping-add-add.component.html',
  styleUrl: './companypaycodemapping-add-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CompanypaycodemappingService,
    }
  ]
})
export class CompanypaycodemappingAddAddComponent {
  @Output() selectedData = new EventEmitter<any>();  // Emit selected rows to parent
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  uploadDisplayedColumns: string[] = ['Checkbox', 'Paycode', 'Description', 'Paytype'];
  filterDisplayedColumns: string[] = ['FilterCheckbox', 'FilterPaycode', 'FilterDescription', 'FilterPaytype'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  selectedRows: any[] = [];  // Store selected rows
  selectAll: boolean = false;  // State for "Select All" checkbox

  constructor(
    private dialogRef: MatDialogRef<CompanypaycodemappingAddAddComponent>,
    @Inject(Pay_TOKEN) private companypaycodemappingService: ICompanypaycodemapping,
  ) { }
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  // Method to close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  ngOnInit(): void {
    const payload = {
      paycode_Code: '',
      PayTypeId: 0,
      IsTaxable: 0,
      PayId: 0
    };

    this.loadPaycodes(payload);

  }

  loadPaycodes(payload: any): void {
    this.companypaycodemappingService.paycodeSearch(payload).subscribe({
      next: (data: any) => {
        this.uploadedData = data.Data.data.Table0;
        this.uploadedDataSource.data = this.uploadedData;
      },
      error: (err: any) => {
        console.error('Error fetching paycodes:', err);
      }
    });
  }

  // Check if the row is selected
  isChecked(row: any): boolean {
    return this.selectedRows.some(r => r.Paycode_Code === row.Paycode_Code);
  }



  // Handle Select All checkbox change
  onSelectAllChange(event: any): void {
    if (event.checked) {
      this.selectedRows = [...this.uploadedData];  // Select all rows
    } else {
      this.selectedRows = [];  // Deselect all rows
    }
    this.selectedData.emit(this.selectedRows);  // Emit selected rows to parent
  }

  // Close the dialog
  onClose(): void {
    this.dialogRef.close();
  }
  onCheckboxChange(event: any, row: any): void {
    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(r => r.Paycode_Code !== row.Paycode_Code);
    }
  }

  onSave(): void {
    const rowsWithSno = this.selectedRows.map((r, index) => ({
      ...r,
      SNo: this.uploadedData.indexOf(r) + 1
    }));

    this.dialogRef.close(rowsWithSno);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.uploadedDataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.uploadedDataSource.filter = filterValue;
  }
}