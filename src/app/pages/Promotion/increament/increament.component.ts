import { Component, InjectionToken, ViewChild } from '@angular/core';
import { IncreamentADDComponent } from '../increament-add/increament-add.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IncrementService } from '../../../Service/increment.service';
import { IncreamentReportService } from '../../../Service/Reports/increament-report.service';
import { promotionIncrementService } from '../../../Service/Promotion/increment.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IIncrementService } from '../../../Repository/iincrement.service';
import { finalize } from 'rxjs';
export const Increment_TOKEN = new InjectionToken<IIncrementService>('Increment_TOKEN');

@Component({
  selector: 'app-increament',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, CompanyallComponent],
  templateUrl: './increament.component.html',
  styleUrl: './increament.component.css',
  providers: [
    {
      provide: Increment_TOKEN,
      useClass: promotionIncrementService,
    }
  ]
})
export class IncreamentComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: String = '';
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;
  searchText: any;
  PayPeriodList: any[] = [];
  EmployeeList: any[] = [];
  isLoading = false;
  data: any;
  selectedEmployeeId: number = 0;
  isUploadGridVisible: boolean = false;



  constructor(private dialog: MatDialog,
    private leave: promotionIncrementService, private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private snackBar: MatSnackBar) { }

  uploadDisplayedColumns = [
    'Action',
    'SNo',
    'CompanyCode',
    'EmployeeId',
    'EmployeeName',
    'NewPayCategoryName',
    'DateOfJoin',
    'EffectiveDate',
    'PayPeriod'
  ];



  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.uploadedDataSource.filter = filterValue;
  }

  onSearchClick() {
    this.showTable = true;
    this.uploadedDataSource.data = this.uploadedData;
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };
    this.payPeriodType = "All";
    this.uploadedDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Client_Code?.toLowerCase().includes(searchText) ||
        data.Employee_Id?.toLowerCase().includes(searchText) ||
        data.Employee_Name?.toLowerCase().includes(searchText) ||
        data.New_Pay_Category_Name?.toLowerCase().includes(searchText) ||
        data.Date_Of_Joining?.toString().includes(searchText) ||
        data.Effective_Date?.toString().includes(searchText) ||
        data.Pay_Period?.toLowerCase().includes(searchText)
      );
    };
  }
  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  view(row: any) {

  }
  ViewOpen(row: any) {
    this.dialog.open(IncreamentADDComponent, {
      width: '80%',
      height: '90vh',
      data: { rowData: row }
    });
  }


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;

    this.BindPayPeriod();
    this.BindEmployeeCode();
  }

  BindPayPeriod() {
    if (!this.selectedCompanyId) {
      console.warn('CompanyId is missing');
      return;
    }

    this.leave.GetPayperiod(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        this.PayPeriodList = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Pay Period API Error', err);
      }
    });
  }

  BindEmployeeCode() {
    if (!this.selectedCompanyId) {
      return;
    }

    this.leave.GetEmployeeCode(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        this.EmployeeList = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Employee API Error', err);
      }
    });
  }
  onsearch() {

    if (!this.selectedCompanyId) {
      alert('Please select the company');
      return;
    }

    this.isUploadGridVisible = true;
    this.isLoading = true;

    const companyId = this.selectedCompanyId;
    const employeeId = this.selectedEmployeeId || 0;
    const payPeriodId = this.payPeriodId || 0;

    this.leave.Search(companyId, employeeId, payPeriodId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const tableData = res?.Data?.data?.Table0 || [];

        if (tableData.length > 0) {
          this.uploadedData = tableData;
          this.uploadedDataSource = new MatTableDataSource(tableData);
          this.uploadedDataSource.paginator = this.paginator;
          this.uploadedDataSource.sort = this.sort;
          this.showTable = true;
        } else {
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          this.showTable = true;
          alert('No records found');
        }
      },
      error: (err) => {
        console.error('Search API Error', err);
        this.isLoading = false;
        alert('Failed to load increment data');
      }
    });
  }


  exportToExcel() {
    // if (!this.selectedCompanyId) {
    //   alert("Please select a company to export data.");
    //   return;
    // }

    const companyId = this.selectedCompanyId || 0;
    const employeeId = this.selectedEmployeeId || 0;
    const payPeriodId = this.payPeriodId || 0;

    this.isLoading = true;

    this.leave.Search(companyId, employeeId, payPeriodId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const tableData = res?.Data?.data?.Table0 || [];
        if (!tableData.length) {
          alert("No data available for export.");
          return;
        }

        // Export to Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Increment_Data");
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `Increment_Export_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error exporting data", err);
        alert("Failed to export data");
      }
    });
  }
  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
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

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id); // backend expects this

    this.leave.BulkPOUpload(formData).pipe(
      finalize(() => {
        this.isLoading = false;
      })

    ).subscribe({
      next: (res: any) => {


        if (res?.Data?.response === 'Failed to import.' && res.Data.errors?.length) {
          // Show alert
          alert(res.Data.response);

          // Parse errors and export to Excel
          const errorArray = JSON.parse(res.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'ErrorMessages_increment.xlsx');
          return;
        }

        if (res?.Data?.response.includes('Successfully')) {
          alert(res.Data.response); // Successful upload
        } else {
          alert(res.Data.response || 'Unknown response from server.');
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (!r) return { parsed: null, msg: '' };
    if (Array.isArray(r) || typeof r === 'object') return { parsed: r, msg: '' };

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

  downloadTemplate() {
    const templateData = [
      {
        "COMPANYCODE": "",
        "EMPLOYEECODE": "",
        "BAND": "",
        "NEWCTC": "",
        "EFFECTIVEDATE": "",
        "ENDDATE": "",
        "PAYPERIOD": "",
        "PAYCODE": "",
        "AMOUNT": "",
        "ARREARFLAG": ""
      }

    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Increament_Template.xlsx`)
  }
}



