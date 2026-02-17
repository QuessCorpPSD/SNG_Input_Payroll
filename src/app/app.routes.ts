import { provideRouter, Routes } from '@angular/router';

import { IndexComponent } from './account/index/index.component';

import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { AuthGuard } from './Shared/auth-guard.service';
import { MasterComponent } from './layout/master/master.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { AssignmentComponent } from './pages/assignment/assignment.component';
import { SeverityComponent } from './pages/severity/severity.component';
import { AllotedLotComponent } from './pages/alloted-lot/alloted-lot.component';
import { SopformComponent } from './pages/sopform/sopform.component';
import { SopComponent } from './pages/Customer/sop/sop.component';
import { SopnewComponent } from './pages/sopnew/sopnew.component';
import { UserMappingComponent } from './pages/admin/user-mapping/user-mapping.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChangepasswordComponent } from './pages/changepassword/changepassword.component';
import { PayrollinputComponent } from './pages/PayrollInput/payrollinput.component';
import { OnboardingComponent } from './pages/PayrollInput/onboarding/onboarding.component';
import { InputmenuComponent } from './pages/PayrollInput/inputmenu/inputmenu.component';
import { IncrementComponent } from './pages/PayrollInput/increment/increment.component';
import { ActivationLWDComponent } from './pages/PayrollInput/activation-lwd/activation-lwd.component';
import { UnseizeComponent } from './pages/PayrollInput/unseize/unseize.component';
import { OnetimeinputComponent } from './pages/PayrollInput/onetimeinput/onetimeinput.component';
import { FinalsubmissionComponent } from './pages/PayrollInput/finalsubmission/finalsubmission.component';
import { TimesheetComponent } from './pages/PayrollInput/timesheet/timesheet.component';

