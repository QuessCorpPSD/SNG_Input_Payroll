import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import { SalaryadvancerequestService } from '../../../Service/salaryadvancemodule/salaryadvancerequest.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import { ISalaryadvancerequest } from '../../../Repository/salaryadvancemodule/Isalaryadvancerequest.service';
import { SalaryadvacerequestAddComponent } from '../salaryadvacerequest-add/salaryadvacerequest-add.component';

export const Salary_TOKEN = new InjectionToken<ISalaryadvancerequest>('Salary_TOKEN');
@Component({
  selector: 'app-salaryadvacerequest',
  standalone: true,
  imports: [MatPaginator, MatTableModule, MatIconModule, CommonModule, FormsModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './salaryadvacerequest.component.html',
  styleUrl: './salaryadvacerequest.component.css',
  providers: [{
    provide: Salary_TOKEN,
    useClass: SalaryadvancerequestService
  }]

})
export class SalaryadvacerequestComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  selectedCompanyCode: any;
  salary: any;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  salarys: any;
  isLoading=false;

  constructor(@Inject(Salary_TOKEN) private service: SalaryadvancerequestService, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private dialog: MatDialog,) { }
  isUploadGridVisible = false;

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code', 'Employee Name', 'Pay Code', 'Amount', 'Salary Advance Status', 'Request Type', 'No of Installments'
  ];


  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }
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
    this.isUploadGridVisible = true;
    if (!this.selectedCompanyId) {
      alert('Please Select Company')

      return;
    }
    if (!this.payperiodId) {
      alert('Please select Payperiod')
      return;
    }
    const Companyid = this.selectedCompanyId;
    const PayPeriod = this.payperiodId;

    console.log(Companyid, PayPeriod);
    this.service.Search(Companyid, PayPeriod).subscribe({
      next: (res) => {
        console.log('API Response:', res.Data);
        this.salary = res.Data.data.Table0;
        // this.salarys = res.Data.message;

        // if (this.salarys) {
        //   alert(this.salarys)
        // }
        if (this.salary && this.salary.length > 0) {
          this.dataSource = new MatTableDataSource(this.salary);
          console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = ['Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code', 'Employee Name', 'Pay Code', 'Amount', 'Salary Advance Status', 'Request Type', 'No of Installments'];
        } else {
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      },
    });
  }

  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company')
      return;
    }
    if (!this.payperiodId) {
      alert('Please Select PayPeriod')

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
          const fileName = `salary_Advancerequest_${timestamp}.xlsx`;


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
          Sheets: { 'Salaryadvancerequest': worksheet },
          SheetNames: ['Salaryadvancerequest']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `SalaryAdvanceRequest_${Date.now()}.xlsx`);
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
    this.isLoading=true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyCode', this.selectedCompanyCode);
    formData.append('Payperiod_id', this.payperiodId);
    formData.append('Payperiod', this.payperiods);

    this.service.BulkPOUpload(formData).subscribe({
      next: (res) => {
        console.log('📥 API Response:', res);

        // ✅ handle case when Data is null
        if (!res || !res.Data) {
          console.warn('ℹ️ No data returned from server yet.');
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data.response;

        // ✅ Defensive check before accessing response
        if (response && response.includes("Row(s) Uploaded Successfully.")) {
          alert('✅ Rows uploaded successfully.');
          return;
        }

        const { parsed, msg } = this.tryParseResponse(response);

        const successMsg = 'Data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          alert('✅ Data uploaded successfully.');
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          const rawErr = res.Data.errors?.[0];
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
            Error_Message: item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_salaryadvancerelease.xlsx');

          return;
        }

        // ✅ Fallback if no specific case matched
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          // ⚙️ Handle case where API returns message but no data (your current case)
          if (res?.Message) {
            alert(`ℹ️ ${res.Message}`);
          } else {
            alert('Error while processing response.');
          }
        }

      },
      error: (err) => {
        console.error('❌ Upload failed', err);
        alert('Upload failed due to a network or server error.');
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


  AddPOOpen() {
    this.dialog.open(SalaryadvacerequestAddComponent, {
      width: '60%',
      height: '61vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

}
