import { Component, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyComponent } from '../../../common/company/company.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';
import { PotypeComponent } from '../../../common/potype/potype.component';
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { HolemployeesalaryService } from '../../../Service/SalaryRelease/holemployeesalary.service';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';

@Component({
  selector: 'app-hold-employe-salary',
  standalone: true,
  imports: [
    CompanyComponent,
    CommonModule,
    ReactiveFormsModule,
    AlertpopupComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PayperiodSalaryComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './hold-employe-salary.component.html',
  styleUrl: './hold-employe-salary.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: HolemployeesalaryService }
  ]
})
export class HoldEmployeSalaryComponent {
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = ['serial_No', 'company_Code', 'company_Id', 'employee_Id', 'employee_Code', 'employee_Name', 'pay_Period', 'pay_Frequency_Detail_Id', 'hold_status', 'nonInvoice_Batchid'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  companyId: any;
  selectedCC: any;
  selectedPP: any;
  payPeriodId: any;
  payperiodUI = new EventEmitter<Payperiodclass>();
  HoldType: any;
  selectedHoldType: any;
  userdetail: any;
  isTableVisible: boolean = false;
  salaryRelease: any;
  @ViewChild('fileInput') fileInput: any;

  constructor(@Inject(Common_TOKEN) private leave: HolemployeesalaryService, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }


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
    this.BindHoldType();

  }



  BindHoldType() {
    this.leave.Holddropdown().subscribe({
      next: (res) => {
        this.HoldType = res.Data;
      },
    });
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
      status: '',
    };
    // console.log('Payload:', JSON.stringify(Payload));

    this.leave.Search(Payload).subscribe({
      next: (res) => {
        console.log('API Response:', res.Data);
        this.salaryRelease = res.Data;
        if (this.salaryRelease && this.salaryRelease.length > 0) {
          this.dataSource = new MatTableDataSource(this.salaryRelease);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.displayedColumns = ['serial_No', 'company_Code', 'company_Id', 'employee_Id', 'employee_Code', 'employee_Name', 'pay_Period', 'pay_Frequency_Detail_Id', 'hold_status', 'nonInvoice_Batchid'];
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
      status: '',
    };

    console.log('Export Payload:', JSON.stringify(exportPayload));

    this.leave.Search(exportPayload).subscribe({
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


  DownloadTemplate() {
    this.isLoading = true;
    const Qzoneusername = this.userdetail?.user_Id;
    const Flag = 'HoldReleaseRequest';
    const createdBy = this.userdetail.user_Id;
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
          Sheets: { 'Holdemployeesalary': worksheet },
          SheetNames: ['Holdemployeesalary']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `Holdemployeesalary_${Date.now()}.xlsx`);
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
          this.formData.append('QZoneUserName', this.userdetail.user_Id);
          this.formData.append('CreatedBy', this.userdetail.user_Id);

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

    this.leave.Upload(this.formData).subscribe(
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






