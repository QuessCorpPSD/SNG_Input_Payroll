import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AllowReprocessService } from '../../../Service/Process/allow-reprocess.service';

@Component({
  selector: 'app-allow-re-process',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    CompanyallComponent,
    AlertpopupComponent,
    MatCheckboxModule
  ],
  templateUrl: './allow-re-process.component.html',
  styleUrl: './allow-re-process.component.css'
})
export class AllowReProcessComponent {

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
  isSelectAllChecked = false;
  selectedRows: any[] = [];

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private leave: AllowReprocessService,
    private snackBar: MatSnackBar
  ) { }

  showAlertPopup(message: string, sub: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = sub;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  uploadDisplayedColumns: string[] = [
    'select',
    'SNo',
    'Company_Code',
    'Client_Name',
    'Pay_Sequence_Number',
    'Pay_Period',
    'Reprocess_Flag'
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  selectAllRows(event: any): void {
    const isChecked = event.checked;

    this.uploadedDataSource.data.forEach(row => {
      row.selected = isChecked;
    });

    this.selectedRows = isChecked ? [...this.uploadedDataSource.data] : [];
  }


  updateSelectedRows(): void {
    this.selectedRows = this.uploadedDataSource.data.filter(row => row.selected);
  }
  onSearchClick() {

    if (!this.selectedCompanyId) {
      this.showAlertPopup('Validation Error', 'Please select Company Code');
      return;
    }

    const payload = { Company_id: this.selectedCompanyId?.toString() || '' };

    this.showTable = true;
    this.isLoading = true;

    this.leave.Allowsearch(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;
        const tableData = res?.Data?.data?.Table0 || [];

        if (!tableData || tableData.length === 0) {
          this.uploadedDataSource.data = [];
          this.showAlertPopup("No Records Found");
          return;
        }

        this.uploadedData = tableData;
        this.uploadedDataSource.data = this.uploadedData;

        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;
      },

      error: err => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Failed to load data');
      }
    });
  }
  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }

    this.isLoading = true;

    const exportPayload = { Company_id: this.selectedCompanyId.toString() };

    this.leave.downloadExcel(exportPayload).subscribe({
      next: res => {

        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0 || [];

        if (jsonData.length === 0) {
          this.showAlertPopup('Info', 'No Records Found');
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Allow_Reprocess');

        XLSX.writeFile(wb, `allow_reprocess_${new Date().toISOString()}.xlsx`);
        this.showAlertPopup('Success', 'Excel Exported Successfully');
      },

      error: err => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Failed to Export');
      }
    });
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) this.userdetail = JSON.parse(this.decry.decrypt(json));

    this.payPeriodType = "All";
  }



  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }



  saveAllowReprocess() {

    if (!this.selectedCompanyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }


    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.showAlertPopup("Validation Error", "Please select at least one row");
      return;
    }

    this.isLoading = true;

    const payload = {
  Mode: "Add",
  CreatedBy: this.userdetail?.user_Id?.toString() || "",

  allowReprocesses: this.selectedRows.map(row => ({
    Allow_Reprocess_Id: row.Allow_Reprocess_Id?.toString() || "",
    Pay_Frequency_Detail_Id: row.Pay_Frequency_Detail_Id?.toString() || "",
    Serial_No: row.Serial_No?.toString() || row['SNo']?.toString() || "",
    Company_Code: row.Company_Code || row['Company_Code'] || "",
    Client_Name: row.Client_Name || row['Client_Name'] || "",
    Pay_Sequence_Number: row.Pay_Sequence_Number || row['Pay_Sequence_Number'] || "",
    Pay_Period: row.Pay_Period || row['Pay_Period'] || "",
    Reprocess_Flag: row.Reprocess_Flag || row['Reprocess_Flag'] || "",
    Company_Id: this.selectedCompanyId?.toString() || "",
    Error_Message: ""
  }))
};
    this.leave.AllowReprocess(payload).subscribe({
      next: res => {

        this.isLoading = false;

        if (res?.StatusCode === 200 && res?.Data?.response === "Data Saved Successfully") {
          this.showAlertPopup('Success', 'Data Saved Successfully!');
        } else {
          this.showAlertPopup('Warning', res?.Data?.response || 'Failed to save');
        }
      },

      error: err => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Error Saving Data');
      }
    });

  }
}
