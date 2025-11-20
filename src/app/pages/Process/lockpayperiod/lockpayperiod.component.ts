import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LockpayperiodaddComponent } from '../lockpayperiodadd/lockpayperiodadd.component';
import { MatDialog } from '@angular/material/dialog';
import { LockpayperiodService } from '../../../Service/Process/lockpayperiod.service';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import FileSaver from 'file-saver';
import { MatCheckbox } from "@angular/material/checkbox";

@Component({
  selector: 'app-lockpayperiod',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent, MatCheckbox],
  templateUrl: './lockpayperiod.component.html',
  styleUrl: './lockpayperiod.component.css'
})

export class LockpayperiodComponent {
  paySearch: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  pagetype: any;
  paySearchs: any;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  month: any;
  LockPayPeriodform!: FormGroup;
  selectedRows: any[] = [];

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog, private lockPayPeriod: LockpayperiodService) { }

  showTable = false;

  uploadDisplayedColumns: string[] = ['checkbox', 'slNo', 'companycode', 'CompanyName', 'PayPeriod', 'status'];

  uploadedData: any[] = []; // no mock data
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindMonth();

    this.LockPayPeriodform = new FormGroup({
      Month: new FormControl(''),
    });
  }

  BindMonth() {
    this.lockPayPeriod.Getmonth().subscribe({
      next: res => { this.month = res.Data }
    });
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  onRowSelectionChange(row: any) {

    // If row is being selected
    if (row.selected) {

      //  Uncheck all other rows first
      this.paySearch.forEach(r => {
        if (r !== row) {
          r.selected = false;
        }
      });

      //  Store only this row as selected
      this.selectedRows = [row];

      //  Open popup ONLY on selecting
      this.AddLockPayPeriodOpen(row);

    } else {
      // When user unchecks the row → clear selection
      this.selectedRows = [];    }
  }

  onsearch() {
    const formValue = this.LockPayPeriodform.getRawValue()
    if (!formValue?.Month) {
      this.showAlertPopup("please select Pay Period");
      return;
    }
    const payload = {
      "PayPeriod": formValue?.Month
    }

    this.isLoading = true;
    this.showTable = true;
    this.lockPayPeriod.SearchLockPayPeriod(payload).subscribe({
      next: (res) => {
        this.paySearch = res.Data?.data?.Table0;
        if (this.paySearch && this.paySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.paySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['checkbox', 'slNo', 'companycode', 'CompanyName', 'PayPeriod', 'status'];
        } else {
          this.dataSource.data = [];
          this.showAlertPopup('Information', 'No data found for the selected criteria');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Failed to load lock pay period data');
      },
    });
  }

  exportToExcel(): void {
    const payload = {
      "PayPeriod": ''
    }

    this.lockPayPeriod.exportLockPayPeriod(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data;

          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup(res.Data.message);
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `LockPayPeriod_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          this.showAlertPopup('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        this.showAlertPopup('Failed to load data from server.');
      },
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
      this.showAlertPopup("Please upload only one Excel file.")
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.lockPayPeriod.importLockPayPeriod(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          this.showAlertPopup('Upload request Processed.Server did not return any data');
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup("Row(s) Uploaded Successfully.")
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
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          this.isLoading = false;
          this.showAlertPopup("Failed to Import");
          // errors[0] may be a JSON string, an array, or a plain string/object
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
          XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          this.showAlertPopup(fallback);
        } else {
          this.showAlertPopup('Error while processing response.')
        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        this.showAlertPopup("Upload Failed")
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

  downloadTemplate() {
    const templateData = [
      {
        CompanyCode: "",
        PayPeriod: "",
        Lock: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'LockPayPeriod': workSheet },
      SheetNames: ['LockPayPeriod']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `LockPayPeriod_${Date.now()}.xlsx`)
  }

  AddLockPayPeriodOpen(rowData: any) {
    this.dialog.open(LockpayperiodaddComponent, {
      width: '30%',
      height: '68vh',
      disableClose: true,
      data: { row: rowData }
    });
  }
}
