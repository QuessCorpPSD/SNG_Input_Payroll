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
import { IAttendanceProcessRepository } from '../../../Repository/Process/IAttendnaceProcessRepository';
import { AttendanceProcessRepository } from '../../../Service/Process/AttendanceProcessRepository';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export const Pay_TOKEN = new InjectionToken<IAttendanceProcessRepository>('Pay_TOKEN');


type RawRow = Record<string, any>;

interface ViewRow {
  Company_Code: number;
  Company_Name: string;
  Employee_Code: string;
  Employee_Name: string;
  Pay_Period: string;
  Month_Days: string;
  Work_Days: string;
  ProcessType: string;
  Loss_Of_Pay_Days: string;
  Effective_Date: string;
}

@Component({
  selector: 'attendance',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CompanyallComponent,
    PayperiodsequenceComponent, MatIconModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, AlertpopupComponent, PayprocesstypeComponent, MatPaginatorModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
  providers: [DatePipe,
    {
      provide: Pay_TOKEN,
      useClass: AttendanceProcessRepository,
    }
  ]
})
export class AttendanceComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  isLoading: boolean = false;
  empid: any;
  selectoption: any;
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

  constructor(private datePipe: DatePipe, @Inject(Pay_TOKEN) private _attendanceProcessService: IAttendanceProcessRepository,
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

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };
    this.selectoption = "-1";
    this.empid = "";
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
      mode: "Search",
      Value1: "1",
      searchxml: {
        Company_id: String(this.selectedCompanyId),
        Pay_Frequency_Id: String(this.payPeriod.payfrequencyid),
        Resign_Status: String(this.selectoption),
        Emp_Code: String(this.empid),
      }
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
              Company_Code: r['Company_Code'],
              Company_Name: r['Company_Name'],
              Employee_Code: r['Employee_Code'],
              Employee_Name: r['Employee_Name'],
              Pay_Period: r['Pay_Period'],
              Month_Days: r['Month_Days'],
              Work_Days: r['Work_Days'],
              ProcessType: r['ProcessType'],
              Loss_Of_Pay_Days: r['Loss_Of_Pay_Days'],
              Effective_Date: r['Effective_Date']

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
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
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

    const baseHeaders = ["COMPCODE", "PAYPERIOD", "EMPID", "LOPDAYS", "ACTION"];
    const data: any[][] = [baseHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Table");

    XLSX.writeFile(wb, "Attendance_Process_Template.xlsx");
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
      mode: "Search",
      Value1: "1",
      searchxml: {
        Company_id: String(this.selectedCompanyId),
        Pay_Frequency_Id: String(this.payPeriod.payfrequencyid)
      }
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
              "Attendance": AttendanceSheet
            },
            SheetNames: ["Attendance"]
          };

          // Generate filename
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `Attendance_Process_${dateStr}.xlsx`;

          // Write workbook to file
          const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          const blob: Blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          FileSaver.saveAs(blob, fileName);
          this.isLoading = false;

        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.statusCode === 400) {
          alert('No records found.')
          this.isLoading = false;
        }
        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
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

    this._attendanceProcessService.ImportAttendnace(formData).subscribe({
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
          XLSX.writeFile(workbook, 'ErrorMessages_Attendance_Process.xlsx');
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
