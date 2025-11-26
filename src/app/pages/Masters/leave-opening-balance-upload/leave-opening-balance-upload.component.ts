import { CommonModule } from '@angular/common';
import { Component, ViewChild, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaveOpeningBalanceService } from '../../../Service/Master/LeaveOpeningBalance.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
@Component({
  selector: 'lob',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatSortModule,
    CompanyallComponent,
    GroupnameComponent,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './leave-opening-balance-upload.component.html',
  styleUrls: ['./leave-opening-balance-upload.component.css'],
  providers: [LeaveOpeningBalanceService]
})
export class LeaveOpeningBalanceUploadComponent {
  companyIdpopup: number = 0;
  siteIdpopup: string = '0';
  selectedCompanyCode: any;
  selectedSiteName: any;
  companyId = 0;
  siteId = '';
  Fromdate: string = '0';
  Todate: string = '0';
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
    companyIdInput: string = '';
  siteIdInput: string = '';
  companyCodeInput: string = '';
  fromDateInput: string = '';
  toDateInput: string = '';
  userdetail: any;
  vendoremployeeService: any;
  isLoading = false;

  UploadedResponse: any;
  popupMessage = '';
  showPopup = false;
     
 
  constructor(private leaveOpeningBalanceService: LeaveOpeningBalanceService,private _sessionStoreage: SessionStorageService,private decry: EncryptionService) { }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }

  searchLeaveopeningbalance() {
    if (this.companyId === 0) {
      alert('Please select a valid Company');
      return;
    }

    // Ensure siteId is never empty string
    const siteParam = this.siteId && this.siteId.trim() !== '' ? this.siteId : '0';

    this.leaveOpeningBalanceService
      .GetLeaveOpeningCompanywise(
        String(this.companyId),
        siteParam
      )
      .subscribe({
        next: (res) => {
          const table = res?.Data?.data?.Table0 ?? [];

          if (table.length > 0) {
            this.tableHeaders = Object.keys(table[0]);
            this.dynamicColumns = Object.keys(table[0]);
            this.displayedColumns = [...this.dynamicColumns];
            this.dataSource = new MatTableDataSource(table);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource.data = [];
            alert('No data found');
          }
        },
        error: (err) => {
          console.error('Error loading leave opening balance', err);
          alert('Failed to load leave opening balance');
        }
      });
  }

  ngOnInit(): void {
    this.companyId = 0;
    // this.siteId = 0;

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

  }
DownloadLeaveTemplate() {
  console.log('companyId:', this.companyId);
  console.log('siteId:', this.siteId);
  console.log('companyCode:', this.selectedCompanyCode);
  console.log('fromDate:', this.fromDateInput);
  console.log('toDate:', this.toDateInput);

  if (
    !this.companyId ||
    // !this.siteId?.trim() ||
    !this.selectedCompanyCode?.trim() ||
    !this.fromDateInput?.trim() ||
    !this.toDateInput?.trim()
  ) {
    alert('All fields are mandatory. Please fill all the details.');
    return;
  }

  const payload = {
    companyId: this.companyId.toString(),
    siteId: this.siteId,
    companyCode: this.selectedCompanyCode,
    fromdate: this.fromDateInput,
    todate: this.toDateInput
  };

  console.log('Payload sent:', payload);

  this.leaveOpeningBalanceService.PostLeaveOpeningTemplate(payload).subscribe({
    next: (res) => {
      console.log('Backend response:', res);

      if (res.StatusCode === 200 && res.Data?.data?.Table0?.length) {
        const data = res.Data.data.Table0;

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'LeaveOpeningBalance': worksheet },
          SheetNames: ['LeaveOpeningBalance']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blob, `LeaveOpeningBalance_Template_${Date.now()}.xlsx`);
      } else {
        alert('No template data available or backend rejected the request.');
      }
    },
    error: (err) => {
      console.error('Error downloading template:', err);
      alert('Failed to download template');
    }
  });
}

  ImportLeaveBalanceClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one Excel file.');
      this.isLoading = false;
      return;
    }
    console.log()

const formData = new FormData();
console.log('CompanyId:', this.companyId);
console.log('Fromdate:', this.fromDateInput);
console.log('Todate:', this.toDateInput);
console.log('CreatedBy:', this.userdetail?.user_Id);
console.log('File:', file?.name, file?.type, file?.size);

formData.append('file', file);
formData.append('CompanyId', this.companyId?.toString() || '');
formData.append('Fromdate', this.fromDateInput?.trim() || '');
formData.append('Todate', this.toDateInput?.trim() || '');
formData.append('CreatedBy', this.userdetail?.user_Id?.toString() || '');

    this.leaveOpeningBalanceService.UploadLeaveOpeningBalance(formData).subscribe({
      next: (res) => {
        console.log('Upload response:', res);

        this.UploadedResponse = res;
        console.log('Uploading file:', file.name, file.type, file.size);
        console.log('User:', this.userdetail?.user_Id);

        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);
        const successMsg = 'Leave Opening Balance data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.showPopup = true;
          this.popupMessage = successMsg;
          this.isLoading = false;
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          this.handleImportErrors(res?.Data?.errors?.[0]);
          this.popupMessage = 'Import Failed.';
          this.showPopup = true;
          this.isLoading = false;
          return;
        }

        alert(msg || parsed?.Message || 'Unknown error during upload.');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Upload failed (error handler):', err);

        if (err.error?.data?.errors) {
          this.handleImportErrors(err.error.data.errors);
          this.popupMessage = 'Import failed with validation errors. Please check the downloaded error file.';
        } else {
          this.popupMessage = 'Upload failed. See console for details.';
        }

        alert(this.popupMessage);
        this.isLoading = false;
        this.showPopup = true;
      }
    });
  }

  handleImportErrors(rawErr: any) {
    let errorArray: any[] = [];

    try {
      if (typeof rawErr === 'string') {
        const parsed = JSON.parse(rawErr);
        errorArray = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(rawErr)) {
        errorArray = rawErr;
      } else if (rawErr) {
        errorArray = [rawErr];
      }
    } catch {
      errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
    }

    const exportData = errorArray.map((item: any) => ({
      MESSAGE: item?.MESSAGE || item?.Message || item?.message || 'Unknown error'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { ErrorMessages: worksheet },
      SheetNames: ['ErrorMessages']
    };
    XLSX.writeFile(workbook, 'Import_Errors.xlsx');
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') {
      const msg = r.Message || r.message || r.error || r.errorMessage || '';
      return { parsed: r, msg };
    }
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        const msg = p.Message || p.message || p.error || p.errorMessage || '';
        return { parsed: p, msg };
      } catch {
        return { parsed: null, msg: r };
      }
    }
    return { parsed: null, msg: String(r) };
  }

}

