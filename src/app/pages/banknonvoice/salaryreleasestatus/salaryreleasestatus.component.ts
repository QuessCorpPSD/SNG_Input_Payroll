import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { ISalaryReleaseStatus } from '../../../Repository/banknonvoice/ISalaryReleaseStatus.service';
import { SalaryreleasestatusService } from '../../../Service/banknonvoice/salaryreleasestatus.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<ISalaryReleaseStatus>('Pay_Token');


@Component({
  selector: 'app-salaryreleasestatus',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatCardModule, MatIconModule, MatTooltipModule, PayPeriodComponent, CompanyallComponent],
  templateUrl: './salaryreleasestatus.component.html',
  styleUrl: './salaryreleasestatus.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: SalaryreleasestatusService,
    }
  ]
})
export class SalaryreleasestatusComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  selectedBatchType: string = '';
  startDate: string = '';
  endDate: string = '';
  employeeCode: string = '';
  batchtype: any[] = [];
  batchList: any[] = [];
  startDateInput: string = '';
  endDateInput: string = '';
  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  selectedCompanyId: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPPid?: string;
  selectedPP?: string;
  paginatedData: any[] = [];
  companyId: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: ISalaryReleaseStatus) { }



  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName', 'PayPeriod', 'ReleaseStatus', 'BatchId', 'BatchCreatedBy', 'BatchCreatedOn', 'IkyaLocation', 'WorkLocation', 'Bank', 'AccountNumber', 'IFSCCode', 'PTState', 'NetPay', 'BankRefNo', 'UTRChequeNo', 'UTRDate'

  ];

  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
  }
  // handleCompanyEvent(event: any) {
  //   this.comapnyId = event.companyId;
  //   this.selectedCompanyCode = event.companyCode;
  //   this.companyUI = event.company;
  //   this.BindPurpose(this.comapnyId);
  // }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.paginatedData = [];
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPPid = String(payperiod.payfrequencyid);
    this.selectedPP = String(payperiod.payPeriod);
    this.paginatedData = [];
  }


  handlePayperiodEventmain(payperiod: Payperiodclass) {
    this.payPeriodmain = payperiod;
    this.payperiodIdmain = payperiod.payfrequencyid;
    this.payperiodsmain = payperiod.payPeriod;

  }

  BindPurpose(companyId: number) {

  }

  searchClick() {


    if (!this.selectedCompanyCode) {
      alert("Please Select Company Code");
      return;
    }
    this.istablevisible = true;
  }
  exportToExcel(): void {
    // Validation
    if (!this.selectedBatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }
  }
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!this.selectedBatchType) {
      alert('Please select a Batch Type.');
      this.isLoading = false;
      return;
    }
  }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

}
