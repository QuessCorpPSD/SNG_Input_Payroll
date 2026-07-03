import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { SalaryadvanceapproveAddComponent } from '../salaryadvanceapprove-add/salaryadvanceapprove-add.component';
import { MatDialog } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import { SalaryadvanceapproveService } from '../../../Service/salaryadvancemodule/salaryadvanceapprove.service';
import { ISalaryadvancerequest } from '../../../Repository/salaryadvancemodule/Isalaryadvancerequest.service';

export const Salary_TOKEN = new InjectionToken<ISalaryadvancerequest>('Salary_TOKEN');
@Component({
  selector: 'app-salaryadvanceapprove',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, PayPeriodComponent, CompanyallComponent, CommonModule, FormsModule],
  templateUrl: './salaryadvanceapprove.component.html',
  styleUrl: './salaryadvanceapprove.component.css',
  providers: [{
    provide: Salary_TOKEN,
    useClass: SalaryadvanceapproveService
  }]
})
export class SalaryadvanceapproveComponent {

  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  selectedCompanyCode: any;
  salary: any;
  salarys: any;
  constructor(@Inject(Salary_TOKEN) private service: SalaryadvanceapproveService, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog,) { }
  isUploadGridVisible = false;
  isLoading = false;

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code', 'Employee Name', 'Pay Code', 'Amount', 'Approve Amount', 'Salary Advance Status', 'Request Type', 'No of Installments'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
    console.log(this.selectedCompanyCode)
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log('pay', this.payperiodId)
    console.log('payperiods', this.payperiods)
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.payPeriodType = "All";

  }
  onsearch() {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');

      return;
    }
    if (!this.payperiodId) {
      alert('Please select Payperiod');
      return;
    }
    this.isLoading = true;
    this.isUploadGridVisible = true;
    const Companyid = this.selectedCompanyId;
    const PayPeriod = this.payperiodId;

    console.log(Companyid, PayPeriod);
    this.service.Search(Companyid, PayPeriod).subscribe({
      next: (res) => {
        console.log('API Response:', res.Data);
        if (res.StatusCode === 200 && Array.isArray(res.Data.data.Table0) && res.Data.data.Table0.length > 0) {
          this.salary = res.Data.data.Table0;
          if (this.salary && this.salary.length > 0) {
            this.dataSource = new MatTableDataSource(this.salary);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.uploadDisplayedColumns = ['Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code', 'Employee Name', 'Pay Code', 'Amount', 'Salary Advance Status', 'Request Type', 'No of Installments'];
            this.isLoading = false;
          }
        } else {
          this.dataSource.data = [];
          alert("No Data Found");
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }
    if (!this.payperiodId) {
      alert('Please Select PayPeriod');

      return;
    }

    const Companyid = this.selectedCompanyId;
    const PayPeriod = this.payperiodId;

    console.log('Export Payload:', Companyid, PayPeriod);

    this.service.Search(Companyid, PayPeriod).subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data;
          // console.log('data',jsonData)

          this.salarys = res.Data.message;

          if (this.salarys) {
            alert(this.salarys);
          }


          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {

            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `salary_Advanceapprove_${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);


        } catch (err) {
          console.error('Error exporting to Excel:', err);

        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }

  DownloadTemplate() {

    this.service.DownloadTemplate().subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Salaryadvanceapprove': worksheet },
          SheetNames: ['Salaryadvanceapprove']
        };

        // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const blob = new Blob([buffer], { type: 'application/octet-stream' });
        // FileSaver.saveAs(blob, `SalaryAdvanceapprove_${Date.now()}.xlsx`);
        XLSX.writeFile(workbook, `SalaryAdvanceapprove_${Date.now()}.xlsx`);
      },
      error: err => {
        console.error('Error downloading template', err);
      }
    });
  }


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!this.payperiodId){
      alert('Please select Pay Period');
      return;
    }

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }
    this.isLoading=true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyCode', this.selectedCompanyCode);
    formData.append('Payperiod_id', this.payperiodId);
    formData.append('Payperiod', this.payperiods);

    console.log('CreatedBy', this.userdetail.user_Id);
    console.log('CompanyCode', this.selectedCompanyCode);
    console.log('Payperiod_id', this.payperiodId);
    console.log('Payperiod', this.payperiods)

    this.service.BulkPOUpload(formData).subscribe({
      next: (res) => {
        if (!res?.Data) {
          alert('No data returned from server.');
          this.isLoading=false;
          return;
        }

        const responseMessage = res.Data.response;

        // ✅ Success case
        if (responseMessage?.includes('Rows Uploaded Successfully')) {
          alert('✅ Rows uploaded successfully.');
          this.isLoading=false;
          return;
        }

        let errorList: any[] = [];

        if (Array.isArray(res.Data.errors) && res.Data.errors.length > 0) {
          try {
            // errors[0] is a JSON string → parse it
            errorList = JSON.parse(res.Data.errors[0]);
          } catch (e) {
            console.error('Error parsing error messages', e);
            this.isLoading=false;
          }
        }

        if (errorList.length === 0) {
          alert('Upload failed but no detailed errors found.');
          this.isLoading=false;
          return;
        }

        const excelData = errorList.map((e, index) => ({
          SlNo: index + 1,
          ErrorMessage: e.Error_Message
        }));

        const worksheet: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(excelData);

        const workbook: XLSX.WorkBook = {
          Sheets: { Errors: worksheet },
          SheetNames: ['Errors']
        };

        XLSX.writeFile(workbook, 'Validation_salaryadvanceApprove.xlsx');
        this.isLoading=false;
      },

      error: (err) => {
        this.isLoading = false;
        console.error('❌ Upload failed', err);
        alert('Upload failed due to a server or network error.');
      }
    });
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




}
