import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITAdjustmentAddComponent } from '../itadjustment-add/itadjustment-add.component';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { MatSort } from '@angular/material/sort';
import { ITadjustmentsService } from '../../../Service/Process/itadjustments.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-itadjustment',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatTooltipModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, AlertpopupComponent, ReactiveFormsModule],
  templateUrl: './itadjustment.component.html',
  styleUrl: './itadjustment.component.css'
})
export class ITAdjustmentComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  itadjust: any;
  itadjusts: any;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  ecode: any;
  Itadjustmectform!: FormGroup;
  constructor(private dialog: MatDialog, private fb: FormBuilder,
    private decry: EncryptionService, private service: ITadjustmentsService,
    private _sessionStoreage: SessionStorageService) { }
  isUploadGridVisible = false;

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'CompanyCode', 'Employee Code', 'Employee Name', 'Pay Category', 'Pay Period', 'Pay Code', 'Amount', 'Mode of Entry'
  ];


  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  // Method to close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.BindEcode();
  }

  BindEcode() {
    const payload = {
      CompanyId: this.selectedCompanyId?.toString()
    }
    this.service.Getemployeecode(payload).subscribe({
      next: res => { this.ecode = res.Data.data.Table0 }
    });
  }

  AddPOOpen() {
    this.dialog.open(ITAdjustmentAddComponent, {
      width: '83%',
      height: '81vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  onsearch() {
    if (!this.selectedCompanyId) {
      this.showAlertPopup('Please Select Company');
      return;
    }

    this.isUploadGridVisible = true;
    const formValue = this.Itadjustmectform.getRawValue();

    const payload = {
      Company_id: this.selectedCompanyId?.toString() ?? '',
      Employee_id: formValue.Employeecode?.toString() ?? ''
    };


    this.service.Search(payload).subscribe({
      next: (res) => {

        this.itadjusts = res.Data?.data?.Table0 ?? []; // records
        this.itadjust = res.Data.message; // message from API

        // 🔥 SHOW this.showAlertPopup ONLY WHEN NO DATA IS RETURNED
        if (!this.itadjusts || this.itadjusts.length === 0) {
          this.showAlertPopup(this.itadjust || "No data available.");
          this.dataSource.data = [];
          return; // stop here
        }

        // 🔥 IF DATA EXISTS → load table
        this.dataSource = new MatTableDataSource(this.itadjusts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.uploadDisplayedColumns = [
          'Action', 'SNo', 'CompanyCode', 'Employee Code',
          'Employee Name', 'Pay Category', 'Pay Period',
          'Pay Code', 'Amount', 'Mode of Entry'
        ];
      },

      error: (err) => {
        console.error('Error loading itadjusts release data', err);
      },
    });
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.Itadjustmectform = this.fb.group({
      Employeecode: ['']
    })

  }

  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      this.showAlertPopup('Please Select Company')
      return;
    }
    this.isLoading = true;
    const formValue = this.Itadjustmectform.getRawValue();

    const payload = {
      Company_id: this.selectedCompanyId?.toString() ?? '',
      Employee_id: formValue.Employeecode?.toString() ?? ''
    };


    this.service.Search(payload).subscribe({
      next: (res) => {
        this.isLoading = true;
        try {
          const jsonData = res?.Data?.data?.Table0;


          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.isLoading = false;
            this.showAlertPopup(res.Data.message)
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'ITAdjustmentdata');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `ITAdjustment${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          this.isLoading = false;

          console.error('Error exporting to Excel:', err);

        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;

      },
    });
    this.isLoading = false;
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
      this.isLoading = false;

      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          this.isLoading = false;
          this.showAlertPopup('Upload request processed. Server did not return any data.');
          return;
        }


        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup('RowS Uploaded Successfully')
          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showAlertPopup(successMatch);

          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          this.showAlertPopup('Failed to Import');
          const rawErr = res?.Data?.errors?.[0];
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
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_ITAdjustment.xlsx');
          this.isLoading = false;
          return;
        }

        // ✅ Fallback if no specific case matched
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          this.showAlertPopup(fallback);
        } else {
          // ⚙️ Handle case where API returns message but no data (your current case)
          if (res?.Message) {
            this.showAlertPopup(`ℹ️ ${res.Message}`);
          } else {
            this.showAlertPopup('Error while processing response.');
          }
        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Upload failed', err);
        this.showAlertPopup('Upload failed due to a network or server error.');
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

  DownloadTemplate() {
    this.isLoading = true;
    const templateData = [
      {
        CompanyCode: "",
        EmployeeCode: "",
        PayPeriod: "",
        PayCode: "",
        ModeOfEntry: "",
        Amount: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'IT Adjustment': worksheet },
      SheetNames: ['IT Adjustment']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `ITAdjustment_Template_${Date.now()}.xlsx`);
    this.isLoading = false;
  }


}
