import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompanyComponent } from '../../../common/company/company.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { UanreleaseService } from '../../../Service/SalaryRelease/uanrelease.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from "@angular/material/checkbox";
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';

@Component({
  selector: 'app-uanrelease',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatPaginatorModule, ReactiveFormsModule, FormsModule, MatTableModule, MatCheckboxModule, AlertpopupComponent],
  templateUrl: './uanrelease.component.html',
  styleUrl: './uanrelease.component.css'
})
export class UANReleaseComponent {
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  companyId: any;
  selectedCC: any;
  userdetail: any;
  entityList: any[] = [];
  selectedEntity: any;
  employeeCode: any;
  isTableVisible: boolean = false;

  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  uanRelease: any[] = [];

  // Define columns including checkbox
  displayedColumns: string[] = ['select', 'entity_Name', 'companyCode', 'companyName', 'invoiceNumber', 'employeeCode', 'employeeName', 'payPeriod', 'netPay', 'holdStatus', 'uanRemarks'];
  dataSource = new MatTableDataSource<any>([]);
 uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isSelectAllChecked: boolean = false;
  selectedRows: any[] = [];
  
  @ViewChild('fileInput') fileInput: any;
  excelFile: File | null = null;


  constructor(private poService: UanreleaseService, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }

  BindEntity() {
    this.poService.GetInvoiceDescription(this.userdetail.user_Id).subscribe({
      next: res => {
        this.entityList = res.Data;
      },
      error: err => {
        console.log('Error fetching entity list:', err);
      }
    });
  }

  // Master toggle for select all
  masterToggle() {
    this.isSelectAllChecked = !this.isSelectAllChecked;

    if (this.isSelectAllChecked) {
      // Select all rows on current page
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      const currentPageData = this.dataSource.filteredData.slice(startIndex, endIndex);

      currentPageData.forEach(row => {
        row.selected = true;
        if (!this.selectedRows.includes(row)) {
          this.selectedRows.push(row);
        }
      });
    } else {
      // Deselect all rows
      this.dataSource.data.forEach(row => row.selected = false);
      this.selectedRows = [];
    }
  }

  // Handle individual row selection
  onRowSelect(row: any, event: any) {
    row.selected = event.checked;

    if (event.checked) {
      if (!this.selectedRows.includes(row)) {
        this.selectedRows.push(row);
      }
    } else {
      const index = this.selectedRows.indexOf(row);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
      this.isSelectAllChecked = false;
    }

    // Check if all visible rows are selected
    this.updateSelectAllState();
  }

  // Update select all checkbox state
  updateSelectAllState() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    const currentPageData = this.dataSource.filteredData.slice(startIndex, endIndex);

