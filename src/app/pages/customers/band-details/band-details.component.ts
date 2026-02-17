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
    MatCardModule, FormsModule, CompanyallComponent, AlertpopupComponent
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
    'SNo',
    'Company Code',
    'Band Code',
    'Band Name',
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

        //  Stop loading immediately if invalid data
        if (res.StatusCode !== 200 || !res.Data || res.Data.length === 0) {
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          this.isLoading = false; // ✅ STOP LOADING
          return;
        }

        let table = res.Data;

        //  FILTER BY COMPANY CODE
        if (this.selectedCompanyCode && this.selectedCompanyCode !== "") {
          const keyword = String(this.selectedCompanyCode).trim().toLowerCase();
          table = table.filter((row: any) =>
            row.company_Code?.toLowerCase().includes(keyword)
          );
        }

        //  MAP TO TABLE FORMAT
        this.uploadedData = table.map((item, index) => ({
          SNo: index + 1,
          'Company Code': item.company_Code,
          'Band Code': item.band_Code,
          'Band Name': item.band_Name
        }));

        this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;

        this.isLoading = false; //  STOP LOADING
      },

      error: (err) => {
        console.error(err);
        this.uploadedData = [];
        this.uploadedDataSource.data = [];
        this.isLoading = false; // STOP LOADING
      }
    });
  }


  exportToExcel() {
    this.bandService.GetAllBandDetails(this.selectedCompanyId || 0).subscribe({
      next: (res) => {
        const data = res?.Data;
        if (!data || data === 0) {
          alert("No data available to export");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "BandDetails");

        const today = new Date().toISOString().split('T')[0];
        const fileName = `Band_Details_${today}.xlsx`;

        XLSX.writeFile(wb, fileName);
      }, error: (err) => {
        console.error(err);
      }
    })
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

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }
}

