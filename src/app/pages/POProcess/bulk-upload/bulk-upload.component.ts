import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { IPORespository } from '../../../Repository/IPORepository';
import { PoRespository } from '../../../Service/PoRespository';
export const PO_TOKEN = new InjectionToken<IPORespository>('PO_TOKEN');
@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.css',
  providers: [{
    provide: PO_TOKEN,
    useClass: PoRespository,
  }]
})
export class BulkUploadComponent {
  selectedFiles: File[] = [];
  userdetail: any;
  base64Files: { name: string; type: string; size: number; content: string }[] = [];
  constructor(private dialogRef: MatDialogRef<BulkUploadComponent>, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(PO_TOKEN) private poService: IPORespository) { }
  // Capture selected files
  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.convertFilesToBase64();
    }
  }

  // Remove file from list
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  onClose(): void {
    this.dialogRef.close()
  }

  // Upload logic (here just demo)
  // uploadFiles() {
  //   if (this.selectedFiles.length === 0) return;

  //   // Create form data

  //   // this.selectedFiles.forEach(file => formData.append('files', file));

  //   // TODO: Replace with actual API call using HttpClient
  //   // const json = this._sessionStoreage.getItem('UserProfile');
  //   // if (json) {
  //   //   this.userdetail = JSON.parse(this.decry.decrypt(json));


  //   // } else {
  //   //   console.warn('UserProfile not found in session storage');
  //   // }

  //   const request = {
  //     "ActionType": "Upload",
  //     "EmployeeId": 10034,
  //     "File": this.base64Files
  //   };
  //   console.log(JSON.stringify(request));
  //   this.poService.BulkPOUpload(request).subscribe({
  //     next: res => { console.log(res) },
  //     error: err => { console.log(err) }
  //   })

  // }
  uploadFiles() {
    if (this.selectedFiles.length === 0) return;

    // Get userId from session storage
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
      return;
    }

    const formData: FormData = new FormData();

    this.selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    formData.append('flag', 'Upload');
    formData.append('createdBy', this.userdetail.user_Id.toString());

    // ✅ Safe debug log
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    console.log('payload',JSON.stringify(formData));

    this.poService.BulkPOUpload(formData).subscribe({
      next: res => console.log('Upload successful', res),
      error: err => console.error('Upload error', err)
    });
  }

  convertFilesToBase64() {
    this.base64Files = []; // reset
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // remove "data:...;base64,"
        this.base64Files.push({
          name: file.name,
          type: file.type,
          size: file.size,
          content: base64
        });
      };
      reader.readAsDataURL(file);
    });
  }
}