import { InvoiceauditComponent } from './pages/PayrollInput/invoiceaudit/invoiceaudit.component';
import { MasternavigationComponent } from './pages/Masters/MasterNavigation/masternavigation/masternavigation.component';
import { HolidaymasterComponent } from './pages/Masters/holidaymaster/holidaymaster.component';
import { InvoiceruleComponent } from './pages/Masters/invoicerule/invoicerule.component';
import { LeavemasterComponent } from './pages/Masters/leavemaster/leavemaster.component';
import { LeaveruleComponent } from './pages/Masters/leaverule/leaverule.component';
import { LeaveOpeningBalanceUploadComponent } from './pages/Masters/leave-opening-balance-upload/leave-opening-balance-upload.component';
import { VendorEmployeeComponent } from './pages/Masters/vendor-employee/vendor-employee.component';
import { InvoicenavigationComponent } from './pages/Invoice/invoicenavigation/invoicenavigation.component';
import { InitiateComponent } from './pages/Invoice/initiate/initiate.component';
import { PerfomainvoiceComponent } from './pages/Invoice/perfomainvoice/perfomainvoice.component';
import { PoNavigationComponent } from './pages/po-navigation/po-navigation.component';
import { PoCreateComponent } from './pages/POProcess/po-create/po-create.component';
import { EmployeePOComponent } from './pages/po-navigation/employee-po/employee-po.component';
import { POApproveComponent } from './pages/po-navigation/poapprove/poapprove.component';
import { ReportsComponent } from './pages/Reports/reports.component';
import { PayregisterunprocessedComponent } from './pages/Reports/payregisterunprocessed/payregisterunprocessed.component';
import { PayslipComponent } from './pages/Reports/payslip/payslip.component';
import { InvoiceLeaveBalanceReportComponent } from './pages/Reports/invoice-leave-balance-report/invoice-leave-balance-report.component';
import { LeaveBalanceReportComponent } from './pages/Reports/leave-balance-report/leave-balance-report.component';
import { PoactiveinactivereportComponent } from './pages/Reports/poactiveinactivereport/poactiveinactivereport.component';
import { PoemployeereportComponent } from './pages/Reports/poemployeereport/poemployeereport.component';
import { PomonthwisereportComponent } from './pages/Reports/pomonthwisereport/pomonthwisereport.component';
import { QITSBillingReportComponent } from './pages/Reports/qits-billing-report/qits-billing-report.component';
import { TimesheetReportComponent } from './pages/Reports/timesheet-report/timesheet-report.component';
import { ProcessComponent } from './pages/Process/process.component';
import { ReprocessComponent } from './pages/Process/reprocess/reprocess.component';
import { BonusflushComponent } from './pages/SalaryRelease/bonusflush/bonusflush.component';
import { DBTholdemployeesalaryComponent } from './pages/SalaryRelease/dbtholdemployeesalary/dbtholdemployeesalary.component';
import { EmployeesalaryreleaseComponent } from './pages/SalaryRelease/employeesalaryrelease/employeesalaryrelease.component';
import { HoldEmployeSalaryComponent } from './pages/SalaryRelease/hold-employe-salary/hold-employe-salary.component';
import { HoldReleaseRequestComponent } from './pages/SalaryRelease/hold-release-request/hold-release-request.component';
import { NetPaySammaryComponent } from './pages/SalaryRelease/net-pay-sammary/net-pay-sammary.component';
import { NetpaysummaryofnonvoiceComponent } from './pages/SalaryRelease/netpaysummaryofnonvoice/netpaysummaryofnonvoice.component';
import { NewJoineeExistingEmployeeBankVerifiedReportComponent } from './pages/SalaryRelease/new-joinee-existing-employee-bank-verified-report/new-joinee-existing-employee-bank-verified-report.component';
import { PartialHoldComponent } from './pages/SalaryRelease/partial-hold/partial-hold.component';
import { ReleaseHoldEmployeeSalaryComponent } from './pages/SalaryRelease/release-hold-employee-salary/release-hold-employee-salary.component';
import { SalaryAdvanceRequestComponent } from './pages/SalaryRelease/salary-advance-request/salary-advance-request.component';
import { SalaryHoldRequestComponent } from './pages/SalaryRelease/salary-hold-request/salary-hold-request.component';
import { SalaryReleaseNavigationComponent } from './pages/SalaryRelease/salary-release-navigation/salary-release-navigation.component';
import { SalaryReleaseRequestComponent } from './pages/SalaryRelease/salary-release-request/salary-release-request.component';
import { UANReleaseComponent } from './pages/SalaryRelease/uanrelease/uanrelease.component';
import { UpfrontPortalFinalApprovalComponent } from './pages/SalaryRelease/upfront-portal-final-approval/upfront-portal-final-approval.component';
import { VANPaymentRequestComponent } from './pages/SalaryRelease/vanpayment-request/vanpayment-request.component';
import { AttendanceComponent } from './pages/Process/attendance/attendance.component';
import { ArrearAttendanceComponent } from './pages/Process/arrear-attendance/arrear-attendance.component';
import { BillableDaysComponent } from './pages/Invoice/billable-days/billable-days.component';
import { GstinvoiceComponent } from './pages/Invoice/gstinvoice/gstinvoice.component';
import { SalaryadvacerequestComponent } from './pages/salaryadvancemodule/salaryadvacerequest/salaryadvacerequest.component';
import { SalaryadvanceapproveComponent } from './pages/salaryadvancemodule/salaryadvanceapprove/salaryadvanceapprove.component';
import { SalaryadvancemodulenavigationComponent } from './pages/salaryadvancemodule/salaryadvancemodulenavigation/salaryadvancemodulenavigation.component';
import { SalaryadvancereportComponent } from './pages/salaryadvancemodule/salaryadvancereport/salaryadvancereport.component';
import { GlobalmasternavigationComponent } from './pages/GlobalMasters/globalmasternavigation/globalmasternavigation.component';
import { PaycodesComponent } from './pages/GlobalMasters/paycodes/paycodes.component';
import { ShgslabdetailComponent } from './pages/GlobalMasters/shgslabdetail/shgslabdetail.component';
import { AllowReProcessComponent } from './pages/Process/allow-re-process/allow-re-process.component';
import { AttendancebatchidUpdateComponent } from './pages/Process/attendancebatchid-update/attendancebatchid-update.component';
import { FFprocessComponent } from './pages/Process/ffprocess/ffprocess.component';
import { FNFRevokeComponent } from './pages/Process/fnfrevoke/fnfrevoke.component';
import { ITAdjustmentComponent } from './pages/Process/itadjustment/itadjustment.component';
import { LockpayperiodComponent } from './pages/Process/lockpayperiod/lockpayperiod.component';
import { LOPAdjustmentsComponent } from './pages/Process/lopadjustments/lopadjustments.component';
import { OneTimeReplacementComponent } from './pages/Process/one-time-replacement/one-time-replacement.component';
import { OtherincomeComponent } from './pages/Process/otherincome/otherincome.component';
import { PayregisteruploadComponent } from './pages/Process/payregisterupload/payregisterupload.component';
import { PaytransactionComponent } from './pages/Process/paytransaction/paytransaction.component';
import { ReimbrusmentcalenderComponent } from './pages/Process/reimbrusmentcalender/reimbrusmentcalender.component';
import { PayProcessComponent } from './pages/Process/pay-process/pay-process.component';
import { CustomernavigationComponent } from './pages/customers/customernavigation/customernavigation.component';
import { DepartmentComponent } from './pages/customers/department/department.component';
import { DesignationComponent } from './pages/customers/designation/designation.component';
import { BandDetailsComponent } from './pages/customers/band-details/band-details.component';
import { CostCenterMappingComponent } from './pages/customers/cost-center-mapping/cost-center-mapping.component';
import { PEclientmappingComponent } from './pages/Masters/peclientmapping/peclientmapping.component';
import { BillingpayfrequencyComponent } from './pages/Invoice/billingpayfrequency/billingpayfrequency.component';
import { PayfrequencyComponent } from './pages/customers/payfrequency/payfrequency.component';
import { DynamicuploadComponent } from './pages/tools/dynamicupload/dynamicupload.component';
import { ToolsnavigationComponent } from './pages/tools/toolsnavigation/toolsnavigation.component';
import { CompanypaycodemappingComponent } from './pages/customers/companypaycodemapping/companypaycodemapping.component';
import { ProvisionalinvoiceComponent } from './pages/Invoice/provisionalinvoice/provisionalinvoice.component';
import { POInitiateComponent } from './pages/Invoice/poinitiate/poinitiate.component';
import { SDLslabDetailComponent } from './pages/GlobalMasters/sdlslab-detail/sdlslab-detail.component';
import { CPFslabDetailsComponent } from './pages/GlobalMasters/cpfslab-details/cpfslab-details.component';
import { GSTComponent } from './pages/GlobalMasters/gst/gst.component';
import { CorporatebankComponent } from './pages/customers/corporatebank/corporatebank.component';
import { ITcalenderComponent } from './pages/customers/itcalender/itcalender.component';
import { InvoiceReportComponent } from './pages/Reports/invoice-report/invoice-report.component';
import { NetpayreportComponent } from './pages/Reports/netpayreport/netpayreport.component';
import { ClientaddressComponent } from './pages/customers/clientaddress/clientaddress.component';
import { EntityMasterComponent } from './pages/GlobalMasters/entity-master/entity-master.component';
import { InvoiceLegalEntityComponent } from './pages/GlobalMasters/invoice-legal-entity/invoice-legal-entity.component';
import { VendorComponent } from './pages/GlobalMasters/vendor/vendor.component';
import { InvoiceCultureComponent } from './pages/Invoice/invoice-culture/invoice-culture.component';
import { ServiceChargeComponent } from './pages/customers/ServiceChargeMaster/service-charge/service-charge.component';
import { SiteMasterComponent } from './pages/GlobalMasters/site-master/site-master.component';
import { EmployeeComponent } from './pages/customers/employee/employee.component';
import { ClientbillablereportsdatewiseComponent } from './pages/Invoice/clientbillablereportsdatewise/clientbillablereportsdatewise.component';
import { CreditnoteComponent } from './pages/Invoice/creditnote/creditnote.component';
import { CreditnoteapproveComponent } from './pages/Invoice/creditnoteapprove/creditnoteapprove.component';
import { CreditnoteupdateComponent } from './pages/Invoice/creditnoteupdate/creditnoteupdate.component';
import { PayregisterentitywiseComponent } from './pages/Reports/payregisterentitywise/payregisterentitywise.component';
import { BillingubrComponent } from './pages/Reports/billingubr/billingubr.component';
import { CreditnotebalancereportComponent } from './pages/Reports/creditnotebalancereport/creditnotebalancereport.component';
import { PobalancereportComponent } from './pages/Reports/pobalancereport/pobalancereport.component';
import { OtherincomereportComponent } from './pages/Reports/otherincomereport/otherincomereport.component';
import { OtherincomeentitywisereportComponent } from './pages/Reports/otherincomeentitywisereport/otherincomeentitywisereport.component';
import { BankmasterComponent } from './pages/GlobalMasters/bankmaster/bankmaster.component';
import { FormulaComponent } from './pages/GlobalMasters/formula/formula.component';
import { OtherIncomeProcessReportComponent } from './pages/Reports/other-income-process-report/other-income-process-report.component';
import { EmployeeReportProcessComponent } from './pages/Reports/employee-report-process/employee-report-process.component';
import { IncrementReportComponent } from './pages/Reports/increment-report/increment-report.component';
import { AdminnavigationComponent } from './pages/admin/adminnavigation/adminnavigation.component';
import { CompanypermissionComponent } from './pages/admin/companypermission/companypermission.component';
import { CompanyinvoiceformatComponent } from './pages/Invoice/companyinvoiceformat/companyinvoiceformat.component';
import { MaterialcodeComponent } from './pages/GlobalMasters/materialcode/materialcode.component';
import { CancelledinvoicerepositoryComponent } from './pages/customers/cancelledinvoicerepository/cancelledinvoicerepository.component';
import { ESIslabComponent } from './pages/GlobalMasters/esislab/esislab.component';
import { CompanyComponent } from './pages/customers/company/company.component';
import { PayPeriodUnlockComponent } from './pages/admin/pay-period-unlock/pay-period-unlock.component';
import { SalaryReleaseMenuComponent } from './pages/SalaryReleaseNew/salary-release-menu/salary-release-menu.component';
import { HoldRequestComponent } from './pages/SalaryReleaseNew/hold-request/hold-request.component';
import { UpfrontApprovalComponent } from './pages/SalaryReleaseNew/upfront-approval/upfront-approval.component';
import { YearlyPayoutComponent } from './pages/SalaryReleaseNew/yearly-payout/yearly-payout.component';
import { NetpaySummaryComponent } from './pages/SalaryReleaseNew/netpay-summary/netpay-summary.component';
import { CityComponent } from './pages/GlobalMasters/city/city.component';
import { ProfessionaltaxComponent } from './pages/GlobalMasters/professionaltax/professionaltax.component';
import { ProvidentfundComponent } from './pages/GlobalMasters/providentfund/providentfund.component';
import { ComputationruleComponent } from './pages/GlobalMasters/computationrule/computationrule.component';

