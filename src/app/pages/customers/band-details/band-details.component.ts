import { Component, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { BandADDComponent } from '../band-add/band-add.component';
import { BandDeatialsService } from '../../../Service/CUSTOMER/band-deatials.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-band-details',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule,
    MatCardModule, FormsModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent
  ],
  templateUrl: './band-details.component.html',
  styleUrl: './band-details.component.css'
})
export class BandDetailsComponent {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: String = '';
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;

  // ⭐ ADDED FOR POPUP + LOADING
  isLoading: boolean = false;
  showPopup = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private bandService: BandDeatialsService
  ) { }

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Company Code',
    'Band Code',
    'Band Name',
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ⭐ POPUP FUNCTION
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
    this.bandService.GetAllBandDetails(this.selectedCompanyId || 0).subscribe({
      next: (res) => {

        this.isLoading = false;

        if (res.StatusCode !== 200 || !res.Data || res.Data.length === 0) {
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          return;
        }

        let table = res.Data;

        // ⭐ APPLY FILTER LIKE ENTITY MASTER (NO ALERT)
        if (this.selectedCompanyCode && this.selectedCompanyCode !== "") {
          const keyword = String(this.selectedCompanyCode).trim().toLowerCase();

          table = table.filter((row: any) =>
            row.company_Code?.toLowerCase().includes(keyword)
          );
        }

        // ⭐ FINAL MAPPING (same as your current logic)
        this.uploadedData = table.map((item, index) => ({
          SNo: index + 1,
          'Company Code': item.company_Code,
          'Band Code': item.band_Code,
          'Band Name': item.band_Name
        }));

        this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;

      },

      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });

  }

  exportToExcel() {

    if (!this.uploadedData || this.uploadedData.length === 0) {
      this.showAlertPopup("No data available to export");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.uploadedData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BandDetails");

    const today = new Date().toISOString().split('T')[0];
    const fileName = `Band_Details_${today}.xlsx`;

    XLSX.writeFile(wb, fileName);

    this.showAlertPopup("Excel exported successfully!");
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.payPeriodType = "All";
  }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  AddPOOpen() {
    this.dialog.open(BandADDComponent, {
      width: '35%',
      height: '44vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any) {
    console.log('View clicked for:', row);
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }
}

