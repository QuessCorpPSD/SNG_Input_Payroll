import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { IItcalender } from '../../../Repository/customer/Iitcalender';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { SelectionModel } from '@angular/cdk/collections';
import { Payperiodclass } from '../../../Models/Common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { IProfomaImport } from '../../../Repository/invoice/IProfomaImport';
import { ProfomaImportService } from '../../../Service/invoice/profoma-import.service';
import * as XLSX from 'xlsx';
export const Pay_Token = new InjectionToken<IProfomaImport>('Pay_Token');

@Component({
  selector: 'app-invoice-initiate-against-profoma',
  standalone: true,
  imports: [AlertpopupComponent, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCheckboxModule, PayPeriodComponent],
  templateUrl: './invoice-initiate-against-profoma.component.html',
  styleUrl: './invoice-initiate-against-profoma.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ProfomaImportService,
    }
  ]
})
export class InvoiceInitiateAgainstProfomaComponent {
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  showTable = false;
  uploadDisplayedColumns: string[] = ['action', 'id', 'mapName', 'state', 'group', 'inputNumber', 'employeeCount', 'netPay', 'ctc', 'serviceChargeAmount'];
  uploadedData: any[] = [];
  selection = new SelectionModel<any>(true, []);
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  companyUI: any;
  dataSource = new MatTableDataSource<any>();
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  proformaSearch: any;
  constructor(private dialog: MatDialog,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: ProfomaImportService,
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  userdetail: any;
  isdisabled: boolean = false;

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.companyUI = company;
    console.log(this.companyUI);
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }

  toggleRow(event) {

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.uploadedData.length;
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
        : this.uploadedData.forEach(row => this.selection.select(row));
    }
  }

  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please select company code');
      return;
    }
    if (!this.payPeriod) {
      alert('Please select payperiod');
      return;
    }
    this.showTable = true;
    this.isLoading = true;

    const CompanyId = this.selectedCompanyId;
    const PayperiodId = this.payPeriod.payfrequencyid;
    const flag = "Search";

    this.service.search(CompanyId, PayperiodId, flag).subscribe({

      next: (res) => {
        this.proformaSearch = res.Data.data.Table0;
        if (this.proformaSearch && this.proformaSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.proformaSearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = ['action', 'id', 'mapName', 'state', 'group', 'inputNumber', 'employeeCount', 'netPay', 'ctc', 'serviceChargeAmount'];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        alert('Failed to load salary release data');
        this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please select company code');
      return;
    }
    if (!this.payPeriod) {
      alert('Please select payperiod');
      return;
    }

    this.showTable = true;
    this.isLoading = true;

    const CompanyId = this.selectedCompanyId;
    const PayperiodId = this.payPeriod.payfrequencyid;
    const flag = "ExportToExcel";

    this.service.search(CompanyId, PayperiodId, flag).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CompanyPermission');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `InvoiceInitiateAgainstProfoma${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        this.isLoading = false;
      },
    });
  }

  Invoiceintiate(): void {
    // Check search data available
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      alert("Please search first.");
      return;
    }

    if (this.selection.selected.length == 0) {
      alert("Please Select atleast one row");
      return;
    }

    this.isdisabled = true;
    this.isLoading = true;

    const POInvoiceInitiateMaster = {
      CompanyId: this.selectedCompanyId?.toString() || '',
      PayPeriodId: this.payPeriod.payfrequencyid?.toString() || '',
      flag: 'Initiate',
      CreatedBy: this.userdetail?.UserId?.toString() || '',

      Rows: this.selection.selected.map(row => ({
        RowNumber: row.serial_No ?? 0,
        CompanyId: row.company_Id ?? 0,
        PayPeriodId: row.pay_Period_Id ?? 0,
        CostCenterMappingId: row.map_Name_Id ?? 0,
        StateId: row.state_Id ?? 0,
        GroupDetailId: row.group_Detail_Id ?? 0,
        InputNumber: row.input_Number ?? 0,
        EmployeeCount: row.head_Count ?? 0,
        NetPay: row.msP_Amount?.toString() || '',
        CTC: row.ctc?.toString() || '',
        ServiceChargeAmount: row.service_Charge_Type_Id?.toString() || ''
      }))
    };

    this.service.ProformaInitiate(POInvoiceInitiateMaster).subscribe({
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




}