import { OffercreationComponent } from './pages/gsoffer/offercreation/offercreation.component';
import { LFWSlabComponent } from './pages/GlobalMasters/lfwslab/lfwslab.component';
import { TDSslabComponent } from './pages/GlobalMasters/tdsslab/tdsslab.component';
import { StatesComponent } from './pages/GlobalMasters/state/state.component';
import { ChildreneducationallowanceComponent } from './pages/Taxandsavings/childreneducationallowance/childreneducationallowance.component';
import { NavigationComponent } from './pages/Taxandsavings/navigation/navigation.component';
import { CompanyprovidedbenefitsComponent } from './pages/Taxandsavings/companyprovidedbenefits/companyprovidedbenefits.component';
import { GratuityComponent } from './pages/Taxandsavings/gratuity/gratuity.component';
import { LtacalculationComponent } from './pages/Taxandsavings/ltacalculation/ltacalculation.component';
import { PreviousemploymenttaxdetailsComponent } from './pages/Taxandsavings/previousemploymenttaxdetails/previousemploymenttaxdetails.component';
import { TaxdeclationandactualComponent } from './pages/Taxandsavings/taxdeclationandactual/taxdeclationandactual.component';
import { IncomeLossOnHousePropertyComponent } from './pages/Taxandsavings/income-loss-on-house-property/income-loss-on-house-property.component';
import { IncreamentComponent } from './pages/Promotion/increament/increament.component';
import { PromotionNavigationComponent } from './pages/Promotion/promotion-navigation/promotion-navigation.component';
import { HRAcalculationComponent } from './pages/Taxandsavings/hracalculation/hracalculation.component';

