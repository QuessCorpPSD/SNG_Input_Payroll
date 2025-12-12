import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddEntityMasterComponent } from '../add-entity-master/add-entity-master.component';
import { EntityMasterService } from '../../../Service/GlobalMasters/entity-master.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-entity-master',
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
  templateUrl: './entity-master.component.html',
  styleUrls: ['./entity-master.component.css']
})
export class EntityMasterComponent {

  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>([]);
  showTable: boolean = false;
  entityName: string = "";

 
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private entityService: EntityMasterService,
    private _sessionStorage: SessionStorageService,
    private decry: EncryptionService,
    private fb: FormBuilder,
  ) { }

  uploadDisplayedColumns: string[] = [
    'SI No',
    'Entity',
    'Profit Center',
    'Function Code',
    'JV WBS',
    'JV Profit Center',
    'Account Number',
    'Invoice Legal Entity'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  
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

  
  onSearchClick() {
    this.showTable = true;
    this.isLoading = true;

    this.entityService.EntitySearch().subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const table = res?.Data?.data?.Table0 || [];

        if (!table.length) {
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          alert("No records found");
          return;
        }

        let filteredTable = table;

        if (this.entityName.trim() !== "") {
          const keyword = this.entityName.trim().toLowerCase();

          filteredTable = table.filter((row: any) =>
            row.Entity_Name?.toLowerCase().includes(keyword)
          );
        }

        this.uploadedData = filteredTable.map((row: any) => ({
          'SI No': row.Serial_No,
          'Entity': row.Entity_Name,
          'City': row.City_Name,
          'Profit Center': row.Profit_Center,
          'Function Code': row.Function_Code,
          'JV WBS': row.WBS,
          'JV Profit Center': row.Profit_Center,
          'Account Number': row.Account_Number,
          'Invoice Legal Entity': row.QuessLegalEntityName,
          'Id': row.Entity_Profit_Center_Id
        }));

        this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Search Error:", err);
        alert("Failed to load Entity Master data");
      }
    });
  }

 
  exportToExcelLocal() {
    if (!this.uploadedData || this.uploadedData.length === 0) {
      alert("No data available to export!");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uploadedData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FilteredEntityMaster");

    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `Entity_Master_${timestamp}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.showAlertPopup("Excel Exported Successfully!");
  }

  AddPOOpen() {
    this.dialog.open(AddEntityMasterComponent, {
      width: '65%',
      height: '57vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any) {
  }
}
