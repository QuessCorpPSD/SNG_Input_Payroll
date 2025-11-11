import { CommonModule } from '@angular/common';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { Payperiodclass } from '../../../Models/Common';
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { NetpaysummaryNonvoiceService } from '../../../Service/SalaryRelease/netpaysummary-nonvoice.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatTableDataSource } from '@angular/material/table';
import { APIResponse } from '../../../Models/apiresponse';


@Component({
  selector: 'app-netpaysummaryofnonvoice',
  standalone: true,
  imports: [
    CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PayperiodSalaryComponent,
    AlertpopupComponent
  ],
  templateUrl: './netpaysummaryofnonvoice.component.html',
  styleUrl: './netpaysummaryofnonvoice.component.css'
})
export class NetpaysummaryofnonvoiceComponent {
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
    private service: NetpaysummaryNonvoiceService
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
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    }
  }

  DownloadTemplate() {
    this.isLoading = true;

   const companyID = this.companyId;
    const payPeriodId = this.payPeriodId;
    const QzoneUsername = this.userdetail.userId;

    console.log(companyID, payPeriodId, QzoneUsername);

    if (!this.companyId) {
      this.showAlertPopup('Please select Company');
      this.isLoading = false;
      return;
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select Pay Period');
      this.isLoading = false;
      return;
    }
    if (!QzoneUsername) {
      this.showAlertPopup('Error', 'User ID not available');
      this.isLoading = false;
      return;
    }


    this.service.DownloadTemplate(companyID, payPeriodId, QzoneUsername).subscribe({
      next: res => {
        console.log('API Response:', res);

        const base64String = res?.Data?.file;

        if (base64String && base64String.length > 0) {
          console.log('Base64 String Found:', base64String);
          const fileName = res?.Data?.fileName || 'NetpaysummaryNonvoice';
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

}