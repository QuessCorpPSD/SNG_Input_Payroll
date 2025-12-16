import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

import { CompanyaddComponent } from '../companyadd/companyadd.component';

import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { CompanyserviceService } from '../../../Service/CUSTOMER/companyservice.service';

@Component({
  selector: 'app-companyedit',
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
  templateUrl: './companyedit.component.html',
  styleUrl: './companyedit.component.css'
})
export class CompanyeditComponent {
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
  companydata: any;
  companyBind: any;
  isLoading: boolean = false;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  showPopupvalidate = false;
  showPopup = false;

  @ViewChild('fileInput') fileInput: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CompanyeditComponent>, private dialog: MatDialog, private company: CompanyserviceService, @Inject(MAT_DIALOG_DATA) public companyView: any, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService) { }

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
    this.BindCompanyId();
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
      PayrollType: ['flexi', Validators.required],
      WBSCode: ['', Validators.required],
      ClientSince: ['', Validators.required],
      ContractStartType: ['', Validators.required],
      ContractExpiryType: ['', Validators.required],
      Active: ['1'],
      FPayMode: [''],

      // Invoice
      // InvoiceType: ['Multiple', Validators.required],
      InsuranceApplicable: ['yes'],
      InvoiceType: [''],

      // Radio - PO Wise Batch (Yes/No)
      POWiseBatch: ['no'],

      // Dropdowns
      AttendanceCycleForm: ['', Validators.required],
      AttendanceCycleTo: ['', Validators.required],

      // Checkbox
      IsNewJoinee: [true],

      // Other Text Inputs
      MonthDays: ['yes'],
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
      WorkDaysbased: [''],
      CTC: ['Monthly'],
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
      POApplicable: ['yes'],
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
      Modeofpayment: [''],
      PortalPaySlipFormat: [''],
      Incharge: [''],
      RoundOffApplicable: ['0'],
      TAT: [''],
      ValidDate: [''],
      IncentiveDate: [''],
      Deviation: ['0'],
      SalarySMS: ['1'],
      EffectiveDate: ['', Validators.required],
      SalesPerson: [''],
      BranchLocation: [''],
      ProfitCenterCode: [''],
      Particulars: [''],
      SapCustomerCode: ['', Validators.required],
      IsNonInvoice: ['Invoice'],
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
      Is40BillingMode: [false],
      IsCurrencyConversion: [false],
      BillingModel: [''],
      BankAdvice: [''],
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
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  formatDateType(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  BindCompanyId() {
    this.isLoading = true;
    const companyId = this.companyView.CompanyID;
    const companyCode = this.companyView.companyCode;

    this.company.viewCompanyDetails(companyId).subscribe({
      next: res => {
        this.isLoading = false;
        const table = res?.Data?.data?.Table0;
        const table3 = res?.Data?.data?.Table3;

        if (!table || table.length === 0) {
          alert("No data found for the given Company ID.");
          return;
        }

        this.companydata = table[0];
        this.companyBind = table3;
        this.CompanyAddForm.patchValue({
          CompanyCode: companyCode,
          ComapnyName: this.companydata.Client_Id,
          MISName: this.companydata.Mis_Name,
          BusinessUnitName: this.companydata.Business_Unit_Name_Id,
          BusinessUnitLocation: this.companydata.Business_Unit_Location_Id,
          Zone: this.companydata.Zone_Tagging,
          CompanyGroupCode: this.companydata.CompanyGroupCode,
          CompanyGroupName: this.companydata.CompanyGroupName,
          PayrollType: this.companydata.Payroll_Type === true ? true : false,
          WBSCode: this.companydata.SAP_Code,
          ClientSince: this.formatDate(this.companydata.Client_Since),
          ContractStartType: this.formatDate(this.companydata.Contract_Start_Date),
          ContractExpiryType: this.formatDate(this.companydata.Contract_End_Date),
          Active: this.companydata.Company_Active,
          FPayMode: this.companydata.Is_Zip_Documents,
          InvoiceType: this.companydata.Invoice_Type,
          InsuranceApplicable: this.companydata.Is_Insurance_Applicable,
          POWiseBatch: this.companydata.Is_PO_Wise_Batch,
          AttendanceCycleForm: this.companydata.Attendance_Cycle_From,
          AttendanceCycleTo: this.companydata.Attendance_Cycle_To,
          WorkDaysbased: this.companydata.Work_Days_Based_On,
          CTC: this.companydata.CTC,
          IsNewJoinee: this.companydata.IsNewJoinee,
          MonthDays: this.companydata.Month_Days,
          BankName: this.companydata.Bank_Id,
          OnboardingCategory: this.companydata.OnBoarding_Category,
          OnboardingCharges: this.companydata.Absorption_Fee,
          OnboardingChargesValue: this.companydata.Absorption_Fee_Criteria_Type,
          InedgeCategory: this.companydata.InEdge_Category,
          InedgeCharges: this.companydata.Inedge_charges,
          InedgeChargesValue: this.companydata.Inedge_charges_Criteria_Type,
          IncentiveType: this.companydata.Incentive_Type,
          QdemyCharges: this.companydata.Qdemy_charges,
          QdemyChargesValue: Number(this.companyBind.QDemyFee_Type_Id),
          POApplicable: this.companydata.Is_PO_Applicable === true ? 1 : 0,
          TechSubscriptionCharges: this.companydata.TechSubscriptionCharges,
          TechSubscriptionChargesvalue: this.companydata.Tech_Subscription_Charges_Criteria_Type,
          FDuesBasedon: this.companydata.Dues_Based_On,
          SourcingOBApplicable: this.companydata.Sourcing_Fee_Criteria_Type,
          InvoiceFormats: this.companydata.Invoice_Format,
          Insurance: this.companydata.Insurance_Amount,
          ReimbInvoiceFormat: this.companydata.ReimbInvoiceFormat_Id,
          PaySlipFormats: this.companydata.Portal_Payslip_Format,
          BillingType: this.companydata.Billing_Type,
          Modeofpayment: this.companydata.Mode_Of_Payment,
          PortalPaySlipFormat: this.companydata.Portal_Payslip_Format,
          Incharge: this.companydata.Incharge,
          RoundOffApplicable: this.companydata.Is_RoundOff_Applicable,
          TAT: this.companydata.TATDays,
          ValidDate: this.formatDate(this.companydata.service_tax_date),
          IncentiveDate: this.companydata.Incentive_Date,
          Deviation: this.companydata.Deviation,
          SalarySMS: this.companydata.Salary_SMS,
          EffectiveDate: this.formatDate(this.companydata.Effective_Date),
          SalesPerson: this.companydata.Sales_Person,
          BranchLocation: this.companydata.Branch_Location,
          ProfitCenterCode: this.companydata.Profit_Center_Code,
          Particulars: this.companydata.Particulars,
          SapCustomerCode: this.companydata.Sap_Customer_Code,
          IsNonInvoice: this.companydata.Is_NonInvoice,
          HeaderFooter: this.companydata.IsHeaderFooter,
          MinimumWagesApplicability: this.companydata.Minimum_Wages,
          WorkingDaysServiceFee: this.companydata.IsExtraWorkingDaysServiceFee,
          IsBonusPayThroughFF: this.companydata.IsBonusPayThroughFF,
          AttendanceInputwithLeave: this.companydata.AttendanceInputWithLeave,
          ManagementMIS: this.companydata.Management_MIS,
          PfCode: this.companydata.PfCode_Id,
          PayrollWithDecimal: this.companydata.PayrollWithDecimalId,
          IsDecimal: this.companydata.IsDecimal,
          CompanyType: this.companydata.CompanyType,
          ServiceFeeWithDecimal: this.companydata.ServiceFeeWithDecimalId,
          ManualNewJoinee: this.companydata.Manual_NewJoinee,
          ReimbPayment: this.companydata.ReimbPaymentId,
          Vertial: this.companydata.Vertical_Id,
          DigitalPlatformConsent: this.companydata.DigitalPlatformConsent,
          IsProforma: this.companydata.IsProforma,
          IsOneTouchInvoicing: this.companydata.IsOneTouchInvoicing,
          WorkingHours: this.companydata.WorkingHours1,
          IsSignature: this.companydata.IsSignature,
          IsInovicePoBased: this.companydata.IsInvoicePoBased,
          Is40BillingMode: this.companydata.Is40BillingModel,
          IsCurrencyConversion: this.companydata.Is_Conversion,
          DGPSF: this.companydata.DGPSF,
          Sector: this.companydata.Sector,
          ReimbrusementDate: this.companydata.ReimbrusementDate,
          ReimbursementType: this.companydata.ReimbursementType,
          Segment: this.companydata.Segment_Id,
          SubSegment: this.companydata.SubSegment_Id,
          BankAdvice: this.companydata.BankAdviceId,
          ServiceChargeClubbing: this.companydata.ServiceChargeClubbing,
          BillingModel: this.companydata.Is40BillingModel,

        });
        this.OnEntitychange({ target: { value: this.companydata.Business_Unit_Name_Id } });
        this.onBankChange({ target: { value: this.companydata.Bank_Id } });

      },
      error: err => {
        alert("Error fetching company details.");
      }
    });
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  triggerFileUploadServiceTax() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // --- Upload functionality here ---
    }
  }

  onFileSelectedServiceTax(event: any) {
    const file = event.target.files[0];
    if (file) {
      // --- Upload functionality here ---
    }
  }

  // AddContactDetails() {
  //   this.dialog.open(ContactdetailsComponent, {
  //     width: '65%',
  //     height: '47vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });
  // }

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

  updateCompany() {

    if (this.CompanyAddForm.invalid) {
      this.CompanyAddForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.CompanyAddForm.getRawValue();

    const payload = {
      mode: "UPDATE",
      CreatedBy: this.userdetail.user_Id?.toString(),
      companyrequest: {
        Company_Id: this.companyView.CompanyID?.toString() ?? "",
        Company_Contract_Id: this.companydata.Company_Contract_id?.toString() ?? "",
        Client_Id: formValue?.ComapnyName ?? 0,
        Financial_Year_Id: 0,
        Client_Since: this.formatDateType(formValue?.ClientSince) ?? "",
        Company_Active: formValue?.Active ? 1 : 0,
        Is_Zip_Documents: 0,
        Payroll_Type: Number(formValue?.PayrollType ?? 0),
        Invoicing_Type: Number(formValue?.InvoiceType ?? 0),
        Investment_Block_Date: this.formatDateType(formValue?.ValidDate) ?? "",
        Business_Unit_Name_Id: formValue?.BusinessUnitName?.toString() ?? "",
        Month_Days: formValue?.MonthDays?.toString() ?? "",
        Salary_Fix_Days: "0",
        Business_Unit_Location_Id: formValue?.BusinessUnitLocation?.toString() ?? "",
        Attendance_Cycle_From: formValue?.AttendanceCycleForm?.toString() ?? "",
        Attendance_Cycle_To: formValue?.AttendanceCycleTo?.toString() ?? "",
        Is_PF_Remittance: "",
        Input_Date: "1",
        Output_Date: "2",
        Work_Days_Based_On: formValue?.WorkDaysbased?.toString() ?? "",
        CTC: formValue?.CTC?.toString() ?? "",
        Sourcing_Fee_Criteria_Type: "",
        Sourcing_Fee: formValue?.SourcingOBApplicable?.toString() ?? "",
        Absorption_Fee_Criteria_Type: "",
        Absorption_Fee: "",
        Incentive_Type: formValue?.IncentiveType?.toString() ?? "",
        Is_PO_Applicable: formValue?.POApplicable?.toString() ?? "",
        Salary_SMS: formValue?.SalarySMS?.toString() ?? "",
        Dues_Based_On: formValue?.FDuesBasedon?.toString() ?? "",
        Is_Insurance_Applicable: formValue?.InsuranceApplicable?.toString() ?? "",
        ReimbInvoiceFormat_Id: Number(formValue?.ReimbInvoiceFormat ?? 0),
        Segment_Id: formValue?.Segment?.toString() ?? "",
        SubSegment_Id: formValue?.SubSegment?.toString() ?? "",
        Payslip_Format: "0",
        Mode_Of_Payment: "0",
        TAT: formValue?.TAT?.toString() ?? "",
        Billing_Type: "0",
        Is_RoundOff_Applicable: formValue?.RoundOffApplicable?.toString() ?? "",
        Deviation: formValue?.Deviation?.toString() ?? "",
        Incharge: formValue?.Incharge?.toString() ?? "",
        Credit_Days_Upfront: "",
        Customer_Type: "",
        Incentive_Date: formValue?.IncentiveDate?.toString() ?? "",
        Service_Tax_Applicable: 0,
        Reimbursement_Type: "0",
        Salary_Transfer_Date: "0",
        Effective_Date: this.formatDateType(formValue?.EffectiveDate)?.toString() ?? "",
        Sales_Person: formValue?.SalesPerson?.toString() ?? "",
        Branch_Location: formValue?.BranchLocation?.toString() ?? "",
        Reimbursement_Date: "0",
        SAP_Code: formValue?.SapCustomerCode?.toString() ?? "",
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
        Wages: formValue.MinimumWagesApplicability?.toString() ? "1 " : "0",
        Particulars: formValue?.Particulars?.toString() ?? "",
        Is_NonInvoice: formValue?.IsNonInvoice?.toString() ?? "",
        Mis_Name: formValue?.MISName?.toString() ?? "",
        Zone_Tagging: formValue?.Zone?.toString() ?? "",
        IsHeaderFooter: "1",
        Sap_Customer_Code: formValue?.SapCustomerCode?.toString() ?? "",
        Profit_Center_Code: formValue?.ProfitCenterCode?.toString() ?? "",
        Inedge_charges: formValue?.InedgeCharges?.toString() ?? 0,
        Inedge_charges_Criteria_Type: formValue?.InedgeChargesValue?.toString() ?? 0,
        CompanyGroupCode: formValue?.CompanyGroupCode?.toString() ?? "",
        OnBoarding_Category: formValue?.OnboardingCategory?.toString() ?? "",
        InEdge_Category: formValue?.InedgeCategory?.toString() ?? "",
        Is_PO_Wise_Batch: formValue?.POWiseBatch?.toString() ?? "",
        IsBonusPayThroughFF: Number(formValue?.IsBonusPayThroughFF ?? 0),
        IsExtraWorkingDaysServiceFee: Number(formValue?.WorkingDaysServiceFee ?? 0),
        AttendanceInputWithLeave: Number(formValue?.AttendanceInputwithLeave ?? 0),
        Management_MIS: formValue?.ManagementMIS?.toString() ?? "",
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
        Portal_Payslip_Format: formValue?.PortalPaySlipFormat?.toString() ?? "",
        IsNewJoinee: formValue?.IsNewJoinee?.toString() ? "1" : "0",
        ReimbPaymentId: Number(formValue?.ReimbPaymentId),
        PayrollWithDecimalId: Number(formValue?.PayrollWithDecimal ?? 0),
        PfCategoryId: 0,
        IsSignature: formValue?.IsSignature?.toString() ? 1 : 0,
        ServiceFeeWithDecimalId: Number(formValue?.ServiceFeeWithDecimal ?? 0),
        Qdemy_charges: formValue?.QdemyCharges?.toString() ?? 0,
        IsCurrencyConversion: formValue?.IsCurrencyConversion?.toString() ? 1 : 0,
        TechSubscriptionCharges: formValue?.TechSubscriptionCharges?.toString() ?? 0,
        Tech_Subscription_Charges_Criteria_Type: formValue?.TechSubscriptionChargesvalue?.toString() ?? 0,
        DigitalPlatformConsent: Number(formValue?.DigitalPlatformConsent ?? 0),
        DGPSF: Number(formValue?.DGPSF ?? 0),
        Vertical_Id: Number(formValue?.Vertial ?? 0),
        ServiceChargeClubbing: Number(formValue?.ServiceChargeClubbing ?? 0),
        IsOneTouchInvoicing: Number(formValue?.IsOneTouchInvoicing ?? 0),
        IsInvoicePoBased: Number(formValue?.IsInovicePoBased?.toString() ?? 0),
        IS_ESI_split: Number(formValue?.ESISplit ?? 0),
        WorkingHours: Number(formValue?.WorkingHours ?? 0),
        Is40BillingModel: formValue?.Is40BillingModel?.toString() ? 1 : 0,
        BillingCompanyId: 0,
        Contract_Start_Date: this.formatDateType(formValue?.ContractStartType) ?? "",
        Contract_End_Date: this.formatDateType(formValue?.ContractExpiryType) ?? "",
        Contract_File_Path: formValue?.ContractFile?.toString() ?? "",
        Contract_File_Name: formValue?.ContractFileName?.toString() ?? "",
        Contract_Uploaded_File_Name: formValue?.ContractUploadedFileName?.toString() ?? "",
        Service_Tax_Date: this.formatDateType(formValue?.ValidDate) ?? "",
        Service_Tax_File_Path: formValue?.ServiceTaxFile?.toString() ?? "",
        Service_Tax_File_Name: formValue?.ServiceTaxFileName?.toString() ?? "",
        Service_Tax_Uploaded_File_Name: formValue?.ServiceTax?.toString() ?? "",
        Bank_Id: formValue?.BankName?.toString() ?? "",
        IFSC_Code: formValue?.SwiftCode?.toString() ?? "",
        Account_Number: formValue?.AccountNo?.toString() ?? "",
        Bank_Address: formValue?.BankAddress?.toString() ?? "",
        Branch: formValue?.Branch?.toString() ?? "",
        BranchCode: formValue?.BranchCode?.toString() ?? "",
        BankCode: formValue?.BankCode?.toString() ?? "",
        BankAdviceId: formValue?.BankAdvice?.toString() ?? "0"
      }
    };

    this.company.updateCompany(payload).subscribe({
      next: res => {
        const msg1 = res.Data.data.Table0[0].Message;
        this.showAlertPopup(msg1);
        this.isLoading = false;
        this.onClose();
      },
      error: err => console.error(err)
    });

    this.isLoading = false;
  }

  onClose() {
    this.dialogRef.close();
  }

}