    if (currentPageData.length > 0) {
      this.isSelectAllChecked = currentPageData.every(row => row.selected);
    } else {
      this.isSelectAllChecked = false;
    }
  }

  // Handle page change
  onPageChange(event: any) {
    this.updateSelectAllState();
  }

  ngOnInit() {
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

    this.BindEntity();
  }

  search() {
    this.isLoading = true;
    if (!this.selectedEntity) {
      this.showAlertPopup('Please select Entity');
      this.isLoading=false;
      return;
    }

    const Payload = {
      Entity_Id: this.selectedEntity.toString(),
      Pay_Period_Id: 0,
      Employee_Id: this.employeeCode || "",
      QZoneUserName: this.userdetail.user_Id
    };

    this.poService.Search(Payload).subscribe({
      next: (res) => {
        if (res.Data && res.Data.length) {
          // Add selected property to each row for checkbox functionality
          this.uanRelease = res.Data.map((item: any) => ({
            ...item,
            selected: false
          }));

          this.dataSource = new MatTableDataSource(this.uanRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isTableVisible = true;
          this.selectedRows = [];
          this.isSelectAllChecked = false;
          this.isLoading = false;
        } else {
          this.dataSource = new MatTableDataSource<any>([]);
          this.isTableVisible = false;
          this.selectedRows = [];
          this.isSelectAllChecked = false;
          this.isLoading = false;
          this.showAlertPopup('No data found for the selected criteria');
        }
      },
      error: (err) => {
        this.showAlertPopup('Failed to load salary release data');
        this.isTableVisible = false;
        this.isLoading = false;

      }
    });
  }

  // Rest of your methods remain the same...
  searchAndDownloadExcel(): void {
    this.isLoading = true;
    if (!this.selectedEntity) {
      this.showAlertPopup('Please select Entity');
      return;
    }

    const payload = {
      Entity_Id: this.selectedEntity.toString(),
      Pay_Period_Id: 0,
      Employee_Id: this.employeeCode || "",
      QZoneUserName: this.userdetail.user_Id
    };

    this.poService.Search(payload).subscribe(
      (response: APIResponse) => {
        try {
          const jsonData = response.Data;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            console.warn("No data found in the response.");
            this.showAlertPopup("No data found for the selected filters.");
            this.isLoading = false;
            return;
          }

          const limitedData = jsonData.slice(0, 1200);

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(limitedData);

          const workbook: XLSX.WorkBook = {
            Sheets: { "UAN Release Data": worksheet },
            SheetNames: ["UAN Release Data"]
          };

          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `UANRelease_Report_${dateStr}.xlsx`;
          this.isLoading = false;

          const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, fileName);
          this.isLoading = false;

        } catch (err) {
          console.error("Failed to parse JSON or create Excel file:", err);
          this.showAlertPopup("An error occurred while processing the data.");
          this.isLoading = false;
        }
      },
      (error) => {
        console.error("Error downloading the file:", error);
        this.showAlertPopup("Error fetching the data. Please try again later.");
        this.isLoading = false;
      }
    );
  }

  DownloadTemplate() {
    this.isLoading = true;
    const Qzoneusername = this.userdetail?.user_Id;
    const Flag = 'UanHoldRelease';
    const createdBy = this.userdetail?.user_Id;
    if (!Qzoneusername) {
      this.showAlertPopup('User ID not available');
      this.isLoading = false;
      return;
    }
     if (!this.selectedEntity) {
      this.showAlertPopup('Please select Entity');
      this.isLoading=false;
      return;
    }
    this.poService.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          this.showAlertPopup('No template data available.');
          this.isLoading = false;
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'UANRelease': worksheet },
          SheetNames: ['UANRelease']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `UANRelease_${Date.now()}.xlsx`);
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
    this.isLoading = true;
    if (!this.selectedEntity) {
      this.showAlertPopup('Validation Error', 'Please select Entity');
      this.isLoading = false;
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

    this.poService.UploadHoldRelease(this.formData).subscribe(
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

sendRequest(): void {
  if (this.selectedRows.length === 0) {
    this.showAlertPopup('Please select at least one invoice.');
    return;
  }

  const payload = {
    requestdata: this.selectedRows.map(row => ({
      Entity_Name: row.entity_Name || '',
      CompanyCode: row.companyCode || '',
      CompanyName: row.companyName || '',
      InvoiceNumber: row.invoiceNumber || '',
      EmployeeCode: row.employeeCode || '',
      EmployeeName: row.employeeName || '',
      PayPeriod: row.payPeriod || '',
      NetPay: row.netPay ? row.netPay.toString() : '',
      HoldStatus: row.holdStatus || '',
      UANRemarks: row.uanRemarks || ''
    })),
    QZoneUserName: this.userdetail.user_Id.toString()
  };

  console.log('Payload for request:', JSON.stringify(payload));

  this.poService.SendRequest(payload).subscribe(
    (response: APIResponse) => {
      if (response && response.Data && response.Data[0] && response.Data[0].error_Message) {
        const successMessage = response.Data[0].error_Message;
        console.log('API Success:', successMessage);

        if (successMessage.toLowerCase().includes('successfully')) {
          this.showAlertPopup('Request sent successfully!');
          this.downloadResponse(successMessage, 'success');

          this.search(); 
        } else {
          this.showAlertPopup('Request sent with warnings or issues.');
          this.downloadResponse(successMessage, 'warning');
        }
      } else {
        console.log('API Success, but no error_Message:', response);
        this.showAlertPopup('Request sent successfully, but no message returned.');
        this.downloadResponse('No message returned', 'success');

        this.search();
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

  downloadResponse(response: any, type: string): void {
    const fileName = `${type}_response_${new Date().toISOString()}.txt`;
    const content = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }
}