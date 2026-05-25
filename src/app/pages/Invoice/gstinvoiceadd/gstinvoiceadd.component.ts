import { Component, ViewChild } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { format } from 'node:path';
import { InvoiceRepository } from '../../../Service/invoice/InvoiceRepository';
import { FinancialYearComponent } from "../../../common/financial-year/financial-year.component";
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { MapnameComponent } from "../../../common/Mapname/mapname/mapname.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';


@Component({
  selector: 'app-gstinvoiceadd',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    CompanyallComponent,
    FinancialYearComponent,
    PayPeriodComponent,
    MapnameComponent,
    GroupnameComponent
  ],
  templateUrl: './gstinvoiceadd.component.html',
  styleUrl: './gstinvoiceadd.component.css'
})
export class GstinvoiceaddComponent {

  selectedCompanyId!: number;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  accordionLoaded = false;
  addGstInvoice!: FormGroup;
  InvoiceType: any;
  invoiceType: any;
  CTCDeductionType: any;
  BillingType: any;
  NetDeductionType: any;
  GstPercentage: any;
  selectedFinancialYear: any;
  PayCode: any;
  payperiodId: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedMapId: any;
  siteId: number = 0;
  selectedSiteName: string = '';
  companyId: number = 0;
  mapNameId: any;
  selectedMap: any;
  taxableAmount: number = 0;


  constructor(private dialogRef: MatDialogRef<GstinvoiceaddComponent>, private gst: InvoiceRepository, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;

    this.addGstInvoice.patchValue({
      CompanyName: company.companyName
    });

    this.BindGstPercentage();
  }

  handleFinancialYear(year) {
    this.selectedFinancialYear = year.financial_Year_Id;
    this.addGstInvoice.patchValue({
      FinancialYear: year.financial_Year_Id
    });
  }

  groupnameEvent(event) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;

