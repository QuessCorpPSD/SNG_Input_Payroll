import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { ISalaryReleaseRequest } from '../../../Repository/SalaryRequest/isalaryreleaserequest';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { ISalaryHoldRequest } from '../../../Repository/SalaryRequest/Isalaryholdrequest';
import { SalaryHoldRequestService } from '../../../Service/SalaryRelease/salary-hold-request.service';
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { Payperiodclass } from '../../../Models/Common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-salary-hold-request',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule, PayperiodSalaryComponent, MatPaginatorModule, MatTableModule, AlertpopupComponent],
  templateUrl: './salary-hold-request.component.html',
  styleUrl: './salary-hold-request.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: SalaryHoldRequestService }
  ]
})
export class SalaryHoldRequestComponent {
  companyId: any;
  selectedCompanyCode: any;
  years: any[] = [];
  selectedYear: any;
  selectedPP?: string;
  payPeriodId?: number;
  payperiodUI = new EventEmitter<Payperiodclass>();
  selectedCC: any;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = ['serial_No', 'company_Code', 'employee_Code', 'employee_Name', 'pay_Period', 'map_Name', 'invoice_No', 'hold_status'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  salaryRelease: any;
  isTableVisible = false;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = ''; 
  isSelectAllChecked = false;
  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;
  @ViewChild('fileInput') fileInput: any;
  isLoading = false;
  
  constructor(@Inject(Common_TOKEN) private leave: ISalaryHoldRequest, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
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

  SearchSalaryHoldRelease() {
    this.isLoading = true;
    this.isTableVisible = true;
    
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      return;
    }
    
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please Select Payperiod');
      return;
    }
    
    const Payload = {
      Company_Id: this.companyId.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
    };

    console.log('Payload:', JSON.stringify(Payload));

    this.leave.SalaryHoldRequestSearch(Payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('API Response:', res.Data);
        this.salaryRelease = res.Data;
        if (this.salaryRelease && this.salaryRelease.length > 0) {
          this.dataSource = new MatTableDataSource(this.salaryRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['serial_No', 'company_Code', 'employee_Code', 'employee_Name', 'pay_Period', 'map_Name', 'invoice_No', 'hold_status'];
          this.isLoading=false;
        } else {
          this.dataSource.data = [];
          this.showAlertPopup('Information', 'No data found for the selected criteria');
          this.isLoading=false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
        this.showAlertPopup('Error', 'Failed to load salary release data');
      },
    });
  }

  searchAndDownloadExcel(): void {
    this.isLoading = true;
    

    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      this.isLoading = false;
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please Select Payperiod');
      this.isLoading = false;
      return;
    }

    const payload = {
      Company_Id: this.companyId?.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
    };

    console.log('DownloadPayload', JSON.stringify(payload));

    this.leave.downloadExcel(payload).subscribe(
      (response: APIResponse) => {
        try {
          const jsonData = response.Data;

          if (!jsonData || jsonData.length === 0) {
            console.warn("No data found in the response.");
            this.showAlertPopup("Information", "No data found for the selected filters.");
            this.isLoading = false;
            return;
          }

          // Create worksheet
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const workbook: XLSX.WorkBook = { 
            Sheets: { "Salary Hold Release Data": worksheet }, 
            SheetNames: ["Salary Hold Release Data"] 
          };

          // File name
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `SalaryHold_Report_${dateStr}.xlsx`;

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
        } finally {
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

  DownloadTemplate() {
    this.isLoading = true;
    const Qzoneusername = this.userdetail?.user_Id;
    const Flag = 'HoldRequest';
    const createdBy = this.userdetail.user_Id;
    
    if (!Qzoneusername) {
      this.showAlertPopup('Error', 'User ID not available');
      return;
    }
     if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please Select Company');
      this.isLoading = false;
      return;
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please Select Payperiod');
      this.isLoading = false;
      return;
    }
    
    this.leave.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        try {
          const data = res?.Data?.data?.Table0 ?? [];
          if (!data.length) {
            this.showAlertPopup('Information', 'No template data available.');
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'SalaryHoldRequest': worksheet },
            SheetNames: ['SalaryHoldRequest']
          };

          const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, `SalaryHoldRequest_${Date.now()}.xlsx`);
          this.showAlertPopup('Success', 'Template downloaded successfully!');
          
        } catch (error) {
          console.error('Error processing template:', error);
          this.showAlertPopup('Error', 'Failed to process template');
        } finally {
          this.isLoading = false;
        }
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
            });
            return rowData;
          });

          this.uploadedDataSource = new MatTableDataSource(this.uploadedData);

          this.formData = new FormData();
          this.formData.append('File', file, file.name);
          this.formData.append('QZoneUserName', this.userdetail.user_Id);
          this.formData.append('CreatedBy', this.userdetail.user_Id);

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
      } finally {
        this.isLoading = false;
      }
    };

    reader.onerror = (error) => {
      this.isLoading = false;
      console.error('Error reading file:', error);
      this.showAlertPopup('Error', 'Error reading file!');
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

    this.leave.UploadSalaryHoldRequest(this.formData).subscribe(
      (response: APIResponse) => {
        try {
          console.log('Upload response:', response);

          const message = response.Data && response.Data[0] && response.Data[0].validation
            ? response.Data[0].validation
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
        } catch (error) {
          console.error('Error processing upload response:', error);
          this.showAlertPopup('Error', 'Error processing upload response');
        } finally {
          this.isLoading = false;
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Upload failed:', error);
        this.showAlertPopup('Error', 'File submission failed!');
        this.resetUploadState();
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