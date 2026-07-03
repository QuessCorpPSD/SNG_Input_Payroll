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
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatDialog } from '@angular/material/dialog';
import { IHoldEmployeeSalary } from '../../../Repository/banknonvoice/IHoldEmployeeSalary';
import { HoldEmployeSalaryService } from '../../../Service/banknonvoice/hold-employe-salary.service';
export const Common_TOKEN = new InjectionToken<IHoldEmployeeSalary>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-hold-employee-salary',
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
    BankInvoiceComponent,],
  templateUrl: './hold-employee-salary.component.html',
  styleUrl: './hold-employee-salary.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: HoldEmployeSalaryService }]
})
export class HoldEmployeeSalaryComponent {
  companyUI: any;
  isLoading = false;
  userdetail!: any;
  payperiodUI: any;
  payPeriodTypefromParent: string = '';
  dataSource = new MatTableDataSource<any>([]);
  salaryHoldTypeList: any[] = [];
  selectedStatus: string = '';
  showTable: boolean = false;
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';


  displayedColumns: string[] = [
    'Serial_No',
    'Company_Code',
    'Employee_Code',
    'Employee_Name',
    'Pay_Period',
    'Hold_status',
    'NonInvoice_Batchid'
  ];

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private service: IHoldEmployeeSalary,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;




  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      //alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
     // alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      //alert("Select Pay Period");
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
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParent = "All";
    this.loadSalaryHoldType();

  }
  applyFilter() {

    const filterValue = this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      return (
        data.Serial_No?.toString().toLowerCase().includes(filter) ||
        data.Company_Code?.toString().toLowerCase().includes(filter) ||
        data.Employee_Code?.toString().toLowerCase().includes(filter) ||
        data.Employee_Name?.toString().toLowerCase().includes(filter) ||
        data.Pay_Period?.toString().toLowerCase().includes(filter) ||
        data.Hold_status?.toString().toLowerCase().includes(filter) ||
        data.NonInvoice_Batchid?.toString().toLowerCase().includes(filter)
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

    if (!this.selectedStatus) {
      alert("Select Salary Hold Type");
      return;
    }

    this.isLoading = true;

    const companyId = this.companyUI.companyId;
    const payPeriodId = this.payperiodUI.payfrequencyid;
    const status = this.selectedStatus;

    this.service.SearchHoldEmpSalary(companyId, payPeriodId, status)
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert("No data found");
            this.dataSource = new MatTableDataSource<any>([]);
            this.showTable = false;
            this.isLoading = false;
            return;
          }

          // ✅ EXACT Netpay Pattern
          this.dataSource = new MatTableDataSource<any>(tableData);
          this.dataSource.paginator = this.holdpaginator;   // ⭐ MISSING IN YOUR CODE
          this.dataSource.sort = this.sort;

          this.showTable = true;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error("Search Error", err);
          this.isLoading = false;
          this.showTable = false;
        }
      });
  }
  onExportClick(): void {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.selectedStatus) {
      alert("Select Salary Hold Type");
      return;
    }

    this.isLoading = true;

    const payload = {
      companyId: this.companyUI.companyId,
      payPeriodId: this.payperiodUI.payfrequencyid,
      status: this.selectedStatus
    };

    this.service.ExportHoldEmpSalary(payload).subscribe({
      next: (res: any) => {
        const jsonData = res?.Data?.data?.Table0 ?? [];

        if (jsonData.length === 0) {
          alert("No Records Found");
          this.isLoading = false;
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "HoldEmployeeSalary");

        const fileName = "HoldEmployeeSalary.xlsx";

        XLSX.writeFile(wb, fileName);

        this.isLoading = false;
      },

      error: (err: any) => {
        console.error("Export Error", err);
        alert("Export Failed");
        this.isLoading = false;
      }
    });
  }


  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.selectedStatus) {
      alert("Select Salary Hold Type");
      return;
    }
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(file:any): void {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.selectedStatus) {
      alert("Select Salary Hold Type");
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id.toString());

    this.service.UploadHoldEmpSalary(formData).subscribe({
      next: (res: any) => {

        const data = res?.Data;
        const response = data?.response;

        if (!data) {
          alert('Server did not return any data.');
          this.isLoading = false;
          return;
        }

        let message = "";
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

        if (message.toLowerCase().includes("success")) {
          alert(message);
          this.searchClick();
          return;
        }

        // ❌ ERROR HANDLING (FULLY DYNAMIC)
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
            parsedErrors = [{ Message: 'Error parsing server response' }];
          }

          // ✅ NO HARDCODE — keep API structure as-is
          const exportData = parsedErrors.map((row: any) => {
            const obj: any = {};

            Object.keys(row).forEach((key) => {
              obj[key] = String(row[key] ?? '');
            });

            return obj;
          });

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { Errors: worksheet },
            SheetNames: ['Errors']
          };

          XLSX.writeFile(workbook, 'HoldEmpSalary_Errors.xlsx');

          alert(response || 'Upload Failed');
          this.isLoading = false;
          return;
        }

        // 🔁 FALLBACK (no assumptions)
        alert(typeof response === 'string' ? response : 'Upload Completed');
        this.isLoading = false;
      },

      error: (err: any) => {
        console.error(err);
        alert('Upload Failed');
        this.isLoading = false;
      }
    });
  }

  loadSalaryHoldType(): void {
    this.service.GetSalaryHoldType().subscribe({
      next: (res: any) => {
        this.salaryHoldTypeList = res?.data?.data?.Table0 ?? [];
      },

      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }
  onSalaryHoldTypeChange(event: any) {
    console.log(event);
    this.selectedStatus = event.Label;
  }

  onTemplateClick() {
    this.isLoading = true;

    const flag = 'HoldRequestNI';
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      this.isLoading = false;
      return;
    }

    this.service.DownloadHoldTemplate(flag, userId).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          this.isLoading = false; // ✅ important fix
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'HoldRequestNI': worksheet },
          SheetNames: ['HoldRequestNI']
        };

        XLSX.writeFile(workbook,'HoldRequestNI_Template.xlsx');
        // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const blob = new Blob([buffer], { type: 'application/octet-stream' });

        // FileSaver.saveAs(blob, 'HoldRequestNI_Template.xlsx'); // ✅ clean name

        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
        this.isLoading = false;

      }
    });
  }

}
