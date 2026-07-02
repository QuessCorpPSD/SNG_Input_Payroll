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

const Pay_TOKEN = new InjectionToken<IGenericUpload>('Pay_TOKEN');

@Component({
  selector: 'app-genericupload',
  standalone:true,
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
  selectedUploadType: any;
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
    this.GetUploadType();
  }

  GetUploadType() {
    this.service.GetUploadType().subscribe({
      next: (res: any) => {

        this.uploadTypeList = res?.Data?.data?.Table0 || [];
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

    const uploadTypeName = selected?.GEN_vDescription;

    this.service.DownloadTemplate(uploadTypeName).subscribe({
      next: (res: any) => {

        const data = res?.Data?.data?.Table0 || [];

        if (!data.length) {
          alert('No template data found');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          uploadTypeName.replaceAll(' ', '')
        );

        XLSX.writeFile(
          workbook,
          uploadTypeName.replaceAll(' ', '') + 'Template.xlsx'
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
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload only one Excel file');
      this.isLoading = false;
      return;
    }

    if (!this.selectedUploadType || this.selectedUploadType == 0) {
      alert('Please select Upload Type');
      this.isLoading = false;
      return;
    }

    const selected = this.uploadTypeList.find(
      x => x.GEN_iID == this.selectedUploadType
    );

    const uploadTypeName = selected?.GEN_vDescription;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id.toString());
    formData.append('UploadType', uploadTypeName);

    this.service.Importgenericupload(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log(res);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Upload Failed');
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
}
