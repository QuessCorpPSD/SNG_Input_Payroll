import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { IGenericUpload } from '../../../Repository/banknonvoice/IGenericUpload.services';
import { GenericuploadService } from '../../../Service/banknonvoice/genericupload.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs';

const Pay_TOKEN = new InjectionToken<IGenericUpload>('Pay_TOKEN');

@Component({
  selector: 'app-genericupload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './genericupload.component.html',
  styleUrl: './genericupload.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GenericuploadService,
    }
  ]
})
export class GenericuploadComponent {
  uploadType: any;
  uploadTypeList: any[] = [];
  selectedUploadType: number = 0;
  isLoading: any;
  UploadType: any;
  userdetail: any;
  constructor(
    @Inject(Pay_TOKEN) private service: IGenericUpload,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }
  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.GetUploadType("BankInvoiceGenericUploadTypes", this.userdetail.user_Id);
  }

  GetUploadType(flag: any, userId: any) {
    this.isLoading = true;
    this.service.GetUploadType(flag, userId).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (res: any) => {
        this.uploadTypeList = res?.Data?.data?.Table0 || [];
        this.selectedUploadType = 0;
      },
    });
  }

  downloadTemplate() {
    if (!this.selectedUploadType || this.selectedUploadType == 0) {
      alert('Please select Upload Type');
      return;
    }

    const selected = this.uploadTypeList.find(
      x => x.GEN_iID == this.selectedUploadType
    );

    const uploadTypeName =
      selected?.GEN_vDescription?.replace(/\s+/g, '');

    if (!uploadTypeName) {
      alert('Invalid Upload Type');
      return;
    }

    this.isLoading = true;

    this.service.DownloadTemplate(uploadTypeName)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const data = res?.Data?.data || [];

          if (!data.length) {
            alert('No template data found');
            return;
          }
          const worksheet = XLSX.utils.json_to_sheet(data);

          const workbook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            uploadTypeName
          );

          XLSX.writeFile(
            workbook,
            `${uploadTypeName}Template.xlsx`
          );
        },

        error: (err) => {
          console.error(err);
          alert('Template download failed');
        }
      });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload only one Excel file');
      return;
    }

    if (!this.selectedUploadType || this.selectedUploadType == 0) {
      alert('Please select Upload Type');
      return;
    }

    const selected = this.uploadTypeList.find(
      x => x.GEN_iID == this.selectedUploadType
    );

    const uploadTypeName = selected?.GEN_vDescription;

    if (!uploadTypeName) {
      alert('Invalid Upload Type');
      return;
    }

    const formData = new FormData();

    formData.append('file', file);
    formData.append(
      'CreatedBy',
      this.userdetail.user_Id.toString()
    );
    formData.append('UploadType', uploadTypeName);

    this.isLoading = true;

    this.service.Importgenericupload(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const response = res?.Data?.response;
          const errors = res?.Data?.errors || [];
          if (
            response &&
            response.includes('Uploaded Successfully')
          ) {
            alert(response);
            return;
          }
          if (
            response ===
            'Columns Name are not matching please upload valid template'
          ) {
            alert(response);
            return;
          }
          if (
            response ===
            'Excel sheet is empty or not formatted correctly.'
          ) {
            alert(response);
            return;
          }
          if (response === 'Failed to import.') {

            if (errors.length > 0) {
              this.downloadErrorExcel(errors, uploadTypeName);
            } else {
              alert(response);
            }
            return;
          }
          alert(response || 'Upload failed.');
        },

        error: (err) => {
          console.error(err);
          alert('Upload Failed');
        }
      });
  }

  downloadErrorExcel(errors: any[], uploadTypeName: string): void {
    const errorList: any[] = [];
    errors.forEach((errorItem: any) => {
      try {
        const parsedErrors =
          typeof errorItem === 'string'
            ? JSON.parse(errorItem)
            : errorItem;

        if (Array.isArray(parsedErrors)) {
          parsedErrors.forEach((error: any) => {
            errorList.push({
              Error_Message: error?.Error_Message || ''
            });
          });

        } else if (parsedErrors?.Error_Message) {
          errorList.push({
            Error_Message: parsedErrors.Error_Message
          });
        }

      } catch (e) {

        errorList.push({
          Error_Message: errorItem
        });
      }
    });

    if (!errorList.length) {
      alert('No error details found.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(errorList);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Errors'
    );

    XLSX.writeFile(
      workbook,
      `${uploadTypeName.replace(/\s+/g, '')}_Errors.xlsx`
    );
  }
}
