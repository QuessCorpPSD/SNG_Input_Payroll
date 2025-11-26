import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { VendoremployeeService } from '../../../Service/Master/vendoremployee.service';
import { IVendoremployeeService } from '../../../Repository/Master/ivendoremployee.service';

import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { Console } from 'console';

const vendoremployeeService = InjectionToken<IVendoremployeeService>;

@Component({
  selector: 'vendoremployee',
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
  templateUrl: './vendor-employee.component.html',
  styleUrls: ['./vendor-employee.component.css'],
  providers: [
    { provide: vendoremployeeService, useClass: VendoremployeeService }
  ]
})
export class VendorEmployeeComponent {
  companyId = 0;
  siteId = '';
  employeecode = 0;
  Eactive = 'ALL';

  companyIdpopup: number = 0;
  siteIdpopup: string = '0';

  selectedCompanyCode: any;
  selectedSiteName: any;
  userdetail: any;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];

  vendoremployeeForm: FormGroup;
  selectedFromdate: any;
  isLoading = false;

  UploadedResponse: any;
  popupMessage = '';
  showPopup = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _sessionStorage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(vendoremployeeService) private vendoremployeeService: IVendoremployeeService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.vendoremployeeForm = this.fb.group({
      vendoremployee: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const json = this._sessionStorage.getItem('UserProfile');
    if (json) {
      try {
        this.userdetail = JSON.parse(this.decry.decrypt(json));
      } catch (error) {
        console.error('Error decrypting user profile:', error);
      }
    }
  }

  handleCompanyEventpopup(event: any) {
    this.companyIdpopup = event.companyId;
    this.selectedCompanyCode = event.displayName;
  }

  groupnameEventpopup(event: any) {
    this.siteIdpopup = event.siteCode;
    this.selectedSiteName = event.siteName;
  }

  getReadableColumnName(column: string): string {
    return column ? column.replace(/_/g, ' ') : column;
  }

  get hasSearchResults(): boolean {
    return Array.isArray(this.dataSource?.data) && this.dataSource.data.length > 0;
  }


  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }
  
  

  searchVendorEmployee() {
  const companyidstr = this.companyId === 0 ? '""' : this.companyId;
  const siteidstr = this.siteId === '' ? '""' : this.siteId; // Ensure it’s not undefined
  const employeecodestr = this.employeecode === 0 ? '""' : this.employeecode;
  const eactivestr = this.Eactive?.trim() ?? "ALL";

  // Just for debug:
  console.log("API Params =>", companyidstr, siteidstr, employeecodestr, eactivestr);

  this.vendoremployeeService
    .GetVendorEmployeeCompanywise(
      String(companyidstr),
      String(siteidstr),
      String(employeecodestr),
      String(eactivestr)
    )
    .subscribe({
      next: (res) => {
        const table = res?.Data?.data?.Table0 ?? [];

        if (table.length > 0) {
          this.tableHeaders = Object.keys(table[0]);
          // this.dynamicColumns = Object.keys(table[0]);
          this.dynamicColumns=['Serial_No','Company_Code','Map_Name','Employee_Code','Employee_Name','Vendor','EActive','Date_Joined','DOS','Vertical','PO_Value','PO_Start_Date','PO_End_Date','Requisitioner_Name','Salary','Mobile_Number','PAN_Number','Email_Id','Full_Address','State_Name','Group_Name']
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
        console.error('Error loading vendor employees', err);
        alert('Failed to load vendor employees');
      }
    });
}


  DownloadTemplate() {
    this.vendoremployeeService.GetVendorEmployeeTemplate().subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'VendorEmployee': worksheet },
          SheetNames: ['VendorEmployee']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `VendorEmployee_Template_${Date.now()}.xlsx`);
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail?.user_Id);

    this.vendoremployeeService.UploadVendorEmployee(formData).subscribe({
      next: (res) => {
        console.log('Upload response:', res);

        this.UploadedResponse = res;

        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);
        const successMsg = 'Vendor Employee data uploaded successfully.';
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
        alert('Upload failed. See console for details.');
        this.isLoading = false;
        this.popupMessage = 'Upload failed.';
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
    // Try common keys for messages
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
