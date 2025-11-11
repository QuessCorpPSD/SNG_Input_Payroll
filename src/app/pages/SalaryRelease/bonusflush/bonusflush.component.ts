import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { BonusflushService } from '../../../Service/SalaryRelease/bonusflush.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { APIResponse } from '../../../Models/apiresponse';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { CommonModule } from '@angular/common';
import saveAs from 'file-saver';

@Component({
  selector: 'app-bonusflush',
  standalone: true,
  imports: [CommonModule, MatIconModule, CompanyallComponent, MatTooltipModule, MatTableModule, ReactiveFormsModule, FormsModule, AlertpopupComponent],
  templateUrl: './bonusflush.component.html',
  styleUrl: './bonusflush.component.css'
})
export class BonusflushComponent {
  companyId: any;
  selectedCC: any;
  selectedCompanyCode: any;
  userdetail: any;
  @ViewChild('fileInput') fileInput: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;

  // Date properties - initialize with current date or leave empty
  fromDate: string = '';
  toDate: string = '';
  isLoading: boolean = false;

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private service: BonusflushService
  ) { }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    console.log('Selected Company:', this.selectedCompanyCode);
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    };
  }




  searchAndDownloadExcel(): void {
    this.isLoading = true;
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      this.isLoading = false;
      return;
    }

    if (!this.fromDate || !this.toDate) {
      this.showAlertPopup('Validation Error', 'Please select both From Date and To Date');
      this.isLoading = false;
      return;
    }

    // Format dates to dd-MM-yyyy
    const formattedFromDate = this.formatDate(this.fromDate);
    const formattedToDate = this.formatDate(this.toDate);

    console.log('API Parameters:', {
      companyId: this.companyId,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
      userName: this.userdetail?.userId || ''
    });

    // Call service method with individual parameters
    this.service.downloadExcel(
      this.companyId,
      formattedFromDate,
      formattedToDate,
      this.userdetail?.userId || ''
    ).subscribe(
      (response: APIResponse) => {
        try {
          // Check if response contains base64 data
          if (!response.Data) {
            console.warn("No data found in the response.");
            this.showAlertPopup("No data found for the selected filters.");
            return;
          }

          // Extract base64 data from response
          let base64Data: string;

          if (typeof response.Data === 'string') {
            // Direct base64 string
            base64Data = response.Data;
          } else if (response.Data.file || response.Data.data) {
            // If base64 is nested in response object
            base64Data = response.Data.file || response.Data.data;
          } else {
            console.warn("Unexpected response format:", response);
            this.showAlertPopup("Unexpected response format from server.");
            return;
          }

          // Clean base64 string if it contains data URL prefix
          if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1];
          }

          // Use your existing function to download the Excel file
          this.downloadExcelFromBase64(
            base64Data,
            `BonusFlush_${formattedFromDate}_to_${formattedToDate}`,
            'BonusFlushReport'
          );
          this.isLoading = false;

          this.showAlertPopup('Success', 'Excel file downloaded successfully!');

        } catch (err) {
          console.error("Failed to process base64 data:", err);
          this.showAlertPopup("Error", "An error occurred while processing the file data.");
          this.isLoading = false;

        }
      },
      (error) => {
        console.error("Error downloading the file:", error);
        this.showAlertPopup("Error", "Error fetching the data. Please try again later.");
        this.isLoading = false;
      }
    );
  }

  // Your existing base64 conversion function
  downloadExcelFromBase64(base64String: string, fileName: string, FileType: string): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Keep your date formatting function
  private formatDate(date: string): string {
    if (!date) return '';

    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }
  private processExcelResponse(response: APIResponse, fromDate: string, toDate: string): void {
    try {
      const jsonData = response.Data;

      if (!jsonData || jsonData.length === 0) {
        console.warn("No data found in the response.");
        this.showAlertPopup("No Data Found", "No data found for the selected filters.");
        return;
      }

      // Create worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

      // Create workbook
      const workbook: XLSX.WorkBook = {
        Sheets: { "Bonus Flush Data": worksheet },
        SheetNames: ["Bonus Flush Data"]
      };

      // File name with dates
      const fileName = `BonusFlush_${fromDate}_to_${toDate}.xlsx`;

      // Export the file
      const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);

      this.showAlertPopup('Success', 'Excel file downloaded successfully!');
    } catch (err) {
      console.error("Failed to parse JSON or create Excel file:", err);
      this.showAlertPopup("Error", "An error occurred while processing the data.");
    }
  }

  // Rest of your methods remain the same...
  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  DownloadTemplate() {
    this.isLoading = true;
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }

    const Qzoneusername = this.userdetail?.userId;
    const Flag = 'BonusFlushOut';
    const createdBy = '3';
    if (!Qzoneusername) {
      this.showAlertPopup('User ID not available');
      return;
    }
    this.service.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          this.showAlertPopup('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'BonusFlush': worksheet },
          SheetNames: ['BonusFlush']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `BonusFlush_${Date.now()}.xlsx`);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        this.showAlertPopup('Failed to download template');
        this.isLoading = false;
      }
    });
  }

  triggerFileInput() {
    this.isLoading = true;
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      this.isLoading = false;
      return;
    }
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;

    if (file) {
      this.readExcelFile(file);
    } else {
      this.showAlertPopup('Error', 'No file selected!');
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
              this.isLoading = false;
            });
            return rowData;
          });

          this.uploadedDataSource = new MatTableDataSource(this.uploadedData);

          this.formData = new FormData();
          this.formData.append('File', file, file.name);
          this.formData.append('QZoneUserName', this.userdetail.userId);
          this.formData.append('Flag', 'Bonus Release');

          this.isUploadGridVisible = true;
          this.isUploadDataVisible = true;

          console.log('Excel data parsed:', this.uploadedData);
          this.showAlertPopup('Success', 'Please review the data and click Submit when ready.');
          this.isLoading = false;
        } else {
          this.showAlertPopup('Error', 'The Excel file appears to be empty!');
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
    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadedData() {
    this.isLoading = true;
    if (!this.formData || !this.selectedFile) {
      this.showAlertPopup('Error', 'No file data to submit!');
      return;
    }

    this.service.Upload(this.formData).subscribe(
      (response: APIResponse) => {
        console.log('Upload response:', response);

        const message = response.Data && response.Data[0] && response.Data[0].error_Message
          ? response.Data[0].error_Message
          : "File uploaded successfully!";

        if (message.toLowerCase().includes('success')) {
          this.showAlertPopup('Success', 'File uploaded successfully!');
          this.createExcelFile(message, response);
          this.resetUploadState();
          this.isLoading = false;
        } else {
          this.showAlertPopup('Import Failed', 'Failed to upload the file. Please check for issues.');
          this.createExcelFile(message, response);
          this.resetUploadState();
          this.isLoading = false;
        }
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