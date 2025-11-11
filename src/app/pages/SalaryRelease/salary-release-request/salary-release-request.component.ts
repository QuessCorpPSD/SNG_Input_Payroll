import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { ISalaryReleaseRequest } from '../../../Repository/SalaryRequest/isalaryreleaserequest';
import { SalaryreleaserequestService } from '../../../Service/SalaryRelease/salaryreleaserequest.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import { PayperiodSalaryComponent } from '../../../common/payperiod-salary/payperiod-salary.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatTableModule } from '@angular/material/table';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatCheckbox, MatCheckboxModule } from "@angular/material/checkbox";
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-salary-release-request',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule, PayperiodSalaryComponent, MatTableModule, MatCheckboxModule, MatPaginatorModule, AlertpopupComponent],
  templateUrl: './salary-release-request.component.html',
  styleUrl: './salary-release-request.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: SalaryreleaserequestService }
  ]
})
export class SalaryReleaseRequestComponent {
  companyId: any;
  selectedCompanyCode: any;
  years: any[] = [];
  selectedYear: any;
  selectedPP: any;
  selectedCC: any;
  payPeriodId?: number;

  stateService: any;
  payPeriodTypetoChild: string = '';
  salaryRelease: any;

  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = ['select', 'invoice_no', 'company_Code', 'total_emp', 'net_Pay'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  payperiodUI = new EventEmitter<Payperiodclass>();
  selectedRows: any[] = [];
  userdetail: any;
  _snackBar: any;
  @ViewChild('fileInput') fileInput: any;

  // Popup properties
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading = false;

  constructor(@Inject(Common_TOKEN) private leave: ISalaryReleaseRequest, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }

  isSelectAllChecked = false;
  isTableVisible = false;
  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;

  // Method to show popup
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
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiodUI.emit(payperiod);
  }

  selectAllRows(event: any): void {
    const isChecked = event.checked;

    const currentPageData = this.dataSource.filteredData.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      (this.paginator.pageIndex + 1) * this.paginator.pageSize
    );

