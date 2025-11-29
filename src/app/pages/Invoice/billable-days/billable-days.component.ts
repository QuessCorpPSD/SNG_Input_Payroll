import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';

import { EncryptionService } from '../../../Shared/encryption.service';
import { CommonModule } from '@angular/common';

import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';
import { Payperiodclass } from '../../../Models/Common';


import { TextFieldModule } from '@angular/cdk/text-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { Observable, ReplaySubject } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { BillImportTypeComponent } from '../../../common/bill-import-type/bill-import-type.component';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';


export const Bill_Token = new InjectionToken<IInvoiceRepository>('Bill_Token');

@Component({
  selector: 'app-billable-days',
  standalone: true,
  imports: [CommonModule, CompanyallComponent, PayPeriodComponent, MatIconModule, MatFormFieldModule,
    MatSelectModule, MatTableModule, MatPaginatorModule, TextFieldModule, MatInputModule, BillImportTypeComponent],
  templateUrl: './billable-days.component.html',
  styleUrl: './billable-days.component.css',
  providers: [{
    provide: Bill_Token,
    useClass: InvoiceRepository,
  }]
})
export class BillableDaysComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  EmployeeCode = '';
  importType: any;
  files: File[] = [];
  filebase64: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = ['company_Id', 'company_Name', 'employee_Code', 'employee_Name', 'pay_Period', 'billable_Days', 'iqN_REF_NO', 'iqN_ID', 'reF_DATE', 'froM_DATE', 'tO_DATE', 'wO_NUMBER', 'grN_NUMBER', 'recruiteR_NAME', 'clienT_BILLING_PERCENTAGE', 'locatioN_NAME', 'oT_AMOUNT', 'otheR_ALLOWANCE', 'reimB_AMOUNT', 'discounT_TYPE', 'discount_Amount']
  dataSource = new MatTableDataSource<any>([]);
  userdetail!: any;
  issearch = -1;
  showPreviewModal = false;
  excelPreviewData: any[] = [];
  isLoading = false;
  excelFile: File | null = null;
  showSearchGrid: any;
  datatable: any;

  ngOnInit(): void {
    this.payPeriodType = "All";
    const json = this._sessionservice.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
  }
  constructor(@Inject(Bill_Token) private _invoiceService: IInvoiceRepository,
    private _sessionservice: SessionStorageService, private decry: EncryptionService) { }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }
  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }

  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);
      formData.append('importType', this.importType.value);


      this._invoiceService.UploadBillable(formData).subscribe({
        next: (res) => {
          console.log(res);
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "Billable_Days_Validations");
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }
  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

   FileUpload(fileInput: HTMLInputElement): void {
    if (!this.importType) {
      alert("Please select Import Type");
      return;
    }
    fileInput.click();
  }
  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }



  export(): void {
    const request = {
      "Param": this.issearch,
      "Company_Id": this.selectedCompanyId,
      "Pay_Period_Id": this.payPeriod.payfrequencyid,
      "Employee_Code": this.EmployeeCode,
    }

    this._invoiceService.BillableDaysSearchExport(request).subscribe({
      next: res => {
        this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
      },
      error: err => { console.log(err) }
    })
    // const rawData = this.dataSource.filteredData?.length
    //   ? this.dataSource.filteredData
    //   : this.dataSource.data;

    // const dataToExport = Array.isArray(rawData) ? rawData : [rawData]; // ✅ always array

    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    // const workbook: XLSX.WorkBook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // FileSaver.saveAs(blob, '.xlsx');

  }
  BillableSearch() {
    if (!this.selectedCompanyId) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payPeriod) {
      alert("Please select PayPeriod");
      return;
    }

    this.issearch = 1;
    const request = {
      "Company_Id": this.selectedCompanyId,
      "Pay_Period_Id": this.payPeriod.payfrequencyid,
      "Employee_Code": this.EmployeeCode
    }
    console.log(request)
    this._invoiceService.BillableSearch(request).subscribe({
      next: res => {
        this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.dataSource.paginator = this.paginator;
      },
      error: err => { console.log(err) }
    })

  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement);
    if (file) {
      if (file.files) {
        this.files.push(...Array.from(file.files));
      }
    }

  }
  downloadExcelFromBase64(base64: string, filename: string) {
    //this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  handleImportType(event) {
    this.importType = event;
    console.log(this.importType);
  }
  TemplateDownload() {
    if (this.importType == undefined) {
      alert('Please select Import Type');
      return;
    }

    this._invoiceService.BillableTemplateDownload(this.importType.value).subscribe({
      next: res => {
        this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
      },
      error: err => { console.log(err) }
    })
  }
}