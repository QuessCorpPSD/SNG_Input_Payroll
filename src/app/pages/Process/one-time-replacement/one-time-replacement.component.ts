import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OneTimeReplacementService } from '../../../Service/Process/one-time-replacement.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { AddOneTimeReplacementComponent } from '../add-one-time-replacement/add-one-time-replacement.component';

@Component({
  selector: 'app-one-time-replacement',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule,
    MatCardModule, FormsModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent, ReactiveFormsModule
  ],
  templateUrl: './one-time-replacement.component.html',
  styleUrl: './one-time-replacement.component.css'
})
export class OneTimeReplacementComponent {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: String = '';
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  EmployeeList: any[] = [];      
  employeeCode: string = "";      
  onetimeform!: FormGroup;
  constructor(
    private dialog: MatDialog,
    private leave: OneTimeReplacementService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Company_Code',
    'Employee_Code',
    'Employee_Name',
    'Pay_Category_Code',
    'Pay_Sequence_Number',
    'Pay_Period',
    'Paycode_Code',
    'Amount',
    'Mode_Of_Entry',
    'Type',
    'Arrear_Pay_Sequence_Number',
    'Arrear_Pay_Period'
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
  BindEmployeeCode() {
    const payload = { CompanyId: this.selectedCompanyId?.toString() };

    this.leave.GetEmployeesByCompanyId(payload).subscribe({
      next: (res: any) => {
        this.EmployeeList = res.Data.data.Table0;
      }
    });
  }
  onSearchClick() {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Please select PayPeriod');
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_id: this.selectedCompanyId.toString(),
      Pay_Frequency_Id: this.payPeriodId.toString(),
      Employee_Code: this.employeeCode || ""
    };

    this.showTable = true;

    this.leave.OneTimeSearch(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.Data?.statusCode === 400) {
          this.uploadedDataSource.data = [];
          this.showAlertPopup('No Records Found');
          return;
        }

        if (Array.isArray(res?.Data)) {
          this.uploadedData = res.Data;
          this.uploadedDataSource.data = this.uploadedData;
          this.uploadedDataSource.paginator = this.paginator;
          this.uploadedDataSource.sort = this.sort;
        }
      },
      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Failed to load data.');
      }
    });
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Please select Payperiod');
      return;
    }

    this.isLoading = true;

    const exportPayload = {
      Company_id: this.selectedCompanyId.toString(),
      Pay_Frequency_Id: this.payPeriodId.toString(),
      Employee_Code: this.employeeCode || ""
    };

    this.leave.downloadExcel(exportPayload).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.Data?.statusCode === 400) {
          this.showAlertPopup('No records found');
          return;
        }

        const jsonData = Array.isArray(res?.Data) ? res.Data : [];

        if (!jsonData.length) {
          this.showAlertPopup( 'No Records Found');
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'OneTimeReplacement');

        const fileName = `one_time_replacement_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);

        this.showAlertPopup('Excel exported successfully!');
      },
      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Failed to load data for export');
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      this.showAlertPopup('Please upload an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("User", this.userdetail.user_Id);

    this.isLoading = true;

    this.leave.UploadOneTime(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.Data?.status === 400 && res?.Data?.errors) {
          this.showAlertPopup('Import Failed');

          const errors = res.Data.errors;
          const errorList: any[] = [];

          if (errors.file) errorList.push({ Error_Message: errors.file[0] });
          if (errors.User) errorList.push({ Error_Message: errors.User[0] });

          const ws = XLSX.utils.json_to_sheet(errorList);
          const wb = { Sheets: { Errors: ws }, SheetNames: ['Errors'] };
          XLSX.writeFile(wb, 'OneTimeReplacement_Errors.xlsx');

          return;
        }

        const successMsg = "Row(s) Uploaded Successfully.";
        const raw = res?.Data?.response || res?.Data || "";

        if (raw.includes(successMsg)) {
          this.showAlertPopup('Success');
          return;
        }

        if (Array.isArray(res?.Data)) {
          const ws = XLSX.utils.json_to_sheet(res.Data);
          const wb = { Sheets: { Errors: ws }, SheetNames: ['Errors'] };
          XLSX.writeFile(wb, 'OneTimeReplacement_Errors.xlsx');
          this.showAlertPopup('Import Failed');
          return;
        }

        this.showAlertPopup('No Rows to Upload');
      },

      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Upload Failed');
      }
    });
  }

  DownloadTemplate() {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Please select Payperiod');
      return;
    }

    this.isLoading = true;

    const templateData = [
      { Compcode: "", PayPeriod: "", Empcode: "", ModeofEntry: "", Type: "", ArrearPayPeriod: "", Pay_Type: "", Remarks: "" }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = { Sheets: { 'onetimereplacement': ws }, SheetNames: ['onetimereplacement'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `onetimereplacement_Template_${Date.now()}.xlsx`);

    this.showAlertPopup('Template downloaded.');
    this.isLoading = false;
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.payPeriodType = "All";

    this.onetimeform = this.fb.group({
      Employeecode: ['']

    })
  }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  // AddPOOpen() {
  //   this.dialog.open(AddOneTimeReplacementComponent, {
  //     width: '70%',
  //     height: '105vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });
  // }

  view(row: any) {
    console.log('View clicked:', row);
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
    this.BindEmployeeCode();
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
  }
}
