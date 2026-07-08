import { Component, Inject, InjectionToken, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { IInvoiceRepository } from '../../../Repository/invoice/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/invoice/InvoiceRepository';
import { ICommonService } from '../../../Repository/ICommonService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoicetypeComponent } from '../../../common/invoicetype/invoicetype.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { InvoiceType } from '../../../Models/invoicetype';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs';
import * as FileSaver from 'file-saver';

export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'poinitiate',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, CompanyallComponent, PayPeriodComponent, MatIconModule, MatTableModule, AlertpopupComponent],
  templateUrl: './poinitiate.component.html',
  styleUrl: './poinitiate.component.css',
  providers: [
    {

      provide: Invoice_TOKEN,
      useClass: InvoiceRepository,

    }]
})
export class POInitiateComponent {

  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  remarks = '';
  dataSource = new MatTableDataSource<any>([]);;
  invoiceType: any;
  selection = new SelectionModel<any>(true, []);
  userdetail: any;
  currentElement: any;
  isdisabled: boolean = false;
  issearch: boolean = false;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isLoading: boolean = false;
  companyUI: any;
  showPopup: boolean = false;
  popupMessage: string = "";
  datatable: any;

  displayColumns = ['action', 'serial_No', 'map_name', 'CTC', 'head_Count', 'input_Number', 'group_Name', 'service_Charge_Type', 'address_Code', 'msP_Amount']
  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, private dialog: MatDialog) {
  }

  openDialog(): void {
    //this.currentElement = { ...element }; // make copy for editing
    this.dialogRef = this.dialog.open(this.editDialog, {
      width: '400px',
      data: "text"
    });
  }

  Invoiceintiate(): void {
    if (this.selectedCompanyId == undefined) {
      alert("Select Company ");
      return;
    }

    if (this.payPeriod == undefined) {
      alert("Select PayPeriod ");
      return;
    }

    if (this.selection.selected.length == 0) {
      alert("Please Select atleast one row");
      return;
    }

    this.isdisabled = true;
    this.isLoading = true;

    const POInvoiceInitiateMaster = this.selection.selected.map(row => ({
      serial_No: row.serial_No,
      company_Id: row.company_Id,
      company_Code: row.company_Code,
      invoiceType_Id: row.invoiceType_Id,
      ctc: row.ctc,
      head_Count: row.head_Count,
      map_Name_Id: row.map_Name_Id,
      map_Name: row.map_Name,
      pO_Number: row.pO_Number,
      state_Id: row.state_Id,
      state_Name: row.state_Name,
      input_Number: row.input_Number,
      group_Detail_Id: row.group_Detail_Id,
      group_Name: row.group_Name,
      pay_Period_Id: row.pay_Period_Id,
      pay_Period: row.pay_Period,
      service_Charge_Type_Id: row.service_Charge_Type_Id,
      service_Charge_Type: row.service_Charge_Type,
      invoiceCulture_id: row.invoiceCulture_id,
      invoiceCul_Ref_No: row.invoiceCul_Ref_No,
      category_Id: row.category_Id,
      address_Code: row.address_Code,
      msP_Amount: row.msP_Amount,
    }));

    const POInvoiceInitiateRequest = {
      CreatedBy: this.userdetail.user_Id,
      POInvoiceInitiateMaster: POInvoiceInitiateMaster

    };

    this._invoiceService.POInvoiceInitiate(POInvoiceInitiateRequest).subscribe({
      next: (res) => {
        const msg = res.Data[0].Error_Message;
        if (msg.toLowerCase().includes("success")) {
          this.showPopup = true;
          this.popupMessage = msg;
        } else {
          alert(msg);
        }

        this.isLoading = false;
        this.isdisabled = false;
      },
      error: (err) => {
        console.error("Error saving:", err);
        alert("Something went wrong while initiating invoice");
        this.isLoading = false;
        this.isdisabled = false;
      }
    });
  }
  downloadExcelFromBase64(base64: string, filename: string) {

    // this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }
  InitiationSearchExport(): void {

    if (this.selectedCompanyId == undefined) {
      alert("Select Company ");
      return;
    }

    if (this.payPeriod == undefined) {
      alert("Select PayPeriod ");
      return;
    }

    this.isLoading = true;

    this._invoiceService.ExportPOInvoice(this.selectedCompanyId, this.payPeriod.payfrequencyid).subscribe({
      next: res => {
        if (res.Data.file != "No") {
          this.downloadExcelFromBase64(res.Data.file, res.Data.fileName)
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  InitiationRequest(): void {

    if (this.selectedCompanyId == undefined) {
      alert("Select Company ");
      return;
    }

    if (this.payPeriod == undefined) {
      alert("Select PayPeriod ");
      return;
    }

    this.isLoading = true;

    this._invoiceService.RequestPOInvoice(this.selectedCompanyId, this.payPeriod.payfrequencyid).subscribe({
      next: res => {
        this.datatable = res.Data.data.Table0;
        console.table(this.datatable);
        if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
          this.downloadExcel(this.datatable, "invoice_request");
          this.isLoading = false;
        } else {
          alert("No data found");
          this.isLoading = false;
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
     const fileName = `${templateId}.xlsx`;
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
  }

  toggleRow(event) {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    console.log(this.selection.selected);
    return this.selection.selected.length > 0;
  }

  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.companyUI = company;
    console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
    const request = {
      "Company_Id": 0,
      "PayPeriod_Id": 0,
      "InvoiceType": 0,
      "ActionType": "A"
    }
  }

  InvoiceSearch() {
    if (this.selectedCompanyId == undefined) {
      alert("Select Company ");
      return;
    }

    if (this.payPeriod == undefined) {
      alert("Select PayPeriod ");
      return;
    }

    this.issearch = true;
    this.isLoading = true;
    this._invoiceService.POSearch(this.selectedCompanyId, this.payPeriod.payfrequencyid).subscribe({
      next: res => {

        this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
        this.dataSource.paginator = this.PeningLot_paginator;
        this.issearch = false;
        this.isLoading = false;
      },
      error: err => { this.issearch = false; }
    });
  }
  onOptionSelected(event: InvoiceType) {
    this.invoiceType = event;
  }

  onTemplateClick() {
    const baseHeaders = ["company_code", "employee_code", "pay_period", "material_code", "input_number", "other_allowance", "action"];
    const data: any[][] = [baseHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Table");

    XLSX.writeFile(wb, "PO_Initiate_Template.xlsx");

  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);
    formData.append('importType', '0');

    this._invoiceService.POInvoiceUpload(formData).pipe(
      finalize(() => {
        this.isLoading = false;   // always runs
      })
    ).subscribe({
      next: (res) => {

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {

          this.showPopup = true;
          this.popupMessage = res?.Data?.response;
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

          this.showPopup = true;
          this.popupMessage = successMatch;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          alert('Failed to Import');
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
          XLSX.writeFile(workbook, 'ErrorMessages_PoInitiate.xlsx');

          return;
        }

        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }

      },

      error: err => {
        console.error('❌ Upload failed', err);

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


}
