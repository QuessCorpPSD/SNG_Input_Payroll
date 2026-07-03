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
  isLoading = false;

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
    this.isLoading = true;
    const Companyid = this.selectedCompanyId;
    const PayPeriod = this.payperiodId;

    console.log(Companyid, PayPeriod);
    this.service.Search(Companyid, PayPeriod).subscribe({
      next: (res) => {
        console.log('API Response:', res.Data);
        if (res.StatusCode === 200 && Array.isArray(res.Data.data.Table0) && res.Data.data.Table0.length > 0) {
          this.salary = res.Data.data.Table0;
          this.dataSource = new MatTableDataSource(this.salary);
          console.log(this.dataSource);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = ['Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code', 'Employee Name', 'Pay Code', 'Amount', 'Salary Advance Status', 'Request Type', 'No of Installments'];
          this.isLoading = false;
        }
        else {
          this.dataSource.data = [];
          alert("No Records Found");
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
      alert('Please Select Company')
      return;
    }
    if (!this.payperiodId) {
      alert('Please Select PayPeriod')

      return;
    }
    this.isLoading = true;
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
            this.isLoading = false;
          }

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.isLoading = false;
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
          this.isLoading = false;

        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
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

        // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const blob = new Blob([buffer], { type: 'application/octet-stream' });
        // FileSaver.saveAs(blob, `SalaryAdvanceRequest_${Date.now()}.xlsx`);
        XLSX.writeFile(workbook, `SalaryAdvanceRequest_${Date.now()}.xlsx`);
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
    this.isLoading = true;
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
        this.isLoading = false;

        if (!res?.Data) {
          alert('No data returned from server.');
          return;
        }

        const responseMessage = res.Data.response;

        // ✅ Success case
        if (responseMessage?.includes('Rows Uploaded Successfully')) {
          alert('✅ Rows uploaded successfully.');
          return;
        }

        let errorList: any[] = [];

        if (Array.isArray(res.Data.errors) && res.Data.errors.length > 0) {
          try {
            // errors[0] is a JSON string → parse it
            errorList = JSON.parse(res.Data.errors[0]);
          } catch (e) {
            console.error('Error parsing error messages', e);
          }
        }

        if (errorList.length === 0) {
          alert('Upload failed but no detailed errors found.');
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

        XLSX.writeFile(workbook, 'ErrorMessages_salaryadvancerelease.xlsx');
      },

      error: (err) => {
        this.isLoading = false;
        console.error('❌ Upload failed', err);
        alert('Upload failed due to a server or network error.');
      }
    });

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
