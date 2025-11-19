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
    MatSelectModule,MatTableModule,MatPaginatorModule, TextFieldModule, MatInputModule, BillImportTypeComponent],
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
  displayedColumns = ['company_Id','company_Name','employee_Code','employee_Name','pay_Period','billable_Days','iqN_REF_NO','iqN_ID','reF_DATE','froM_DATE','tO_DATE','wO_NUMBER', 'grN_NUMBER', 'recruiteR_NAME','clienT_BILLING_PERCENTAGE','locatioN_NAME','oT_AMOUNT','otheR_ALLOWANCE','reimB_AMOUNT','discounT_TYPE','discount_Amount']
  dataSource = new MatTableDataSource<any>([]);
  userdetail!: any;
  issearch=-1;
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
  ConvertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      // Already base64 encoded
      const base64 = reader.result as string;

      // If you only need the pure base64 (without the data:... prefix)
      const pureBase64 = base64.split(',')[1];

      result.next(pureBase64);
      result.complete();
    };

    reader.onerror = (error) => {
      result.error(error);
    };

    return result.asObservable();
  }
  FileUpload() {
    console.log(this.userdetail);
    if (this.importType == undefined) {
      alert('Please select Import Type');
      return;
    }
    if (this.files.length == 0) {
      alert('Please choose file');
      return;
    }

    this.files.forEach(element => {
      this.ConvertFile(element).subscribe((res) => {
        var files_docs = {
          "name": element.name,
          "type": element.type,
          "size": element.size,
          "content": res
        };
        const request = {
          "CreatedBy": this.userdetail.user_Id,
          "File": files_docs,
          "importType": this.importType.value
        };

        this._invoiceService.BillableUpload(request).subscribe({
          next: res => { console.log(res) },
          error: err => { console.log(err) }
        })
      });
    });
  }



  export(): void {
    const request={
      "Param":this.issearch,
      "Company_Id":this.selectedCompanyId,
      "Pay_Period_Id":this.payPeriod.payfrequencyid,
      "Employee_Code":this.EmployeeCode,
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
    this.issearch=1;
    const request = {
      "Company_Id": this.selectedCompanyId,
      "Pay_Period_Id": this.payPeriod.payfrequencyid,
      "Employee_Code": this.EmployeeCode
    }
    console.log(request)
    this._invoiceService.BillableSearch(request).subscribe({
      next: res => {  this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.dataSource.paginator = this.paginator;  },
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

    this._invoiceService.BillableTemplateDownload(this.importType.value).subscribe({
      next: res => {
        this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
      },
      error: err => { console.log(err) }
    })
  }
}