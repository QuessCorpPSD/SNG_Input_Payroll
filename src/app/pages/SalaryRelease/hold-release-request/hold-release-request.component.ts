import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { HoldreleaserequestService } from '../../../Service/SalaryRelease/holdreleaserequest.service';
import { IHoldReleaseRequest } from '../../../Repository/SalaryRequest/Iholdreleaserequest';
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { Payperiodclass } from '../../../Models/Common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from "@angular/material/checkbox";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-hold-release-request',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule, PayperiodSalaryComponent, MatPaginatorModule, MatCheckboxModule, MatTableModule, AlertpopupComponent],
  templateUrl: './hold-release-request.component.html',
  styleUrls: ['./hold-release-request.component.css'],
  providers: [
    { provide: Common_TOKEN, useClass: HoldreleaserequestService }
  ]
})
export class HoldReleaseRequestComponent {
  companyId: any;
  selectedCompanyCode: any;
  selectedCC: any;
  selectedPP: any;
  payPeriodId: any;
  isTableVisible = false;
  payperiodUI = new EventEmitter<Payperiodclass>();

  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = ['select', 'serial_No', 'company_Code', 'company_Name', 'invoice_No', 'employee_Id', 'employee_Name', 'pay_Period', 'map_Name', 'salary_Hold_Type'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  salaryRelease: any;
  isSelectAllChecked = false;
  @ViewChild('fileInput') fileInput: any;
  userdetail: any;
  selectedRows: any[] = [];
  excelFile: File | null = null;
  isLoading = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(@Inject(Common_TOKEN) private leave: IHoldReleaseRequest, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }


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
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    }

  }

  selectAllRows(event: any): void {
    const isChecked = event.checked;

    // Select or deselect rows on the current page
    const currentPageData = this.dataSource.filteredData.slice(
      this.paginator.pageIndex * this.paginator.pageSize,
      (this.paginator.pageIndex + 1) * this.paginator.pageSize
    );

    currentPageData.forEach((row) => {
      row.selected = isChecked;
      if (isChecked) {
        // Add to selected rows if checked
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      } else {
        // Remove from selected rows if unchecked
        const index = this.selectedRows.indexOf(row);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
        }
      }
    });

    // Check if all rows across all pages are selected
    this.isSelectAllChecked = this.dataSource.filteredData.every((row) => row.selected);
    this.dataSource._updateChangeSubscription();  // Refresh table
  }

  // Method to update selected rows when a single row is selected/deselected
  updateSelectedRows(): void {
    this.selectedRows = this.dataSource.filteredData.filter(row => row.selected);
    this.isSelectAllChecked = this.dataSource.filteredData.every(row => row.selected);
  }

  // Handle page change event
  pageChanged(event: any): void {
    const currentPageData = this.dataSource.filteredData.slice(
      event.pageIndex * event.pageSize,
      (event.pageIndex + 1) * event.pageSize
    );
    this.isSelectAllChecked = currentPageData.every((row) => row.selected);
  }

  HoldReleaseSearch() {
    this.isLoading = true;
    this.isTableVisible = true;
    if (!this.companyId) {
      this.showAlertPopup('Please select Company')
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Please Select Payperiod')
    }
    const Payload = {
      Company_Id: this.companyId.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
      Action: 'APPROVE',
    };
    // console.log('Payload:', JSON.stringify(Payload));

    this.leave.SalaryReleaseSearch(Payload).subscribe({
      next: (res) => {
        console.log('API Response:', res.Data);
        this.salaryRelease = res.Data;
        if (this.salaryRelease && this.salaryRelease.length > 0) {
          this.dataSource = new MatTableDataSource(this.salaryRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.displayedColumns = ['select', 'serial_No', 'company_Code', 'company_Name', 'invoice_No', 'employee_Id', 'employee_Name', 'pay_Period', 'map_Name', 'salary_Hold_Type'];
          this.isLoading = false;
        } else {

          this.dataSource.data = [];
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        this.showAlertPopup('Failed to load salary release data');
        this.isLoading = false;
      },
    });
  }


  searchAndDownloadExcel(): void {
    this.isLoading = true;
    if (!this.companyId) {
      this.showAlertPopup('Please select Company');
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Please select Status');
      return;
    }

    const payload = {
      Company_Id: this.companyId?.toString(),
      Pay_Period_Id: this.payPeriodId?.toString(),
    };

    // console.log('DownloadPayload', JSON.stringify(payload));

    this.leave.downloadExcel(payload).subscribe(
      (response: APIResponse) => {
        try {
          const jsonData = response.Data;
          // console.log('excel', jsonData);  

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            console.warn("No data found in the response.");
            this.showAlertPopup("No data found for the selected filters.");
            return;
          }

          const limitedData = jsonData.slice(0, 1200);

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(limitedData);

          const workbook: XLSX.WorkBook = {
            Sheets: { "Hold Release Data": worksheet },
            SheetNames: ["Hold Release Data"]
          };

          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `HoldRelease_Report_${dateStr}.xlsx`;

          const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          // console.log('excelBuffer', excelBuffer);
          this.isLoading = false;
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, fileName);

        } catch (err) {
          console.error("Failed to parse JSON or create Excel file:", err);
          this.showAlertPopup("An error occurred while processing the data.");
          this.isLoading = false;
        }
      },
      (error) => {
        console.error("Error downloading the file:", error);
        this.showAlertPopup("Error fetching the data. Please try again later.");
      }
    );
  }

  DownloadTemplate() {
    this.isLoading = true;
    const Qzoneusername = this.userdetail?.userId;
    const Flag = 'HoldReleaseRequest';
    const createdBy = '3';
    if (!Qzoneusername) {
      this.showAlertPopup('User ID not available');
      return;
    }
    this.leave.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          this.showAlertPopup('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'HoldReleaseRequest': worksheet },
          SheetNames: ['HoldReleaseRequest']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `HoldReleaseRequest_${Date.now()}.xlsx`);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        this.showAlertPopup('Failed to download template');
        this.isLoading = false;
      }
    });
  }

  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;

  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;

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
              this.isLoading = false;
            });
            return rowData;
          });

          this.uploadedDataSource = new MatTableDataSource(this.uploadedData);

          this.formData = new FormData();
          this.formData.append('File', file, file.name);
          this.formData.append('QZoneUserName', this.userdetail.userId);
          this.formData.append('CreatedBy', '3');

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
    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadedData() {
    this.isLoading = true;
    if (!this.formData || !this.selectedFile) {
      this.showAlertPopup('Error', 'No file data to submit!');
      return;
    }

    this.leave.UploadHoldRelease(this.formData).subscribe(
      (response: APIResponse) => {
        console.log('Upload response:', response);

        const message = response.Data && response.Data[0] && response.Data[0].error_Message
          ? response.Data[0].error_Message
          : "File uploaded successfully!";
        console.log('API Response Message:', message);
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

  sendRequest() {
    if (this.selectedRows.length === 0) {
      this.showAlertPopup('Please select at least one invoice.');
      return;
    }


    const payload = {
      requestdata: this.selectedRows.map(row => ({
        Company_Code: (row.company_Code ?? "").toString(),
        Employee_Code: (row.employee_Code ?? "").toString(),
        PayPeriod: (row.pay_Period ?? "").toString(),
        InvNo: (row.invoice_No ?? "").toString(),
        SalaryType: (row.salaryType ?? "Regular").toString(),  // Default to "Regular" if undefined
        ProvisionalInvoiceNumber: ""  // Empty string by default
      })),

      CreatedBy: 3,
      QZoneUserName: this.userdetail.userId.toString()
    };

    console.log('Payload for request', JSON.stringify(payload));

    this.leave.HoldReleaseRequest(payload).subscribe(
      (response: APIResponse) => {
        if (response && response.Data && response.Data[0] && response.Data[0].error_Message) {
          const message = response.Data[0].error_Message;
          console.log('API Response Message:', message);
          console.log('full response', JSON.stringify(response))

          if (message.toLowerCase().includes('successfully')) {
            this.showAlertPopup('Request sent successfully!');
            this.downloadResponse(message, 'success');
          } else {
            this.showAlertPopup('Request sent with warnings or issues.');
            this.downloadResponse(message, 'warning'); // Save as 'warning_response_...txt'
          }
        } else {
          console.log('API Success, but no error_Message:', response);
          this.showAlertPopup('Request sent successfully, but no message returned.');
          this.downloadResponse('No message returned', 'success');
        }

      },
      (error) => {
        if (error && error.data && error.data[0] && error.data[0].error_Message) {
          const errorMessage = error.data[0].error_Message;
          console.error('API Error:', errorMessage);
          this.showAlertPopup('Failed to send request.');
          this.downloadResponse(errorMessage, 'error');
        } else {
          console.error('API Error without message:', error);
          this.showAlertPopup('Failed to send request, but no error message returned.');
          this.downloadResponse('No error message returned', 'error');
        }
      }
    );
  }

  downloadResponse(response: any, type: string) {
    const fileName = `${type}_response_${new Date().toISOString()}.txt`;
    const content = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }
}
