import { CommonModule } from '@angular/common';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyComponent } from '../../../common/company/company.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { Payperiodclass } from '../../../Models/Common';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { SalaryadvancerequestService } from '../../../Service/SalaryRelease/salaryadvancerequest.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-salary-advance-request',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    CompanyallComponent,
    PayperiodSalaryComponent,
    MatTableModule,
    AlertpopupComponent
  ],
  templateUrl: './salary-advance-request.component.html',
  styleUrl: './salary-advance-request.component.css'
})
export class SalaryAdvanceRequestComponent {
  message = '';
  popupMessage = '';
  popupSubMessage = '';

  showPopup = false;
  isLoading: boolean = false; 
  selectedCompanyCode: any;
  payperiod: any;
  selectedPayPeriod: any;
  InvoiceCultureForm!: FormGroup;
  selectedPP: any;
  payPeriodId: any;
  payperiodUI = new EventEmitter<Payperiodclass>();
  companyId: any;
  selectedCC: any;
  userdetail: any;


  @ViewChild('fileInput') fileInput: any;
  selectedFile: File | null = null;
  uploadDisplayedColumns: string[] = [];
  uploadedData: any[] = [];
  formData: FormData | null = null;
  isUploadDataVisible: boolean = false;


  constructor(
    private fb: FormBuilder,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private service: SalaryadvancerequestService
  ) { }

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

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
    this.selectedCompanyCode = event.companyCode
    console.log(this.selectedCompanyCode)
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiodUI.emit(payperiod);
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

  DownloadTemplate() {
    this.isLoading = true;

    const Company_Code = this.selectedCompanyCode;
    const Pay_Period_Id = this.payPeriodId;
    const Qzoneusername = this.userdetail.user_Id;

    console.log('Company Code:', Company_Code);
    console.log('Pay Period ID:', Pay_Period_Id);
    console.log('User ID:', Qzoneusername);

    if (!this.selectedCompanyCode) {
      this.showAlertPopup('Validation Error', 'Please select company');
      this.isLoading = false;
      return;
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select Pay Period');
      this.isLoading = false;
      return;
    }
    if (!Qzoneusername) {
      this.showAlertPopup('Error', 'User ID not available');
      this.isLoading = false;
      return;
    }


    this.service.DownloadTemplate(Company_Code, Pay_Period_Id, Qzoneusername).subscribe({
      next: res => {
        console.log('API Response:', res);

        const base64String = res?.Data?.file;

        if (base64String && base64String.length > 0) {
          console.log('Base64 String Found:', base64String);
          const fileName = res?.Data?.fileName || 'SalaryAdvance';
          this.downloadExcelFromBase64(base64String, fileName, 'xlsx');
          this.showAlertPopup('Success', 'Template downloaded successfully!');
        } else {
          this.showAlertPopup('Information', 'No template data available.');
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template:', err);
        this.showAlertPopup('Error', 'Failed to download template');
        this.isLoading = false;
      }
    });
  }

  downloadExcelFromBase64(base64String: string, fileName: string, fileType: string): void {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${fileName}.${fileType}`;


      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);


      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error('Error downloading from base64:', error);
      this.showAlertPopup('Error', 'Failed to process download file');
    }
  }

  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;

  triggerFileInput() {
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please Select Payperiod');
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

          this.isUploadGridVisible = true;
          this.isUploadDataVisible = true;

          console.log('Excel data parsed:', this.uploadedData);
          this.showAlertPopup('Success', 'Please review the data and click Submit when ready.');
        } else {
          this.showAlertPopup('Error', 'The Excel file appears to be empty!');
        }
        this.isLoading = false;
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