    this.addGstInvoice.patchValue({
      GroupDetail: event.GroupDetail
    });
  }

  mapnameEvent(event) {
    this.mapNameId = event.mapNameId;
    this.selectedMap = event.mapName;
    this.addGstInvoice.patchValue({
      CostCenterMapping: event.mapNameId
    });
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;

    this.addGstInvoice.patchValue({
      PayPeriod: payperiod.payPeriod
    });
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindGstInvoiceType();
    this.BindCTCDeductionType();
    this.BindGetBillingType();
    this.BindNetDeductionType();
    this.payPeriodType = "All";
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];


    this.addGstInvoice = new FormGroup({
      InvoiceNumber: new FormControl({ value: '', disabled: true }),
      Status: new FormControl({ value: 'Created', disabled: true }),
      companyCode: new FormControl('', Validators.required),
      CompanyName: new FormControl('', Validators.required),
      GroupDetail: new FormControl(''),
      CostCenterMapping: new FormControl('', Validators.required),
      FinancialYear: new FormControl('', Validators.required),
      PayPeriod: new FormControl('', Validators.required),
      InvoiceType: new FormControl('', Validators.required),
      NofEmployees: new FormControl(''),
      InvoiceDate: new FormControl(formattedToday),
      Amount: new FormControl("", Validators.required),
      Particulars: new FormControl(""),
      ServiceCharge: new FormControl(""),
      ServiceChargeAmount: new FormControl(""),
      AbsorptionFee: new FormControl(""),
      AbsorptionAmt: new FormControl(""),
      SourcingFee: new FormControl(""),
      SourcingFeeAmount: new FormControl(""),
      InEdgeCharges: new FormControl(""),
      InEdgeChargesNote: new FormControl(""),
      CTCAdjustmentAmount: new FormControl(""),
      CTCDeductionType: new FormControl(""),
      CTCAdjustmentNote: new FormControl(""),
      OnboardingCharge: new FormControl(""),
      ComplianceFee: new FormControl(""),
      ComplianceFeeAmount: new FormControl(""),
      UpfrontCharges: new FormControl(""),
      UpfrontChargesNote: new FormControl(''),
      TaxableAmount3: new FormControl(""),
      TaxableAmount3Note: new FormControl(""),
      BGVBilling: new FormControl(""),
      AssessmentFee: new FormControl(""),
      Discount1: new FormControl(""),
      Discount2: new FormControl(""),
      IDCardBilling: new FormControl(""),
      EmailId: new FormControl(""),
      RegistartionFee: new FormControl(""),
      TrainerFee: new FormControl(""),
      GOVTGRANTS_DBT: new FormControl(""),
      PREKIT: new FormControl(""),
      VMSFEE: new FormControl(""),
      EducationFee: new FormControl(""),
      NoticePeriodRecovery: new FormControl(""),
      LaptopRental: new FormControl(""),
      DRADeduction: new FormControl(""),
      OtherDeduction: new FormControl(""),
      CallCharges: new FormControl(""),
      CallRate: new FormControl(""),
      GST: new FormControl("", Validators.required),
      GSTAmount: new FormControl(""),
      MobilerecoveryAmount: new FormControl(""),
      PersonalLoanAmount: new FormControl(""),
      OtherDeductionAmount: new FormControl(""),
      NonTaxableAmount1: new FormControl(""),
      NonTaxableAmount1Note: new FormControl(""),
      NonTaxableAmount2: new FormControl(""),
      NonTaxableAmount2Note: new FormControl(""),
      NonTaxableAmount3: new FormControl(""),
      NonTaxableAmount3Note: new FormControl(""),
      NetAdjustmentAmount: new FormControl(""),
      NetDeductionType: new FormControl(""),
      NetAdjNote: new FormControl(""),
      NetAmount: new FormControl(""),
      EmployeeESI: new FormControl(""),
      EmployerESI: new FormControl(""),
      EmployeePF: new FormControl(""),
      EmployerPF: new FormControl(""),
      PIIdNo: new FormControl(""),
      EmployeeName: new FormControl(""),
      Markup: new FormControl(""),
      GriMsp: new FormControl(""),
      DONumber: new FormControl(""),
      WONumber: new FormControl(""),
      WODate: new FormControl(""),
      InvoiceNotes: new FormControl(""),
      Remarks: new FormControl(""),
      DiscrepancyReason: new FormControl(""),
      DiscrepancyBy: new FormControl(""),
      CreatedMode: new FormControl(""),
      BillableType: new FormControl("", Validators.required),
      Location: new FormControl(""),
      State: new FormControl(""),
    });

    this.addGstInvoice.valueChanges.subscribe(() => {
      this.calculateAmount();
    });
  }

  BindGstInvoiceType() {
    this.gst.getGSTInvoiceType().subscribe({
      next: res => { this.invoiceType = res.Data }
    });
  }

  BindCTCDeductionType() {
    this.gst.getCTCDeductionType().subscribe({
      next: res => { this.CTCDeductionType = res.Data }
    });
  }

  BindGetBillingType() {
    this.gst.getBillingType().subscribe({
      next: res => { this.BillingType = res.Data }
    });
  }

  BindNetDeductionType() {
    this.gst.getNetDeductionType().subscribe({
      next: res => { this.NetDeductionType = res.Data }
    });
  };

  BindGstPercentage() {
    this.gst.GetGSTPercentage().subscribe({
      next: (res: any) => {

        this.GstPercentage = res.Data[0].gst_Percentage;

        this.addGstInvoice.patchValue({
          GST: this.GstPercentage
        });

      }
    });
  }
  CreateGSTInvoice() {

    if (this.addGstInvoice.invalid) {
      this.addGstInvoice.markAllAsTouched();
      return;
    }

    const formValue = this.addGstInvoice.getRawValue();
    const today = new Date().toISOString().split('T')[0] + "T00:00:00";

    const payload = {
      Action: "Add",
      Created_Mode: null,

      UserId: this.userdetail?.user_Id?.toString() ?? null,
      Invoice_Id: null,

      Invoice_Number: formValue?.InvoiceNumber?.toString() ?? null,
      Company_Id: this.selectedCompanyId?.toString() ?? null,
      Cost_Center_Mapping_Id: this.mapNameId?.toString() ?? null,

      City_Id: "76",

      Financial_Year_Id: this.selectedFinancialYear?.toString() ?? null,
      Pay_Period_Id: this.payperiodId?.toString() ?? null,
      Invoice_Type_Id: formValue?.InvoiceType?.toString() ?? null,

      Invoice_Date: formValue?.InvoiceDate?.toString() ?? null,
      Invoice_Due_Date: formValue?.InvoiceDate?.toString() ?? null,

      Particulars: formValue?.Particulars?.toString() ?? null,
      Amount: formValue?.Amount?.toString() ?? null,

      StateId: "1",
      InvoicingStateId: "1",

      CGST_Percentage: null,
      SGST_Percentage: null,
      UTGST_Percentage: null,
      IGST_Percentage: formValue?.GSTAmount?.toString() ?? null,

      Client_PO: null,
      Purchase_Order_Id: null,

      Input_Date: today?.toString() ?? null,
      Output_Date: today?.toString() ?? null,

      Service_Charge: formValue?.ServiceCharge?.toString() ?? null,
      Service_Charge_Amount: formValue?.ServiceChargeAmount?.toString() ?? null,

      Sourcing_Fee: formValue?.SourcingFee?.toString() ?? null,
      Sourcing_Fee_Amount: formValue?.SourcingFeeAmount?.toString() ?? null,

      No_Of_Employees: formValue?.NofEmployees?.toString() ?? null,

      Absorption_Fee: formValue?.AbsorptionFee?.toString() ?? null,
      Absorption_Amt: formValue?.AbsorptionAmt?.toString() ?? null,

      CTC_Amt_Adjusted: formValue?.CTCAdjustmentAmount?.toString() ?? null,
      CTC_Amt_NorP: null,
      CTC_Adj_Note: formValue?.CTCAdjustmentNote?.toString() ?? null,

      Net_Amt_Adjusted: formValue?.NetAdjustmentAmount?.toString() ?? null,
      Net_Amt_NorP: null,
      Net_Adj_Note: formValue?.NetAdjNote?.toString() ?? null,

      Invoice_Culture_Id: null,
      Invoice_Culture_RefNo: null,

      Input_No: null,

      Employee_ESI: formValue?.EmployeeESI?.toString() ?? null,
      Employer_ESI: formValue?.EmployerESI?.toString() ?? null,
      Employee_PF: formValue?.EmployeePF?.toString() ?? null,
      Employer_PF: formValue?.EmployerPF?.toString() ?? null,

      Mobile_Recovery_Amount: formValue?.MobilerecoveryAmount?.toString() ?? null,
      Personal_Loan_Amount: formValue?.PersonalLoanAmount?.toString() ?? null,
      Other_Deduction_Amount: formValue?.OtherDeductionAmount?.toString() ?? null,

      WO_Number: formValue?.WONumber?.toString() ?? null,
      Pl_Id_No: formValue?.PIIdNo?.toString() ?? null,
      Employee_Name: formValue?.EmployeeName?.toString() ?? null,

      Markup: formValue?.Markup?.toString() ?? null,
      Gri_Msp: formValue?.GriMsp?.toString() ?? null,
      DO_Number: formValue?.DONumber?.toString() ?? null,
      Remarks: formValue?.Remarks?.toString() ?? null,
      Status: formValue?.Status?.toString() ?? null,

      IsActive: null,
      WO_Date: formValue?.WODate?.toString() ?? null,
      InvoiceNotes: formValue?.InvoiceNotes?.toString() ?? null,

      CreatedBy: this.userdetail?.user_Id?.toString() ?? null,
      CreatedOn: today?.toString() ?? null,
      ModifiedBy: null,
      ModifiedOn: null,

      Discrepancy_By: formValue?.DiscrepancyBy?.toString() ?? null,
      Discrepancy_Reason: formValue?.DiscrepancyReason?.toString() ?? null,

      Onboarding_Charge: formValue?.OnboardingCharge?.toString() ?? null,

      Group_Detail_Id: null,

      TaxableAmount1: null,
      TaxableAmount1_Note: null,
      TaxableAmount2: null,
      TaxableAmount2_Note: null,

      TaxableAmount3: formValue?.TaxableAmount3?.toString() ?? null,
      TaxableAmount3_Note: formValue?.TaxableAmount3Note?.toString() ?? null,

      NonTaxableAmount1: formValue?.NonTaxableAmount1?.toString() ?? null,
      NonTaxableAmount1_Note: formValue?.NonTaxableAmount1Note?.toString() ?? null,
      NonTaxableAmount2: formValue?.NonTaxableAmount2?.toString() ?? null,
      NonTaxableAmount2_Note: formValue?.NonTaxableAmount2Note?.toString() ?? null,
      NonTaxableAmount3: formValue?.NonTaxableAmount3?.toString() ?? null,
      NonTaxableAmount3_Note: formValue?.NonTaxableAmount3Note?.toString() ?? null,

      Billable_Type_Id: null,
      ProvisionalInvoiceNumber: null,

      Compliance_Fee: formValue?.ComplianceFee?.toString() ?? null,
      Compliance_Fee_Amount: formValue?.ComplianceFeeAmount?.toString() ?? null,

      CtcDeductionTypeId: null,
      NetDeductionTypeid: null,
      GratuityInterest: null,
      InsuranceAmount: null,
      NewInvoiceNumber: null,

      BGVBL: formValue?.BGVBilling?.toString() ?? null,
      ASTFEE: formValue?.AssessmentFee?.toString() ?? null,
      DISCT1: formValue?.Discount1?.toString() ?? null,
      DISCT2: formValue?.Discount2?.toString() ?? null,
      IDCARD: formValue?.IDCardBilling?.toString() ?? null,
      EMAIL: formValue?.EmailId?.toString() ?? null,
      REGFEE: formValue?.RegistrationFee?.toString() ?? null,
      TRNFEE: formValue?.TrainerFee?.toString() ?? null,

      GGDBT: formValue?.GOVTGRANTS_DBT?.toString() ?? null,
      PPEKIT: formValue?.PREKIT?.toString() ?? null,
      VMSFEE: formValue?.VMSFEEF?.toString() ?? null,

      CALCRG: formValue?.CallCharges?.toString() ?? null,
      CALRT: formValue?.CallRate?.toString() ?? null
    };

    console.log("payload", JSON.stringify(payload));
    this.gst.addGstInvoice(payload).subscribe({
      next: (res: string) => {
        const message = res.replace(/<br\s*\/?>/gi, '\n')
        if (message.includes('InvoiceID')) {
          alert(message)
          this.onClose();
        }
        else {
          alert(message);
          return;
        }

      },
      error: saveErr => {
        console.error('PO save error:', saveErr);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  calculateAmount() {

    const addValues =
      Number(this.addGstInvoice.get('Amount')?.value || 0) +
      Number(this.addGstInvoice.get('ServiceChargeAmount')?.value || 0) +
      Number(this.addGstInvoice.get('AbsorptionAmt')?.value || 0) +
      Number(this.addGstInvoice.get('SourcingFeeAmount')?.value || 0) +
      Number(this.addGstInvoice.get('InEdgeCharges')?.value || 0) +
      Number(this.addGstInvoice.get('OnboardingCharge')?.value || 0) +
      Number(this.addGstInvoice.get('UpfrontCharges')?.value || 0) +
      Number(this.addGstInvoice.get('BGVBilling')?.value || 0) +
      Number(this.addGstInvoice.get('AssessmentFee')?.value || 0) +
      Number(this.addGstInvoice.get('IDCardBilling')?.value || 0) +
      Number(this.addGstInvoice.get('EmailId')?.value || 0) +
      Number(this.addGstInvoice.get('RegistartionFee')?.value || 0) +
      Number(this.addGstInvoice.get('TrainerFee')?.value || 0) +
      Number(this.addGstInvoice.get('GOVTGRANTS_DBT')?.value || 0) +
      Number(this.addGstInvoice.get('PREKIT')?.value || 0) +
      Number(this.addGstInvoice.get('VMSFEE')?.value || 0) +
      Number(this.addGstInvoice.get('EducationFee')?.value || 0) +
      Number(this.addGstInvoice.get('LaptopRental')?.value || 0);

    const minusValues =
      Number(this.addGstInvoice.get('CTCAdjustmentAmount')?.value || 0) +
      Number(this.addGstInvoice.get('Discount1')?.value || 0) +
      Number(this.addGstInvoice.get('Discount2')?.value || 0) +
      Number(this.addGstInvoice.get('NoticePeriodRecovery')?.value || 0) +
      Number(this.addGstInvoice.get('DRADeduction')?.value || 0) +
      Number(this.addGstInvoice.get('OtherDeduction')?.value || 0);

    this.taxableAmount = addValues - minusValues;

    const gstPercentage =
      Number(this.addGstInvoice.get('GST')?.value || 0);

    const gstAmount = (this.taxableAmount * gstPercentage) / 100;

    const netamount = Number(
      (
        Number(this.taxableAmount) + Number(gstAmount)
      ).toFixed(2)
    );

    this.addGstInvoice.patchValue(
      {
        GSTAmount: gstAmount.toFixed(2),
        NetAmount: netamount
      },
      { emitEvent: false }
    );   
  }

}
