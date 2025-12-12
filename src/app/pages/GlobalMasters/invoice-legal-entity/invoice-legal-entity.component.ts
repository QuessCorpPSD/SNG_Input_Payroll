import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormsModule } from '@angular/forms';

import { AddInvoiceLegalEntityComponent } from '../add-invoice-legal-entity/add-invoice-legal-entity.component';
import { InvoiceLegalEntityService } from '../../../Service/GlobalMasters/invoice-legal-entity.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-invoice-legal-entity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AlertpopupComponent,
    MatCardModule
  ],
  templateUrl: './invoice-legal-entity.component.html',
  styleUrls: ['./invoice-legal-entity.component.css']
})
export class InvoiceLegalEntityComponent implements AfterViewInit {

  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>([]);

  entityName: string = "";
  showTable: boolean = false;


  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  uploadDisplayedColumns: string[] = ['SI No', 'Entity Name'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private invoiceService: InvoiceLegalEntityService,
    private _sessionStorage: SessionStorageService,
    private decry: EncryptionService,
    private fb: FormBuilder,
  ) { }


  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }


  onSearchClick() {
    this.isLoading = true;

    this.invoiceService.InvoiceSearch().subscribe({
      next: (res: any) => {
        this.isLoading = false;

        let table = res?.Data?.data?.Table0 || [];

        // filter
        if (this.entityName.trim() !== "") {
          const keyword = this.entityName.trim().toLowerCase();
          table = table.filter((x: any) =>
            (x.EntityName || "").toLowerCase().includes(keyword)
          );
        }

        if (!table.length) {
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          this.showTable = true;
          this.showAlertPopup("No records found");
          return;
        }

        this.uploadedData = table.map((r: any) => ({
          'SI No': r.Serial_No,
          'Entity Name': r.EntityName,
          'Id': r.Id
        }));

        this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;

        this.showTable = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Search Error:", err);
        this.showAlertPopup("Failed to load Invoice Legal Entity data");
      }
    });
  }


  exportToExcel(): void {
    if (!this.uploadedData || this.uploadedData.length === 0) {
      this.showAlertPopup("No data available to export");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uploadedData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoice Legal Entity');

    const fileName = `InvoiceLegalEntity_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.showAlertPopup("Excel downloaded successfully!");
  }

  AddPOOpen() {
    this.dialog.open(AddInvoiceLegalEntityComponent, {
      width: '35%',
      height: '33.5vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any) {
  }
}
