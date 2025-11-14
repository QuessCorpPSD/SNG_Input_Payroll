import { CompanyComponent } from "../../../common/company/company.component";
import { Company, Mapnameclass, Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output, TrackByFunction, ViewEncapsulation, Injectable } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
export const DASH_TOKEN = new InjectionToken<IOnboardingServices>('DASH_TOKEN');
import { IOnboardingServices } from "../../../Repository/IOnboardingService";
import { OnboardingServices } from "../../../Service/OnboardingService";
import { OnboardingComponent } from "../onboarding/onboarding.component";
import { OnboardingStateService } from "../../../onboarding-state.service";
import { SessionStorageService } from "../../../Shared/SessionStorageService";
import { EncryptionService } from "../../../Shared/encryption.service";
import { ITimesheetService } from "../../../Repository/itimesheet.service";
import { TimesheetService } from "../../../Service/timesheet.service";
import { finalize } from "rxjs";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { HttpResponse } from "@angular/common/http";
import { PayrollinputComponent } from "../payrollinput.component";


const timesheetservice = InjectionToken<ITimesheetService>;

type RawRow = Record<string, any>;
interface DayCol {
  key: string;            // e.g. "2025-06-01OT"
  date: string;           // e.g. "2025-06-01"
  dayNum: number;         // e.g. 1
  dowShort: string;       // S M T W T F S
  isWeekend: boolean;
}

interface ViewRow {
  SlNo: number;
  EmpID: string;
  EmpTempID: string;
  EmployeeCode: string;
  EmployeeName: string;
  DOJ: string | null;
  Seperation: string | null;
  WDWH: string | null;      // "WD-WH"
  DEHE: string | null;      // "DE-HE"
  L: string | null;
  H: string | null;
  CO: string | null;
  WO: string | null;
  Status: string | null;
  Remarks: string | null;
  Approver: string | null;
  OT: string | null;
  // one value per dynamic day column (same index order as dayCols)
  dayValues: (string | null)[];
  OTWKD: string | null;
  OTWND: string | null;
  NSOTH: string | null;
  POTRS: string | null;
  selected: boolean;
}

export interface AttachmentItem {
  timesheet_Document_ID: string;
  employeeID: string;
  fileName: string;
  documentPath: string;
}

