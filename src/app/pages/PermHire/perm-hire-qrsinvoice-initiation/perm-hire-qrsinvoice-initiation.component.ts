import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { IPermHireServiceCharge } from '../../../Repository/customer/IPermhireServiceCharge.service';
import { PermhireservicechargetypeService } from '../../../Service/CUSTOMER/permhireservicechargetype.service';
import { finalize } from 'rxjs';

export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-perm-hire-qrsinvoice-initiation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './perm-hire-qrsinvoice-initiation.component.html',
  styleUrl: './perm-hire-qrsinvoice-initiation.component.css',
  providers: [
    {
      provide: Pay_Token, useClass: PermhireservicechargetypeService,
    }
  ]
})
export class PermHireQRSInvoiceInitiationComponent {
  showTable = false;
  selectedCompanyId!: number;
  userdetail: any;
  searchText: string = "";
  selectedCompanyCode: any;
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payperiodId: any;
  payperiods: string = '';

  // Selection Model for single row selection
  selection = new SelectionModel<any>(false, []);

  constructor(
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_Token) private service: IPermHireServiceCharge
  ) { }

  // Columns: Checkbox, Sl No, Map Name, CTC, Head Count, State, Group, Service Charge Category, Address Code, Service Charge Amount
  uploadDisplayedColumns: string[] = [
    'select', 'slNo', 'mapName', 'ctc', 'headCount', 'state', 'group', 'serviceChargeCategory', 'addressCode', 'serviceChargeAmount'];

  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    // console.log('pay', this.payperiodId)
    // console.log('payperiods', this.payperiods)
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this._decrypt.decrypt(json));
    } else {
      // console.warn('UserProfile not found in session storage');
    }
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.payPeriodType = "All";
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please select the Company Code');
      return;
    }
    if (!this.payperiodId) {
      alert('Please select the Pay Period');
      return;
    }

    this.showTable = true;
    this.isLoading = true;

    this.service.SearchPermHireInvoiceInitiate(this.selectedCompanyId, this.payperiodId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res: any) => {
        const resultData = res?.Data?.data?.Table0 || res?.data?.Table0 || [];
        // console.log('Search result:', resultData);

        if (resultData && resultData.length > 0) {
          this.dataSource = new MatTableDataSource(resultData);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'select', 'slNo', 'mapName', 'ctc', 'headCount', 'state', 'group', 'serviceChargeCategory', 'addressCode', 'serviceChargeAmount'];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }
      },
      error: (err) => {
        // console.error('Error loading perm hire invoice initiation data', err);
        alert('Failed to load perm hire invoice initiation data');
      },
    });
  }

  onCheckboxChange(row: any) {
    this.selection.toggle(row);
  }

  onInitiate() {
    if (this.selection.selected.length === 0) {
      alert('Please select a row to initiate.');
      return;
    }

    const selectedRow = this.selection.selected[0];

    const payload = {
      Company_Id: selectedRow.Company_Id,
      Pay_Period_Id: selectedRow.Pay_Period_Id,
      Action: "Initiate",
      CreatedBy: String(this.userdetail.user_Id),
      Rows: [
        {
          Company_Id: selectedRow.Company_Id,
          Company_Code: selectedRow.Company_Code,
          InvoiceType_Id: selectedRow.InvoiceType_Id,
          ServiceChargeAmount: selectedRow.ServiceChargeAmount != null
            ? String(selectedRow.ServiceChargeAmount)
            : null,
          Head_Count: selectedRow.Head_Count,
          Map_Name_Id: selectedRow.Map_Name_Id,
          Map_Name: selectedRow.Map_Name,
          State_Id: selectedRow.State_Id,
          State_Name: selectedRow.State_Name,
          Input_Number: selectedRow.Input_Number,
          Group_Detail_Id: selectedRow.Group_Detail_Id,
          Group_Name: selectedRow.Group_Name,
          Pay_Period_Id: selectedRow.Pay_Period_Id,
          Pay_Period: selectedRow.Pay_Period,
          Category_Id: selectedRow.Category_Id,
          Service_Charge_Category: selectedRow.Service_Charge_Category,
          Address_Code: selectedRow.Address_Code
        }
      ]
    };

    // console.log('Initiate payload:', payload);

    this.isLoading = true;
    this.service.PermHireInvoiceInitiate(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response: any) => {
        const inner = response?.Data?.data;
        let msg = inner?.response || response?.Data?.response || 'Initiated.';

        if ((msg === 'Failed to Save.' || msg === 'Failed') &&
          Array.isArray(inner?.errors) &&
          inner.errors.length > 0) {
          try {
            const parsed = JSON.parse(inner.errors[0]);
            if (Array.isArray(parsed) && parsed[0]?.Error_Message) {
              msg = parsed[0].Error_Message;
            } else if (parsed?.Error_Message) {
              msg = parsed.Error_Message;
            }
          } catch {
            msg = inner.errors[0];
          }
        }

        alert(msg);
        this.selection.clear();
        this.onsearch();
      },
      error: (error) => {
        // console.error('Initiate failed', error);
        const errMsg =
          error?.error?.Data?.data?.response ||
          error?.error?.Data?.errors?.request?.[0] ||
          error?.error?.Error?.ErrorMessage ||
          'Failed to initiate.';
        alert(errMsg);
      }
    });
  }

  onReject() {
    if (this.selection.selected.length === 0) {
      alert('Please select a row to reject.');
      return;
    }
    const selectedRow = this.selection.selected[0];
    // console.log('Rejecting for:', selectedRow);
    // Add your reject logic here
  }

  exportToExcelsave(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Result': worksheet },
      SheetNames: ['Result']
    };
    XLSX.writeFile(workbook, 'PermHireInvoiceInitiate_Result.xlsx');
  }
}