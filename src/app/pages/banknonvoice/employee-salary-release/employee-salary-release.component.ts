import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankInvoiceComponent } from '../bank-invoice-Onboarding/bank-invoice.component';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { IemployeeSalaryRelease } from '../../../Repository/banknonvoice/IemployeeSalaryRelease';
import { EmployeeSalaryReleaseService } from '../../../Service/SalaryRelease/employee-salary-release.service';
import { EmployeeSalaryReleaseServices } from '../../../Service/banknonvoice/employee-salary-release.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Common_TOKEN = new InjectionToken<IemployeeSalaryRelease>('Common_TOKEN');

@Component({
  selector: 'app-employee-salary-release',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    BankInvoiceComponent],
  templateUrl: './employee-salary-release.component.html',
  styleUrl: './employee-salary-release.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: EmployeeSalaryReleaseServices }]
})
export class EmployeeSalaryReleaseComponent {
  companyUI: any;
  isLoading = false;
  userdetail!: any;
  payperiodUI: any;
  payPeriodTypefromParent: string = '';
  dataSource = new MatTableDataSource<any>([]);

  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';

  displayedColumns: string[] = [
    'SNo',
    'Company_Code',
    'Group_Name',
    'Vendor_Name',
    'Pay_Period'
  ];

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private service: IemployeeSalaryRelease,
    private dialog: MatDialog
  ) { }


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;




  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

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
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParent = "All";


  }
  applyFilter() {

    const filterValue = this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      return (
        data.SNo?.toString().toLowerCase().includes(filter) ||
        data.Company_Code?.toString().toLowerCase().includes(filter) ||
        data.Group_Name?.toString().toLowerCase().includes(filter) ||
        data.Vendor_Name?.toString().toLowerCase().includes(filter) ||
        data.Pay_Period?.toString().toLowerCase().includes(filter)
      );

    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  searchClick() {
    this.dataSource.data = [];

    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    this.isLoading = true;

    const companyId = this.companyUI.companyId;
    const payPeriodId = this.payperiodUI.payfrequencyid;

    this.service.GetEmployeeSalaryReleaseSearch(companyId, payPeriodId)
      .subscribe({
        next: (res: any) => {

          const tableData = res?.data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert("No data found");
            this.isLoading = false;
            return;
          }

          // ✅ EXACT Netpay pattern
          this.dataSource = new MatTableDataSource<any>(tableData);
          this.dataSource.paginator = this.holdpaginator;
          this.dataSource.sort = this.sort;

          this.isLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  onExportClick() {

    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: this.companyUI.companyId.toString(),
      payPeriodId: this.payperiodUI.payfrequencyid.toString()
    };

    this.service.ExportEmployeeSalaryRelease(payload)
      .subscribe({
        next: (res: any) => {

          this.isLoading = false;

          const jsonData = res?.data?.data?.Table0 ?? [];

          if (!jsonData.length) {
            alert("No Records Found");
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "EmployeeSalaryRelease");

          XLSX.writeFile(wb, "EmployeeSalaryRelease.xlsx");
        },
        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const link = document.createElement('a');
    link.href = source;
    link.download = filename;
    link.click();
  }

  onImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = "";
    fileInput.click();
  }

  onFileChange(event: any): void {

    const target = event.target as HTMLInputElement;

    if (!target.files || target.files.length !== 1) {
      alert("Please upload one Excel file.");
      return;
    }

    const file = target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("User", this.userdetail.userId.toString());

    this.isLoading = true;

    this.service.UploadEmployeeSalaryRelease(formData)
      .subscribe({
        next: (res: any) => {

          this.isLoading = false;

          const data = res?.data;

          if (!data) {
            alert("No response from server");
            return;
          }

          let message = "";

          // ✅ PARSE RESPONSE (NO HARDCODE)
          try {
            const parsed = typeof data.response === 'string'
              ? JSON.parse(data.response)
              : data.response;

            if (Array.isArray(parsed) && parsed.length > 0) {
              const firstRow = parsed[0];
              message = String(Object.values(firstRow)[0] ?? "");
            } else {
              message = String(data.response ?? "");
            }

          } catch {
            message = String(data.response ?? "");
          }

          // ✅ SUCCESS
          if (message.toLowerCase().includes("success")) {
            alert(message);
            this.searchClick();
            return;
          }

          // ❌ ERROR → DOWNLOAD EXCEL (NO HARDCODE)
          if (data?.errors && data.errors.length > 0) {

            let parsedErrors: any[] = [];

            try {
              const raw = data.errors[0];

              if (typeof raw === 'string') {
                parsedErrors = JSON.parse(raw);
              } else if (Array.isArray(raw)) {
                parsedErrors = raw;
              } else if (raw) {
                parsedErrors = [raw];
              }

            } catch {
              parsedErrors = [{ Message: "Error parsing server response" }];
            }

            // ✅ KEEP API STRUCTURE AS-IS
            const exportData = parsedErrors.map((row: any) => {
              const obj: any = {};
              Object.keys(row).forEach((key) => {
                obj[key] = String(row[key] ?? "");
              });
              return obj;
            });

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { Errors: worksheet },
              SheetNames: ['Errors']
            };

            XLSX.writeFile(workbook, "EmployeeSalaryRelease_Errors.xlsx");

            alert(message || "Upload Failed");
            return;
          }

          // 🔁 FALLBACK
          alert(message || "Upload completed");
        },

        error: (err: any) => {
          console.error(err);
          this.isLoading = false;
          alert("Upload failed");
        }
      });
  }
  downloadValidationExcel(errors: string[]) {

    const excelData = errors.map((msg, index) => ({
      Sl_No: index + 1,
      Validation_Message: msg
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Errors");

    XLSX.writeFile(wb, "EmployeeSalaryRelease_Errors.xlsx");
  }
  downloadExcel(data: any[]): void {
    if (!data || data.length === 0) {
      alert("No error data found");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Errors");

    const fileName = "EmployeeSalaryRelease_ErrorReport.xlsx";

    XLSX.writeFile(wb, fileName);
  }

  onTemplateClick() {
    this.isLoading = true;

    const flag = 'SalaryRequestNI';   // ✅ Required
    const userId = this.userdetail?.userId;

    if (!userId) {
      alert('User ID not available');
      this.isLoading = false;
      return;
    }

    if (!this.companyUI) {
      alert('Please Select Company');
      this.isLoading = false;
      return;
    }

    if (!this.payperiodUI) {
      alert('Please Select Payperiod');
      this.isLoading = false;
      return;
    }

    const companyId = this.companyUI.companyId;
    const payPeriodId = this.payperiodUI.payfrequencyid;

    console.log("Template Params:", { flag, userId, companyId, payPeriodId });

    this.service.DownloadSalaryReleaseTemplate(flag, userId).subscribe({
      next: res => {
        const data = res?.data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          this.isLoading = false;   // ✅ important (missing in your version)
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'SalaryRequestNI': worksheet },
          SheetNames: ['SalaryRequestNI']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blob, 'SalaryRequestNI_Template.xlsx'); // ✅ cleaner name

        this.isLoading = false; // ✅ same as reference code
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
        this.isLoading = false;
      }
    });
  }
}
