import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CompanyComponent } from '../../../common/company/company.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Company, Payperiodclass } from '../../../Models/Common';
import { BankinvoiceService } from '../../../Service/banknonvoice/bankinvoice.service';
import { CreditNoteRequestServiceService } from '../../../Service/banknonvoice/credit-note-request-service.service';
import { HoldEmployeSalaryService } from '../../../Service/banknonvoice/hold-employe-salary.service';

@Component({
  selector: 'app-bank-invoice',
  imports: [CommonModule,
    MatFormFieldModule, ReactiveFormsModule,
    FormsModule, CompanyComponent, PayPeriodComponent,

  ],
  templateUrl: './bank-invoice.component.html',
  styleUrl: './bank-invoice.component.css',
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class BankInvoiceComponent implements OnInit {

  constructor(
    public stateService: BankinvoiceService,
    private creditNoteService: CreditNoteRequestServiceService,
    private holdService: HoldEmployeSalaryService
  ) { }
  @Input() visibleDropdowns: number[] = [];
  @Input() showSearchButton: boolean = false;
  @Input() payPeriodTypefromParent: string = "";
  @Input() showPurpose: boolean = false;
  @Input() showDNReason: boolean = false;
  @Input() showDNvalue: boolean = false;
  @Input() showDateRange: boolean = false;
  @Input() showEmployeeCode: boolean = false;
  @Input() showSalaryHoldType: boolean = false;

  @Output() companyUI = new EventEmitter<Company>();
  @Output() payperiodUI = new EventEmitter<Payperiodclass>();
  @Output() searchClicked = new EventEmitter<void>();
  @Output() purposeChange = new EventEmitter<string>();
  @Output() salaryHoldTypeChange = new EventEmitter<string>();
  @Output() employeeCodeChange = new EventEmitter<{ EmployeeCode: string }>();
  @Output() dateRangeChanged = new EventEmitter<{ fromDate: string; toDate: string }>();


  companyCode: any;
  payPeriod: any;
  Purpose!: string;
  DNReason!: string;
  SalaryHoldType!: string;
  fromDate!: string;
  toDate!: string;
  selectedCC?: number;
  selectedCN?: number;
  selectedPP?: string;
  payPeriodTypetoChild?: string;
  PurposeList: any[] = [];
  SalaryHoldTypeList: any[] = [];
  EmployeeCode!: string;




  ngOnInit(): void {
    this.payPeriodTypetoChild = this.payPeriodTypefromParent;
    if (this.showPurpose) {
      this.BindPurposeDropdown();   // 👈 CALL HERE
    }
    if (this.showSalaryHoldType) {
      this.BindSalaryHoldType();
    }

  }

  handleCompanyEvent(company: any) {
    if (company) {
      this.selectedCC = company.companyId;
      this.selectedCN = company.companyCode;
      this.stateService.setCompany(company);
      this.companyUI.emit(company);
    }
    else {
      this.companyUI.emit();
    }
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    if (payperiod) {
      this.selectedPP = payperiod.payPeriod;
      this.stateService.setPayperiod(payperiod);
      this.payperiodUI.emit(payperiod);
    }
  }


  searchClick() {
    this.searchClicked.emit();
  }

  BindPurposeDropdown() {
    this.creditNoteService
      .GetCreditNoteDropdown('CREDIT_NOTE_TYPE', 'CREDIT_NOTE_TYPE')
      .subscribe(res => {

        console.log(res);

        this.PurposeList = res?.data?.data?.Table0 || [];
        this.PurposeList = this.PurposeList.map((item: any) => ({
          Value: item.GEN_iID,
          Label: item.GEN_vDescription
        }));

      });
  }
  onPurposeChange() {
    this.purposeChange.emit(this.Purpose);
  }
  BindSalaryHoldType() {
    this.holdService.GetSalaryHoldType().subscribe(res => {
      this.SalaryHoldTypeList = res?.data?.data?.Table0 ?? [];

      this.SalaryHoldTypeList = this.SalaryHoldTypeList.map((item: any) => ({
        Value: item.SalaryHoldType_Id,
        Label: item.SalaryHold_Type
      }));
    });
  }

  onSalaryHoldTypeChange() {

    this.salaryHoldTypeChange.emit(
      this.SalaryHoldType
    );
  }

  onEmployeeCodeChange() {
    this.employeeCodeChange.emit({
      EmployeeCode: this.EmployeeCode
    });
  }

  onDateChange() {
    this.dateRangeChanged.emit({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') ?? '';

    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  allowAlphaNumeric(event: KeyboardEvent): void {
    const key = event.key;

    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Tab'
    ) {
      return;
    }

    const regex = /^[a-zA-Z0-9]$/;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

}
