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
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { AddOneTimeReplacementComponent } from '../add-one-time-replacement/add-one-time-replacement.component';
import { OneTimeReplacementService } from '../../../Service/Process/one-time-replacement.service';

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
      this.showAlertPopup('Validation Error', 'Please select Company Code');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select PayPeriod');
      return;
    }

    this.isLoading = true;
    const formvalue = this.onetimeform.getRawValue()

    const payload = {
      Company_id: this.selectedCompanyId.toString(),
      Pay_Frequency_Id: this.payPeriodId.toString(),
      Employee_Code: formvalue.Employeecode?.toString() || ''
    };

    this.showTable = true;

    this.leave.OneTimeSearch(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        const search = res?.Data?.data?.Table0;

        if (!search && search === 0) {
          this.uploadedDataSource.data = [];
          this.showAlertPopup(res.Data.message);
          return;
        }

        if (Array.isArray(search)) {
          this.uploadedData = search;
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
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select Payperiod');
      return;
    }

    this.isLoading = true;

    const formvalue = this.onetimeform.getRawValue()

    const exportPayload = {
      Company_id: this.selectedCompanyId?.toString(),
      Pay_Frequency_Id: this.payPeriodId?.toString(),
      Employee_Code: formvalue.Employeecode?.toString() || ''
    };

    this.leave.downloadExcel(exportPayload).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.Data?.statusCode === 400) {
          this.showAlertPopup('No records found');
          return;
        }

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData.length) {
          this.showAlertPopup(res.Data.message);
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'OneTimeReplacement');

        const fileName = `one_time_replacement_${new Date().toISOString().split('T')[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);

        this.showAlertPopup('Success', 'Excel exported successfully!');
      },
      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Failed to load data for export');
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);


    this.leave.UploadOneTime(formData).subscribe({
      next: (res) => {


        // ✅ handle case when Data is null
        if (!res || !res.Data) {
          this.showAlertPopup('Upload request processed. Server did not return any data.');
          this.isLoading = false;

          return;
        }


        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;

          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;


          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {

          this.showAlertPopup('Failed to import');
          const rawErr = res?.Data?.errors?.[0];
          let errorArray: any[] = [];
          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_onetimereplacement.xlsx');
          this.isLoading = false;

          return;
        }

        // ✅ Fallback if no specific case matched
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          this.showAlertPopup(fallback);
        } else {
          // ⚙️ Handle case where API returns message but no data (your current case)
          if (res?.Message) {
            this.showAlertPopup(`ℹ️ ${res.Message}`);
          } else {
            this.showAlertPopup('Error while processing response.');
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;

        console.error('❌ Upload failed', err);
        this.showAlertPopup('Upload failed due to a network or server error.');
      }
    });
    this.isLoading = false;
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }

  DownloadTemplate() {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select Payperiod');
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

    this.showAlertPopup('Success', 'Template downloaded.');
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
