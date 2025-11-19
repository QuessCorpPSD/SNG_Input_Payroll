import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { CommonModule } from '@angular/common';
export const IR_TOKEN = new InjectionToken<IinvoiceRuleService>('IR_TOKEN');
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceRuleGrid } from '../../../Models/InvoiceRuleGrid';
import { InvoiceForm } from '../../../Models/InvoiceRuleGrid';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { Company, Groupnameclass } from '../../../Models/Common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { invoiceRuleService } from '../../../Service/Master/invoiceRuleService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IinvoiceRuleService } from '../../../Repository/Master/IinvoiceRuleService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { EInvoiceGrid } from '../../../Models/EInvoiceGrid';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';

@Component({
  selector: 'einvoice',
  standalone: true,
  imports: [CommonModule, MatPaginator, MatTableModule,
    MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckbox, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, CompanyallComponent, ReactiveFormsModule, AlertpopupComponent, PayPeriodComponent],
  templateUrl: './einvoice.component.html',
  styleUrl: './einvoice.component.css'
})
export class EInvoiceComponent {

  companyUI: any;
  payperiodUI: any;
  selectedCC?: number;
  selectedCN?: string;
  selectedPP?: string;
  isLoading?: boolean = false;
  showPopup?: boolean = false;
  popupMessage: string = "";
  popupSubMessage: string = "";
  datatable: Array<{ [key: string]: any }> = [];
  isChecked: boolean = false;
  userdetail: any;

  payPeriodTypetoChild?: string;

  handleCompanyEvent(company: any) {
    this.selectedCC = company.companyId;
    this.selectedCN = company.companyCode;
    this.companyUI.emit(company);
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payperiodUI.emit(payperiod);
  }

  ngOnDestroy(): void {
    this.payPeriodTypetoChild = "All"
        const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
  }

  dataSource = new MatTableDataSource<EInvoiceGrid>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'companyCode', 'siteName', 'daysPerMonth', 'weekends',
    'holidays', 'compOff', 'delete'
  ];

  constructor(@Inject(IR_TOKEN) private invoicerepo: IInvoiceRepository, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder
  ) { }

  selection = new SelectionModel<EInvoiceGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id)
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  toggleRow(row: EInvoiceGrid) {
    this.selection.toggle(row);
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Please select Company Code");
    }
    if (!this.payperiodUI) {
      alert("Please select Pay Period");
    }

    if (this.companyUI && this.payperiodUI) {
      this.isLoading = true;
      this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
    }
  }

  BindDashBoard(companyId: number, payPeriodId: number) {
    this.invoicerepo.GetAllInvoiceDetails(companyId, payPeriodId, this.userdetail.user_Id).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        this.dataSource = new MatTableDataSource<any>(res.Data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  IRNInitiate(){
    
  }


}
