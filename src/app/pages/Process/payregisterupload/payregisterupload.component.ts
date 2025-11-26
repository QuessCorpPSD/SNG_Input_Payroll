import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { PayregisteruploadService } from '../../../Service/Process/payregisterupload.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-payregisterupload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent],
  templateUrl: './payregisterupload.component.html',
  styleUrl: './payregisterupload.component.css'
})
export class PayregisteruploadComponent {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  payperiodId: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private payRegisterUpload: PayregisteruploadService) {

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
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

  exportToExcel(): void {
    const payload = {
      "Company_id": this.selectedCompanyId?.toString(),
      "Pay_Frequency_Id": this.payperiodId?.toString()
    }

    if (!this.selectedCompanyId || !this.payperiodId) {
      this.showAlertPopup("please select Company Code and Pay Period");
      return;
    }

    this.payRegisterUpload.exportPayRegisterUpload(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup(res.Data.message)
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `PayRegisterUpload_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          this.showAlertPopup('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        this.showAlertPopup("Failed to load data from server.");
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

    this.payRegisterUpload.importPayRegisterUpload(formData).subscribe({
      next: (res) => {
        if (!res || !res.Data) {
          this.showAlertPopup('Upload request Processed.Server did not return any data');
          this.isLoading = false;
          return;
        }

        if (res?.Data?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup("Row(s) Uploaded Successfully.")
          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data);

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
          this.showAlertPopup("Failed to Import")
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
          this.showAlertPopup("Error while processing response.")
        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        this.showAlertPopup('Upload Failed');
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
    const payload = {
      "Company_id": this.selectedCompanyId?.toString(),
      "Pay_Frequency_Id": this.payperiodId?.toString()
    }

    if (!this.selectedCompanyId && !this.payperiodId) {
      this.showAlertPopup("please select Company Code and Pay Period");
      return;
    }

    this.payRegisterUpload.downloadTemplate(payload).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (data.length === 0) {
          this.showAlertPopup('No template data available.')
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'PayRegisterUpload': worksheet },
          SheetNames: ['PayRegisterUpload']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `PayRegisterUpload_${Date.now()}.xlsx`);
      },
      error: err => {
        this.showAlertPopup('Failed to download template');
      }
    });
  }



  downloadTemplate() {
    const payload = [
      {
        "Company_id": this.selectedCompanyId?.toString(),
        "Pay_Frequency_Id": this.payperiodId?.toString()
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(payload);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'PayRegisterUpload': workSheet },
      SheetNames: ['PayRegisterUpload']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `PayRegisterUpload_${Date.now()}.xlsx`)
  }


}
