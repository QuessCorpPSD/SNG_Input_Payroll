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
    CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginator,
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
  UploadedResponse: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  EmployeeList: any[] = [];
  employeeCode: string = "";
  onetimeform!: FormGroup;
  showTypeColumn: boolean = true;
  showArrearPaySequenceColumn: boolean = true;
  showArrearPayPeriodColumn: boolean = true;
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
    // 'Type',
    // 'Arrear_Pay_Sequence_Number',
    // 'Arrear_Pay_Period'
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;
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
      alert('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      alert('Please select PayPeriod');
      return;
    }

    this.isLoading = true;
    this.showTable = true;

    const payload = {
      Company_id: this.selectedCompanyId.toString(),
      Pay_Frequency_Id: this.payPeriodId.toString(),
      Employee_Code: this.employeeCode || ""
    };
    console.log('Payload for OneTimeSearch:', payload);

    this.leave.OneTimeSearch(payload).subscribe({
      next: (res) => {

        console.log('Response from OneTimeSearch:', res)
        const lopadjusts = res.Data?.data?.Table0 ?? []; // records


        if (!lopadjusts || lopadjusts.length === 0) {
          alert("No data available.");
          this.uploadedDataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.uploadedData = res.Data?.data?.Table0;
        this.uploadedDataSource.data = this.uploadedData;
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to load data.');
      }
    });
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      alert('Please select Payperiod');
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_id: this.selectedCompanyId.toString(),
      Pay_Frequency_Id: this.payPeriodId.toString(),
      Employee_Code: this.employeeCode || ""
    };

    this.leave.downloadExcel(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
          this.isLoading = false;
          alert(res.Data.message)
          return;
        }


        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "OneTimeReplacement");

        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `one_time_replacement_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);

      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to load data for export');
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
      alert('Please upload an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("User", this.userdetail.user_Id);

    this.isLoading = true;

    this.leave.UploadOneTime(formData).subscribe({
      next: (res: any) => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response.includes('Rows Uploaded Successfully.')) {
          this.isLoading = false;
          this.showPopup = true;
          this.showAlertPopup(this.UploadedResponse.Data.response);
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {
          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item.Error_Message || item.ERROR_MESSAGE || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'OnetimeReplacement_ErrorMessages.xlsx');
          this.isLoading = false;
          alert('Import Failed');

        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            if (this.UploadedResponse.Data.response != '') {
              alert(this.UploadedResponse.Data.response);
              this.isLoading = false;
            }
            else {
              alert('Error while processing response.');
              this.isLoading = false;
            }

          }
        }
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }


      },

      error: () => {
        this.isLoading = false;
        alert('Upload Failed');
      }
    });
  }

  DownloadTemplate() {
    const templateData = [
      { Compcode: "", PayPeriod: "", Empcode: "", Band: "", Paycode: "", Amount: "", ModeofEntry: "", Type: "", ArrearPayPeriod: "", Pay_Type: "", Remarks: "" }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = { Sheets: { 'onetimereplacement': ws }, SheetNames: ['onetimereplacement'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `onetimereplacement_Template_${Date.now()}.xlsx`);

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
  
  onDeleteRow(row: any) {
    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }
    const id = row.One_Time_Replacement_Id;
    const userId = this.userdetail.user_Id;
    this.leave.deleteOneTimeReplacement(id, userId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.data?.Table0?.Error_Message;

        if (res?.StatusCode === 200 && msg.toLowerCase().includes('success')) {
          alert(msg);
          this.onSearchClick();
        } else {
          alert(msg);
          this.onSearchClick();
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Delete failed');
      }
    });
  }



}
