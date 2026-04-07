import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyserviceService } from '../../../Service/CUSTOMER/companyservice.service';
import { MatSort } from '@angular/material/sort';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'bankadvicesplitculture',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule,
    AlertpopupComponent, CompanyallComponent],
  templateUrl: './bank-advice-split-culture.component.html',
  styleUrl: './bank-advice-split-culture.component.css'
})
export class BankAdviceSplitCultureComponent {
  selectedCompanyId: any;
  companySearch: any;
  showTable = false;

  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  userdetail: any;
  CompanyCode: any;
  searchText: any;

  constructor(private dialog: MatDialog, private company: CompanyserviceService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService) { }

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'vendorCode', 'companyName', 'companyCode', 'inputDate', 'outputDate', 'active', 'segment', 'subSegment', 'businessUnitName', 'businessUnitLocation', 'sapCustomerCode', 'profitCenterCode', 'workingHours'
  ];

  uploadedData: any[] = []; // s No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', category: '', date: '', fromvalue: '', tovalue: '', criteria: '', criterianame: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

  }

  onsearch() {
    this.isLoading = true;
    this.showTable = true;

    const companyCode = this.CompanyCode || 0;
    this.company.searchCompany(companyCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.companySearch = res.Data?.data;
        if (this.companySearch && this.companySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.companySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action', 'slNo', 'vendorCode', 'companyName', 'companyCode', 'inputDate', 'outputDate', 'active', 'segment', 'subSegment', 'businessUnitName', 'businessUnitLocation', 'sapCustomerCode', 'profitCenterCode', 'workingHours'
          ];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });
  }


  AddCompanyMasterOpen() {

  }

  EditCompanyMasterOpen(row: any) {

  }

  TemplateClick(){
    
  }

}

