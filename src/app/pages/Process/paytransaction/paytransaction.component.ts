import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { PaytransactionaddComponent } from '../paytransactionadd/paytransactionadd.component';
import { PaytransactionService } from '../../../Service/Process/paytransaction.service';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-paytransaction',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent],
  templateUrl: './paytransaction.component.html',
  styleUrl: './paytransaction.component.css'
})
export class PaytransactionComponent {

  // Paycodeform!: Paytransactionform;
  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  paySearch: any;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  pagetype: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  PayTransactionForm!: FormGroup;
  employeeCode: any;
  PayCode: any;
  payperiodId: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog, private payTransaction: PaytransactionService) {

  }

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'companycode', 'employeecode', 'employeename', 'paysequence', 'payperiod', 'paycode', 'paycategory'
  ];

  // uploadFilteredColumns: string[] = [
  //   'Actionfilter', 'slNoFilter', 'companycodeFilter', 'employeecodeFilter', 'employeenameFilter', 'paysequenceFilter', 'payperiodFilter', 'paycodeFilter','paycategoryFilter'
  // ];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', companycode: '', employeecode: '', employeename: '', paysequence: '', payperiod: '', paycode: '', paycategory: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.setUpCustomFilter();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.BindEmployeeCode();
    this.BindPayCode();
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";

    this.PayTransactionForm = new FormGroup({
      EmployeeCode: new FormControl(''),
      PayCode: new FormControl('')
    });

  }

  BindEmployeeCode() {
    const payload = {
      "CompanyId": this.selectedCompanyId?.toString()
    }
    this.payTransaction.GetEmployeeCode(payload).subscribe({
      next: res => { this.employeeCode = res.Data.data.Table0 }
    });
  }

  BindPayCode() {
    const payload = {
      "CompanyId": this.selectedCompanyId?.toString()
    }
    this.payTransaction.GetPayCode(payload).subscribe({
      next: res => { this.PayCode = res.Data.data.Table0 }
    });
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
  }

  applyFilter() {
    this.uploadedDataSource.filter = JSON.stringify({
      category: this.filterValues.category.trim().toLowerCase(),
      date: this.filterValues.date.trim().toLowerCase(),
      fromvalue: this.filterValues.fromvalue.trim().toLowerCase(),
      tovalue: this.filterValues.tovalue.trim().toLowerCase(),
      criteria: this.filterValues.criteria.trim().toLowerCase(),
      criterianame: this.filterValues.criterianame.trim().toLowerCase(),
    });

    if (this.uploadedDataSource.paginator) {
      this.uploadedDataSource.paginator.firstPage();
    }
  }

  onsearch() {
    const formValue = this.PayTransactionForm.getRawValue()
    const payload = {
      "CompanyId": this?.selectedCompanyId?.toString(),
      "EmployeeId": formValue?.EmployeeCode?.toString() ?? '',
      "Pay_Frequency_Id": this.payperiodId?.toString() ?? '',
      "Paycode_Id": formValue?.PayCode?.toString() ?? ''
    }

    if (!this.selectedCompanyId) {
      alert("please select Company Code");
      return;
    }
    this.isLoading = true;
    this.showTable = true;
    this.payTransaction.SearchPayTransaction(payload).subscribe({
      next: (res) => {
        this.paySearch = res.Data.data.Table0;
        if (this.paySearch && this.paySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.paySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['Action', 'slNo', 'companycode', 'employeecode', 'employeename', 'paysequence', 'payperiod', 'paycode', 'paycategory'];

        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        alert('Failed to load salary release data');
      },
    });
    this.isLoading = false;
  }

  exportToExcel(): void {
    const formValue = this.PayTransactionForm.getRawValue()

    const payload = {
      "CompanyId": this.selectedCompanyId?.toString(),
      "EmployeeId": formValue?.EmployeeCode?.toString() ?? '',
      "Pay_Frequency_Id": this.payperiodId?.toString() ?? '',
      "Paycode_Id": formValue?.PayCode?.toString() ?? ''
    }

    if (!this.selectedCompanyId) {
      alert("please select Company Code");
      return;
    }

    this.payTransaction.exportPayTransaction(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res.Data.data.Table0;

          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `PayTransaction_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        alert('Failed to load data from server.');
      },
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
      alert("Please upload only one Excel file.")
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.payTransaction.importPayTransaction(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("upload Request processed.Server did not return any data")
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup("Row(s) Uploaded Successfully.")
          return;
        }
        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          this.isLoading = false;
          alert("Failed to Import");
          // errors[0] may be a JSON string, an array, or a plain string/object
          const rawErr = res?.Data?.errors?.[0];
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
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback)
        } else {
          alert('Error while processing response.');
        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        alert('Upload failed');
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

  downloadTemplate() {
    const templateData = [
      {
        COMPCODE: "",
        PAYPERIOD: "",
        PAYCODE: "",
        BAND: "",
        EMPID: "",
        AMOUNT: '',
        REMARKS: ''
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'PayTransaction': workSheet },
      SheetNames: ['PayTransaction']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.showAlertPopup('Downloaded Successfully')
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `PayTransaction_${Date.now()}.xlsx`)
  }

  AddpaytransactionOpen() {
    this.dialog.open(PaytransactionaddComponent, {
      width: '90%',
      height: '78vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  onDeletePayTransaction(row: any) {
    if (!confirm('Are you sure you want to delete this Row?')) {
      return;
    }

    this.isLoading = true;

    const id = row.Pay_Transaction_Id;
    const userId = this.userdetail.user_Id;

    this.payTransaction.DeletePayTransaction(id, userId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const msg = res?.Data?.data?.Table0?.Error_Message;

        if (res?.StatusCode === 200 && msg?.toLowerCase().includes('success')) {
          alert(msg);
          this.onsearch();
        } else {
          alert(msg);
          this.onsearch();
        }
      },
      error: () => {
        this.isLoading = false;
        alert('Delete failed');
      }
    });
  }



}
