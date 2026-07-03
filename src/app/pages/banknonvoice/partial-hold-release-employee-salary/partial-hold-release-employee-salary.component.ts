import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
import { partialHoldReleaseEmployeeSalaryService } from '../../../Service/banknonvoice/partialHoldReleaseEmployeeSalary.service';
@Component({
  selector: 'app-partial-hold-release-employee-salary',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatCardModule, CommonModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './partial-hold-release-employee-salary.component.html',
  styleUrl: './partial-hold-release-employee-salary.component.css'
})
export class PartialHoldReleaseEmployeeSalaryComponent implements OnInit {

  isLoading = false;
  userdetail: any;
  UploadType = ''

  constructor(private _sessionStoreage: SessionStorageService, private _decrypt: EncryptionService, public service: partialHoldReleaseEmployeeSalaryService) {

  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this._decrypt.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }


  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      alert('Please select a file.');
      return;
    }

    if (!this.UploadType) {
      alert('Please select Upload Type.');
      input.value = '';
      return;
    }

    const file = input.files[0];

    const allowedExtensions = ['xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension || '')) {
      alert('Only Excel files (.xls/.xlsx) are allowed.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('UploadType', this.UploadType);
    formData.append('UserId', this.userdetail.user_Id);

    this.isLoading = true;

    // this.service.UploadCollectionStatus(formData)
    //   .pipe(finalize(() => {
    //     this.isLoading = false;
    //     input.value = '';
    //   }))
    //   .subscribe({

    //     next: (res) => {

    //       if (!res?.Data) {
    //         alert('Server returned no data.');
    //         return;
    //       }

    //       const response = res.Data.error_Message ?? '';

    //       if (response.includes('Row(s) Uploaded Successfully.')) {
    //         alert('Rows Uploaded Successfully.');
    //         return;
    //       }

    //       if (response.includes('Failed to import.')) {

    //         alert('Failed to Import.');

    //         const rawErr = res.Data.errors?.[0];

    //         let errorArray: any[] = [];

    //         try {

    //           if (typeof rawErr === 'string') {

    //             const parsed = JSON.parse(rawErr);

    //             errorArray = Array.isArray(parsed)
    //               ? parsed
    //               : [parsed];

    //           } else {

    //             errorArray = Array.isArray(rawErr)
    //               ? rawErr
    //               : rawErr
    //                 ? [rawErr]
    //                 : [];

    //           }

    //         } catch {

    //           errorArray = rawErr
    //             ? [{ Error_Message: String(rawErr) }]
    //             : [];

    //         }

    //         const exportData = errorArray.map((x: any) => ({
    //           Error_Message: x.Error_Message || x.Validation || ''
    //         }));

    //         const worksheet = XLSX.utils.json_to_sheet(exportData);

    //         const workbook = {
    //           Sheets: {
    //             ErrorMessages: worksheet
    //           },
    //           SheetNames: ['ErrorMessages']
    //         };

    //         XLSX.writeFile(workbook, 'ErrorMessages.xlsx');

    //       }

    //     },
    //     error: (err) => {
    //       console.error(err);
    //       alert('Upload failed.');
    //     }

    //   });
  }

  onDownloadTemplate() {
    var flag = 'NIStatusApprove';
    this.isLoading = true;
    // this.service.GetTemplate(this.userdetail.user_Id, flag)
    //   .subscribe({

    //     next: (res: any) => {
    //       this.isLoading = false;
    //       const tableData = res?.Data?.data?.Table0 ?? [];

    //       if (!tableData.length) {
    //         alert('No template data found.');
    //         return;
    //       }
    //       this.exportDataToExcel(tableData, 'batch_generation_template');
    //     },
    //     error: (err) => {
    //       this.isLoading = false;
    //       console.error(err);
    //       alert('Unable to download template.');
    //     }

    //   });
  }

  exportDataToExcel(data: any[], filename: string) {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

      xlsx.writeFile(workbook,`${filename}_${new Date().getTime()}.xlsx`
      );
    });
  }
}
