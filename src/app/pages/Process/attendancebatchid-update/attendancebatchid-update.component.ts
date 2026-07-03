import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { AttendancebatchitupdateService } from '../../../Service/Process/attendancebatchitupdate.service';

@Component({
  selector: 'app-attendancebatchid-update',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './attendancebatchid-update.component.html',
  styleUrl: './attendancebatchid-update.component.css'
})
export class AttendancebatchidUpdateComponent {
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  constructor(private decry: EncryptionService, private service: AttendancebatchitupdateService,
    private _sessionStoreage: SessionStorageService) { }

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

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName
    }

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
    formData.append('User', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {


        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup('Data Uploaded Successfully')
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
          XLSX.writeFile(workbook, 'ErrorMessages_Attendancebatchid.xlsx');
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
          this.showAlertPopup('Error while processing response.');
        }

      },
      error: (err) => {
        this.isLoading = false;
        console.error('❌ Upload failed', err);


      }
    });
    this.isLoading = false;

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
    // STATIC TEMPLATE HEADERS
    const templateData = [
      {
        EmployeeCode: "",
        PayPeriod: "",
        BatchId: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Attendancebatchidupdate': worksheet },
      SheetNames: ['Attendancebatchidupdate']
    };

    // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // FileSaver.saveAs(blob, `Attendancebatchid_Template_${Date.now()}.xlsx`);
    XLSX.writeFile(workbook, `Attendancebatchid_Template_${Date.now()}.xlsx`);
    this.isLoading = false;
  }

}
