import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { PayperiodSalaryComponent } from '../../../common/payperiod-salary/payperiod-salary.component';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { Payperiodclass } from '../../../Models/Common';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IEmployeeSalaryRelease } from '../../../Repository/SalaryRequest/IEmployeeSalaryRelease';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmployeeSalaryReleaseService } from '../../../Service/SalaryRelease/employee-salary-release.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';

@Component({
  selector: 'app-employeesalaryrelease',
  standalone : true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule, PayperiodSalaryComponent, MatPaginatorModule, MatTableModule, AlertpopupComponent],
  templateUrl: './employeesalaryrelease.component.html',
  styleUrl: './employeesalaryrelease.component.css',

  providers: [
    { provide: Common_TOKEN, useClass: EmployeeSalaryReleaseService }
  ]
})
export class EmployeesalaryreleaseComponent {
  companyId: any;
  selectedCC: any;
  selectedPP: any;
  payPeriodId: any;
  payperiodUI = new EventEmitter<Payperiodclass>();
  isLoading = false;
  isTableVisible = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  salaryRelease: any;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['sNo', 'company_Code', 'pay_Period', 'vendor_Name', 'group_Name', 'purpose', 'inpuT_NO', 'batcH_ID', 'g_NO'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userdetail: any;
  @ViewChild('fileInput') fileInput: any;

  uploadedDataSource = new MatTableDataSource<any>();
  isUploadGridVisible = false;

  uploadedData: any[] = [];
  uploadDisplayedColumns: string[] = [];
  isUploadDataVisible = false;
  selectedFile: File | null = null;
  formData: FormData | null = null;

  constructor(@Inject(Common_TOKEN) private leave: IEmployeeSalaryRelease, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }


  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiodUI.emit(payperiod);
  }

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

  Search() {
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
      Action: 'Search',
    };
    console.log('Payload:', JSON.stringify(Payload));

    this.leave.EmployeeSalaryReleaseSearch(Payload).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.salaryRelease = res.Data;
        if (this.salaryRelease && this.salaryRelease.length > 0) {
          this.dataSource = new MatTableDataSource(this.salaryRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.displayedColumns = ['sNo', 'company_Code', 'pay_Period', 'vendor_Name', 'group_Name', 'purpose', 'inpuT_NO', 'batcH_ID', 'g_NO'];

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
      Action: 'Search',
    };

    console.log('Export Payload:', JSON.stringify(exportPayload));

    this.leave.EmployeeSalaryReleaseSearch(exportPayload).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, 'EmployeeSalaryReleaseData');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Employeesalary_release_${timestamp}.xlsx`;


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
    const Qzoneusername = this.userdetail?.userId;
    const Flag = 'SalaryRequestNI';
    const createdBy = '3';

    if (!Qzoneusername) {
      this.showAlertPopup('User ID not available');
      return;
    }

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
    this.leave.DownloadTemplate(Flag, Qzoneusername, createdBy).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          this.showAlertPopup('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Employeesalaryrelease': worksheet },
          SheetNames: ['Employeesalaryrelease']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `Employeesalaryrelease_${Date.now()}.xlsx`);
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

    this.leave.UploadSalaryHoldRequest(this.formData).subscribe(
      (response: APIResponse) => {
        console.log('Upload response:', response);

        const message = response.Data && response.Data[0] && response.Data[0].validation
          ? response.Data[0].validation
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

}
