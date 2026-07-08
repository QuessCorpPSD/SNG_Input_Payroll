import { Component, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import { PayperiodSalaryComponent } from '../../../common/payperiod-salary/payperiod-salary.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from "@angular/material/checkbox";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { VANPaymentService } from '../../../Service/SalaryRelease/vanpayment.service';
import { Common_TOKEN } from '../../POProcess/extension/extension.component';
import saveAs from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-vanpayment-request',
  standalone: true,
  imports: [
    CompanyallComponent,
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PayperiodSalaryComponent,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    AlertpopupComponent
  ],
  templateUrl: './vanpayment-request.component.html',
  styleUrl: './vanpayment-request.component.css',
  providers: [{ provide: Common_TOKEN, useClass: VANPaymentService }]
})
export class VANPaymentRequestComponent implements OnInit {
  companyId: any;
  selectedCompanyCode: any;
  selectedPP: any;
  selectedCC: any;
  payPeriodId?: number;

  vanPaymentData: any;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = ['select', 'serial_No', 'company_Code', 'employee_Code', 'employee_Name', 'pay_Period', 'map_Name', 'invoice_No', 'hold_status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  payperiodUI = new EventEmitter<Payperiodclass>();
  selectedRows: any[] = [];
  userdetail: any;
  @ViewChild('fileInput') fileInput!: ElementRef;

  isSelectAllChecked = false;
  isTableVisible = false;
  isLoading = false;
  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;
  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';


  constructor(
    private vanPaymentService: VANPaymentService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService
  ) { }

  ngOnInit(): void {
    this.initializeUserDetails();
  }

  private initializeUserDetails(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
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

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
    this.selectedCompanyCode = event.companyCode;
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

  DownloadTemplate() {
    this.isLoading = true;
    const Qzoneusername = this.userdetail?.user_Id;
    const Flag = 'VanPaymentRequest';
    const createdBy = this.userdetail?.user_Id?.toString();

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

    this.vanPaymentService.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: (res: APIResponse) => {
        console.log('Template API Response:', res);

        let data: any[] = [];

        if (res && res.Data) {
          if (res.Data.data && res.Data.data.Table0) {
            data = res.Data.data.Table0;
          } else if (res.Data.Table0) {
            data = res.Data.Table0;
          } else if (Array.isArray(res.Data)) {
            data = res.Data;
          } else if (typeof res.Data === 'object') {
            data = [res.Data];
          }
        } else if (Array.isArray(res)) {
          data = res;
        }

        console.log('Extracted template data length:', data.length);

        if (!data || data.length === 0) {
          this.showAlertPopup('Information', 'No template data available in the response.');
          this.isLoading = false;
          return;
        }

        try {
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          const workbook: XLSX.WorkBook = {
            Sheets: {
              'VANPaymentTemplate': worksheet
            },
            SheetNames: ['VANPaymentTemplate']
          };

          // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          // const blob = new Blob([buffer], { type: 'application/octet-stream' });
          // FileSaver.saveAs(blob, `VAN Payment Request_${Date.now()}.xlsx`);
          XLSX.writeFile(workbook, `VAN Payment Request_${Date.now()}.xlsx`);
          this.showAlertPopup('Success', 'Template downloaded successfully!');
          this.isLoading = false;

        } catch (error) {
          console.error('Error creating Excel file:', error);
          this.showAlertPopup('Error', 'Error creating template file. Please try again.');
          this.isLoading = false;
        }
      },
      error: (err: any) => {
        console.error('Error downloading template:', err);

        let errorMessage = 'Failed to download template';

        if (err.status === 404) {
          errorMessage = 'Template not found (404). Please check the API endpoint.';
        } else if (err.status === 500) {
          errorMessage = 'Server error (500). Please try again later.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        console.error('Full error details:', err);
        this.showAlertPopup('Error', errorMessage);
        this.isLoading = false;
      }
    });
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

    this.vanPaymentService.UploadVANPayment(this.formData).subscribe(
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

  searchAndDownloadExcel(): void {
    this.isLoading = true;
    
    if (!this.companyId) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      this.isLoading = false;
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please select Pay Period');
      this.isLoading = false;
      return;
    }

    const payload = {
      requestdata: [
        {
          CompanyCode: this.selectedCompanyCode?.toString(),
        },
      ],
      Pay_Period_Id: this.payPeriodId,
      QZoneUserName: this.userdetail.user_Id,
    };

    console.log('DownloadPayload', JSON.stringify(payload));

    this.vanPaymentService.searchAndDownloadExcel(payload).subscribe(
      (response: APIResponse) => {
        try {
          const jsonData = response.Data;

          if (!jsonData || jsonData.length === 0) {
            console.warn("No data found in the response.");
            this.showAlertPopup('Information', 'No data found for the selected filters.');
            this.isLoading = false;
            return;
          }

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const workbook: XLSX.WorkBook = { Sheets: { "VAN Payment request": worksheet }, SheetNames: ["Salary Release Data"] };

          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `VAN Payment request_${dateStr}.xlsx`;

          // const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          // const blob = new Blob([excelBuffer], {
          //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          // });
          // saveAs(blob, fileName);
          XLSX.writeFile(workbook, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error("Failed to parse JSON or create Excel file:", err);
          this.showAlertPopup('Error', 'An error occurred while processing the data.');
          this.isLoading = false;
        }
      },
      (error) => {
        console.error("Error downloading the file:", error);
        this.showAlertPopup('Error', 'Error fetching the data. Please try again later.');
        this.isLoading = false;
      }
    );
  }
}