import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeAddComponent } from '../employee-add/employee-add.component'; import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from "@angular/material/card";
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
import FileSaver from 'file-saver';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [AlertpopupComponent, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, MatTooltipModule, MatCardModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeeComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  employee!: FormGroup
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  isUploadGridVisible = false;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  employeedata: any;
  @ViewChild(MatSort) sort!: MatSort;
  employeeexcel: any;
  userdetail: any;
  EmployeeList: any;
  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'EMPNO', 'EMPNAME', 'CompanyCode', 'DOB', 'Active', 'ORIHIREDDATE', 'SEX', 'Department', 'OCCUPATIONCODE'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  UploadedResponse: any;
  UploadedResponseSalary: any;

  @ViewChild('paginator') paginator!: MatPaginator;
  empid: any;
  constructor(private dialog: MatDialog, @Inject(Pay_TOKEN) private service: IEmployeeservice, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }




  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.employee = this.fb.group({
      EActive: ["-1 "]
    })

  }
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

  BindEmployeeCode() {
    const payload = { CompanyId: this.selectedCompanyId?.toString() };

    this.service.GetEmployeesByCompanyId(payload).subscribe({
      next: (res: any) => {
        this.EmployeeList = res.Data.data.Table0;
      }
    });
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.BindEmployeeCode();
  }


  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please Select Company')
      return;
    }
    this.isLoading = true;
    this.isUploadGridVisible = true;

    const Companyid = this.selectedCompanyId;
    const empid = this.empid || 0;
    this.service.search(Companyid, empid).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.employeedata = res?.Data?.data?.Table0;

        if (!this.employeedata) {
          this.isLoading = false;
          alert(res.Data.message)
        }
        if (this.employeedata && this.employeedata.length > 0) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.employeedata);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action', 'SNo', 'EMPNO', 'EMPNAME', 'CompanyCode', 'DOB', 'Active', 'ORIHIREDDATE', 'SEX', 'Department', 'OCCUPATIONCODE'];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error('Error loading Companypaycode release data', err);
        this.isLoading = false;
      },
    });
    this.isLoading = false;
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    this.isLoading = true;

    const Companyid = this.selectedCompanyId;

    this.service.Exporttoexcel(Companyid).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data.data.Table0;
          this.employeeexcel = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(this.employeeexcel);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "payFrequency");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `payFrequency_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }

  ImportClick(fileInpute: HTMLInputElement): void {
    fileInpute.click();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);


    this.service.BulkPOUpload(formData).subscribe({
      next: (res) => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response.includes('Successfully')) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = this.UploadedResponse.Data.response;
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.Error_Message || ''
              || item.Message || item.MESSAGE || item.message
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Employee.xlsx');
          this.isLoading = false;
          alert(this.UploadedResponse.Data.response);
          return;
        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            this.isLoading = false;
            return;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
            return;
          }

        }

      },
      error: (err) => {
        console.error(' Upload failed', err);
        alert('Upload failed due to a network or server error.');
        this.isLoading = false;

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


  ImportClickSalary(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChangesalary(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);

    this.service.Upload(formData).subscribe({
      next: (res) => {
        this.UploadedResponseSalary = res;

        if (this.UploadedResponseSalary.StatusCode === 200 && this.UploadedResponseSalary.Data.response.includes('Successfully')) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = this.UploadedResponseSalary.Data.response;
        }
        else if (this.UploadedResponseSalary.StatusCode === 200 && this.UploadedResponseSalary.Data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponseSalary.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.Error_Message || ''
              || item.Message || item.MESSAGE || item.message
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Employee.xlsx');
          this.isLoading = false;
          alert(this.UploadedResponseSalary.Data.response);
          return;
        }
        else {
          if (this.UploadedResponseSalary.Data.response != '') {
            alert(this.UploadedResponseSalary.Data.response);
            this.isLoading = false;
            return;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
            return;
          }

        }

      },
      error: (err) => {
        console.error(' Upload failed', err);
        alert('Upload failed due to a network or server error.');
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  tryParseResponses(r: any): { parsed: any; msg: string } {
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


  ViewOpen(row: any) {
    this.dialog.open(EmployeeAddComponent, {
      width: '83%',
      height: '87vh',
      disableClose: true,
      data: { rowData: row }
    });
  }

  downloadEmployeeTemplate() {
    const templateData = [
      {
        "COMPID": "",
        "NAME": "",
        "FATHERNAME": "",
        "GENDER": "",
        "DOJ": "",
        "DOB": "",
        "MARITAL": "",
        "DEPARTMENT": "",
        "DESIGNATION": "",
        "OLDEMPLOYEECODE": "",
        "PAY CATEGORY": "",
        "BANK NAME": "",
        "A/C NO": "",
        "EMAIL": "",
        "DATE OF JOIN PAY PERIOD": "",
        "SWIFTCODE": "",
        "BRANCH": "",
        "BRANCHCODE": "",
        "BANKCODE": "",
        "HIRING STATUS": "",
        "MAP NAME": "",
        "RECRUITER'S NAME": "",
        "MOBNO": "",
        "ENTITY LOCATION": "",
        "COST CENTRE": "",
        "GROUP NAME": "",
        "EMPLOYMENT_TYPE": "",
        "OMS_ID": "",
        "DMS_ID": "",
        "NRIC_FIN_NUMBER": "",
        "FUND_LEVY": "",
        "RACE_CODE": "",
        "NATIONAL_CODE": "",
        "LEAVE_SCHEME": "",
        "RELIGION": "",
        "WORK_PASS": "",
        "SPR_STATUS": "",
        "SPR_APPROVE_DATE": "",
        "VISA_NUMBER": "",
        "VISA_DURATION_START_DATE": "",
        "VISA_DURATION_END_DATE": "",
        "RFUND_CODE1": "",
        "RFUND_CODE2": "",
        "COUNTRY_OF_BIRTH": "",
        "PASSPORT_NUMBER": "",
        "PASSPORT_EXPIRY_DATE": "",
        "ADDRESS": "",
        "PIN_CODE": "",
        "INVOICE_LEGAL_ENTITY": ""

      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Employee_Master_Template.xlsx`)
  }

  downloadSalaryTemplate() {
    const templateData = [
      {
        "COMPCODE": "",
        "EMPCODE": "",
        "BAND": "",
        "PAYCODE": "",
        "AMOUNT": "",
        "PAYSEQUENCENO": ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `New_Joinee_Salary_Template.xlsx`)
  }

}
