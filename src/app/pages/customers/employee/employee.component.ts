import { Component, ViewChild } from '@angular/core';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeAddComponent } from '../employee-add/employee-add.component'; import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from "@angular/material/card";
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [AlertpopupComponent, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, MatTooltipModule, MatCardModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  employee!: FormGroup
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  isUploadGridVisible = false;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  employeedata: any;
  @ViewChild(MatSort) sort!: MatSort;
  employeeexcel: any;
  userdetail: any;
  EmployeeList: any;
  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'EMPNO', 'EMPNAME', 'CompanyCode', 'DOB', 'Active', 'ORIHIREDDATE', 'SEX', 'Department', 'OCCUPATIONCODE'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(private dialog: MatDialog, private service: EmployeeService, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private fb: FormBuilder) { }




  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.employee = this.fb.group({
      EActive: ["-1 "]
    })

  }
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
  BindEmployeeCode() {
    const payload = { CompanyId: this.selectedCompanyId?.toString() };

    this.service.GetEmployeesByCompanyId(payload).subscribe({
      next: (res: any) => {
        this.EmployeeList = res.Data.data.Table0;
      }
    });
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.BindEmployeeCode();
  }


  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please Select Company')
      this.isLoading = false;
      return;
    }
    this.isUploadGridVisible = true;

    const form = this.employee.getRawValue();
    const Companyid = this.selectedCompanyId;
    const eactive = form.EActive;
    this.service.search(Companyid, eactive).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('API Response:', res.Data);
        this.employeedata = res?.Data?.data?.Table0;

        if (!this.employeedata) {
          this.isLoading = false;
          alert(res.Data.message)
        }
        if (this.employeedata && this.employeedata.length > 0) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.employeedata);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action', 'SNo', 'EMPNO', 'EMPNAME', 'CompanyCode', 'DOB', 'Active', 'ORIHIREDDATE', 'SEX', 'Department', 'OCCUPATIONCODE'];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
    this.isLoading = false;
  }
  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    const Companyid = this.selectedCompanyId;

    this.service.Exporttoexcel(Companyid).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data.data.Table0;
          this.employeeexcel = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(this.employeeexcel);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "payFrequency");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `payFrequency_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);


    this.service.BulkPOUpload(formData).subscribe({
      next: (res) => {
        console.log('📥 API Response:', res);

        if (!res || !res.Data) {
          console.warn('ℹ️ No data returned from server yet.');
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data?.[0]?.Error_Message;

        if (response && response.includes("Row(s) Uploaded Successfully.")) {
          alert('✅ Rows uploaded successfully.');
          return;
        }

        const { parsed, msg } = this.tryParseResponse(response);

        const successMsg = 'Data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          alert('✅ Data uploaded successfully.');
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          const rawErr = res.Data.errors?.[0];
          let errorArray: any[] = [];

          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_salaryadvancerelease.xlsx');

          return;
        }

        // ✅ Fallback if no specific case matched
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          // ⚙️ Handle case where API returns message but no data (your current case)
          if (res?.Message) {
            alert(`ℹ️ ${res.Message}`);
          } else {
            alert('Error while processing response.');
          }
        }

      },
      error: (err) => {
        console.error('❌ Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }


  ImportClickSalary(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChangesalary(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {
        console.log('📥 API Response:', res);

        if (!res || !res.Data) {
          console.warn('ℹ️ No data returned from server yet.');
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data?.[0]?.Error_Message;

        if (response && response.includes("Row(s) Uploaded Successfully.")) {
          alert('✅ Rows uploaded successfully.');
          return;
        }

        const { parsed, msg } = this.tryParseResponses(response);

        const successMsg = 'Data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          alert('✅ Data uploaded successfully.');
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          const rawErr = res.Data.errors?.[0];
          let errorArray: any[] = [];

          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_salaryadvancerelease.xlsx');

          return;
        }

        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          if (res?.Message) {
            alert(`ℹ️ ${res.Message}`);
          } else {
            alert('Error while processing response.');
          }
        }

      },
      error: (err) => {
        console.error('❌ Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  tryParseResponses(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }


  ViewOpen(row: any) {
    this.dialog.open(EmployeeAddComponent, {
      width: '83%',
      height: '87vh',
      disableClose: true,
      data: { rowData: row }
    });
  }

}
