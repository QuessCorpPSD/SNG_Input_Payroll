import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from '../../../Service/CommonService';
import { BankInvoiceComponent } from '../bank-invoice-Onboarding/bank-invoice.component';
import { ICommonService } from '../../../Repository/ICommonService';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatDialog } from '@angular/material/dialog';
import { IReleaseholdemployeesalary } from '../../../Repository/banknonvoice/IReleaseholdemployeesalary';
import { ReleaseholdemployeesalaryService } from '../../../Service/banknonvoice/releaseholdemployeesalary.service';
import { finalize } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-releasehold-employeesalary',
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
    BankInvoiceComponent,
    MatCheckboxModule,],
  templateUrl: './releasehold-employeesalary.component.html',
  styleUrl: './releasehold-employeesalary.component.css',
  // providers: [
  //   { provide: Common_TOKEN, useClass: ReleaseholdemployeesalaryService }]
})
export class ReleaseholdEmployeesalaryComponent {
  companyUI: any;
  isLoading = false;
  userdetail!: any;
  payperiodUI: any;
  payPeriodTypefromParent: string = '';
  dataSource = new MatTableDataSource<any>([]);

  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedFile!: File;

  displayedColumns: string[] = [
    'select',
    'Serial_No',   // ✅ FIXED
    'Company_Code',
    'Company_Name',
    'Employee_Code',
    'Employee_Name',
    'Pay_Period',
    'Net_Pay',
    'Salary_Hold_Type'
  ];

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    private service: ReleaseholdemployeesalaryService,
    private dialog: MatDialog
  ) { }


  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  // dataSource = new MatTableDataSource<ReleaseGrid>([]);
  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;



  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
     // alert("Select Company Code");
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
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    console.log(this.userdetail)

    this.payPeriodTypefromParent = "All";


  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }
  applyFilter() {

    const filterValue = this.searchText?.trim().toLowerCase() || '';

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      return (
        data.Serial_No?.toString().toLowerCase().includes(filter) ||
        data.Company_Code?.toString().toLowerCase().includes(filter) ||
        data.Company_Name?.toString().toLowerCase().includes(filter) ||
        data.Employee_Code?.toString().toLowerCase().includes(filter) ||
        data.Employee_Name?.toString().toLowerCase().includes(filter) ||
        data.Pay_Period?.toString().toLowerCase().includes(filter) ||
        data.Net_Pay?.toString().toLowerCase().includes(filter) ||
        data.Salary_Hold_Type?.toString().toLowerCase().includes(filter)
      );

    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  searchClick() {

    this.dataSource.data = [];   // same as netpay reset

    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    if (this.companyUI && this.payperiodUI) {

      this.BindDashBoard(
        this.companyUI.companyId,
        this.payperiodUI.payfrequencyid
      );
    }
  }

  BindDashBoard(companyCode: any, payPeriod: any) {

    this.isLoading = true;

    var Company_Id = this.companyUI.companyId;
    var Pay_Period_Id = this.payperiodUI.payfrequencyid;
    var Employee_Id = 0;   // same pattern (optional param)

    this.service.SearchReleaseHoldSalary(Company_Id, Pay_Period_Id, Employee_Id)
      .subscribe({
        next: res => {

          if (!res.Data || res.Data.length === 0) {
            alert("No data available to display.");
            this.isLoading = false;
            return;
          }

          const tableData = res.Data.data.Table0;

          if (!tableData || tableData.length === 0) {
            alert("No data found");
            this.isLoading = false;
            return;
          }

          this.dataSource = new MatTableDataSource<any>(tableData);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.holdpaginator;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching data:', err.message);
          this.isLoading = false;
        }
      });
  }

  onExportClick(): void {

    if (!this.companyUI) {
      alert('Please select Company');
      return;
    }

    if (!this.payperiodUI) {
      alert('Please select Payperiod');
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_Id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      Employee_Id: 0
    };

    this.service.ExportReleaseHoldSalary(payload)
      .pipe(
        finalize(() => this.isLoading = false)   // same pattern
      )
      .subscribe({
        next: res => {

          if (!res?.Data?.data?.Table0 || res.Data.data.Table0.length === 0) {
            alert('No data to export');
            return;
          }

          const data = res.Data.data.Table0;

          // SAME STYLE AS NETPAY (xlsx + filesaver)
          import('xlsx').then(xlsx => {

            const worksheet = xlsx.utils.json_to_sheet(data);

            const workbook = {
              Sheets: { 'Sheet1': worksheet },
              SheetNames: ['Sheet1']
            };

            const excelBuffer = xlsx.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            const blob = new Blob([excelBuffer], {
              type: 'application/octet-stream'
            });

            import('file-saver').then(fs => {
              fs.saveAs(blob, 'ReleaseHoldSalary.xlsx');
            });

          });

        },
        error: err => {
          console.error('Export error:', err);
        }
      });
  }



  onTemplateClick() {
    this.isLoading = true;

    const flag = 'HoldReleaseRequestNI';   // ✅ CHANGED ONLY THIS
    const userId = this.userdetail?.user_Id;

    if (!userId) {
      alert('User ID not available');
      this.isLoading = false;
      return;
    }
    this.service.DownloadReleaseHoldTemplate(flag, userId).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];

        if (!data.length) {
          alert('No template data available.');
          this.isLoading = false;
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook: XLSX.WorkBook = {
          Sheets: { 'HoldReleaseRequestNI': worksheet },   // ✅ CHANGED
          SheetNames: ['HoldReleaseRequestNI']             // ✅ CHANGED
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blob, 'HoldReleaseRequestNI_Template.xlsx'); // ✅ CHANGED

        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
        this.isLoading = false;
      }
    });
  }


  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert('Please select Company');
      return;
    }

    if (!this.payperiodUI) {
      alert('Please select Payperiod');
      return;
    }
    fileInput.value = "";   // reset
    fileInput.click();      // open file dialog
  }

  onFileChange(file: any): void {

     if (!this.companyUI) {
      alert('Please select Company');
      return;
    }

    if (!this.payperiodUI) {
      alert('Please select Payperiod');
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("CreatedBy", this.userdetail.user_Id.toString());
    formData.append("action", 'ReleaseEmployeeSalaryUpload');
    

    this.isLoading = true;

    this.service.UploadReleaseHoldSalary(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          console.log("UPLOAD RESPONSE:", res);

          const data = res?.Data;

          if (!data) {
            alert("No response from server");
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


          if (data.errors && data.errors.length > 0) {

            let parsedErrors: any[] = [];

            try {
              const raw = data.errors[0];


              parsedErrors = typeof raw === 'string' ? JSON.parse(raw) : raw;

            } catch (e) {
              parsedErrors = [{ Error_Message: "Error parsing server response" }];
            }

            const excelData = parsedErrors.map((row: any, index: number) => ({
              Sl_No: index + 1,
              Error_Message: row.Error_Message || ""
            }));

            import('xlsx').then(xlsx => {
              const worksheet = xlsx.utils.json_to_sheet(excelData);
              const workbook = xlsx.utils.book_new();

              xlsx.utils.book_append_sheet(workbook, worksheet, 'Errors');

              xlsx.writeFile(workbook, "ReleaseHoldSalary_Errors.xlsx");
            });

            alert(message);
            return;
          }

          // fallback
          alert(message);
        },

        error: (err: any) => {
          console.error("Upload error:", err);
          alert("Upload failed");
        }
      });
  }

  downloadValidationExcel(errors: string[], fileName: string) {

    import('xlsx').then(xlsx => {

      const excelData = errors.map((msg, index) => ({
        Sl_No: index + 1,
        Error_Message: msg
      }));

      const worksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(workbook, worksheet, 'Errors');

      xlsx.writeFile(workbook, `${fileName}.xlsx`);
    });
  }

  Release() {

    const selectedRows = this.selection.selected;

    if (!selectedRows || selectedRows.length === 0) {
      alert("Please select at least one record");
      return;
    }

    this.isLoading = true;

    const payload = {
      CreatedBy: this.userdetail.user_Id,
      Action: "ReleaseEmployeeSalaryUpload",
      Data: selectedRows.map((row: any) => ({
        Company_Code: row.Company_Code,
        Employee_Code: row.Employee_Code,

        Pay_Period: row.Pay_Period ?? "",
        PURPOSE: row.PURPOSE ?? "",

        BatchID: Number(row.BatchID ?? 0),
        INPUT_NO: Number(row.INPUT_NO ?? 0)
      }))
    };

    console.log("FINAL PAYLOAD:", payload);

    this.service.SaveReleaseHoldSalary(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const rawResponse = res?.Data?.response;
          const errors = res?.Data?.errors;

          let message = "";


          try {
            const parsed = typeof rawResponse === 'string'
              ? JSON.parse(rawResponse)
              : rawResponse;

            if (Array.isArray(parsed) && parsed.length > 0) {
              message = parsed[0].Error_Message || "";
            } else {
              message = rawResponse || "";
            }

          } catch {
            message = rawResponse || "";
          }


          if (message.toLowerCase().includes('success')) {
            alert(message);
            this.selection.clear();
            this.searchClick();
            return;
          }


          if (errors && errors.length > 0) {
            this.downloadValidationExcel(errors, "Release_Errors");
            return;
          }

          alert(message);
        },

        error: err => {
          console.error("Release error:", err);
          alert("Release failed");
        }
      });
  }
}
