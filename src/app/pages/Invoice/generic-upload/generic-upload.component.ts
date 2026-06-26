import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericUploadService } from '../../../Service/invoice/genericuplaod.service'
import { IGenericUpload } from '../../../Repository/invoice/Igenericupload';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { finalize } from 'rxjs';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-generic-upload',
  standalone: true,
  imports: [MatIcon, CommonModule, FormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './generic-upload.component.html',
  styleUrl: './generic-upload.component.css'
})

export class GenericUploadComponent implements OnInit {
  upload_type = '--Select--';
  File: File | null = null;
  selectedFileName: string = "";
  isLoading = false;
  userdetail: any;
  uploadtypes: any;

  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;

  constructor(public apiservice: GenericUploadService, private _sessionStoreage: SessionStorageService, private decry: EncryptionService,) {

  }

  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.BinduploadTypes(this.userdetail.user_Id);
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

  BinduploadTypes(userId: number) {
    this.apiservice.GetUploadTypes(userId).subscribe({
      next: res => {
        this.uploadtypes = res.Data.data.Table0;
      },
      error: err => {
      }
    });
  }

  onFileChange(event: any): void {
    this.File = event.target.files[0];

    if (!this.File) {
      return;
    }
    this.selectedFileName = this.File.name;
    console.log('File selected:', this.selectedFileName);
  }

  ImportClick() {
    
    if (this.File) {

      if(this.upload_type == '--Select--' || !this.upload_type) { 
        alert('Please select an upload type.');
        return;
      }

      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.File);
      formData.append('createdBy', this.userdetail.user_Id);
      formData.append('uploadType', this.upload_type);

      this.apiservice.UploadFile(formData).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({

        next: (res) => {

          if (!res || !res.Data) {
            this.isLoading = false;
            this.showAlertPopup('Upload request processed. Server did not return any data.');
            return;
          }


          if (res?.Data?.data.Table0[0]?.Error_Message?.includes("Row(s) Uploaded Successfully.")) {
            this.isLoading = false;
            this.showAlertPopup('RowS Uploaded Successfully')
            return;
          }
          else if (res?.Data?.data.Table0[0]?.Error_Message?.includes("Failed to import.")) {
            this.isLoading = false;
            this.showAlertPopup('Failed to Import');
            return
          }else if (res?.Data?.data.Table0[0]?.Error_Message) {
            this.isLoading = false;
            this.showAlertPopup(res?.Data?.data.Table0[0]?.Error_Message);
            return
          }

        },
        error: (err) => {
          console.error(' Upload failed', err);
          this.isLoading = false;
          this.showAlertPopup('Upload failed due to a network or server error.');
        }
      });

    } else {
      alert('Import failed. Please select a file to upload.');
      this.isLoading = false;
      return;
    }
  }

  TemplateClick() {
    if(this.upload_type == '--Select--' || !this.upload_type) {
      alert('Please select an upload type to download the template.');
      return;
    }
    this.isLoading = true;
    this.apiservice.DownloadTemplate(this.upload_type).subscribe({
      next: (res) => {
        if (res && res.body) {
          const blob = new Blob([res.body], { type: res.body.type });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.upload_type}_Template.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.isLoading = false;
          alert('Template downloaded successfully.');
        } else {
          this.isLoading = false;
          this.showAlertPopup('Failed to download template. Server did not return any data.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to download template', err);
        this.showAlertPopup('Failed to download template due to a network or server error.');
      }
    });
  }

  exportToExcel(res: any): void {
    if (res?.Data?.data?.Table0.length != 0) {
      const jsonData = res?.Data?.data?.Table0 ?? [];
      const message = res?.Data?.message;
      console.log(jsonData)

      if (jsonData.length === 0) {

        return;
      }

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Generic_Upload_Report");

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Generic_Upload_Report${timestamp}.xlsx`;

      XLSX.writeFile(wb, fileName);
    } else {
      alert('No Record Found');
    }
  }
}