import { BankAccountComponent } from './pages/SalaryReleaseNew/bank-account/bank-account.component';
import { ReportComponent } from './pages/Reports/report/report.component';
import { CPFsummaryComponent } from './pages/Reports/cpfsummary/cpfsummary.component';
import { BankInvoiceNEFTCultureComponent } from './pages/SalaryReleaseNew/bank-invoice-neftculture/bank-invoice-neftculture.component';



export const routes: Routes = [
  {
    path: 'Master', component: MasterComponent, children: [
      { path: 'Home', component: HomeComponent },
      { path: 'Assignment', component: AssignmentComponent },
      { path: 'Severity', component: SeverityComponent },
      { path: 'AllottedLot', component: AllotedLotComponent },
      { path: 'SOP', component: SopnewComponent },
      { path: 'user', component: UserMappingComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'changepassword', component: ChangepasswordComponent },

      {
        path: 'Admin',
        component: AdminnavigationComponent,
        children: [
          { path: 'companypermission', component: CompanypermissionComponent },
          { path: 'payperiodunlock', component: PayPeriodUnlockComponent }
        ]
      },
      {
        path: 'inputmenu',
        component: InputmenuComponent,
        children: [
          { path: 'onboarding', component: OnboardingComponent },
          { path: 'activation', component: ActivationLWDComponent },
          { path: 'unseize', component: UnseizeComponent },
          { path: 'timesheet', component: TimesheetComponent },
          { path: 'invoiceaudit', component: InvoiceauditComponent },
          { path: 'increment', component: IncrementComponent },
          { path: 'onetimeinput', component: OnetimeinputComponent },
          { path: 'finalsubmission', component: FinalsubmissionComponent }
        ]
      },
      {
        path: 'masternavigation',
        component: MasternavigationComponent,
        children: [
          { path: 'peclientmapping', component: PEclientmappingComponent },
          { path: 'holidaymaster', component: HolidaymasterComponent },
          { path: 'invoicerule', component: InvoiceruleComponent },
          { path: 'leavemaster', component: LeavemasterComponent },
          { path: 'leaverule', component: LeaveruleComponent },
          { path: 'lob', component: LeaveOpeningBalanceUploadComponent },
          { path: 'vendoremployee', component: VendorEmployeeComponent }
        ]
      },
      {
        path: 'SalaryRelease',
        component: SalaryReleaseNavigationComponent,
        children: [
          {
            path: 'SalaryReleaseRequest',
            component: SalaryReleaseRequestComponent
          },
          {
            path: 'SalaryHoldRequest',
            component: SalaryHoldRequestComponent
          },
          {
            path: 'HoldReleaseRequest',
            component: HoldReleaseRequestComponent
          },
          {
            path: 'PartialHoldEmployeeSalary',
            component: PartialHoldComponent
          },
          {
            path: 'DBTHoldEmployeeSalary',
            component: DBTholdemployeesalaryComponent
          },
          {
            path: 'UpfrontPortalFinalApproval',
            component: UpfrontPortalFinalApprovalComponent
          },
          {
            path: 'ReleaseHoldEmployeeSalary',
            component: ReleaseHoldEmployeeSalaryComponent
          },
          {
            path: 'NetpaySummarynonvoice',
            component: NetpaysummaryofnonvoiceComponent
          },

          {
            path: 'NewJoineeBankFailure',
            component: NewJoineeExistingEmployeeBankVerifiedReportComponent

          },
          {
            path: 'bonusflushout',
            component: BonusflushComponent

          },
          {
            path: 'UANRelease',
            component: UANReleaseComponent
          },


          { path: 'NetPaySammary', component: NetPaySammaryComponent },
          { path: 'VANPaymentRequest', component: VANPaymentRequestComponent },
          { path: 'HoldEmployeSalary', component: HoldEmployeSalaryComponent },
          { path: 'SalaryAdvanceRequest', component: SalaryAdvanceRequestComponent },
          { path: 'Employeesalaryrelease', component: EmployeesalaryreleaseComponent }


        ]
      },
      {
        path: 'salaryreleasemenu',
        component: SalaryReleaseMenuComponent,
        children: [
          { path: 'BankAccount', component: BankAccountComponent },
          { path: 'Holdrequest', component: HoldRequestComponent },
          { path: 'Netpaysummary', component: NetpaySummaryComponent },
          { path: 'Upfrontapproval', component: UpfrontApprovalComponent },
          { path: 'Yearlypayout', component: YearlyPayoutComponent },
          { path: "NEFTCulture", component: BankInvoiceNEFTCultureComponent }
        ]
      },
      {
        path: 'invoicenavigation',
        component: InvoicenavigationComponent,
        children: [
          { path: 'initiate', component: InitiateComponent },
          { path: 'provisionalinvoice', component: ProvisionalinvoiceComponent },
          { path: 'perfomainvoice', component: PerfomainvoiceComponent },
          { path: 'billabledays', component: BillableDaysComponent },
          { path: 'gstinvoice', component: GstinvoiceComponent },
          { path: 'billingpayfrequency', component: BillingpayfrequencyComponent },
          { path: 'gstinvoice', component: GstinvoiceComponent },
          { path: 'poinitiate', component: POInitiateComponent },
          { path: 'app-invoice-culture', component: InvoiceCultureComponent },
          { path: 'ClientBillableReportDatewise', component: ClientbillablereportsdatewiseComponent },
          { path: 'creditnote', component: CreditnoteComponent },
          { path: 'creditnoteapprove', component: CreditnoteapproveComponent },
          { path: 'creditnoteupdate', component: CreditnoteupdateComponent },
          { path: 'companyinvoiceformat', component: CompanyinvoiceformatComponent },

        ]
      },

      {
        path: 'ponavigation',
        component: PoNavigationComponent,
        children: [
          { path: 'Entry', component: PoCreateComponent },
          { path: 'Employee', component: EmployeePOComponent },
          { path: 'Approve', component: POApproveComponent },

        ]
      },
      {
        path: 'customer', component: CustomernavigationComponent,
        children: [
          { path: "department", component: DepartmentComponent, },
          { path: "designation", component: DesignationComponent, },
          { path: "BandDetails", component: BandDetailsComponent, },
          { path: "CostCenterMapping", component: CostCenterMappingComponent, },
          { path: "payfrequency", component: PayfrequencyComponent },
          { path: "corporatebank", component: CorporatebankComponent },
          { path: "clientaddress", component: ClientaddressComponent },
          { path: "itcalender", component: ITcalenderComponent },
          { path: "companypaycodemapping", component: CompanypaycodemappingComponent },
          { path: "ServiceCharge", component: ServiceChargeComponent },
          { path: "employee", component: EmployeeComponent },
          { path: "cancelledinvoicerepository", component: CancelledinvoicerepositoryComponent },
          { path: "Company", component: CompanyComponent },

        ]
      },
      {
        path: 'tools', component: ToolsnavigationComponent,
        children: [
          { path: "dynamiupload", component: DynamicuploadComponent },
          { path: "corporatebank", component: CorporatebankComponent, },
          { path: "itcalender", component: ITcalenderComponent, },
          { path: 'companypaycodemapping', component: CompanypaycodemappingComponent },
          { path: 'clientaddress', component: ClientaddressComponent },
        ]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        children: [
          { path: 'payregisterunprocessed', component: PayregisterunprocessedComponent },
          { path: 'payslip', component: PayslipComponent },
          { path: 'app-invoice-leave-balance-report', component: InvoiceLeaveBalanceReportComponent },
          { path: 'app-leave-balance-report', component: LeaveBalanceReportComponent },
          { path: 'poactiveinactivereport', component: PoactiveinactivereportComponent },
          { path: 'poemployeereport', component: PoemployeereportComponent },
          { path: 'pomonthwisereport', component: PomonthwisereportComponent },
          { path: 'app-qits-billing-report', component: QITSBillingReportComponent },
          { path: 'app-timesheet-report', component: TimesheetReportComponent },
          { path: 'app-invoice-report', component: InvoiceReportComponent },
          { path: 'app-netpayreport', component: NetpayreportComponent },
          { path: 'payregisterentitywise', component: PayregisterentitywiseComponent },
          { path: 'billingubr', component: BillingubrComponent },
          { path: 'creditnotbalancereport', component: CreditnotebalancereportComponent },
          { path: 'pobalancereport', component: PobalancereportComponent },
          { path: "otherincomereport", component: OtherincomereportComponent },
          { path: 'otherincomereportentitywise', component: OtherincomeentitywisereportComponent },
          { path: 'billingubr', component: BillingubrComponent },
          { path: 'otherIncomeProcessReport', component: OtherIncomeProcessReportComponent },
          { path: 'employeReportProcess', component: EmployeeReportProcessComponent },
          { path: 'IncreamnetReport', component: IncrementReportComponent },
          { path: 'Report', component: ReportComponent },
          { path: 'cpfsummary', component: CPFsummaryComponent }
        ]
      },
      {
        path: 'process',
        component: ProcessComponent,
        children: [
          { path: 'reprocess', component: ReprocessComponent },
          { path: 'attendance', component: AttendanceComponent },
          { path: 'arrearattendance', component: ArrearAttendanceComponent },
          { path: 'LOPAdjustment', component: LOPAdjustmentsComponent },
          { path: 'AttendancebatchIdupdate', component: AttendancebatchidUpdateComponent },
          { path: 'payprocess', component: PayProcessComponent },
          { path: 'ITAdjustment', component: ITAdjustmentComponent },
          { path: 'otherincome', component: OtherincomeComponent },
          { path: 'app-one-time-replacement', component: OneTimeReplacementComponent },
          { path: 'app-fnfrevoke', component: FNFRevokeComponent },
          { path: 'FFprocess', component: FFprocessComponent },
          { path: 'AllowReProcess', component: AllowReProcessComponent },
          { path: "paytransaction", component: PaytransactionComponent, },
          { path: "lockpayperiod", component: LockpayperiodComponent, },
          { path: "payregisterupload", component: PayregisteruploadComponent, },
          { path: "reimbrusmentcalendar", component: ReimbrusmentcalenderComponent, },
        ]
      },
      {
        path: 'salaryadvancemodule', component: SalaryadvancemodulenavigationComponent,
        children: [
          { path: 'salaryadvancerequest', component: SalaryadvacerequestComponent },
          { path: 'salaryadvanceapprove', component: SalaryadvanceapproveComponent },
          { path: 'salaryadvancereport', component: SalaryadvancereportComponent },
        ]
      },
      {
        path: 'taxnavigation', component: NavigationComponent,
        children: [
          { path: 'cea', component: ChildreneducationallowanceComponent },
          { path: 'cpb', component: CompanyprovidedbenefitsComponent },
          { path: 'gratuity', component: GratuityComponent },
          { path: "ltacalculation", component: LtacalculationComponent },
          { path: "previousemploymenttaxdetails", component: PreviousemploymenttaxdetailsComponent },
          { path: "taxanddeclarationactual", component: TaxdeclationandactualComponent },
          { path: 'IncomeLoss', component: IncomeLossOnHousePropertyComponent },
          { path: 'HRAcalculation', component: HRAcalculationComponent },
        ]
      },

      {
        path: 'PromationNavigation', component: PromotionNavigationComponent,
        children: [
          { path: 'Increament', component: IncreamentComponent },


        ]
      },

      {
        path: 'navigationglobal', component: GlobalmasternavigationComponent,
        children: [
          { path: "paycodes", component: PaycodesComponent },
          { path: "shgslabdetail", component: ShgslabdetailComponent },
          { path: "SDLslabDetail", component: SDLslabDetailComponent },
          { path: "CPFslabDetails", component: CPFslabDetailsComponent },
          { path: "app-entity-master", component: EntityMasterComponent },
          { path: "InvoiceLegalEntity", component: InvoiceLegalEntityComponent },
          { path: "Vendor", component: VendorComponent },
          { path: "gst", component: GSTComponent },
          { path: "sitemaster", component: SiteMasterComponent },
          { path: "materialcode", component: MaterialcodeComponent },
          { path: 'BankMaster', component: BankmasterComponent },
          { path: 'Formula', component: FormulaComponent },
          { path: 'city', component: CityComponent },
          { path: 'states', component: StatesComponent },
          { path: 'ESIslab', component: ESIslabComponent },


          { path: "professionaltax", component: ProfessionaltaxComponent },
          { path: "providentfund", component: ProvidentfundComponent },
          { path: "computationrule", component: ComputationruleComponent },
          { path: "providentfund", component: ProvidentfundComponent },

          { path: 'lfw', component: LFWSlabComponent },
          { path: 'tds', component: TDSslabComponent }
        ]
      },
      {
        path: 'onboarding', component: OffercreationComponent,

      },
      //   { path: 'UI', component: SopComponent },
      { path: '**', redirectTo: '/Home', pathMatch: 'full' }

    ],

  },
  // {
  //     path: '',
  //     redirectTo: 'dashboard',
  //     pathMatch: 'full'
  //   },
  // {
  //     path:'',
  //     component:MasterComponent, 
  //     data:{
  //         title:'Master'
  //     }  ,             
  //     children:[
  //         {
  //             loadChildren:()=>import('./pages/routes').then(m=>m.routes)
  //         }
  //     ]
  // },

  { path: 'Login', loadComponent: () => import('./layout/loginmaster/loginmaster.component').then((c) => c.LoginmasterComponent) },
  { path: 'forgot', loadComponent: () => import('./pages/forgot/forgot.component').then((c) => c.ForgotComponent) },
  { path: 'upfrontfinalapprove', loadComponent: () => import('./pages/SalaryReleaseNew/upfront-final-approve/upfront-final-approve.component').then((c) => c.UpfrontFinalApproveComponent) },
  { path: '**', redirectTo: 'Login', pathMatch: 'full' }

  //, canActivate: [AuthGuard]
  // { path: 'Login', component: IndexComponent },
  // { path: 'not-authorized', component: NotAuthorizedComponent },   
  // { path: '', redirectTo: '/Login', pathMatch: 'full' },
];

export const appConfig = {
  providers: [
    provideRouter(routes),
  ],
};