    currentPageData.forEach((row) => {
      row.selected = isChecked;
      if (isChecked) {
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      } else {
        const index = this.selectedRows.indexOf(row);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
        }
      }
    });

    this.isSelectAllChecked = this.dataSource.filteredData.every((row) => row.selected);
    this.dataSource._updateChangeSubscription();
  }

  updateSelectedRows(): void {
    this.selectedRows = this.dataSource.filteredData.filter(row => row.selected);
    this.isSelectAllChecked = this.dataSource.filteredData.every(row => row.selected);
  }

  pageChanged(event: any): void {
    const currentPageData = this.dataSource.filteredData.slice(
      event.pageIndex * event.pageSize,
      (event.pageIndex + 1) * event.pageSize
    );
    this.isSelectAllChecked = currentPageData.every((row) => row.selected);
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

  SalaryReleaseSearch() {
    this.isLoading = true;
    this.isTableVisible = true;
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

    const Payload = {
      Company_Id: this.companyId.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
      Action: 'APPROVE',
    };
    console.log('Payload:', JSON.stringify(Payload));

    this.leave.SalaryReleaseSearch(Payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('API Response:', res.Data);
        this.salaryRelease = res.Data;
        if (this.salaryRelease && this.salaryRelease.length > 0) {
          this.dataSource = new MatTableDataSource(this.salaryRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['select', 'invoice_no', 'company_Code', 'total_emp', 'net_Pay'];
        } else {
          this.dataSource.data = [];
          this.showAlertPopup('Information', 'No data found for the selected criteria');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
        this.showAlertPopup('Error', 'Failed to load salary release data');
      },
    });
  }

  exportToExcel(): void {
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

    // Call the same API separately for export
    const exportPayload = {
      Company_Id: this.companyId.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
      Action: 'APPROVE',
    };

    console.log('Export Payload:', JSON.stringify(exportPayload));

    this.leave.SalaryReleaseSearch(exportPayload).subscribe({
      next: (res) => {
        
        try {
          const jsonData = res.Data;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup('Information', 'No data available to export');
            this.isLoading = false;
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'SalaryReleaseData');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `salary_release_${timestamp}.xlsx`;
          

          XLSX.writeFile(wb, fileName);
          this.showAlertPopup('Success', 'Excel file exported successfully!');
          this.isLoading = false;

        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.showAlertPopup('Error', 'Failed to export data to Excel');
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading data for export', err);
        this.showAlertPopup('Error', 'Failed to load data for export');
      },
    });
  }

  sendRequest(): void {
    this.isLoading = true;
    if (this.selectedRows.length === 0) {
      this.showAlertPopup('Validation Error', 'Please select at least one invoice.');
      this.isLoading = false;
      return;
    }

    const payload = {
      requestdata: this.selectedRows.map(row => ({
        Invoice_No: row.invoice_no,
        Net_Pay: row.net_Pay.toString()
      })),
      Company_id: this.companyId,
      Pay_Period_id: this.payPeriodId,
      CreatedBy: this.userdetail?.user_Id,
      Mode: 'REQ',
      Bank_Advice_Approvals_Id: 0,
      QZoneUserName: this.userdetail.user_Id.toString()
    };

    console.log('Payload for request', JSON.stringify(payload));

    this.leave.SalaryReleaseRequest(payload).subscribe(
      (response: APIResponse) => {
        this.isLoading = false;
        if (response && response.Data && response.Data[0] && response.Data[0].error_Message) {
          const successMessage = response.Data[0].error_Message;

          console.log('API Success:', successMessage);
          if (successMessage.toLowerCase().includes('success')) {
            this.showAlertPopup('Success', 'Request sent successfully!');
            this.downloadResponse(successMessage, 'success');
            this.SalaryReleaseSearch();
          } else {
            this.showAlertPopup('Warning', 'Request sent with warnings or issues.');
            this.downloadResponse(successMessage, 'warning');
          }
        } else {
          console.log('API Success, but no error_Message:', response);
          this.showAlertPopup('Success', 'Request sent successfully!');
          this.downloadResponse('No message returned', 'success');
        }
      },
      (error) => {
        this.isLoading = false;
        if (error && error.data && error.data[0] && error.data[0].error_Message) {
          const errorMessage = error.data[0].error_Message;
          console.error('API Error:', errorMessage);
          this.showAlertPopup('Error', 'Failed to send request.');
          this.downloadResponse(errorMessage, 'error');
        } else {
          console.error('API Error without message:', error);
          this.showAlertPopup('Error', 'Failed to send request.');
          this.downloadResponse('No error message returned', 'error');
        }
      }
    );
  }

  downloadResponse(response: any, type: string): void {
    const fileName = `${type}_response_${new Date().toISOString()}.txt`;
    const content = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }

  DownloadTemplate() {
    this.isLoading = true;
    console.log('Download Template started...');
    const Qzoneusername = this.userdetail?.user_Id;
    const Flag = 'SalaryRequest';
    const createdBy = this.userdetail?.user_Id;

    if (!Qzoneusername) {
      this.showAlertPopup('Error', 'User ID not available');
      this.isLoading = false;
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
    this.isLoading = true;

    this.leave.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        try {
          const data = res?.Data?.data?.Table0 ?? [];
          if (!data.length) {
            this.showAlertPopup('Information', 'No template data available.');
            this.isLoading = false;
            return;
          }

          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'SalaryRelease': worksheet },
            SheetNames: ['SalaryRelease']
          };

          const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          FileSaver.saveAs(blob, `SalaryReleaseRequest_${Date.now()}.xlsx`);
          // this.showAlertPopup('Success', 'Template downloaded successfully!');
          this.isLoading = false;


        } catch (error) {
          console.error('Error processing template:', error);
          this.showAlertPopup('Error', 'Failed to process template');
        } finally {

          console.log('Download Template completed');
        }
      },
      error: err => {
        console.error('Error downloading template', err);
        // this.showAlertPopup('Error', 'Failed to download template');
        this.isLoading = false;
      }
    });
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
      this.isLoading = false;
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
          this.formData.append('CreatedBy', this.userdetail?.user_Id);

          this.isUploadGridVisible = true;
          this.isUploadDataVisible = true;

          console.log('Excel data parsed:', this.uploadedData);
          this.showAlertPopup('Success', 'Please review the data and click Submit when ready.');
        } else {
          this.showAlertPopup('Error', 'The Excel file appears to be empty!');
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        this.showAlertPopup('Error', 'Error reading Excel file. Please make sure it\'s a valid Excel file.');
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

    this.leave.UploadSalaryRequest(this.formData).subscribe(
      (response: APIResponse) => {
        this.isLoading = false;
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