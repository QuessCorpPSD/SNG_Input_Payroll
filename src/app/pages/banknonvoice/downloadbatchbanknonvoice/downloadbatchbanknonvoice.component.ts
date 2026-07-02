import { Component, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { DownloadBatchService } from '../../../Service/banknonvoice/DownloadBatch.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-downloadbatchbanknonvoice',
  standalone: true,
  imports: [MatIcon, MatTooltipModule, FormsModule, CommonModule],
  templateUrl: './downloadbatchbanknonvoice.component.html',
  styleUrl: './downloadbatchbanknonvoice.component.css'
})
export class DownloadbatchbanknonvoiceComponent implements OnInit {

  selectedBatchId = '';
  BatchType = '';
  BatchDate: string = '';
  FormattedBatchDate: string = '';
  batchtypes: any;
  batchList: any;
  isLoading: boolean = false;
  userdetail: any;
  constructor(public service: DownloadBatchService, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) {
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.loadbatchType(this.userdetail.user_Id)
  }

  onBatchChange(): void {

    this.selectedBatchId = '';

    if (!this.BatchType) {
      //alert('Please select Batch Type.');
      return;
    }

    if (!this.BatchDate) {
      //alert('Please select Date.');
      return;
    }

    if (this.BatchDate) {
      const [year, month, day] = this.BatchDate.split('-');
      this.FormattedBatchDate = `${day}-${month}-${year}`;
    }

    this.BindBatchId(this.BatchType);
  }

  BindBatchId(selectedBatchId) {
    console.log('FormattedBatchDate', this.FormattedBatchDate);
    this.isLoading = true;
    this.service.GetBatchList(selectedBatchId, this.FormattedBatchDate, this.userdetail.user_Id).subscribe({
      next: (res: any) => {
        this.batchList = res?.Data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load Batch Id');
        this.isLoading = false;
      }
    });
  }

  loadbatchType(userid): void {
    this.service.GetBatchTypeList(userid).subscribe({
      next: (res: any) => {
        this.batchtypes = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }

  // downloadBatch(): void {

  //   if (!this.selectedBatchId) {
  //     alert('Please select a Batch ID.');
  //     return;
  //   }

  //   this.isLoading = true;

  //   this.service.DownloadBatchFile(this.selectedBatchId)
  //     .pipe(finalize(() => this.isLoading = false))
  //     .subscribe({
  //       next: (response: Blob) => {

  //         const blob = new Blob([response], {
  //           type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //         });

  //         const url = window.URL.createObjectURL(blob);

  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = `Batch_${this.selectedBatchId}.xlsx`;
  //         a.click();

  //         window.URL.revokeObjectURL(url);
  //         this.selectedBatchId = '';
  //         this.BindBatchId(this.BatchType);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert('Failed to download file.');
  //       }
  //     });

  // }


  downloadBatch(): void {

    if (!this.selectedBatchId) {
      alert('Please select a Batch ID.');
      return;
    }

    this.isLoading = true;

    this.service.DownloadBatchFile(this.selectedBatchId).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const blob = response.body;

        // Default filename
        let fileName = `Batch_${this.selectedBatchId}.rar`;

        // Read filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }

        // Download file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        window.URL.revokeObjectURL(url);

        // this.selectedBatchId = '';
        // this.BindBatchId(this.BatchType);

        alert('File downloaded successfully!');
      },

      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Failed to download file.');
      }
    });
  }

}

