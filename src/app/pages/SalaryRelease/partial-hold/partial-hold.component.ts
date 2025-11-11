import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { IpartialHold } from '../../../Repository/SalaryRequest/IpartialHold';
import { PatialHoldService } from '../../../Service/SalaryRelease/patial-hold.service';
import { Common_TOKEN } from '../../POProcess/extension/extension.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-partial-hold',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTableModule,
    AlertpopupComponent
  ],
  templateUrl: './partial-hold.component.html',
  styleUrl: './partial-hold.component.css',
  providers: [
    {
      provide: Common_TOKEN,
      useClass: PatialHoldService,
    }
  ]
})
export class PartialHoldComponent {
  type: any;
  userdetail: any;
  selectedUploadType: any;
  @ViewChild('fileInput') fileInput: any;
  companyId: any;
  isSelectAllChecked = false;
  isTableVisible = false;
  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup: boolean = false;
  isLoading: boolean = false;

  
  displayedColumns: string[] = ['select', 'invoice_no', 'company_Code', 'total_emp', 'net_Pay'];
  dataSource = new MatTableDataSource<any>([])
  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private partialhold: PatialHoldService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    console.log(this.userdetail);
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName
    } 

    this.BindUploadType(this.userdetail.user_Id);
  }
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  BindUploadType(userName: string): void {
    // this.isLoading = true; 
    this.partialhold.GetUploadType(this.userdetail.user_Id).subscribe({
      next: (res) => {
        if (res && res.Data) {
          this.type = res.Data;
        }
        // this.isLoading = false; 
      },
      error: (err) => {
        console.error('Error fetching upload types:', err);
        // this.isLoading = false; 
      }
    });
  }

  DownloadTemplate() {
    
    this.isLoading = true;
    const Flag = this.selectedUploadType;
    const Qzoneusername = this.userdetail.user_Id;
    const createdBy = this.userdetail.user_Id;
  
    console.log(Flag);   

      if (!Flag) {
      this.showAlertPopup('Validation Error', 'Please select Upload type');
      this.isLoading = false; 
      return;
    }
    if (!Qzoneusername) {
      this.showAlertPopup('Error', 'User ID not available');
      this.isLoading = false; 
      return;
    }

    this.partialhold.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          this.isLoading = false;
          this.showAlertPopup('Information', 'No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'PartialHold': worksheet },
          SheetNames: ['PartialHold']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `PartialHold_${Date.now()}.xlsx`);
        this.showAlertPopup('Success', 'Template downloaded successfully!');
        this.isLoading = false; 
      },
      error: err => {
        console.error('Error downloading template', err);
        this.showAlertPopup('Error', 'Failed to download template');
        this.isLoading = false;
      }
    });
  }

  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;

  triggerFileInput() {
    if (!this.selectedUploadType) {
      this.showAlertPopup('Validation Error', 'Please select Upload type');
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    this.isLoading = true;
    const file: File = event.target.files[0];
    this.selectedFile = file;

    if (file) {
      this.readExcelFile(file);
    } else {
      this.showAlertPopup('Error', 'No file selected!');
      this.isLoading = false;
    }
  }

  readExcelFile(file: File) {
    this.isLoading = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          this.uploadDisplayedColumns = jsonData[0] as string[];

          this.uploadedData = jsonData.slice(1).map((row: any, index: number) => {
            const rowData: any = { id: index };
            this.uploadDisplayedColumns.forEach((header, colIndex) => {
              rowData[header] = row[colIndex];
            });
            return rowData;
          });

          this.uploadedDataSource = new MatTableDataSource(this.uploadedData);

          this.formData = new FormData();
          this.formData.append('File', file, file.name);
          this.formData.append('QZoneUserName', this.userdetail.user_Id);
          this.formData.append('Flag', this.selectedUploadType);

          this.isUploadGridVisible = true;
          this.isUploadDataVisible = true;

          console.log('Excel data parsed:', this.uploadedData);
          this.showAlertPopup('Success', 'Please review the data and click Submit when ready.');
          this.isLoading = false; 
        } else {
          this.showAlertPopup('Error', 'The Excel file appears to be empty!');
          this.isLoading = false; 
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        this.showAlertPopup('Error', 'Error reading Excel file. Please make sure it\'s a valid Excel file.');
        this.isLoading = false; 
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.showAlertPopup('Error', 'Error reading file!');
      this.isLoading = false; 
    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadedData() {
    this.isLoading = true;
    if (!this.formData || !this.selectedFile) {
      this.showAlertPopup('Error', 'No file data to submit!');
      this.isLoading = false; 
      return;
    }

    this.partialhold.Upload(this.formData).subscribe(
      (response: APIResponse) => {
        console.log('Upload response:', response);

        const message = response.Data && response.Data[0] && response.Data[0].error_Message
          ? response.Data[0].error_Message
          : "File uploaded successfully!";

        if (message.toLowerCase().includes('success')) {
          this.showAlertPopup('Success', 'File uploaded successfully!');
          this.createExcelFile(message, response);
          this.resetUploadState();
        } else {
          this.showAlertPopup('Import Failed', 'Failed to upload the file. Please check for issues.');
          this.createExcelFile(message, response);
          this.resetUploadState();
        }
        this.isLoading = false; 
      },
      (error) => {
        console.error('Upload failed:', error);
        this.showAlertPopup('Error', 'File submission failed!');
        this.resetUploadState();
        this.isLoading = false; 
      }
    );
  }

  resetUploadState() {
    this.uploadedData = [];
    this.uploadDisplayedColumns = [];
    this.isUploadGridVisible = false;
    this.isUploadDataVisible = false;
    this.selectedFile = null;
    this.formData = null;
    this.isLoading = false; 

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  createExcelFile(message: string, response?: APIResponse) {
    const data: { Message: string }[] = [];

    if (response && response.Data && Array.isArray(response.Data)) {
      response.Data.forEach((item: any, index: number) => {
        if (item && item.error_Message) {
          data.push({
            Message: `Row ${index + 1}: ${item.error_Message}`
          });
        }
      });
    }

    if (data.length === 0) {
      data.push({ Message: message });
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Error Messages');
    const excelArray: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const excelFile: Blob = new Blob([excelArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(excelFile);
    link.download = `UploadResponse_${new Date().getTime()}.xlsx`;
    link.click();
  }
}