@Component({
  selector: 'timesheet',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, PayrollinputComponent, AlertpopupComponent],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DASH_TOKEN, useClass: OnboardingServices },
    { provide: timesheetservice, useClass: TimesheetService },
  ]
})
export class TimesheetComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  sitenameUI: any;
  citynameUI: any;
  selectedTemplate: string = '';
  selectedImport: string = '';
  companyCode: any;
  payPeriod: any;
  mapName: any;
  selectedPayPeriodFromApi?: PayPeriodComponent;
  isLoading = false;
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  excelFiledaily: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  payPeriodTypefromParent: string = '';
  payPeriodTypefromParentall: string = '';
  userdetail!: any;
  Switchpage: string = '';
  apiResponseDaily: any;
  apiResponseDailyTemplate: any;
  dayCols: DayCol[] = [];
  rows: ViewRow[] = [];
  statusOptions = ['Assigned', 'UnAssigned', 'Saparated', 'Seized'];
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  allSelected = false;
  showAttachmentPopup = false;
  isAttachmentsLoading = false;
  attachmentresponse: AttachmentItem[] = [];
  selectedAttachmentEmpCode: string | null = null;
  allowedCodes = ['PL', 'SL', 'CL', 'WO', 'H', 'CO'];
  allowedCodesSet = new Set(this.allowedCodes);
  hourRegex = /^\d{1,2}(\.\d{1,2})?$/;
  filteredRows: any[] = [];



  //headerResult: string = '';
  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices,
    public stateService: OnboardingStateService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(timesheetservice) private timesheetService: ITimesheetService
  ) { }
 
  handleCompanyEvent(company: any) {

    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.payperiodUI);
  }
  handleMapNameEvent(mapName: any) {
    this.mapnameUI = mapName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.mapnameUI);
  }

  handleGroupNameEvent(siteName: any) {
    this.sitenameUI = siteName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handleCityEvent(cityName: any) {
    this.citynameUI = cityName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.sitenameUI) {
      alert("Select Group Name");
      return;
    }
  }

  onTemplateChange(payPeriod: Payperiodclass) {
    this.payperiodUI = payPeriod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.payperiodUI);
  }
  ngOnInit(): void {
    this.Switchpage = "Month";
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
    this.citynameUI = {
      city_Name: '',
      city_Id: 0
    };

    this.mapnameUI = {
      mapName: '',
      mapNameId: 0
    };
    this.payPeriodTypefromParent = "Current";
    this.payPeriodTypefromParentall = "All";

    this.filteredRows = [...this.rows];

  }
  onTemplateClick(): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }
    else {
      this.attendanceDownload();
      this.isLoading = true;
    }
  }

  attendanceDownload() {
    const formData = new FormData();
    if (this.companyUI) {
      formData.append('companyId', this.companyUI.companyId);
      formData.append('mapNameId', this.mapnameUI.mapNameId);
      formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
      formData.append('flag', '2');

      this.onboardService.GetNewJoineeTemplate(formData).subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            //console.log(data.FileName);
            this.downloadExcelFromBase64(base64, data.fileName)
            this.isLoading = false;
          }
        },
        error: error => {
          console.error('Error:', error);
          this.isLoading = false;
          alert('Failed to connect to server');
        }
      })
    }
    this.isLoading = false;
    return;
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  downloadFileFromBase64(base64: string, filename: string) {
    // decode base64 to binary
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // create blob with generic MIME type
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // cleanup
    window.URL.revokeObjectURL(url);
  }


  onImportClick(fileInput: HTMLInputElement): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
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
    //Check Column Headers
    const formData2 = new FormData();
    if (this.excelFile) {
      formData2.append('file', this.excelFile);
      formData2.append('companyCode', this.companyUI.companyCode);
      formData2.append('companyId', this.companyUI.companyId);
      formData2.append('payPeriod', this.payperiodUI.payPeriod);
      formData2.append('payPeriodId', this.payperiodUI.payfrequencyid);
      this.onboardService.VerifyAttendanceHeaders(formData2).subscribe({
        next: res => {
          const Parsed = JSON.parse(res.Data);
          const headerResult = Parsed[0].Result.toString();
          //console.log(headerResult);

          if (headerResult === '1') {
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
          else {
            if (headerResult) {
              alert(headerResult);
              this.isLoading = false;
            }
            else {
              alert('Error in Check Template');
              this.isLoading = false;
              return;
            }
          }
        }
      });
    }
    else {
      alert("No File");
      this.isLoading = false;
    }
  }


  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }

  downloadExcel(data: any[], templateId: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Attendance': worksheet },
      SheetNames: ['Attendance']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
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
      formData.append('companyCode', this.companyUI.companyCode);
      formData.append('companyId', this.companyUI.companyId);
      formData.append('payPeriod', this.payperiodUI.payPeriod);
      formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
      formData.append('userId', this.userdetail.userId);

      this.onboardService.PostAttendanceData(formData).subscribe({
        next: res => {
          this.datatable = res.Data;
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "Attendance_Validations");
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

  MonthClick() {
    this.Switchpage = "Daily";
  }

  DailyClick() {
    this.Switchpage = "Month";
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.sitenameUI) {
      alert("Select Group Name");
      return;
    }

    if (!this.citynameUI) {
      this.citynameUI = {
        cityid: 0
      };
    }


    if (this.companyUI && this.payperiodUI && this.sitenameUI) {
      this.isLoading = true;
      this.GetEmployeeTimesheetDaywise(this.companyUI.companyCode, this.payperiodUI.payfrequencyid,
        this.sitenameUI.siteCode, this.citynameUI.city_Id, this.userdetail.userId)
    }
  }

  GetEmployeeTimesheetDaywise(companyCode: string, payPeriod: string, siteCode: string,
    city_Id: string, empid: string) {
    this.timesheetService.GetEmployeeTimesheetDaywise(companyCode, payPeriod, siteCode, city_Id, empid).subscribe({
      next: res => {
        if (!res.Data || res.Data === null) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.apiResponseDaily = res.Data;

        const table: RawRow[] = this.apiResponseDaily?.data?.Table0 ?? [];
        if (!table.length) return;

        // 1) detect & sort date columns (…OT)
        const allKeys = Object.keys(table[0]);
        this.dayCols = allKeys
          .filter(k => /^\d{4}-\d{2}-\d{2}OT$/.test(k))
          .sort((a, b) => a.localeCompare(b))
          .map(k => {
            const date = k.substring(0, 10); // "YYYY-MM-DD"
            const d = new Date(date + 'T00:00:00');
            const dow = d.getDay(); // 0=Sun … 6=Sat
            const initials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dow];
            return {
              key: k,
              date,
              dayNum: d.getDate(),
              dowShort: initials,
              isWeekend: dow === 0 || dow === 6
            } as DayCol;
          });

        // 2) normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            SlNo: r['SlNo'],
            EmpID: r['EmpID'],
            EmpTempID: r['EmpTempID'],
            EmployeeCode: r['EmployeeCode'],
            EmployeeName: r['EmployeeName'],
            DOJ: r['DOJ'] ?? null,
            Seperation: r['Seperation'] ?? null,
            WDWH: r['WD-WH'] ?? null,
            DEHE: r['DE-HE'] ?? null,  // will be recalculated if data exists
            L: r['L'] ?? null,
            H: r['H'] ?? null,
            CO: r['CO'] ?? null,
            WO: r['WO'] ?? null,
            Status: r['Status'] ?? 'Assigned',
            Remarks: r['Remarks'] ?? null,
            Approver: r['Approver'] ?? null,
            OT: r['OT'] ?? null,
            dayValues: this.dayCols.map(dc => (r[dc.key] ?? null)),
            OTWKD: r['OTWKD'] ?? null,
            OTWND: r['OTWND'] ?? null,
            NSOTH: r['NSOTH'] ?? null,
            POTRS: r['POTRS'] ?? null,
            selected: false
          };

          // 🔥 recalc only if at least one dayValue is not null/empty
          if (row.dayValues.some(v => v !== null && v !== '')) {
            this.recalculateSummary(row);
          }

          return row;
        });

        this.filteredRows = [...this.rows];



        this.isLoading = false;

      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.EmpID;
  trackDay: TrackByFunction<DayCol> = (_, d) => d.key;



  onDailyTemplateClick(): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Select Company Code");
      this.isLoading = false;
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Peroid");
      this.isLoading = false;
      return;
    }
    if (!this.sitenameUI) {
      alert("Select Group Name");
      this.isLoading = false;
      return;
    }

    if (!this.citynameUI) {
      this.citynameUI = {
        cityid: 0
      };
    }
    else {
      this.attendanceDailyDownload();
    }
  }

  attendanceDailyDownload() {
    this.isLoading = true;

    // (Optional) remove if unused
    // const formData = new FormData();

    this.timesheetService
      .GetEmployeeTimesheetDaywiseDownload(
        this.companyUI.companyCode,
        this.payperiodUI.payfrequencyid,
        this.sitenameUI?.siteCode ?? '',
        this.citynameUI?.city_Id ?? 0,
        this.userdetail.userId
      )
      .pipe(
        // ensure loader always stops
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (res) => {
          if (!res?.Data) {
            alert('No data available to display.');
            return;
          }

          this.apiResponseDailyTemplate = res.Data;

          const table0 = Array.isArray(this.apiResponseDailyTemplate?.Table0)
            ? this.apiResponseDailyTemplate.Table0
            : this.apiResponseDailyTemplate?.data?.Table0 ?? [];

          if (!Array.isArray(table0) || table0.length === 0) {
            alert('No data available to display.');
            return;
          }

          const dataToExport = table0.map((item: any) => {
            const upper: any = {};
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key)) {
                upper[key.toUpperCase()] = item[key];
              }
            }
            return upper;
          });

          // If downloadExcel is heavy/sync, queue it so spinner can render
          requestAnimationFrame(() => {
            this.downloadExcel(dataToExport, 'Attendance_Daily');
          });
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Failed to download. Please try again.');
        }
      });
  }

  onDailyImportClick(fileInputDaily: HTMLInputElement): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Select Company Code");
      this.isLoading = false;
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Peroid");
      this.isLoading = false;
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Group Name");
      this.isLoading = false;
      return;
    }
    fileInputDaily.value='';
    fileInputDaily.click();
  }

  onFileChangeDaily(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFiledaily = target.files[0];
    //Check Column Headers
    const formData = new FormData();
    if (this.excelFiledaily) {
      formData.append('file', this.excelFiledaily);
      formData.append('User', this.userdetail.user_Id);
      formData.append('CompanyCode', this.companyUI.companyCode);
      formData.append('SiteID', this.sitenameUI.siteCode);
      formData.append('Payperiod', this.payperiodUI.payfrequencyid);
      this.timesheetService.UploadDailyTimesheet(formData).subscribe({
        next: res => {
          this.UploadedResponse = res;

          if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Import Successfully Done.') {
            alert('Import Successfully Done.');
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Import Successfully Done.';
          }
          else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

            const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
            const exportData = errorArray.map((item: any) => ({
              MESSAGE: item.MESSAGE || item.Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { 'ErrorMessages': worksheet },
              SheetNames: ['ErrorMessages']
            };

            // Export the file
            XLSX.writeFile(workbook, 'ErrorMessages_Increment.xlsx');
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
    else {
      alert("No File");
      this.isLoading = false;
    }
  }

  openUploader(input: HTMLInputElement) {
    input.value = '';      // clear so the same file can be selected again
    input.click();
  }


  onFileSelected(row: ViewRow, evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const empCode = row.EmployeeCode; // or row.EmployeeCode

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.userId);
    formData.append('Employeeid', empCode);
    formData.append('CompanyCode', this.companyUI.companyCode);
    formData.append('Site_ID', this.sitenameUI.siteCode);
    formData.append('Payperiod_ID', this.payperiodUI.payfrequencyid);
    formData.append('Payperiod', this.payperiodUI.payPeriod);

    // Example API call
    this.timesheetService.UploadDocumentSingleMulitiple(formData).subscribe({
      next: res => {
        if (res.Data?.response === 'File Uploaded successfully') {
          alert('File Uploaded successfully');
          input.value = '';
          return;
        }
        else {
          alert('File Uploaded failed');
          input.value = '';
          return;
        }
      },
      error: (err) => {/* show error toast */ }
    });
  }

  toggleAllRows(checked: boolean) {
    this.rows.forEach(r => r.selected = checked);
  }

  onRowChange() {
    // If all rows are checked, select header too
    this.allSelected = this.rows.every(r => r.selected);
  }

  get anyRowSelected(): boolean {
    return this.rows?.some(r => r.selected) ?? false;
  }

  onBulkAttachmentClick(input: HTMLInputElement) {
    if (!input) { return; }
    input.value = '';   // reset so selecting the same file again still triggers change
    input.click();
  }

  onBulkFilesChosen(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const selectedCodes = (this.rows ?? [])
      .filter(r => r.selected && r.EmployeeCode)
      .map(r => String(r.EmployeeCode).trim());
    const codesCsv = Array.from(new Set(selectedCodes))
      .filter(c => c.length > 0)
      .join(',');

    if (!codesCsv) {
      // optionally show a toast: "Select at least one employee"
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('Employeeid', codesCsv);
    fd.append('User', String(this.userdetail.userId));
    fd.append('CompanyCode', this.companyUI.companyCode);
    fd.append('Site_ID', this.sitenameUI.siteCode);
    fd.append('Payperiod_ID', String(this.payperiodUI.payfrequencyid));
    fd.append('Payperiod', this.payperiodUI.payPeriod);

    this.timesheetService.UploadDocumentSingleMulitiple(fd).subscribe({
      next: res => {

        if (res.Data?.response === 'File Uploaded successfully') {
          alert('File Uploaded successfully');
          input.value = '';
          return;
        }
        else {
          alert('File Uploaded failed');
          input.value = '';
          return;
        }
      },
      error: (err) => {
        console.error('Bulk upload failed', err);
        // error toast here
      }
    });
  }

  openAttachmentsPopup(row: ViewRow): void {
    const companyCode = this.companyUI?.companyCode;
    const siteId = this.sitenameUI?.siteCode;
    const empCode = row.EmployeeCode;
    const payPeriod = this.payperiodUI?.payPeriod;

    if (!companyCode || !siteId || !empCode || !payPeriod) return;

    this.selectedAttachmentEmpCode = empCode;
    this.showAttachmentPopup = true;
    this.isAttachmentsLoading = true;

    this.timesheetService
      .GetTimesheetAttachment(companyCode, siteId, empCode, payPeriod)
      .subscribe({
        next: res => {
          this.attachmentresponse = res?.Data ?? [];
          this.isAttachmentsLoading = false;
        },
        error: () => {
          this.isAttachmentsLoading = false;
          this.showAttachmentPopup = false;
        }
      });
  }

  closeAttachmentsPopup() {
    this.showAttachmentPopup = false;
    this.attachmentresponse = [];
    this.selectedAttachmentEmpCode = null;
  }

  downloadAttachment(it: AttachmentItem) {
    const name = this.extractName(it.fileName) || 'download';

    this.timesheetService.DownloadFile(it.documentPath, name)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ ensures loading is turned off always
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadFileFromBase64(base64, data.fileName);
          } else {
            console.error('Unexpected status code', res.StatusCode);
          }
        },
        error: error => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      });
  }


  private isHttpUrl(s?: string): boolean {
    return !!s && /^https?:\/\//i.test(s);
  }

  extractName(path: string): string {
    return (path || '').split(/[\\/]/).pop() || '';
  }
  extractExt(path: string): string {
    const name = this.extractName(path);
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toUpperCase() : '';
  }

  onType(row: any, idx: number, value: string) {
    const v = (value ?? '').toString().toUpperCase().trim();
    row.dayValues[idx] = v;

    this.recalculateSummary(row);
  }

  recalculateSummary(row: any) {
    // reset counters
    row.L = 0;
    row.H = 0;
    row.CO = 0;
    row.WO = 0;
    row.DEHE = 0;       // total days (0.5/1)
    let totalHours = 0; // total sum of numeric hours

    const workingHours = this.apiResponseDaily?.data?.Table6[0]?.WorkingHours ?? 8;

    for (const val of row.dayValues) {
      if (!val) continue;

      switch (val) {
        case 'PL':
        case 'SL':
        case 'CL':
          row.L++;
          break;
        case 'H':
          row.H++;
          break;
        case 'CO':
          row.CO++;
          break;
        case 'WO':
          row.WO++;
          break;
        default:
          // numeric hours
          const num = Number(val);
          if (!isNaN(num)) {
            totalHours += num;
            if (num < workingHours && num != 0) {
              row.DEHE += 0.5;
            }
            else if (num == 0) {
              row.DEHE += 0;
            }
            else {
              row.DEHE += 1;
            }
          }
          break;
      }
    }

    // final display: "12.5-100"
    row.DEHE = `${row.DEHE}-${totalHours}`;
  }

  onBlur(row: any, index: number, inputEl?: HTMLInputElement): void {
    const raw = (row.dayValues[index] ?? '').toString().toUpperCase().trim();

    const allowedCodes = ['PL', 'SL', 'CL', 'WO', 'H', 'CO'];
    const isCode = allowedCodes.includes(raw);

    // integer or decimal, 0–24
    const isNumber = /^(\d{1,2}(\.\d{1,2})?|24(\.0{1,2})?)$/.test(raw);

    if (raw === '') { row.dayValues[index] = ''; return; }

    if (isCode) {
      if (this.allowedCodesSet.has(raw)) {

        if (raw != 'H' && raw != 'WO' && raw != 'CO') {
          if (this.apiResponseDaily?.data?.Table5[0]?.LeaveType.includes(raw) == false) {
            alert(raw + ' is not applicable for this company.');
            row.dayValues[index] = '';
            inputEl?.focus();
            return;
          }
          if (this.apiResponseDaily?.data?.Table8[0]?.LeaveRoles.includes(raw) == false) {
            alert(raw + ' leave rule is not updated for this company/site.');
            row.dayValues[index] = '';
            inputEl?.focus();
            return;
          }
          row.dayValues[index] = raw;
          return;

        }
        else {
          row.dayValues[index] = raw;
          return;
        }
      }
      else {
        alert('Please enter valid data');
        row.dayValues[index] = '';
        inputEl?.focus();
        return;
      }
    } else if (isNumber) {
      if (this.hourRegex.test(raw)) {
        const n = parseFloat(raw);
        const hfd = parseFloat(this.apiResponseDaily?.data?.Table6[0]?.HalfDay_Working_Hour);
        if (n >= 0 && n <= 24) {

          if (n < hfd && n != 0) {
            alert('Hours should not less then ' + hfd + ' Hrs');
            row.dayValues[index] = '';
            inputEl?.focus();
            return;
          }
          row.dayValues[index] = this.formatHours(raw);
          return;
        }
        else {
          alert('Hours should be less than or equal to 24Hrs');
          row.dayValues[index] = '';
          inputEl?.focus();
          return;
        }
      }
      else {
        alert('Hours should be less than or equal to 24Hrs');
        row.dayValues[index] = '';
        inputEl?.focus();
        return;
      }
    } else {
      alert('Please enter valid data');
      row.dayValues[index] = '';
      inputEl?.focus();
      return;
    }
  }

  private formatHours(s: string): string {
    let [i, d] = s.split('.');
    i = String(parseInt(i || '0', 10));        // normalize integer
    if (d != null) d = d.substring(0, 2).replace(/0+$/, ''); // max 2 decimals
    return d ? `${i}.${d}` : i;
  }

  Saveclick() {
    this.isLoading = true;
    const selectedRows = this.rows.filter(r => r.selected);

    if (!selectedRows.length) {
      alert("Please select at least one row before saving.");
      return;
    }

    for (const row of selectedRows) {
      for (let i = 0; i < row.dayValues.length; i++) {
        const val = row.dayValues[i];
        const col = this.dayCols[i]; // get date from header

        if (val === null || val === undefined || val === '') {
          alert(`Row ${row.SlNo}: Missing entry for date ${col.date}`);
          return; // stop save
        }
      }
    }

    const payload = {
      companyCode: this.companyUI.companyCode,
      siteId: this.sitenameUI.siteCode,
      payPeriodId: this.payperiodUI.payfrequencyid,
      payPeriod: this.payperiodUI.payPeriod,  // "2025-07"
      createdBy: this.userdetail.userId,
      status: "1",  // Save Status
      rows: selectedRows.map(row => ({
        EmpID: row.EmployeeCode || '',
        DOJ: row.DOJ || '',
        Seperation: row.Seperation || '',
        Status: row.Status || '',
        Remarks: row.Remarks || '',
        Approver: row.Approver || '',
        OT: row.OT || '',
        OTWKD: row.OTWKD || '',
        OTWND: row.OTWND || '',
        NSOTH: row.NSOTH || '',
        POTRS: row.POTRS || '',
        dayEntries: row.dayValues.map((val, i) => ({
          date: this.dayCols[i].date,
          value: val
        }))
      }))
    };


    this.timesheetService.SaveTimesheet(payload).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Data submitted successfully.') {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Daily Timesheet Saved Successfully Done.';
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item.RESULT || item.Result || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Timesheet.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed to Save.';

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

  Submitclick() {
    this.isLoading = true;
    const selectedRows = this.rows.filter(r => r.selected);

    if (!selectedRows.length) {
      alert("Please select at least one row before saving.");
      return;
    }

    for (const row of selectedRows) {
      for (let i = 0; i < row.dayValues.length; i++) {
        const val = row.dayValues[i];
        const col = this.dayCols[i]; // get date from header

        if (val === null || val === undefined || val === '') {
          alert(`Row ${row.SlNo}: Missing entry for date ${col.date}`);
          return; // stop save
        }
      }
    }

    const payload = {
      companyCode: this.companyUI.companyCode,
      siteId: this.sitenameUI.siteCode,
      payPeriodId: this.payperiodUI.payfrequencyid,
      payPeriod: this.payperiodUI.payPeriod,  // "2025-07"
      createdBy: this.userdetail.userId,
      status: "2",  // Submit Status
      rows: selectedRows.map(row => ({
        EmpID: row.EmployeeCode || '',
        DOJ: row.DOJ || '',
        Seperation: row.Seperation || '',
        Status: row.Status || '',
        Remarks: row.Remarks || '',
        Approver: row.Approver || '',
        OT: row.OT || '',
        OTWKD: row.OTWKD || '',
        OTWND: row.OTWND || '',
        NSOTH: row.NSOTH || '',
        POTRS: row.POTRS || '',
        dayEntries: row.dayValues.map((val, i) => ({
          date: this.dayCols[i].date,
          value: val
        }))
      }))
    };


    this.timesheetService.SaveTimesheet(payload).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Data submitted successfully.') {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Daily Timesheet Successfully Submitted.';
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item.RESULT || item.Result || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Timesheet.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed to Submit.';

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

  applyFilter() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }

    this.filteredRows = this.rows.filter(r =>
      (r.EmpID && r.EmpID.toString().toLowerCase().includes(text)) ||
      (r.EmployeeName && r.EmployeeName.toLowerCase().includes(text))
    );
  }

  onNumericInput(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onDecimalInput(event: any) {
    let value = event.target.value;
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[0].length > 3) {
      parts[0] = parts[0].substring(0, 3);
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }
    value = parts.join('.');
    event.target.value = value;
  }



}
