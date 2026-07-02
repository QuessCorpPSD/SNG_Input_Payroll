import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Common_TOKEN = new InjectionToken<IPartialSalaryReleaseStatus>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IPartialSalaryReleaseStatus } from '../../../Repository/banknonvoice/IPartialSalaryReleasestatus';
import { PartialSalaryReleasestatusService } from '../../../Service/banknonvoice/partial-salary-releasestatus.service';

@Component({
  selector: 'app-partial-salary-release-status',
  standalone:true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule, MatCardModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './partial-salary-release-status.component.html',
  styleUrl: './partial-salary-release-status.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: PartialSalaryReleasestatusService }
  ],

})
export class PartialSalaryReleaseStatusComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: [] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  EmployeeText: string = '';
  showSearchGrid: boolean = true;
  EmployeeList: any[] = [];
  selectedEmployeeId: number = 0;
  isLoading = false;
  payPeriodId: number = 0;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payperiods: String = '';
  userdetail!: any;
  user_Id: any;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  srpBatchList: any[] = [];
  SelectedBatch: any = "";
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  dataSource = new MatTableDataSource<any>([]);


  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName',
    'Payperiod', 'ReleaseStatus', 'BatchId', 'BatchCreatedBy', 'BatchCreatedOn', 'IkyaLocation', 'WorkLocation', 'Bank', 'AccountNumber', 'IFSCcode', 'PTstate', 'NetPay', 'BankRefNo', 'UTR/CHEQUENo', 'UTRdate'

  ];


  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private decry: EncryptionService,
    private service: PartialSalaryReleasestatusService,
    private _sessionStoreage: SessionStorageService,) { }


  handleCompanyEvent(company) {
    if (company == null) {
      this.companyname = '';
    } else {
      this.companyname = company.companyName;
      this.selectedCompanyId = company.companyId;
      this.selectedCompanyCode = company.companyCode;
    }

  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log('payPeriodId', this.payPeriodId)
    console.log('payperiods', this.payperiods)
  }




  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;

    this.payPeriodType = "All";

  }

  onSearch() {

    this.isLoading = true;
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      this.isLoading = false;
      this.showTable = false;
      return;
    }

    this.showTable = true;
    const companyId = this.selectedCompanyId || 0;
    const payPeriodId = this.payPeriodId || 0;
    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    const employeeIdNo = this.EmployeeText || '';

    this.service.Search(
      companyId,
      payPeriodId,
      fromDate,
      toDate,
      employeeIdNo
    ).subscribe({
      next: (res) => {
        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.EmployeeList =
          res?.Data?.data?.Table0 ?? [];
        if (this.EmployeeList.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.EmployeeList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.displayedColumns = [
          'SINo',
          'CompanyCode',
          'EmployeeCode',
          'EmployeeName',
          'Payperiod',
          'ReleaseStatus',
          'BatchId',
          'BatchCreatedBy',
          'BatchCreatedOn',
          'IkyaLocation',
          'WorkLocation',
          'Bank',
          'AccountNumber',
          'IFSCcode',
          'PTstate',
          'NetPay',
          'BankRefNo',
          'UTR/CHEQUENo',
          'UTRdate'
        ];
        this.isLoading = false;
      },

      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      }
    });
  }

  formatDate(date: any): string {

    if (!date) return '';
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  exportToExcel(): void {
    this.isLoading = true;

    const payload = {
      companyId: (this.selectedCompanyId || 0).toString(),
      payPeriodId: (this.payPeriodId || 0).toString(),
      fromDate: this.formatDate(this.startDate),
      toDate: this.formatDate(this.endDate),
      employeeCode: this.EmployeeText || '0'
    };

    this.service.ExportToExcel(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert('No data available');
          return;
        }

        const ws: XLSX.WorkSheet =
          XLSX.utils.json_to_sheet(jsonData);

        const wb: XLSX.WorkBook =
          XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          wb,
          ws,
          'PartialSalaryReleaseStatus'
        );

        const date =
          new Date().toISOString().split('T')[0];

        const fileName =
          `PartialSalaryReleaseStatus_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },

      error: (err) => {
        this.isLoading = false;

        alert('Export failed');
        console.error(err);
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';

    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;

    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one Excel file.');

      this.isLoading = false;

      return;
    }

    const formData = new FormData();

    formData.append('file', file);

    formData.append('User', this.userdetail.user_Id);

    this.service.UploadSalaryReleaseStatus(formData)
      .subscribe({
        next: (res: any) => {

          const response = res?.Data?.response;

          const statusCode = res?.StatusCode;

          if (!res || !res.Data) {
            alert('Server did not return any data.');

            this.isLoading = false;

            return;
          }

          // SUCCESS
          if (
            statusCode === 200 &&
            response?.includes('Successfully')
          ) {
            alert(response);

            this.onSearch();

            this.isLoading = false;

            return;
          }

          // FAILED IMPORT
          if (
            statusCode === 200 &&
            response === 'Failed to Import.'
          ) {

            let errorArray: any[] = [];

            try {

              const rawErr =
                res?.Data?.errors?.[0];

              if (typeof rawErr === 'string') {
                errorArray = JSON.parse(rawErr);

              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;

              } else if (rawErr) {
                errorArray = [rawErr];
              }

            } catch {
              errorArray = [
                {
                  Error_Message:
                    'Error parsing server response'
                }
              ];
            }

            const exportData = errorArray.map(
              (item: any) => ({
                Error_Message:
                  item?.Error_Message ||
                  item?.Message ||
                  item?.message ||
                  item ||
                  ''
              })
            );

            const worksheet: XLSX.WorkSheet =
              XLSX.utils.json_to_sheet(exportData);

            const workbook: XLSX.WorkBook = {
              Sheets: {
                ErrorMessages: worksheet
              },

              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              'PartialSalaryReleaseStatus_Errors.xlsx'
            );

            alert(response);

            this.isLoading = false;

            return;
          }

          if (response) {
            alert(response);

          } else {
            alert('Upload completed');
          }

          this.isLoading = false;
        },

        error: (err) => {
          console.error(err);

          alert('Upload Failed');

          this.isLoading = false;
        }
      });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {

    if (r == null)
      return {
        parsed: null,
        msg: ''
      };

    if (Array.isArray(r))
      return {
        parsed: r,
        msg: ''
      };

    if (typeof r === 'object')
      return {
        parsed: r,
        msg: ''
      };

    if (typeof r === 'string') {

      try {

        const p = JSON.parse(r);

        return {
          parsed: p,
          msg: ''
        };

      } catch {

        return {
          parsed: null,
          msg: r
        };
      }
    }

    return {
      parsed: null,
      msg: String(r)
    };
  }




}




