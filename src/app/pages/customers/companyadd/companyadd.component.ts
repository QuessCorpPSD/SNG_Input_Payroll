import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { ContactdetailsComponent } from '../contactdetails/contactdetails.component';
import { CompanyserviceService } from '../../../Service/company/companyservice.service';
import { from } from 'rxjs';
import { json } from 'node:stream/consumers';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-companyadd',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule,
    AlertpopupComponent
  ],
  templateUrl: './companyadd.component.html',
  styleUrl: './companyadd.component.css'
})
export class CompanyaddComponent {
  CompanyAddForm!: FormGroup;
  companyName: any;
  groupCode: any;
  entityName: any;
  BankName: any;
  segmentName: any;
  subSegmentName: any;
  paywithDeciamal: any;
  companyType: any;
  servicefee: any;
  reimPayment: any;
  bankAdvice: any;
  serviceClubbing: any;
  billingModel: any;
  BusinessUnitLocation: any;
  entityid: any;
  selectedEntityId: any;
  userdetail: any;
  isLoading: boolean = false;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  showPopupvalidate = false;
  showPopup = false;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CompanyaddComponent>, private dialog: MatDialog, private company: CompanyserviceService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService) { }

  get invoiceType() {
    return this.CompanyAddForm.get('InvoiceType')?.value;
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindGetCompanyName();
    this.BindGetCompanyGroupCode();
    this.BindGetEntityName();
    this.BindBankName();
    this.BindSegment();
    this.BindSubSegment();
    this.BindPayWithDecimal();
    this.BindGetCompanyType();
    this.BindServicefeewithDecimal();
    this.BindRiembPayment();
    this.BindBankAdvice();
    this.BindServiceClubbing();
    this.BindBillingModel();
    this.CompanyAddForm = this.fb.group({

      // Basic Info
      CompanyCode: [''],
      ComapnyName: ['', Validators.required],
      MISName: [''],
      BusinessUnitName: ['', Validators.required],
      BusinessUnitLocation: [''],
      Zone: [''],
      CompanyGroupCode: ['', Validators.required],
      CompanyGroupName: [''],
      PayrollType: ['1', Validators.required],
      WBSCode: ['', Validators.required],
      ClientSince: ['', Validators.required],
      ContractStartType: ['', Validators.required],
      ContractExpiryType: ['', Validators.required],
      Active: ['1'],
      FPayMode: [''],

      // Invoice
      // InvoiceType: ['Multiple', Validators.required],
      InsuranceApplicable: ['1'],
      InvoiceType: ['1'],

      // Radio - PO Wise Batch (Yes/No)
      POWiseBatch: ['0'],

      // Dropdowns
      AttendanceCycleForm: ['', Validators.required],
      AttendanceCycleTo: ['', Validators.required],

      // Checkbox
      IsNewJoinee: [true],

      // Other Text Inputs
      MonthDays: ['1'],
      // City: [''],
      // State: [''],
      // PinCode: [''],
      // PhoneNo: [''],
      // PTCode: [''],
      // ServiceTax: [''],
      // EmailId: [''],
      // CertificateNo: [''],
      // FaxNo: [''],
      // Website: [''],
      // Address: [''],
      // ESICode: [''],
      WorkDaysbased: ['1'],
      CTC: ['0'],
      BankName: ['', Validators.required],
      AccountNo: ['', Validators.required],
      SwiftCode: ['', Validators.required],
      Branch: ['', Validators.required],
      BranchCode: ['', Validators.required],
      BankCode: ['', Validators.required],
      BankAddress: ['', Validators.required],
      OnboardingCategory: ['',],
      OnboardingCharges: [''],
      OnboardingChargesValue: ['1'],
      InedgeCategory: [''],
      InedgeCharges: [''],
      InedgeChargesValue: ['1'],
      IncentiveType: [''],
      QdemyCharges: [''],
      QdemyChargesValue: ['1'],
      POApplicable: ['1'],
      TechSubscriptionCharges: [''],
      TechSubscriptionChargesvalue: ['1'],
      FDuesBasedon: ['1'],
      SourcingOBApplicable: ['0'],
      InvoiceFormats: [''],
      Insurance: [''],
      Segment: ['', Validators.required],
      ReimbInvoiceFormat: [''],
      SubSegment: [''],
      PaySlipFormats: [''],
      BillingType: [''],
      Modeofpayment: ['0'],
      PortalPaySlipFormat: [''],
      Incharge: [''],
      RoundOffApplicable: ['0'],
      TAT: [''],
      ValidDate: ['', Validators.required],
      IncentiveDate: [''],
      Deviation: ['0'],
      SalarySMS: ['1'],
      EffectiveDate: ['', Validators.required],
      SalesPerson: [''],
      BranchLocation: [''],
      ProfitCenterCode: [''],
      Particulars: [''],
      SapCustomerCode: ['', Validators.required],
      IsNonInvoice: ['0'],
      HeaderFooter: [false],
      MinimumWagesApplicability: [true],
      WorkingDaysServiceFee: [false],
      IsBonusPayThroughFF: [false],
      AttendanceInputwithLeave: [false],
      ManagementMIS: [''],
      PfCode: [''],
      PayrollWithDecimal: ['', Validators.required],
      IsDecimal: [false],
      CompanyType: ['', Validators.required],
      ServiceFeeWithDecimal: ['', Validators.required],
      ManualNewJoinee: [false],
      ReimbPayment: ['', Validators.required],
      Vertial: [''],
      DigitalPlatformConsent: ['', Validators.required],
      IsProforma: [false],
      IsOneTouchInvoicing: [''],
      WorkingHours: [''],
      IsSignature: [false],
      IsInovicePoBased: [''],
      Is40BillingModel: [false],
      IsCurrencyConversion: [false],
      BillingModel: [''],
      BankAdvice: ['', Validators.required],
      ServiceChargeClubbing: [''],
      DGPSF: ['', Validators.required],
      Sector: ['', Validators.required],
      ReimbrusementDate: [''],
      ReimbursementType: ['']
    })
    this.CompanyAddForm.get('AccountNo')?.disable();
    this.CompanyAddForm.get('SwiftCode')?.disable();
    this.CompanyAddForm.get('BankAddress')?.disable();
    this.CompanyAddForm.get('Branch')?.disable();
    this.CompanyAddForm.get('BranchCode')?.disable();
    this.CompanyAddForm.get('BankCode')?.disable();
    this.CompanyAddForm.get('CompanyCode')?.disable();
  }

  BindGetCompanyName() {
    this.company.getCompanySearch().subscribe({
      next: res => { this.companyName = res.Data.data?.Table0 }
    });
  }

  BindGetCompanyGroupCode() {
    this.company.getCompanyName().subscribe({
      next: res => { this.groupCode = res.Data.data?.getCompanyGroupCode }
    });
  }

  BindGetEntityName() {
    this.company.getCompanyName().subscribe({
      next: res => {
        this.entityName = res.Data.data?.getEntityName
      }
    });
  }

  OnEntitychange(event: any) {
    const selectedValue = event.target.value;
    this.selectedEntityId = selectedValue;
    if (this.selectedEntityId != '') {
      this.BindBusinessUnitLocation();
    }
  }

  BindBankName() {
    this.company?.getBankName().subscribe({
      next: res => { this.BankName = res.Data?.data?.Table0 }

    });
  }

  onBankChange(event: any) {
    const selectedId = Number(event.target.value);  // Bank_Id

    const bank = this.BankName.find((b: any) => b.Bank_Id === selectedId);

    if (bank) {
      this.CompanyAddForm.patchValue({
        AccountNo: bank.Account_No,
        SwiftCode: bank.Swift_Code,
        Branch: bank.BranchName,
        BranchCode: bank.BranchCode,
        BankCode: bank.bank_code,
        BankAddress: bank.Address
      });
    }
  }

  BindSegment() {
    this.company.getCompanyName().subscribe({
      next: res => { this.segmentName = res.Data.data?.getSegmentName }
    });
  }

  BindSubSegment() {
    this.company.getCompanyName().subscribe({
      next: res => { this.subSegmentName = res.Data.data?.getSubSegmentName }
    });
  }

  BindPayWithDecimal() {
    this.company.getCompanyName().subscribe({
      next: res => { this.paywithDeciamal = res.Data.data?.getPayrollWithDecimal }
    });
  }

  BindGetCompanyType() {
    this.company.getCompanyName().subscribe({
      next: res => { this.companyType = res.Data.data?.getCompanyType }
    });
  }

  BindServicefeewithDecimal() {
    this.company.getCompanyName().subscribe({
      next: res => { this.servicefee = res.Data.data?.getServiceFeeWithDecimal }
    });
  }

  BindRiembPayment() {
    this.company.getCompanyName().subscribe({
      next: res => { this.reimPayment = res.Data.data?.getReimbPayment }
    });
  }

  BindBankAdvice() {
    this.company.getCompanyName().subscribe({
      next: res => { this.bankAdvice = res.Data.data?.getBankAdvice }
    });
  }

  BindServiceClubbing() {
    this.company.getCompanyName().subscribe({
      next: res => { this.serviceClubbing = res.Data.data?.getServiceChargeClubbing }
    });
  }

  BindBillingModel() {
    this.company.getCompanyName().subscribe({
      next: res => { this.billingModel = res.Data.data?.getBillingCompanyCodeList }
    });
  }

  BindBusinessUnitLocation() {
    const entityId = this.selectedEntityId;
    this.company.getBusinessUnitLoation(entityId).subscribe({
      next: res => { this.BusinessUnitLocation = res.Data.data?.Table0 }

    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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


  AddCompany() {

    if (this.CompanyAddForm.invalid) {
      this.CompanyAddForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.CompanyAddForm.getRawValue();
    const payload = {
      mode: "Add",
      CreatedBy: this.userdetail.user_Id?.toString(),
      companyrequest: {
        Client_Id: formValue?.ComapnyName ?? 0,
        Financial_Year_Id: 0,
        Client_Since: this.formatDate(formValue?.ClientSince) ?? "",
        Company_Active: formValue?.Active ?? "1",
        Is_Zip_Documents: 0,
        Payroll_Type: Number(formValue?.PayrollType ?? 0),
        Invoicing_Type: Number(formValue?.InvoiceType ?? 0),
        Investment_Block_Date: this.formatDate(formValue?.ValidDate) ?? "",
        Business_Unit_Name_Id: formValue?.BusinessUnitName ?? "",
        Month_Days: formValue?.MonthDays ?? "",
        Salary_Fix_Days: "0",
        Business_Unit_Location_Id: formValue?.BusinessUnitLocation ?? "",
        Attendance_Cycle_From: formValue?.AttendanceCycleForm ?? "",
        Attendance_Cycle_To: formValue?.AttendanceCycleTo ?? "",
        Is_PF_Remittance: "",
        Input_Date: "1",
        Output_Date: "2",
        Work_Days_Based_On: formValue?.WorkDaysbased ?? "",
        CTC: formValue?.CTC ?? "",
        Sourcing_Fee_Criteria_Type: "",
        Sourcing_Fee: formValue?.SourcingOBApplicable ?? "",
        Absorption_Fee_Criteria_Type: "",
        Absorption_Fee: "",
        Incentive_Type: formValue?.IncentiveType ?? "",
        Is_PO_Applicable: formValue?.POApplicable ?? "",
        Salary_SMS: formValue?.SalarySMS ?? "",
        Dues_Based_On: formValue?.FDuesBasedon ?? "",
        Is_Insurance_Applicable: formValue?.InsuranceApplicable ?? "",
        ReimbInvoiceFormat_Id: Number(formValue?.ReimbInvoiceFormat ?? 0),
        Segment_Id: formValue?.Segment ?? "",
        SubSegment_Id: formValue?.SubSegment ?? "",
        Payslip_Format: "0",
        Mode_Of_Payment: "0",
        TAT: formValue?.TAT ?? "",
        Billing_Type: "0",
        Is_RoundOff_Applicable: formValue?.RoundOffApplicable ?? "",
        Deviation: formValue?.Deviation ?? "",
        Incharge: formValue?.Incharge ?? "",
        Credit_Days_Upfront: "",
        Customer_Type: "",
        Incentive_Date: formValue?.IncentiveDate ?? 0,
        Service_Tax_Applicable: 0,
        Reimbursement_Type: "0",
        Salary_Transfer_Date: "0",
        Effective_Date: this.formatDate(formValue?.EffectiveDate) ?? "",
        Sales_Person: formValue?.SalesPerson ?? "",
        Branch_Location: formValue?.BranchLocation ?? "",
        Reimbursement_Date: "0",
        SAP_Code: formValue?.SapCustomerCode ?? "",
        Pin_Code: "",
        Address: "",
        Phone_Number: "",
        PAN_Number: "",
        TAN_Number: "",
        Service_Tax_Number: "",
        PF_Code: "",
        ESI_Code: "",
        PT_Code: "",
        Email_Id: "",
        Certificate_Number: "",
        Fax_Number: "",
        Website_Name: "",
        Wages: formValue.MinimumWagesApplicability ? "1 " : "0",
        Particulars: formValue?.Particulars ?? "",
        Is_NonInvoice: formValue?.IsNonInvoice ?? "",
        Mis_Name: formValue?.MISName ?? "",
        Zone_Tagging: formValue?.Zone ?? "",
        IsHeaderFooter: "1",
        Sap_Customer_Code: formValue?.SapCustomerCode ?? "",
        Profit_Center_Code: formValue?.ProfitCenterCode ?? "",
        Inedge_charges: formValue?.InedgeCharges ?? 0,
        Inedge_charges_Criteria_Type: formValue?.InedgeChargesValue ?? 0,
        CompanyGroupCode: formValue?.CompanyGroupCode ?? "",
        OnBoarding_Category: formValue?.OnboardingCategory ?? "",
        InEdge_Category: formValue?.InedgeCategory ?? "",
        Is_PO_Wise_Batch: formValue?.POWiseBatch ?? "",
        IsBonusPayThroughFF: Number(formValue?.IsBonusPayThroughFF ?? 0),
        IsExtraWorkingDaysServiceFee: Number(formValue?.WorkingDaysServiceFee ?? 0),
        AttendanceInputWithLeave: Number(formValue?.AttendanceInputwithLeave ?? 0),
        Management_MIS: formValue?.ManagementMIS ?? "",
        PfCode_Id: Number(formValue?.PfCode ?? 0),
        IsDecimal: formValue?.IsDecimal ? "1" : "0",
        IsProforma: formValue?.IsProforma ? "1" : "0",
        CompanyType: 0,
        Manual_NewJoinee: formValue?.ManualNewJoinee ? "1" : "0",
        Invoice_Submission_Date: 0,
        Collection_Date: 0,
        PE_User_ID: "",
        PE_Name: "",
        PE_Email_Id: "",
        RM_User_ID: "",
        RM_Name: "",
        RM_Email_Id: "",
        Client_SPOC_Name: "",
        Client_SPOC_Email_Id: "",
        Client_SPOC_Mobile_No: "",
        Client_Escalation_Manager_Name: "",
        Client_Escalation_Manager_Email_Id: "",
        Client_Escalation_Manager_Mobile_No: "",
        Portal_Payslip_Format: formValue?.PortalPaySlipFormat ?? "",
        IsNewJoinee: formValue?.IsNewJoinee ? "1" : "0",
        ReimbPaymentId: Number(formValue?.ReimbPaymentId ?? 0),
        PayrollWithDecimalId: Number(formValue?.PayrollWithDecimal ?? 0),
        PfCategoryId: 0,
        IsSignature: formValue?.IsSignature ? 1 : 0,
        ServiceFeeWithDecimalId: Number(formValue?.ServiceFeeWithDecimal ?? 0),
        Qdemy_charges: formValue?.QdemyCharges ?? 0,
        IsCurrencyConversion: formValue?.IsCurrencyConversion ? 1 : 0,
        TechSubscriptionCharges: formValue?.TechSubscriptionCharges ?? 0,
        Tech_Subscription_Charges_Criteria_Type: formValue?.TechSubscriptionChargesvalue ?? 0,
        DigitalPlatformConsent: Number(formValue?.DigitalPlatformConsent ?? 0),
        DGPSF: Number(formValue?.DGPSF ?? 0),
        Vertical_Id: Number(formValue?.Vertial ?? 0),
        ServiceChargeClubbing: Number(formValue?.ServiceChargeClubbing ?? 0),
        IsOneTouchInvoicing: Number(formValue?.IsOneTouchInvoicing ?? 0),
        IsInvoicePoBased: Number(formValue?.IsInovicePoBased ?? 0),
        IS_ESI_split: Number(formValue?.ESISplit ?? 0),
        WorkingHours: Number(formValue?.WorkingHours ?? 0),
        Is40BillingModel: formValue?.Is40BillingModel ? 1 : 0,
        BillingCompanyId: 0,
        Contract_Start_Date: this.formatDate(formValue?.ContractStartType) ?? "",
        Contract_End_Date: this.formatDate(formValue?.ContractExpiryType) ?? "",
        Contract_File_Path: formValue?.ContractFile ?? "",
        Contract_File_Name: formValue?.ContractFileName ?? "",
        Contract_Uploaded_File_Name: formValue?.ContractUploadedFileName ?? "",
        Service_Tax_Date: this.formatDate(formValue?.ValidDate) ?? "",
        Service_Tax_File_Path: formValue?.ServiceTaxFile ?? "",
        Service_Tax_File_Name: formValue?.ServiceTaxFileName ?? "",
        Service_Tax_Uploaded_File_Name: formValue?.ServiceTax ?? "",
        Bank_Id: formValue?.BankName ?? "",
        IFSC_Code: formValue?.SwiftCode ?? "",
        Account_Number: formValue?.AccountNo ?? "",
        Bank_Address: formValue?.BankAddress ?? "",
        Branch: formValue?.Branch ?? "",
        BranchCode: formValue?.BranchCode ?? "",
        BankCode: formValue?.BankCode ?? "",
        BankAdviceId: formValue?.BankAdvice ?? ""
      }
    };
    this.company.createCompany(payload).subscribe({
      next: res => {
        const msg = res.Data.message
        this.showAlertPopup(msg);
        this.isLoading = false;
        this.onClose();
        this.dialogRef.close('refresh');
      },
      error: err => console.error(err)
    });
    this.isLoading = false;
  }

  AddContactDetails() {
    this.dialog.open(ContactdetailsComponent, {
      width: '65%',
      height: '47vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
