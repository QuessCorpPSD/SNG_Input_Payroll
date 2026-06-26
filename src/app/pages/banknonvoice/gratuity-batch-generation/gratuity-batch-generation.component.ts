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
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Common_TOKEN = new InjectionToken<IGratuityBatchGeneration>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IGratuityBatchGeneration } from '../../../Repository/banknonvoice/IGratuityBatchGeneration';
import { GratuityBatchGenerationService } from '../../../Service/banknonvoice/gratuity-batch-generation.service';


@Component({
  selector: 'app-gratuity-batch-generation',
  standalone:true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './gratuity-batch-generation.component.html',
  styleUrl: './gratuity-batch-generation.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: GratuityBatchGenerationService }
  ],

})
export class GratuityBatchGenerationComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData)
  companyname: any;
  showTable = false;
  startDate: any;
  endDate: any;
  dataSource = new MatTableDataSource<any>([]);
  userdetail!: any;
  isLoading = false;
  user_Id: any;
  selectedRows: any[] = [];

  displayedColumns: string[] = [
    'select',
    'Entity',
    'CompanyCode',
    'CompanyName',
    'PayPeriod',
    'GroupName',
    'EmployeeCode',
    'EmployeeName',
    'NetPay'
  ];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private service: GratuityBatchGenerationService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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


  }

  toggleRow(row: any) {
    if (row.isSelected) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(
        x => x.Employee_Code !== row.Employee_Code // Or unique ID field
      );
    }
  }

  masterToggle(event: any) {
    if (event.checked) {
      this.dataSource.data.forEach(x => x.isSelected = true);
      this.selectedRows = [...this.dataSource.data];
    } else {
      this.dataSource.data.forEach(x => x.isSelected = false);
      this.selectedRows = [];
    }
  }

  isAllSelected() {
    return (
      this.dataSource.data.length > 0 &&
      this.selectedRows.length === this.dataSource.data.length
    );
  }

  onSearch() {
    this.isLoading = true;
    this.showTable = true;

    const fromDate = this.formatDate(this.startDate);
    const toDate = this.formatDate(this.endDate);
    this.service.Search(fromDate, toDate).subscribe({
      next: (res) => {
        if (res?.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.uploadData = res?.Data?.data?.Table0 ?? [];
        if (this.uploadData.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.uploadData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = [
          'select',
          'Entity',
          'CompanyCode',
          'CompanyName',
          'PayPeriod',
          'GroupName',
          'EmployeeCode',
          'EmployeeName',
          'NetPay'
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
      FromDate: this.formatDate(this.startDate),
      ToDate: this.formatDate(this.endDate)
    };
    this.service.ExportToExcel(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        const jsonData = res?.Data?.data?.Table0;
        if (!jsonData || jsonData.length === 0) {
          alert("No data available");
          return;
        }
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
          wb,
          ws,
          "GratuityBatchGeneration"
        );

        const date = new Date().toISOString().split('T')[0];
        const fileName = `GratuityBatchGeneration_${date}.xlsx`;
        XLSX.writeFile(wb, fileName);
      },

      error: (err) => {
        this.isLoading = false;
        alert("Export failed");
        console.error(err);
      }

    });

  }

  onGenerate() {

    if (this.selectedRows.length === 0) {
      alert('Please select atleast one record');
      return;
    }

    const payload = {
      CreatedBy: Number(this.userdetail.user_Id),

      gratuityBatch: this.selectedRows.map((item: any) => ({
        Bank_Invoice_Id: item.Bank_Invoice_Id,
        Entity_Name: item.Entity_Name,
        Company_Code: item.Company_Code,
        Company_Name: item.Company_Name,
        Pay_Period: item.Pay_Period,
        Group_Name: item.Group_Name,
        Employee_Code: item.Employee_Code,
        Employee_Name: item.Employee_Name,
        Net_Pay: Number(item.Net_Pay)
      }))
    };

    this.service.Generate(payload).subscribe({
      next: (res: any) => {

        let msg = "";

        if (res?.Data?.response) {

          try {

            const result = JSON.parse(res.Data.response);

            msg = result[0]?.Error_Message;

          } catch {

            msg = res.Data.response;
          }
        }

        if (msg && msg.toLowerCase().includes("success")) {

          alert(msg);

          this.selectedRows = [];

          this.onSearch();

        } else {

          alert(msg || "Generate Failed");
        }
      },

      error: (err) => {

        console.error(err);

        alert("Error while generating batch");
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

    formData.append(
      'CreatedBy',
      this.userdetail.user_Id
    );

    this.service.NonInvoiceGratuityUTRUpload(formData).subscribe({

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
          response?.toLowerCase().includes('success')
        ) {

          alert(response);

          this.isLoading = false;

          this.onSearch();

          return;
        }

        // FAILED IMPORT WITH ERRORS

        if (
          statusCode === 200 &&
          response?.toLowerCase().includes('failed')
        ) {

          let errorArray: any[] = [];

          try {

            const rawErr = res?.Data?.errors?.[0];

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
                Error_Message: 'Error parsing server response'
              }
            ];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item?.Error_Message ||
              item?.Message ||
              item?.message ||
              item || ''
          }));

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(exportData);

          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(
            workbook,
            'NonInvoiceGratuityUTRErrors.xlsx'
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
      return { parsed: null, msg: '' };

    if (Array.isArray(r))
      return { parsed: r, msg: '' };

    if (typeof r === 'object')
      return { parsed: r, msg: '' };

    if (typeof r === 'string') {

      try {

        const p = JSON.parse(r);

        return { parsed: p, msg: '' };

      } catch {

        return { parsed: null, msg: r };
      }
    }

    return {
      parsed: null,
      msg: String(r)
    };
  }

  DownloadTemplate(): void {

    this.isLoading = true;

    const createdBy = Number(this.userdetail.user_Id);

    this.service
      .NonInvoiceGratuityUTRColumnNames(createdBy)
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;

          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || jsonData.length === 0) {

            alert('No template data available');

            return;
          }

          const ws: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(jsonData);

          const wb: XLSX.WorkBook =
            XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'NonInvoiceGratuityUTRTemplate'
          );

          const date =
            new Date().toISOString().split('T')[0];

          const fileName =
            `NonInvoiceGratuityUTRTemplate_${date}.xlsx`;

          XLSX.writeFile(wb, fileName);
        },

        error: (err) => {

          this.isLoading = false;

          console.error(err);

          alert('Template download failed');
        }

      });
  }




}



