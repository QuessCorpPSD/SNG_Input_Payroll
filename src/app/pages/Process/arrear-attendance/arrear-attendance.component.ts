import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayperiodsequenceComponent } from '../../../common/payperiodsequence/payperiodsequence.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayprocesstypeComponent } from '../../../common/payprocesstype/payprocesstype.component';
import { Payperiodclass } from '../../../Models/Common';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IArrearAttendanceProcessRepository } from '../../../Repository/Process/IArrearAttendanceProcessRepository';
import { ArrearAttendanceProcessRepository } from '../../../Service/Process/ArrearAttendanceProcessRepository';
import { Console } from 'console';

export const Pay_TOKEN = new InjectionToken<IArrearAttendanceProcessRepository>('Pay_TOKEN');


type RawRow = Record<string, any>;

interface ViewRow {
  Company_code: number;
  Company_Name: string;
  Employee_Code: string;
  Employee_Name: string;
  Pay_Period: string;
  Month_Days: string;
  Work_Days: string;
  Loss_Of_Pay_Days: string;
  Arrear_Pay_Period: string;
}

@Component({
  selector: 'arrearattendance',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CompanyallComponent,
    PayperiodsequenceComponent, MatIconModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, AlertpopupComponent, MatPaginatorModule],
  templateUrl: './arrear-attendance.component.html',
  styleUrl: './arrear-attendance.component.css',
  providers: [DatePipe,
    {
      provide: Pay_TOKEN,
      useClass: ArrearAttendanceProcessRepository,
    }
  ]
})
export class ArrearAttendanceComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  isLoading: boolean = false;
  userdetail!: any;
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  filteredRows: any[] = [];
  paginatedData: any[] = [];
  apiResponse: any;
  rows: ViewRow[] = [];
  pageSize = 10;
  currentPage = 0;

  constructor(private datePipe: DatePipe, @Inject(Pay_TOKEN) private _attendanceProcessService: IArrearAttendanceProcessRepository,
    private _sessionStoreage: SessionStorageService, private decry: EncryptionService,) {

  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }


  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }


  ngOnInit(): void {
    this.payPeriodType = "All";
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
  }

  Searchclick() {
    this.isLoading = true;
    if (!this.selectedCompanyId) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }

    if (!this.payPeriod) {
      alert("Please select PayPeriod");
      this.isLoading = false;
      return;
    }

    const payload = {
      Company_id: String(this.selectedCompanyId),
      Pay_Frequency_Id: String(this.payPeriod.payfrequencyid),
    };

    this._attendanceProcessService.SearchDetails(payload).subscribe({
      next: res => {
        this.UploadedResponse = res;
        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.statusCode === 200) {
          this.apiResponse = res.Data;

          const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
          if (!table.length) {
            alert('No records found.');
            this.isLoading = false;
            return;
          }

          this.rows = table.map((r: RawRow): ViewRow => {
            const row: ViewRow = {
              Company_code: r['Company_code'],
              Company_Name: r['Company_Name'],
              Employee_Code: r['Employee_Code'],
              Employee_Name: r['Employee_Name'],
              Pay_Period: r['Pay_Period'],
              Month_Days: r['Month_Days'],
              Work_Days: r['Work_Days'],
              Loss_Of_Pay_Days: r['Loss_Of_Pay_Days'],
              Arrear_Pay_Period: r['Arrear_Pay_Period']

            };

            return row;
          });

          this.filteredRows = [...this.rows];
          this.setPaginatedData();
          this.isLoading = false;

        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.statusCode === 400) {
          alert('No records found.');
          this.isLoading = false;
        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }
        }
      },
      error: err => {
        console.error("Error:", err);
        this.isLoading = false;
      }
    });

  }

  DownloadTemplate() {

    const baseHeaders = ["COMPANY_CODE", "CURRENT_PAYPERIOD", "ARREAR_PAYPERIOD", "EMPID", "LOP_DAYS", "ACTION"];
    const data: any[][] = [baseHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Table");

    XLSX.writeFile(wb, "Arrear_Attendance_Process_Template.xlsx");
  }

  ExportClick() {
    this.isLoading = true;
    if (!this.selectedCompanyId) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }

    if (!this.payPeriod) {
      alert("Please select PayPeriod");
      this.isLoading = false;
      return;
    }

    const payload = {
      Company_id: String(this.selectedCompanyId),
      Pay_Frequency_Id: String(this.payPeriod.payfrequencyid),
    };

    this._attendanceProcessService.ExporttoExcel(payload).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.statusCode === 200) {
          const tables = res?.Data?.data;

          if (!tables || (!tables.Table0)) {
            this.isLoading = false;
            console.warn("No valid tables found in API response.");
            return;
          }


          // Prepare function to convert a table to worksheet
          function convertTableToSheet(tableData: any[]): XLSX.WorkSheet {
            if (!tableData || tableData.length === 0) {
              return XLSX.utils.aoa_to_sheet([["No Data"]]);
            }

            const finalData: any[][] = [];
            finalData.push(Object.keys(tableData[0])); // headers
            tableData.forEach((row) => {
              finalData.push(Object.values(row));
            });
            return XLSX.utils.aoa_to_sheet(finalData);
          }

          // Convert both tables to worksheets
          const AttendanceSheet = convertTableToSheet(tables.Table0 || []);

          // Create workbook with both sheets
          const workbook: XLSX.WorkBook = {
            Sheets: {
              "Arrear Attendance": AttendanceSheet
            },
            SheetNames: ["Arrear Attendance"]
          };

          // Generate filename
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `Arrear_Attendance_Process_${dateStr}.xlsx`;

          // Write workbook to file
          // const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          // const blob: Blob = new Blob([excelBuffer], {
          //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          // });
          // FileSaver.saveAs(blob, fileName);
          XLSX.writeFile(workbook, fileName);
          this.isLoading = false;

        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.statusCode === 400) {
          alert('No records found.')
          this.isLoading = false;
        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }
        }
      },
      error: err => {
        console.error("Error:", err);
        this.isLoading = false;
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
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this._attendanceProcessService.ImportArrearAttendnace(formData).subscribe({
      next: res => {

        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && (this.UploadedResponse.Data.response.includes('Import Successfully Done.') ||
          this.UploadedResponse.Data.response.includes('Uploaded faild due to'))) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = this.UploadedResponse.Data.response;
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.ERROR_MESSAGE || ''
              || item.Message || item.MESSAGE || item.message
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Arrear_Attendance_Process.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Import Failed.';

        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }

        }
      },
      error: err => {
        console.error('❌ Upload failed', err);
        this.isLoading = false;
      }
    });
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredRows.slice(startIndex, endIndex);
  }
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }
}

