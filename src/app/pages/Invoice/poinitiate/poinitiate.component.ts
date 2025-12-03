import { Component, Inject, InjectionToken, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
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

    console.log(POInvoiceInitiateRequest);

    this._invoiceService.POInvoiceInitiate(POInvoiceInitiateRequest).subscribe({
      next: (res) => {
        console.log(res);
        const parsedData = JSON.parse(res.Data);
        const errormsg = parsedData[0].Error_Message;

        if (errormsg.toLowerCase().includes("successfully")) {
          //alert(errormsg);
          this.showPopup = true;
          this.popupMessage = "Invoice Initiated Successfully";
          this.isLoading = false;
        } else {
          alert(errormsg);
          this.isLoading = false;
        }
        error: (err) => {
          console.error("Error saving:", err);
          this.isLoading = false;
        }
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
        console.log(res);
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
}
