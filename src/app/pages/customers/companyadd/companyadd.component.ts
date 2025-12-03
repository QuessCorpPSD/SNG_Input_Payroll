import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    FormsModule
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
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CompanyaddComponent>, private dialog: MatDialog, private company: CompanyserviceService) { }

  get invoiceType() {
    return this.CompanyAddForm.get('InvoiceType')?.value;
  }

  ngOnInit() {
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
      WorkDaysbased: ['Attendance'],
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
    this.company.getCompanyName().subscribe({
      next: res => { this.companyName = res.Data.data?.getCompanyName }
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
        console.log(res);
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
    this.company.getCompanyName().subscribe({
      next: res => { this.BankName = res.Data.data?.getBankName }
    });
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

  AddContactDetails() {
    this.dialog.open(ContactdetailsComponent, {
      width: '65%',
      height: '47vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  Save() {

    if (this.CompanyAddForm.invalid) {
      this.CompanyAddForm.markAllAsTouched();
      return;
    }
  }


  onClose() {
    this.dialogRef.close();
  }

}
