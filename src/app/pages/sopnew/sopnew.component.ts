import { Component, Inject, OnInit, InjectionToken, ChangeDetectorRef, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AssignmentService } from '../../Service/Assignment.service';
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { Console } from 'console';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
import { concat, forkJoin, Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { json } from 'stream/consumers';
import { stringify } from 'querystring';
import { LayoutModule } from '@angular/cdk/layout';
import { CustomersopService } from '../../Service/customersop.service';
import { ICustomersop } from '../../Repository/icustomersop';
import { state } from '@angular/animations';

const auth = InjectionToken<ICustomersop>;

@Component({
  selector: 'app-sopnew',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sopnew.component.html',
  styleUrl: './sopnew.component.css',
  providers: [
    {
      provide: auth,
      useClass: CustomersopService,
    }
  ]
})
export class SopnewComponent {
  selectedFile: File | null = null;
  categorylist: any[] = [];
  sopForm!: FormGroup;
  selectedQuestion: any = null;
  selectedCategory: any = null;
  selectedAnswers: any[] = [];
  selectedQuestionId: string | null = null;
  category: any;
  questions: any;
  markedProgressData: any;
  textboxClicked: string | null = null;
  selectedQuestionIndex = 0;
  selectedCategoryIndex = 0;
  // addedDataMap: { [key: string]: string[][] } = {};
  addedDataMap: {
    [questionId: string]: {
      [groupKey: string]: {
        [optionKey: string]: string[][];
      };
    };
  } = {};
  buttonAddDataMap: { [questionId: string]: { [buttonKey: string]: any[][] } } = {};
  renderKey = 1;
  dropdownSubMap: { [controlName: string]: any[] } = {};
  selectionLog: { title: string, key: string, value: string }[] = [];
  isLoading = true;
  questionAnswerStateMap: { [questionId: string]: any } = {};
  state_id = "11";
  user_id!: string;
  companydetails: any;
  designationdetails: any;
  fbdetails: any;
  userwisecompanydetails: any;
  premiumtrackerdetails: any;
  coveragetypedetails: any;
  gpapolicydetails: any;
  gtlipolicydetails: any;
  deductionpaycodedetails: any;
  billingpaycodedetails: any;
  martialstatusdetails: any;
  selectedMaritalStatus: string = '-Select-';
  employeetypedetails: any;
  newjoineedetails: any;
  clientdetails: any;
  groupbycompanydetails: any;
  insuranceverticaldetails: any;
  designationbyCompanydetails: any;
  policyconditioncycoveragetypedetails: any;
  policynobyconditiondetails: any;
  Firstmonthpayroll: any;
  isEsiApplicable: boolean | null = null;
  isTillServiceTerminate: boolean = false;
  isEsiNonApplicable: boolean | null = null;
  countrylist: any[] = [];
  currencylist: any[] = [];
  citylist: any[] = [];

  selectedCompany1: string = '';
  selectedOptionLabel3: string = '';
  selectedOptionLabel5: string = '';
  selectedOptionLabel6: string = '';
  selectedOptionLabel8: string = '';
  selectedOptionLabel9: string = '';
  selectedOptionLabel10: string = '';
  selectedOptionLabel11_1: string = '';
  selectedOptionLabel11_2: string = '';
  selectedOptionLabel11_3: string = '';
  selectedOptionLabel14: string = '';
  selectedOptionLabel16_1: string = '';
  selectedOptionLabel16_2: string = '';
  selectedOptionLabel16_3: string = '';
  selectedOptionLabel17_1: string = '';
  selectedOptionLabel17_2: string = '';
  selectedOptionLabel18: string = '';
  selectedOptionLabel19: string = '';
  selectedOptionLabel20_1: string = '';
  selectedOptionLabel20_2: string = '';
  selectedOptionLabel21_1: string = '';
  selectedOptionLabel21_2: string = '';
  selectedOptionLabel21_3: string = '';
  selectedOptionLabel21_4: string = '';
  selectedOptionLabel21_5: string = '';
  selectedOptionLabel22_1: string = '';
  selectedOptionLabel22_2: string = '';
  selectedOptionLabel22_3: string = '';
  selectedOptionLabel22_4: string = '';
  selectedOptionLabel22_5: string = '';
  selectedleave22_6: string = '';
  selectedOptionLabel23_1: string = '';
  selectedOptionLabel23_2: string = '';
  selectedOptionLabel23_3: string = '';
  selectedOptionLabel25_1: string = '';
  selectedleave25_2: string = '';
  selectedOptionLabel27_1: string = '';
  selectedOptionLabel27_2: string = '';
  selectedOptionLabel27_3: string = '';
  selectedOptionLabel28_1: string = '';
  selectedOptionLabel28_2: string = '';
  selectedOptionLabel28_3: string = '';
  selectedOptionLabel28_4: string = '';
  selectedOptionLabel28_5: string = '';
  selectedOptionLabel29_1: string = '';
  selectedOptionLabel29_2: string = '';
  selectedOptionLabel30_1: string = '';
  selectedOptionLabel31_1: string = '';
  selectedOptionLabel32_1: string = '';
  selectedOptionLabel36_1: string = '';
  selectedOptionLabel36_2: string = '';
  selectedOptionLabel36_3: string = '';
  selectedOptionLabel36_4: string = '';
  selectedOptionLabel36_5: string = '';
  selectedOptionLabel37: string = '';
  selectedOptionLabel39_1: string = '';
  selectedOptionLabel39_2: string = '';
  selectedOptionLabel39_4: string = '';
  selectedLeaveType24: string = '';
  selectedbillable24: string = '';
  selectedbilltype24: string = '';
  selecteddesignation20: string = '';
  selectedLeave22: string = '';
  selectedCalanderType24: string = '';
  selectedState24: string = '';
  selectedCountry40: string = '';
  selectedState40: string = '';
  selectedCurrency40: string = '';
  selectedCity40: string = '';
  selectedCompany41: string = '';
  selectedCompany26: string = '';
  selectedGroup26: string = '';
  selectedPremium26: string = '';
  selectedDesignation26: string = '';
  selectedCoverage26: string = '';
  selectedGmcCondition26: string = '';
  selectedGmcPolicy26: string = '';
  selectedGpaPolicy26: string = '';
  selectedGtliPolicy26: string = '';
  selectedDeductionPaycode26: string = '';
  selectedBillingPaycode26: string = '';
  selectedEmployeeType26: string = '';
  selectedInsuranceVertical26: string = '';
  selectedNewJoineeArrear26: string = '';
  selectedCompany7: string = '';
  selectedClientName35: string = '';
  selectedModeofpayment35: string = '';
  selectedAgreement35: string = '';
  selectedServiceFee35: string = '';
  selectedSupplementary35: string = '';
  selectedOBApplicable35: string = '';
  selectedPAYROLL35: string = '';
  selectedSERVICE35: string = '';
  selectedCompany42: string = '';
  selectedDesignation42: string = '';
  selectedSkilled42: string = '';
  selectedstate42_1: string = '';
  selectedcentral42_1: string = '';
  selectedstate42_3: string = '';
  selectedcity42_3: string = '';
  selectedstate34: string = '';
  selectedCompany20: string = '';
  employeeId: string = '';
  isSubmitted1: boolean = false;
  isvalidateurl1: boolean = false;
  isSubmitted2: boolean = false;
  isSubmitted3: boolean = false;
  isSubmitted4: boolean = false;
  isSubmitted4_1: boolean = false;
  isSubmitted4_2: boolean = false;
  isSubmitted4_3: boolean = false;
  isSubmitted5: boolean = false;
  isSubmitted6: boolean = false;
  isSubmitted7: boolean = false;
  isSubmitted8: boolean = false;
  isSubmitted9: boolean = false;
  isSubmitted10: boolean = false;
  isSubmitted11: boolean = false;
  isSubmitted11_1: boolean = false;
  isSubmitted12: boolean = false;
  isSubmitted13: boolean = false;
  isSubmitted14: boolean = false;
  isSubmitted15: boolean = false;
  isSubmitted15_1: boolean = false;
  isSubmitted15_2: boolean = false;
  isSubmitted15_3: boolean = false;
  isSubmitted15_4: boolean = false;
  isSubmitted16: boolean = false;
  isSubmitted17: boolean = false;
  isSubmitted18: boolean = false;
  isSubmitted19: boolean = false;
  isSubmitted20: boolean = false;
  isduplicate20: boolean = false;
  isSubmitted21: boolean = false;
  isSubmitted22: boolean = false;
  isSubmitted23: boolean = false;
  isSubmitted24: boolean = false;
  isSubmitted25: boolean = false;
  isSubmitted26: boolean = false;
  isSubmitted27: boolean = false;
  isSubmitted28: boolean = false;
  isSubmitted29: boolean = false;
  isSubmitted30: boolean = false;
  isSubmitted31: boolean = false;
  isSubmitted32: boolean = false;
  isSubmitted33: boolean = false;
  isSubmitted33_1: boolean = false;
  isSubmitted34: boolean = false;
  isSubmitted35: boolean = false;
  isSubmitted36: boolean = false;
  isSubmitted37: boolean = false;
  isSubmitted38: boolean = false;
  isSubmitted39: boolean = false;
  isSubmitted40: boolean = false;
  isSubmitted41: boolean = false;
  isSubmitted42: boolean = false;
  isSubmitted42_1: boolean = false;
  isduplicate42_1: boolean = false;
  isSubmitted42_2: boolean = false;
  isduplicate42_2: boolean = false;
  isSubmitted42_3: boolean = false;
  isduplicate42_3: boolean = false;
  Answer1: any = {
    QuestionId: '',
    Company_Id: '',
    Company_Code: '',
    Company_Name: '',
    SAP_Code: '',
    MyContract_Reference_ID: '',
    Client_Website_link: '',
    First_Month_Payroll: '',
    Client_Onboarding_Month: '',
    CreatedBy: ''
  };
  Answer1Post: any;
  clientdetailsdate: any[] = [];
  Answer2: any;
  Answer2Post: any;
  Answer3 = {
    selection: '',
    bulocation: '',
  };
  Answer3Post: any;
  Answer4: any;
  Answer4Post: any;
  Answer5: any = {
    Attendance_Cycle_From: '',
    Attendance_Cycle_To: '',
    PayRoll_Cycle_From: '',
    PayRoll_Cycle_To: '',
    Collection_Date: '',
    Group_Name_Site_Master: '',
    Pay_Out_Date: '',
    Payment_Proof: ''
  };
  Answer5Post: any;
  Answer6 = {
    selection: ''
  };
  Answer6Post: any;

  Answer7 = {
    CompanyId: '',
    first_month_Payroll: ''
  };

  Answer7Post: any;
  answer7GridData: any[] = [];
  Answer8 = {
    selection: '',
    email: '',
    id: ''
  };
  Answer8Post: any;
  Answer9 = {
    selection: ''
  };
  Answer9Post: any;
  Answer10 = {
    selection: ''
  };
  Answer10Post: any;
  Answer13: any = {
    Attendance_Checking: ''
  };
  Answer12: any = {
    selection: '',
  }
  Answer12Post: any;
  Answer13Post: any;
  Answer14: any = {
    Major_Correction: '',
    Remarks: ''
  };
  Answer14Post: any;
  Answer16: any = {
    Adhoc_Payment: '',
    Date_Of_Disbursal: '',
    Payment_proof: '',
    Paycode: '',
    Input_Type: '',
    Incentive_Calculation: ''
  };
  Answer16Post: any;
  Answer17: any = {
    Inactive_Employee_Load: '',
    FF_Days: '',
    Remarks: '',
    Gratuity: '',
    Date_Submission: ''
  };
  Answer17Post: any;
  Answer18: any = {
    Payslip_Distribution: '',
    Quess_Ess: ''
  };
  Answer18Post: any;
  Answer19: any = {
    Notice_Period_Pay: '',
    Threshold_Day: '',
    Applicable_Wages_BASIC_DA: '',
    Applicable_Wages_GROSS: ''
  };
  Answer19Post: any;
  Answer21: any = {
    Maternity: '',
    Remarks: '',
    Applicable: '',
    Billable: '',
    Salary: '',
    Approval: '',
    Point_Of_Contact: '',
    Email: '',
    Mobile_Number: '',
    Name: ''
  };
  Answer21Post: any;
  Answer23: any = {
    BGV_Applicable: '',
    Eligibility: '',
    Eligibility_By: '',
    Cost: ''
  };
  Answer23Post: any;
  Answer25: any = {
    Billiable: '',
    Calandar_Type: '',
    Accumulated_FlushOut: '',
    Billed_Paid: ''
  };
  Answer25Post: any;
  Answer28: any = {
    Maternity: '',
    Remarks: '',
    Applicable: '',
    Billable: '',
    Salary: '',
    Approval: '',
    Point_Of_Contact: '',
    Email: '',
    Mobile_Number: '',
    Name: ''
  };
  Answer28Post: any;
  Answer29: any = {
    Billable: '',
    Display_Register: ''
  };
  Answer29Post: any;
  Answer30: any = {
    PO_Type: '',
    PF_Calculated_15K_BASED_ON_ATTENDANCE: '',
    PF_Calculated_Wages_Without_Any_Capping: '',
    PF_Calculated_Earnings_Restricting_15K: ''
  };
  Answer30Post: any;
  Answer32: any = {
    Calculation: '',
    ATTRIBUTES: ''
  };
  Answer32Post: any;
  Answer36: any = {
    Absorption_Fee: '',
    Eligibility: '',
    Designation: '',
    TAT: '',
    Commercials: '',
    Flat: '',
    Pay_Code: ''
  };
  Answer36Post: any;
  Answer37: any = {
    Payment: '',
    Payment_Days: ''
  };
  Answer37Post: any;
  Answer38: any = {
    Penalty_Clause: '',
    Payroll_Closure_Date: ''
  };
  Answer38Post: any;
  Answer27: any = {
    Variable_Pay: '',
    Term: '',
    Billing_Type: ''
  };
  Answer27Post: any;
  Answer39: any = {
    PO_Applicable: '',
    PO_Type: '',
    PO_Category: '',
    Currency: '',
    selection: '',
  };
  Answer39Post: any;
  Answer31: {
    Bill_Applicable: string;
    File_Upload: File | null;
    FilePath: string;
  } = {
      Bill_Applicable: '',
      File_Upload: null,
      FilePath: '',
    };
  Answer31Post: any;

  Answer11: any = {
    Std_Working_Hours_Full_Day: '',
    Std_Working_Hours_Half_Day: ''
  };
  Answer11Post: any;
  Answer15: any = {
    First_Input_date: '',
    Revised_Input_date: '',
  };
  Answer15Post: any;
  Answer20: any = {
    Applicable: '',
    Eligible_days: '',
    Applicable_Desc_Client: '',
    CompanyId: '',
    Company_Code: '',
    Designation_Id: '',
    Designation_Name: '',
    Designationwise_Days: '',
    Applicable_Wages_BASIC_DA: '',
    Applicable_Wages_GROSS: ''
  };
  Answer20Post: any;
  answer20GridData: any[] = [];

  Answer22: any = {
    Applicable: '',
    Leave_Management: '',
    Calander_Type: '',
    Leave_Type_Id: '',
    Leave_Type: '',
    No_Of_Leave: '',
    Carry_Forward: '',
    Carry_Forward_Days: '',
    Encashment: '',
    Leave_Encashment: '',

  };
  Answer22Post: any;
  answer22GridData: any[] = [];

  Answer24: any = {
    Calander_Type_Id: '',
    Calander_Type: '',
    State_Id: '',
    State_Name: '',
    Leave_Type_Id: '',
    Leave_Type: '',
    Holiday_Date: '',
    Leave_Description: '',
    Is_Billable_Id: '',
    Is_Billable: '',
    Billable_Type_Id: '',
    Billable_Type: '',
  };
  Answer24Post: any;
  answer24GridData: any[] = [];

  today = new Date();


  Answer26: any = {
    CompanyId: '0',
    GroupDetailId: '0',
    PremiumTrackerId: '0',
    Designation_Id: '0',
    CoverageTypeId: '0',
    PolicyConditionId: '0',
    GMCAmount: '',
    PolicyNumberId: '0',
    GPAAmount: '',
    GPAPolicyNumberId: '0',
    GTLIAmount: '',
    GTLIPolicyNumberId: '0',
    PayCodeId: '0',
    DeductionAmount: '',
    BillingPayCodeId: '0',
    BillingAmount: '',
    EffectiveDate: this.today.toISOString().split('T')[0],
    Remarks: '',
    MaritalStatus: '',
    Is_ESIApplicable: '0',
    Is_ESINonApplicable: '0',
    EmployeeTypeId: '0',
    Insurance_Vertical_ID: '0',
    NewJoineeArrearId: '0',
  }

  Answer26Get: any = {
    Serial_No: '',
    SopId: '',
    CompanyId: '',
    Company_Code: '',
    GroupDetailId: '',
    Group_Name: '',
    PremiumTrackerId: '',
    MappingTypeDesc: '',
    CoverageType: '',
    CoverageTypeId: '',
    PolicyConditionId: '',
    PolicyCondition: '',
    PolicyNumberId: '',
    PolicyNumber: '',
    PayCodeId: '',
    Paycode: '',
    BillingPayCodeId: '',
    DeductionAmount: '',
    BillingAmount: '',
    BillingPaycode: '',
    EffectiveDate: '',
    GMCAmount: '',
    GPAPolicyNumberId: '',
    GPAPolicyNumber: '',
    GPAAmount: '',
    GTLIPolicyNumberId: '',
    GTLIPolicyNumber: '',
    GTLIAmount: '',
    Remarks: '',
    MaritalStatus: '',
    Is_ESIApplicable: '',
    Is_ESINonApplicable: '',
    EmployeeTypeId: '',
    EmployeeTypeValue: '',
    Designation_Id: '',
    Designation_Name: '',
    Insurance_Vertical: '',
    Insurance_Vertical_ID: '',
    NewJoineeArrear: '',
    NewJoineeArrearId: '',
  }

  answer26GridData: any[] = [];

  Answer35: any = {
    Client_ID: '',
    Full_Name_Of_Organization: '',
    Type_Of_Contact: '',
    Credit_Days_Agreed: '',
    Agreement_Start_Date: '',
    Agreement_End_Date: '',
    Agreement_Status: '',
    One_Time_Onboarding_Fees: '',
    Service_Fee_Type: '',
    Service_Fee: '',
    Sourcing_Fee: '',
    Replacement_Clause: '',
    Absorption_Fee: '',
    Upfront_Charges: '',
    InEdge_Charges: '',
    Supplementary_Fee_Type: '',
    Supplementary_Charges: '',
    LatePayment_Fee: '',
    Other_Fees: '',
    OBApplicable: '0',
    PAYROLL_WITH_DECIMAL: '',
    SERVICE_FEE_WITH_DECIMAL: '',
    Busniess_Head_Approval: ''
  }

  answer35GridData: any[] = [];


  statelist: any;

  Answer34: any = {
    State_Id: '',
    State_Name: '',
    Certificate_Type: '',
    Invoice_Category: '',
    Bill_To: '',
    Bill_To_Pin: '',
    Ship_To: '',
    Ship_To_Pin: '',
    GST_Certificate_Path: '',
    GST_No: '',
    PAN_No: '',
    TAN_No: '',
    SAC_Code: '',
    Client_Invoice_State: '',
    Quess_Invoice_State: '',
    SEZ_Certificate_Path: '',
    LUT_No: '',
    LUT_From_Date: '',
    LUT_End_Date: '',
    LUT_Certificate_Path: '',
    SUB_Code: ''
  }

  fileGST: File | null = null;
  fileSEZ: File | null = null;
  fileLUT: File | null = null;

  invoicecategoryoptions: { id: string; name: string }[] = [];

  answer34GridData: any[] = [];

  Answer40: any = {
    VendorCode: '',
    VendorName: '',
    CountryCode: '',
    CountryName: '',
    CityId: '',
    CityName: '',
    RegionId: '',
    RegionName: '',
    GSTIN: '',
    MSMENumber: '',
    PANNumber: '',
    PurchaseOrderCurrency: '',
    VendorStatus: '',
    VendorCreationDate: '',
    VendorAddress: '',
  }

  answer40GridData: any[] = [];

  Answer41: any = {
    CompanyCode: '',
    MasterChecklist: '',
    SpocDetails: '',
    CompletionActivity: ''
  }

  answer41GridData: any[] = [];

  Answer42_1: any = {
    IndustryType: ''
  }

  Answer42_2: any = {
    Category: '',
    StateId: '',
    StateName: '',
    Structure: ''
  }
  answer42_2GridData: any[] = [];

  Answer42_3: any = {
    CompanyId: '',
    Company_Code: '',
    Designationid: '',
    DesignationName: '',
    SkilledCategoryId: '',
    SkilledCategoryName: ''
  }
  answer42_3GridData: any[] = [];

  Answer42_4: any = {
    StateId: '',
    StateName: '',
    CityId: '',
    CityName: '',
    HC: ''
  }
  answer42_4GridData: any[] = [];

  constructor(@Inject(auth) private _authService: ICustomersop, private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private sessionStorageService: SessionStorageService,
    private _encry: EncryptionService, private http: HttpClient) { }

  ngOnInit() {

    const userdetail = this.sessionStorageService.getItem('UserProfile');
    var user = JSON.parse(this._encry.decrypt(userdetail!));
    this.user_id = user.user_Id;
    this.employeeId = String(user.employeeID);

    // this.user_id = String(this.sessionStorageService.getItem('userId'));
    // this.employeeId = String(this.sessionStorageService.getItem('employeeID'));

    this.GetCategory();
    this.GetCompanyDetails(this.user_id);
    this.GetUserwiseCompanyDetails(this.user_id);
    this.GetPremiumTracker26();
    this.GetCoverageType26();
    this.GetGPAPolicy26();
    this.GetGTLIPolicy26();
    this.GetDeductionPaycode26();
    this.GetBillingPaycode26();
    this.GetMartialStatus26();
    this.GetEmployeeType26();
    this.GetNewJoinee26();
    this.GetState();
    this.updateDateRange();
    this.GetClientName26();
    this.GetCountry();
    this.GetCurrency();

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 5000); // Optional delay to simulate loading
  }

  GetCountry() {
    this._authService.GetCountry().subscribe({
      next: res => {
        this.countrylist = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);

      }
    });
  }

  GetCurrency() {
    this._authService.GetCurrency().subscribe({
      next: res => {
        this.currencylist = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  handleWithLoader<T>(observable: Observable<T>, onNext: (res: T) => void): void {
    this.isLoading = true;
    observable.subscribe({
      next: onNext,
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  GetCategory() {
    this._authService.GetCategory().subscribe({
      next: res => {
        this.categorylist = res.Data;
        if (this.categorylist?.length > 0) {
          this.onCategoryClick(this.categorylist[0]);
        }
      },
      error: err => {
        console.error('Error loading questions', err);

      }
    });
  }

  GetCompanyDetails(user_id: any) {
    this._authService.GetCompanyDetails(user_id).subscribe({
      next: res => {
        this.companydetails = res.Data;
        this.GetDesignation(this.companydetails.company_Code);
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetUserwiseCompanyDetails(user_id: any) {
    this._authService.GetUserWiseCompanyCode(user_id).subscribe({
      next: res => {
        this.userwisecompanydetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetGroupbyCompany(company_id: any) {
    this._authService.GetAllGroupByCompany(company_id).subscribe({
      next: res => {
        this.groupbycompanydetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetDesignationbyCompany(company_id: any) {
    this._authService.GetAllDesignationByCompany(company_id).subscribe({
      next: res => {
        this.designationbyCompanydetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetInsuranceVertical(company_id: any) {
    this._authService.GetInsuranceVertical(company_id).subscribe({
      next: res => {
        this.insuranceverticaldetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetPremiumTracker26() {
    this._authService.GetPremiumTracker26().subscribe({
      next: res => {
        this.premiumtrackerdetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetCoverageType26() {
    this._authService.GetCoverageType26().subscribe({
      next: res => {
        this.coveragetypedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetGPAPolicy26() {
    this._authService.GetGPAPolicy26().subscribe({
      next: res => {
        this.gpapolicydetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetGTLIPolicy26() {
    this._authService.GetGTLIPolicy26().subscribe({
      next: res => {
        this.gtlipolicydetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetDeductionPaycode26() {
    this._authService.GetDeductionPaycode26().subscribe({
      next: res => {
        this.deductionpaycodedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetBillingPaycode26() {
    this._authService.GetBillingPaycode26().subscribe({
      next: res => {
        this.billingpaycodedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetMartialStatus26() {
    this._authService.GetMartialStatus26().subscribe({
      next: res => {
        this.martialstatusdetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetEmployeeType26() {
    this._authService.GetEmployeeType26().subscribe({
      next: res => {
        this.employeetypedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetNewJoinee26() {
    this._authService.GetNewJoinee26().subscribe({
      next: res => {
        this.newjoineedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetClientName26() {
    this._authService.GetClientName26().subscribe({
      next: res => {
        this.clientdetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  GetPolicyConditionByCoverageType(coveragetype_id) {
    this._authService.GetPolicyConditionByCoverageType(coveragetype_id).subscribe({
      next: res => {
        this.policyconditioncycoveragetypedetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetPolicyNoByCondition(coveragetype_id, policy_condition_id) {

    this._authService.GetPolicyNoByCondition(coveragetype_id, policy_condition_id).subscribe({
      next: res => {
        this.policynobyconditiondetails = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  GetState() {

    this._authService.GetState().subscribe({
      next: res => {

        this.statelist = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetDesignation(company_Code: any) {
    this._authService.GetDesignation(company_Code).subscribe({
      next: res => {
        this.designationdetails = res.Data;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  updateDateRange() {

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (this.Answer24.Calander_Type === 'Financial Calendar') {

      // Financial Year: April 1 - March 31
      let startYear = currentYear;
      if (currentMonth < 4) startYear = currentYear - 1;

      const endYear = startYear + 1;

      this.minDate = `${startYear}-04-01`;
      this.maxDate = `${endYear}-03-31`;
    } else if (this.Answer24.Calander_Type === 'Normal Calendar') {

      // Calendar Year: Jan 1 - Dec 31
      this.minDate = `${currentYear}-01-01`;
      this.maxDate = `${currentYear}-12-31`;
    } else {
      this.minDate = '';
      this.maxDate = '';
    }
  }

  // GetSOP_QA() {   

  //   this._authService.GetSOP_QA().subscribe({
  //     next: res => {
  //       this.category = res.Data;


  //     },
  //     error: err => {
  //       console.error('Error loading questions', err);

  //     }
  //   });
  // }

  // GetCompanyDetails(user_id:any){

  //   this._authService.GetCompanyDetails(user_id).subscribe({
  //     next: res => {
  //       this.companydetails = res.Data;


  //     },
  //     error: err => {
  //       console.error('Error loading questions', err);  

  //     }
  //   });
  // }



  loadNextCategory(): void {
    const nextCatIndex = this.selectedCategoryIndex + 1;
    if (nextCatIndex < this.categorylist.length) {
      const nextCategory = this.categorylist[nextCatIndex];
      this.onCategoryClick(nextCategory);
    } else {

    }
  }

  async onCategoryClick(cat: any): Promise<void> {

    try {
      this.isLoading = true;
      this.selectedQuestion = null;
      this.selectedCategory = cat;
      this.selectedCategoryIndex = this.categorylist.findIndex(c => c.categoryId === cat.categoryId);
      await this.GetQuestion(cat.categoryId);

    }
    catch (error) {
      console.error('Error in onCategoryClick:', error);
    } finally {
      this.isLoading = false; // 👉 Stop loader no matter what
    }

  }

  GetQuestion(categoryid: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this._authService.GetQuestion(categoryid).subscribe({
        next: res => {
          this.questions = res.Data.map((q: any) => ({
            ...q,
            answered: false
          }));

          this.GetMarkedQuestion(this.employeeId, this.questions.length)
            .then(() => resolve())
            .catch(err => reject(err));
        },
        error: err => {
          console.error('Error loading questions', err);
          reject(err);
        }
      });
    });
  }

  GetMarkedQuestion(employeeID: any, questionlength: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this._authService.GetmarkedQuestion(this.selectedCompany1 || "0", employeeID).subscribe({
        next: res => {
          this.markedProgressData = res.Data;
          this.markAnsweredQuestionsFromProgress();

          if (questionlength > 0) {
            this.onQuestionClick(this.questions[0]);
          } else {
            console.warn('No questions found in this category.');
          }

          resolve();
        },
        error: err => {
          console.error('Error loading marked questions', err);
          reject(err);
        }
      });
    });
  }
  markAnsweredQuestionsFromProgress() {
    const allMarkedIds = this.markedProgressData
      .flatMap((category: any) => category.marked_Question)
      .map((q: any) => String(q.questionId)); // normalize as string

    this.questions = this.questions.map(q => ({
      ...q,
      answered: allMarkedIds.includes(String(q.questionId))
    }));
  }

  onQuestionClick(question: any): void {

    this.isLoading = true; // Start loader

    try {



      if (question.questionId != 1 && this.selectedCompany1 == '') {
        alert('Please select company code before proceeding.');
        return;
      }


      this.selectedQuestion = question;



      this.selectedQuestionIndex = this.questions.findIndex(q => q.questionId === question.questionId);

      if (this.selectedQuestion.questionId == 1) {
        this.GetSOPAnswer1(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted1 = false;
      }
      if (this.selectedQuestion.questionId == 2) {
        this.GetSOPAnswer2(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted2 = false;
      }
      if (this.selectedQuestion.questionId == 3) {
        this.GetSOPAnswer3(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted3 = false;
      }
      if (this.selectedQuestion.questionId == 6) {
        this.GetSOPAnswer6(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted6 = false;
      }
      if (this.selectedQuestion.questionId == 8) {
        this.GetSOPAnswer8(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted8 = false;
      }
      if (this.selectedQuestion.questionId == 9) {
        this.GetSOPAnswer9(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted9 = false;
      }
      if (this.selectedQuestion.questionId == 10) {
        this.GetSOPAnswer10(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted10 = false;
      }
      if (this.selectedQuestion.questionId == 5) {
        this.GetSOPAnswer5(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted5 = false;
      }
      if (this.selectedQuestion.questionId == 7) {
        this.GetSOPAnswer7(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted7 = false;
      }
      if (this.selectedQuestion.questionId == 12) {
        this.GetSOPAnswer12(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted12 = false;
      }
      if (this.selectedQuestion.questionId == 13) {
        this.GetSOPAnswer13(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted13 = false;
      }
      if (this.selectedQuestion.questionId == 14) {
        this.GetSOPAnswer14(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted14 = false;
      }
      if (this.selectedQuestion.questionId == 16) {
        this.GetSOPAnswer16(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted16 = false;
      }
      if (this.selectedQuestion.questionId == 17) {
        this.GetSOPAnswer17(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted17 = false;
      }
      if (this.selectedQuestion.questionId == 18) {
        this.GetSOPAnswer18(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted18 = false;
      }
      if (this.selectedQuestion.questionId == 19) {
        this.GetSOPAnswer19(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted19 = false;
      }
      if (this.selectedQuestion.questionId == 21) {
        this.GetSOPAnswer21(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted21 = false;
      }
      if (this.selectedQuestion.questionId == 23) {
        this.GetSOPAnswer23(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted23 = false;
      }
      if (this.selectedQuestion.questionId == 25) {
        this.GetSOPAnswer25(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted25 = false;
      }
      if (this.selectedQuestion.questionId == 28) {
        this.GetSOPAnswer28(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted28 = false;
      }
      if (this.selectedQuestion.questionId == 29) {
        this.GetSOPAnswer29(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted29 = false;
      }
      if (this.selectedQuestion.questionId == 30) {
        this.GetSOPAnswer30(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted30 = false;
      }
      if (this.selectedQuestion.questionId == 32) {
        this.GetSOPAnswer32(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted32 = false;
      }
      if (this.selectedQuestion.questionId == 36) {
        this.GetSOPAnswer36(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted36 = false;
      }
      if (this.selectedQuestion.questionId == 37) {
        this.GetSOPAnswer37(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted37 = false;
      }
      if (this.selectedQuestion.questionId == 38) {
        this.GetSOPAnswer38(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted38 = false;
      }
      if (this.selectedQuestion.questionId == 27) {
        this.GetSOPAnswer27(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted27 = false;
      }
      if (this.selectedQuestion.questionId == 39) {
        this.GetSOPAnswer39(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted39 = false;
      }
      if (this.selectedQuestion.questionId == 4) {
        this.GetSOPAnswer4(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted4 = false;
      }
      if (this.selectedQuestion.questionId == 33) {
        this.GetSOPAnswer33(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted33 = false;
      }
      if (this.selectedQuestion.questionId == 31) {
        this.GetSOPAnswer31(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted31 = false;
      }
      if (this.selectedQuestion.questionId == 11) {
        this.GetSOPAnswer11(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted11 = false;
      }
      if (this.selectedQuestion.questionId == 15) {
        this.GetSOPAnswer15(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted15 = false;
      }
      if (this.selectedQuestion.questionId == 20) {
        this.GetSOPAnswer20(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted20 = false;
      }
      if (this.selectedQuestion.questionId == 22) {
        this.GetSOPAnswer22(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted22 = false;
      }
      if (this.selectedQuestion.questionId == 24) {
        this.GetSOPAnswer24(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted24 = false;
      }
      if (this.selectedQuestion.questionId == 26) {
        this.GetSOPAnswer26(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted26 = false;
      }
      if (this.selectedQuestion.questionId == 35) {
        this.GetSOPAnswer35(this.selectedQuestion.questionId, this.employeeId);
        this.isSubmitted35 = false;
      }
      if (this.selectedQuestion.questionId == 34) {
        this.GetSOPAnswer34(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted34 = false;
      }
      if (this.selectedQuestion.questionId == 40) {
        this.GetSOPAnswer40(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.isSubmitted40 = false;
      }
      if (this.selectedQuestion.questionId == 41) {
        this.isSubmitted41 = false;
        this.GetSOPAnswer41_1("4", this.employeeId);
        this.GetSOPAnswer41(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
      }
      if (this.selectedQuestion.questionId == 42) {
        this.isSubmitted42 = false;
        this.GetSOPAnswerCompliance42(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.GetSOPAnswerMinimumwages42(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.GetSOPAnswerDesignation42(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
        this.GetSOPAnswerCLRA42(this.selectedQuestion.questionId, this.selectedCompany1, this.employeeId);
      }
    }
    catch (err) {
      console.error('Error in onQuestionClick:', err);
    } finally {
      this.isLoading = false; // Stop loader
    }
  }

  goToNextQuestion(): void {
    // 🔁 Move to next question or category
    const nextIndex = this.selectedQuestionIndex + 1;
    if (nextIndex < this.questions.length) {
      this.onQuestionClick(this.questions[nextIndex]);
    } else {
      this.loadNextCategory();
    }
  }



  GetSOPAnswer1(Questionid, Createdby) {
    this._authService.GetSOPAnswer1(Questionid, Createdby).subscribe({
      next: res => {
        this.clientdetailsdate = res.Data || [];

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer2(Questionid, Createdby) {
    this._authService.GetSOPAnswer2(Questionid, Createdby).subscribe({
      next: res => {
        this.Answer2 = res.Data;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer6(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer6(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer6.selection = res.Data.fF_Payment_Mode;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer8(Questionid, ComapnayId, Createdby) {
    this._authService.GetSOPAnswer8(Questionid, ComapnayId, Createdby).subscribe({
      next: res => {
        this.Answer8.selection = res.Data.sim_Card_Management_tracker;
        this.Answer8.email = res.Data.email_Id_Management_tracker;
        this.Answer8.id = res.Data.id_Card_Management_tracker;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer9(Questionid, Createdby) {
    this._authService.GetSOPAnswer9(Questionid, Createdby).subscribe({
      next: res => {
        this.Answer9.selection = res.Data.email_ID_Managemnet_Tracker;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer10(Questionid, Createdby) {
    this._authService.GetSOPAnswer10(Questionid, Createdby).subscribe({
      next: res => {
        this.Answer10.selection = res.Data.iD_Card_Managemnet_Tracker;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer3(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer3(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer3.selection = res.Data.poC_Change;
        this.Answer3.bulocation = res.Data.bU_Location_Change;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer5(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer5(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res?.Data) {
          this.Answer5 = {
            Attendance_Cycle_From: res.Data.attendance_Cycle_From || '',
            Attendance_Cycle_To: res.Data.attendance_Cycle_To || '',
            Payroll_Cycle_From: res.Data.payRoll_Cycle_From || '',
            Payroll_Cycle_To: res.Data.payRoll_Cycle_To || '',
            Collection_Date: res.Data.collection_Date || '',
            Group_Name_Site_Master: res.Data.group_Name_Site_Master || '',
            Pay_Out_Date: res.Data.payOut_Date || '',
            Payment_Proof: res.Data.payment_Proof || ''
          };

        }
      },
      error: err => {
        console.error('❌ Error loading Q5', err);
      }
    });
  }

  GetSOPAnswer7(Questionid, Createdby) {
    this._authService.GetSOPAnswer7(Questionid, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.answer7GridData = res.Data || [];
        }


      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer12(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer12(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        const savedSelections: string[] = res?.Data?.map((x: any) => x.subId) || [];

        this.options12.forEach(opt => {
          opt.checked = savedSelections.includes(opt.id);
        });
      },
      error: err => console.error('❌ Error loading Q12', err)
    });
  }


  GetSOPAnswer13(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer13(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer13 = res.Data;
        this.Answer13 = {
          Attendance_Checking: res.Data.attendance_Checking || ''
        };

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer14(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer14(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res?.Data) {
          this.Answer14 = {
            Major_Correction: res.Data.major_Correction || '',
            Remarks: res.Data.remarks || ''
          };

        }
      },
      error: err => {
        console.error('❌ Error loading Q5', err);
      }
    });
  }

  GetSOPAnswer16(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer16(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res?.Data) {
          this.Answer16 = {
            Adhoc_Payment: res.Data.adhoc_Payment || '',
            Date_Of_Disbursal: res.Data.date_Of_Disbursal ? res.Data.date_Of_Disbursal.slice(0, 10) : '',
            Payment_proof: res.Data.payment_proof || '',
            Paycode: res.Data.paycode || '',
            Input_Type: res.Data.input_Type || '',
            Incentive_Calculation: res.Data.incentive_Calculation || ''
          };

        }
      },
      error: err => {
        console.error('❌ Error loading Q5', err);
      }
    });
  }

  GetSOPAnswer17(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer17(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res?.Data) {
          this.Answer17 = {
            Inactive_Employee_Load: res.Data.inactive_Employee_Load || '',
            FF_Days: res.Data.fF_Days || '',
            Remarks: res.Data.remarks || '',
            Gratuity: res.Data.gratuity || '',
            Date_Submission: res.Data.date_Submission ? res.Data.date_Submission.slice(0, 10) : ''
          };

        }
      },
      error: err => {
        console.error('❌ Error loading Q5', err);
      }
    });
  }

  GetSOPAnswer18(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer18(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer18.Payslip_Distribution = res.Data.payslip_Distribution;
        this.Answer18.Quess_Ess = res.Data.quess_Ess;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer19(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer19(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer19.Notice_Period_Pay = res.Data.notice_Period_Pay;
        this.Answer19.Threshold_Day = res.Data.threshold_Day;
        this.Answer19.Applicable_Wages_BASIC_DA = res.Data.applicable_Wages_BASIC_DA;
        this.Answer19.Applicable_Wages_GROSS = res.Data.applicable_Wages_GROSS;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer21(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer21(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer21.Maternity = res.Data.maternity;
        this.Answer21.Remarks = res.Data.remarks;
        this.Answer21.Applicable = res.Data.applicable;
        this.Answer21.Billable = res.Data.billable;
        this.Answer21.Salary = res.Data.salary;
        this.Answer21.Approval = res.Data.approval;
        this.Answer21.Point_Of_Contact = res.Data.point_Of_Contact;
        this.Answer21.Email = res.Data.email;
        this.Answer21.Mobile_Number = res.Data.mobile_Number;
        this.Answer21.Name = res.Data.name;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  GetSOPAnswer23(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer23(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer23.BGV_Applicable = res.Data.bgV_Applicable;
        this.Answer23.Eligibility = res.Data.eligibility;
        this.Answer23.Eligibility_By = res.Data.eligibility_By;
        this.Answer23.Cost = res.Data.cost;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer25(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer25(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer25.Billiable = res.Data.billiable;
        this.Answer25.Calandar_Type = res.Data.calandar_Type;
        this.Answer25.Accumulated_FlushOut = res.Data.accumulated_FlushOut;
        this.Answer25.Billed_Paid = res.Data.billed_Paid;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  GetSOPAnswer28(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer28(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer28.Compensatory_Off = res.Data.compensatory_Off;
        this.Answer28.Remarks = res.Data.remarks;
        this.Answer28.Applicable = res.Data.applicable;
        this.Answer28.Billable = res.Data.billable;
        this.Answer28.Salary = res.Data.salary;
        this.Answer28.Approval = res.Data.approval;
        this.Answer28.Point_Of_Contact = res.Data.point_Of_Contact;
        this.Answer28.Email = res.Data.email;
        this.Answer28.Mobile_Number = res.Data.mobile_Number;
        this.Answer28.Name = res.Data.name;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer29(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer29(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer29.Billable = res.Data.billable;
        this.Answer29.Display_Register = res.Data.display_Register;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer30(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer30(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer30.PO_Type = res.Data.pO_Type;
        this.Answer30.PF_Calculated_15K_BASED_ON_ATTENDANCE = res.Data.pF_Calculated_15K_BASED_ON_ATTENDANCE;
        this.Answer30.PF_Calculated_Wages_Without_Any_Capping = res.Data.pF_Calculated_Wages_Without_Any_Capping;
        this.Answer30.PF_Calculated_Earnings_Restricting_15K = res.Data.pF_Calculated_Earnings_Restricting_15K;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer32(Questionid, ComapnayId, Createdby) {
    this._authService.GetSOPAnswer32(Questionid, ComapnayId, Createdby).subscribe({
      next: res => {
        this.Answer32.Calculation = res.Data.calculation;
        this.Answer32.ATTRIBUTES = res.Data.attributes;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer36(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer36(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer36.Absorption_Fee = res.Data.absorption_Fee;
        this.Answer36.Eligibility = res.Data.eligibility;
        this.Answer36.TAT = res.Data.tat;
        this.Answer36.Commercials = res.Data.commercials;
        this.Answer36.Flat = res.Data.flat;
        this.Answer36.Pay_Code = res.Data.pay_Code;
        this.Answer36.Designation = res.Data.designation;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer37(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer37(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer37.Payment = res.Data.payment;
        this.Answer37.Payment_Days = res.Data.payment_Days;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer38(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer38(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer38.Penalty_Clause = res.Data.penalty_Clause;
        this.Answer38.Payroll_Closure_Date = res.Data.payroll_Closure_Date;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer27(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer27(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        this.Answer27.Variable_Pay = res.Data.variable_Pay;
        this.Answer27.Term = res.Data.term;
        this.Answer27.Billing_Type = res.Data.billing_Type;

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  GetSOPAnswer39(questionId: string, ComapnayId: string, createdBy: string) {
    this._authService.GetSOPAnswer39(questionId, ComapnayId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        // Bind direct values
        this.Answer39 = {
          PO_Applicable: data.pO_Applicable,
          PO_Type: data.pO_Type,
          PO_Category: data.pO_Category,
          POUtiliziation: data.poUtiliziation,
          Currency: data.currency,
          CreatedBy: data.createdBy
        };

        // Set checkboxes (match by subId or PO_Utiliziation)
        this.options39_3.forEach(opt => {
          opt.checked = data.poUtiliziation?.some(
            (item: any) => item.pO_Utiliziation === opt.label || item.subId === opt.id
          );
        });


      },
      error: err => {
        console.error('❌ Error loading Answer39', err);
      }
    });
  }

  GetSOPAnswer4(questionId: string, CompanyId: string, createdBy: string) {
    this._authService.GetSOPAnswer4(questionId, CompanyId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        this.verticalGridData_4 = data.vertical || [];
        this.departmentGridData_4 = data.department || [];
        this.managerGridData_4 = data.manager || [];
        this.circleGridData_4 = data.circle || [];
      },
      error: err => {
        console.error('❌ Error loading Answer4', err);
      }
    });
  }

  GetSOPAnswer33(questionId: string, CompanyId: string, createdBy: string) {
    this._authService.GetSOPAnswer33(questionId, CompanyId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        this.EmailGridData_33 = data.email || [];
        this.PortalGridData_33 = data.portal || [];


      },
      error: err => {
        console.error('❌ Error loading Answer33', err);
      }
    });
  }

  GetSOPAnswer11(questionId: string, CompanyId: string, createdBy: string) {
    this._authService.GetSOPAnswer11(questionId, CompanyId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        this.Answer11 = {
          Std_Working_Hours_Full_Day: data.std_Working_Hours_Full_Day,
          Std_Working_Hours_Half_Day: data.std_Working_Hours_Half_Day,
          CreatedBy: data.createdBy
        };

        this.EmailGridData_11_3 = data.email || [];
        this.PortalGridData_11_3 = data.portal || [];
        this.BiometricGridData_11_3 = data.biometric || [];
        this.OthersGridData_11_3 = data.others || [];
      },
      error: err => {
        console.error('❌ Error loading Answer4', err);
      }
    });
  }

  GetSOPAnswer15(questionId: string, CompanyId: string, createdBy: string) {
    this._authService.GetSOPAnswer15(questionId, CompanyId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        var formattedDatefirst_Input_date;
        var formattedDaterevised_Input_date;

        if (res.Data.first_Input_date != '') {
          const parts = (res.Data.first_Input_date ? res.Data.first_Input_date.slice(0, 10) : '').split('/');
          formattedDatefirst_Input_date = `${parts[2]}-${parts[0]}-${parts[1]}`; // yyyy-MM-dd
        }
        if (res.Data.revised_Input_date != '') {
          const parts = (res.Data.revised_Input_date ? res.Data.revised_Input_date.slice(0, 10) : '').split('/');
          formattedDaterevised_Input_date = `${parts[2]}-${parts[0]}-${parts[1]}`; // yyyy-MM-dd
        }

        this.Answer15 = {
          First_Input_date: formattedDatefirst_Input_date,
          Revised_Input_date: formattedDaterevised_Input_date,
          CreatedBy: data.createdBy
        };

        this.EmailGridData_15 = data.email || [];
        this.PortalGridData_15 = data.portal || [];
        this.BiometricGridData_15 = data.biometric || [];
        this.OthersGridData_15 = data.others || [];
      },
      error: err => {
        console.error('❌ Error loading Answer4', err);
      }
    });
  }

  GetSOPAnswer20(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer20(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          if (res.Data[0].applicable == "Yes"
            && res.Data[0].applicable_Desc_Client == "Designation Wise") {
            this.answer20GridData = res.Data || [];
          }
          else if (res.Data[0].applicable == "Yes"
            && res.Data[0].applicable_Desc_Client == "As per Client Instruction") {
            this.Answer20 = {
              Applicable: res.Data[0].applicable,
              Eligible_days: res.Data[0].eligible_days,
              Applicable_Desc_Client: res.Data[0].applicable_Desc_Client,
              CreatedBy: res.Data[0].createdBy
            };
          }
          else if (res.Data[0].applicable == "No") {
            this.Answer20.Applicable = res.Data[0].applicable;
          }
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer22(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer22(Questionid, CompanyId, Createdby).subscribe({
      next: res => {

        if (res.Data.length > 0) {
          if (res.Data[0].applicable == "Yes" && res.Data[0].leave_Management == "Quess") {
            this.answer22GridData = res.Data || [];
          }
          else if (res.Data[0].applicable == "No") {
            this.Answer22.Applicable = res.Data[0].applicable;
          }
          else if (res.Data[0].applicable == "Yes" && res.Data[0].leave_Management == "Client") {
            this.Answer22.Applicable = res.Data[0].applicable;
            this.Answer22.Leave_Management = res.Data[0].leave_Management;
          }
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer24(Questionid, Createdby) {
    this._authService.GetSOPAnswer24(Questionid, Createdby).subscribe({
      next: res => {

        if (res.Data.length > 0) {
          this.answer24GridData = res.Data || [];
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer26(Questionid, Createdby) {
    this._authService.GetSOPInsurance26(Questionid, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.answer26GridData = res.Data || [];

        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  onAlphanumericInput(event: any) {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  onNumericInput(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }

  onNumericInput31Attendance(event: any): void {
    // Remove non-numeric characters
    let input = event.target.value.replace(/[^0-9]/g, '');
    let num = Number(input);

    // Clamp to range 1–31
    if (num > 31) num = 31;
    if (num < 1 && input !== '') num = 1;

    this.Answer5.Attendance_Cycle_From = input === '' ? '' : String(num);
    event.target.value = this.Answer5.Attendance_Cycle_From;

    // Now set the To value
    const from = Number(this.Answer5.Attendance_Cycle_From);
    if (from === 1 || from === 31) {
      this.Answer5.Attendance_Cycle_To = '30';
    } else if (from > 1 && from <= 31) {
      this.Answer5.Attendance_Cycle_To = String(from - 1);
    } else {
      this.Answer5.Attendance_Cycle_To = '';
    }
  }

  onNumericInput31Payroll(event: any): void {
    // Remove non-numeric characters
    let input = event.target.value.replace(/[^0-9]/g, '');
    let num = Number(input);

    // Clamp to range 1–31
    if (num > 31) num = 31;
    if (num < 1 && input !== '') num = 1;

    this.Answer5.Payroll_Cycle_From = input === '' ? '' : String(num);
    event.target.value = this.Answer5.Payroll_Cycle_From;

    // Now set the To value
    const from = Number(this.Answer5.Payroll_Cycle_From);
    if (from === 1 || from === 31) {
      this.Answer5.Payroll_Cycle_To = '30';
    } else if (from > 1 && from <= 31) {
      this.Answer5.Payroll_Cycle_To = String(from - 1);
    } else {
      this.Answer5.Payroll_Cycle_To = '';
    }
  }

  onNumericInput31Collection(event: any): void {
    // Remove non-numeric characters
    let input = event.target.value.replace(/[^0-9]/g, '');
    let num = Number(input);

    // Clamp to range 1–31
    if (num > 31) num = 31;
    if (num < 1 && input !== '') num = 1;

    this.Answer5.Collection_Date = input === '' ? '' : String(num);
    event.target.value = this.Answer5.Collection_Date;
  }

  onNumericInput31Payout(event: any): void {
    // Remove non-numeric characters
    let input = event.target.value.replace(/[^0-9]/g, '');
    let num = Number(input);

    // Clamp to range 1–31
    if (num > 31) num = 31;
    if (num < 1 && input !== '') num = 1;

    this.Answer5.Pay_Out_Date = input === '' ? '' : String(num);
    event.target.value = this.Answer5.Pay_Out_Date;

  }

  onDayInput(event: any): void {
    let value = event.target.value;

    // Allow only digits and hyphen
    value = value.replace(/[^0-9\-]/g, '');

    // Only one hyphen allowed
    const parts = value.split('-').slice(0, 2); // ignore more than 2 parts
    let valid = true;

    for (let part of parts) {
      if (part === '') continue; // allow incomplete input like "12-"
      const num = Number(part);
      if (isNaN(num) || num < 1 || num > 31) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      // Remove last character if input becomes invalid
      value = value.slice(0, -1);
    }

    event.target.value = value;
  }

  onvalidateDecimal(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Allow only digits and one dot
    let value = input.value;
    const regex = /^\d*\.?\d*$/;

    if (!regex.test(value)) {
      // Remove invalid characters
      value = value.replace(/[^0-9.]/g, '');

      // Keep only the first dot
      const parts = value.split('.');
      if (parts.length > 2) {
        value = parts[0] + '.' + parts[1];
      }

      input.value = value;

    }
  }

  sanitizeDecimalInput(obj: any, field: string, event: any): void {
    let inputValue = event.target.value;

    // Remove non-numeric and non-dot characters
    let cleaned = inputValue.replace(/[^0-9.]/g, '');

    // Allow only one dot
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // Optional: limit to 2 decimal places
    if (parts.length === 2) {
      cleaned = parts[0] + '.' + parts[1].substring(0, 2);
    }

    // Update model
    obj[field] = cleaned;

    // Update input value directly to reflect cleaned input
    event.target.value = cleaned;
  }




  options3 = [
    { label: 'Frequently' },
    { label: 'No Change' }
  ];

  options4 = [
    { label: 'Vertical', checked: false },
    { label: 'Department', checked: false },
    { label: 'Manager', checked: false },
    { label: 'Circle', checked: false }
  ];
  editVerticalIndex_4: number | null = null;
  // Vertical 
  verticalInput1_4 = '';
  verticalInput2_4 = '';
  verticalInput3_4 = '';
  verticalInput4_4 = '';
  verticalGridData_4: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addVerticalData_4() {
    this.isSubmitted4_1 = true;

    if (this.isValidMobile(this.verticalInput3_4)) {
      if (this.verticalInput1_4 && this.verticalInput2_4 && this.verticalInput3_4 && this.verticalInput4_4) {

        const newEntry = {
          input1: this.verticalInput1_4,
          input2: this.verticalInput2_4,
          input3: this.verticalInput3_4,
          input4: this.verticalInput4_4
        };

        if (this.editVerticalIndex_4 !== null) {
          // Edit existing
          this.verticalGridData_4[this.editVerticalIndex_4] = newEntry;
          this.editVerticalIndex_4 = null;
        } else {
          // Add new
          this.verticalGridData_4.push(newEntry);
        }

        this.verticalInput1_4 = '';
        this.verticalInput2_4 = '';
        this.verticalInput3_4 = '';
        this.verticalInput4_4 = '';
      }
      this.isSubmitted4_1 = false;
    }
    else {
      return;
    }


  }

  editVerticalData_4(index: number) {
    const data = this.verticalGridData_4[index];
    this.verticalInput1_4 = data.input1;
    this.verticalInput2_4 = data.input2;
    this.verticalInput3_4 = data.input3;
    this.verticalInput4_4 = data.input4;
    this.editVerticalIndex_4 = index;
  }

  deleteVerticalData_4(index: number) {
    this.verticalGridData_4.splice(index, 1);
    if (this.editVerticalIndex_4 === index) {
      this.editVerticalIndex_4 = null;
    }
  }

  isVerticalChecked_4(): boolean {
    return this.options4.find(option => option.label === 'Vertical')?.checked || false;
  }

  // Department 
  editDepartmentIndex_4: number | null = null;
  departmentInput1_4 = '';
  departmentInput2_4 = '';
  departmentInput3_4 = '';
  departmentInput4_4 = '';
  departmentGridData_4: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addDepartmentData_4() {

    if (this.departmentInput1_4 && this.departmentInput2_4) {

      const newEntry = {
        input1: this.departmentInput1_4,
        input2: this.departmentInput2_4,
        input3: this.departmentInput3_4,
        input4: this.departmentInput4_4
      };

      if (this.editDepartmentIndex_4 !== null) {
        // Edit existing
        this.departmentGridData_4[this.editDepartmentIndex_4] = newEntry;
        this.editDepartmentIndex_4 = null;
      } else {
        // Add new
        this.departmentGridData_4.push(newEntry);
      }

      this.departmentInput1_4 = '';
      this.departmentInput2_4 = '';
      this.departmentInput3_4 = '';
      this.departmentInput4_4 = '';
    }
  }

  editDepartmentData_4(index: number) {
    const data = this.departmentGridData_4[index];
    this.departmentInput1_4 = data.input1;
    this.departmentInput2_4 = data.input2;
    this.departmentInput3_4 = data.input3;
    this.departmentInput4_4 = data.input4;
    this.editDepartmentIndex_4 = index;
  }

  deleteDepartmentData_4(index: number) {
    this.departmentGridData_4.splice(index, 1);
    if (this.editDepartmentIndex_4 === index) {
      this.editDepartmentIndex_4 = null;
    }
  }


  isDepartmentChecked_4(): boolean {
    return this.options4.find(option => option.label === 'Department')?.checked || false;
  }

  // Manager 
  editManagerIndex_4: number | null = null;
  managerInput1_4 = '';
  managerInput2_4 = '';
  managerInput3_4 = '';
  managerInput4_4 = '';
  managerGridData_4: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addManagerData_4() {

    this.isSubmitted4_2 = true;

    if (this.isValidMobile(this.managerInput3_4) && this.isValidEmail(this.managerInput2_4)) {
      if (this.managerInput1_4 && this.managerInput2_4 && this.managerInput3_4 && this.managerInput4_4) {

        const newEntry = {
          input1: this.managerInput1_4,
          input2: this.managerInput2_4,
          input3: this.managerInput3_4,
          input4: this.managerInput4_4
        };

        if (this.editManagerIndex_4 !== null) {
          // Edit existing
          this.managerGridData_4[this.editManagerIndex_4] = newEntry;
          this.editManagerIndex_4 = null;
        } else {
          // Add new
          this.managerGridData_4.push(newEntry);
        }

        this.managerInput1_4 = '';
        this.managerInput2_4 = '';
        this.managerInput3_4 = '';
        this.managerInput4_4 = '';
      }
      this.isSubmitted4_2 = false;
    }
    else {
      return;
    }

  }

  editManagerData_4(index: number) {
    const data = this.managerGridData_4[index];
    this.managerInput1_4 = data.input1;
    this.managerInput2_4 = data.input2;
    this.managerInput3_4 = data.input3;
    this.managerInput4_4 = data.input4;
    this.editManagerIndex_4 = index;
  }

  deleteManagerData_4(index: number) {
    this.managerGridData_4.splice(index, 1);
    if (this.editManagerIndex_4 === index) {
      this.editManagerIndex_4 = null;
    }
  }

  isManagerChecked_4(): boolean {
    return this.options4.find(option => option.label === 'Manager')?.checked || false;
  }

  // Circle 
  editCircleIndex_4: number | null = null;
  circleInput1_4 = '';
  circleInput2_4 = '';
  circleInput3_4 = '';
  circleInput4_4 = '';
  circleGridData_4: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addCircleData_4() {

    this.isSubmitted4_3 = true;

    if (this.isValidMobile(this.circleInput3_4)) {
      if (this.circleInput1_4 && this.circleInput2_4 && this.circleInput3_4 && this.circleInput4_4) {
        const newEntry = {
          input1: this.circleInput1_4,
          input2: this.circleInput2_4,
          input3: this.circleInput3_4,
          input4: this.circleInput4_4
        };

        if (this.editCircleIndex_4 !== null) {
          // Edit existing
          this.circleGridData_4[this.editCircleIndex_4] = newEntry;
          this.editCircleIndex_4 = null;
        } else {
          // Add new
          this.circleGridData_4.push(newEntry);
        }


        this.circleInput1_4 = '';
        this.circleInput2_4 = '';
        this.circleInput3_4 = '';
        this.circleInput4_4 = '';
      }
      this.isSubmitted4_3 = false;
    }
    else {
      return;
    }


  }

  editCircleData_4(index: number) {
    const data = this.circleGridData_4[index];
    this.circleInput1_4 = data.input1;
    this.circleInput2_4 = data.input2;
    this.circleInput3_4 = data.input3;
    this.circleInput4_4 = data.input4;
    this.editManagerIndex_4 = index;
  }

  deleteCircleData_4(index: number) {
    this.circleGridData_4.splice(index, 1);
    if (this.editCircleIndex_4 === index) {
      this.editCircleIndex_4 = null;
    }
  }

  isCircleChecked_4(): boolean {
    return this.options4.find(option => option.label === 'Circle')?.checked || false;
  }

  options5 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options6 = [
    { label: 'E-Transfer' },
    { label: 'Cheque' },
    { label: 'DD' }
  ];

  options8 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options9 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options10 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options11_1 = [
    { label: '12' },
    { label: '09' },
    { label: '08' }
  ];

  options11_2 = [
    { label: '06 ' },
    { label: '4.5' },
    { label: '04' }
  ];

  options11_3 = [
    { id: '1', label: 'Email', checked: false },
    { id: '2', label: 'Portal', checked: false },
    { id: '3', label: 'Biometric', checked: false },
    { id: '4', label: 'Others', checked: false }
  ];

  // Email 
  editEmailIndex_11_3: number | null = null;
  EmailInput1_11_3 = '';
  EmailInput2_11_3 = '';
  EmailInput3_11_3 = '';
  EmailInput4_11_3 = '';
  EmailGridData_11_3: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addEmailData_11_3() {

    this.isSubmitted11_1 = true;

    if (this.isValidEmail(this.EmailInput1_11_3)) {
      if (this.EmailInput1_11_3 && this.EmailInput2_11_3 && this.EmailInput3_11_3 && this.EmailInput4_11_3) {

        const newEntry = {
          input1: this.EmailInput1_11_3,
          input2: this.EmailInput2_11_3,
          input3: this.EmailInput3_11_3,
          input4: this.EmailInput4_11_3
        };

        if (this.editEmailIndex_11_3 !== null) {
          // Edit existing
          this.EmailGridData_11_3[this.editEmailIndex_11_3] = newEntry;
          this.editEmailIndex_11_3 = null;
        } else {
          // Add new
          this.EmailGridData_11_3.push(newEntry);
        }


        this.EmailInput1_11_3 = '';
        this.EmailInput2_11_3 = '';
        this.EmailInput3_11_3 = '';
        this.EmailInput4_11_3 = '';
      }
      this.isSubmitted11_1 = false;
    }
    else {
      return;
    }


  }

  editEmailData_11_3(index: number) {
    const data = this.EmailGridData_11_3[index];
    this.EmailInput1_11_3 = data.input1;
    this.EmailInput2_11_3 = data.input2;
    this.EmailInput3_11_3 = data.input3;
    this.EmailInput4_11_3 = data.input4;
    this.editEmailIndex_11_3 = index;
  }

  deleteEmailData_11_3(index: number) {
    this.EmailGridData_11_3.splice(index, 1);
    if (this.editEmailIndex_11_3 === index) {
      this.editEmailIndex_11_3 = null;
    }
  }

  isEmailChecked_11_3(): boolean {
    return this.options11_3.find(option => option.label === 'Email')?.checked || false;
  }

  // Portal 
  editPortalIndex_11_3: number | null = null;
  PortalInput1_11_3 = '';
  PortalInput2_11_3 = '';
  PortalInput3_11_3 = '';
  PortalInput4_11_3 = '';
  PortalInput5_11_3 = '';

  PortalGridData_11_3: { input1: string; input2: string; input3: string; input4: string, input5: string }[] = [];

  addPortalData_11_3() {
    if (this.PortalInput1_11_3 && this.PortalInput2_11_3 && this.PortalInput3_11_3
      && this.PortalInput4_11_3 && this.PortalInput5_11_3) {

      const newEntry = {
        input1: this.PortalInput1_11_3,
        input2: this.PortalInput2_11_3,
        input3: this.PortalInput3_11_3,
        input4: this.PortalInput4_11_3,
        input5: this.PortalInput5_11_3,
      };

      if (this.editPortalIndex_11_3 !== null) {
        // Edit existing
        this.PortalGridData_11_3[this.editPortalIndex_11_3] = newEntry;
        this.editPortalIndex_11_3 = null;
      } else {
        // Add new
        this.PortalGridData_11_3.push(newEntry);
      }


      this.PortalInput1_11_3 = '';
      this.PortalInput2_11_3 = '';
      this.PortalInput3_11_3 = '';
      this.PortalInput4_11_3 = '';
      this.PortalInput5_11_3 = '';
    }
  }

  editPortalData_11_3(index: number) {
    const data = this.PortalGridData_11_3[index];
    this.PortalInput1_11_3 = data.input1;
    this.PortalInput2_11_3 = data.input2;
    this.PortalInput3_11_3 = data.input3;
    this.PortalInput4_11_3 = data.input4;
    this.PortalInput5_11_3 = data.input5;
    this.editPortalIndex_11_3 = index;
  }

  deletePortalData_11_3(index: number) {
    this.PortalGridData_11_3.splice(index, 1);
    if (this.editPortalIndex_11_3 === index) {
      this.editPortalIndex_11_3 = null;
    }
  }

  isPortalChecked_11_3(): boolean {
    return this.options11_3.find(option => option.label === 'Portal')?.checked || false;
  }

  // Biometric 
  editBiometricIndex_11_3: number | null = null;
  BiometricInput1_11_3 = '';
  BiometricInput2_11_3 = '';
  BiometricInput3_11_3 = '';
  BiometricInput4_11_3 = '';
  BiometricGridData_11_3: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addBiometricData_11_3() {
    if (this.BiometricInput1_11_3 && this.BiometricInput2_11_3 && this.BiometricInput4_11_3) {

      const newEntry = {
        input1: this.BiometricInput1_11_3,
        input2: this.BiometricInput2_11_3,
        input3: this.BiometricInput3_11_3,
        input4: this.BiometricInput4_11_3
      };

      if (this.editBiometricIndex_11_3 !== null) {
        // Edit existing
        this.BiometricGridData_11_3[this.editBiometricIndex_11_3] = newEntry;
        this.editBiometricIndex_11_3 = null;
      } else {
        // Add new
        this.BiometricGridData_11_3.push(newEntry);
      }


      this.BiometricInput1_11_3 = '';
      this.BiometricInput2_11_3 = '';
      this.BiometricInput3_11_3 = '';
      this.BiometricInput4_11_3 = '';

    }
  }

  editBiometricData_11_3(index: number) {
    const data = this.BiometricGridData_11_3[index];
    this.BiometricInput1_11_3 = data.input1;
    this.BiometricInput2_11_3 = data.input2;
    this.BiometricInput3_11_3 = data.input3;
    this.BiometricInput4_11_3 = data.input4;
    this.editBiometricIndex_11_3 = index;
  }

  deleteBiometricData_11_3(index: number) {
    this.BiometricGridData_11_3.splice(index, 1);
    if (this.editBiometricIndex_11_3 === index) {
      this.editBiometricIndex_11_3 = null;
    }
  }

  isBiometricChecked_11_3(): boolean {
    return this.options11_3.find(option => option.label === 'Biometric')?.checked || false;
  }

  // Others 
  editOtherIndex_11_3: number | null = null;
  OthersInput1_11_3 = '';
  OthersInput2_11_3 = '';
  OthersInput3_11_3 = '';
  OthersInput4_11_3 = '';
  OthersGridData_11_3: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addOthersData_11_3() {
    if (this.OthersInput1_11_3 && this.OthersInput2_11_3 && this.OthersInput3_11_3 && this.OthersInput4_11_3) {

      const newEntry = {
        input1: this.OthersInput1_11_3,
        input2: this.OthersInput2_11_3,
        input3: this.OthersInput3_11_3,
        input4: this.OthersInput4_11_3
      };

      if (this.editOtherIndex_11_3 !== null) {
        // Edit existing
        this.OthersGridData_11_3[this.editOtherIndex_11_3] = newEntry;
        this.editOtherIndex_11_3 = null;
      } else {
        // Add new
        this.OthersGridData_11_3.push(newEntry);
      }

      this.OthersGridData_11_3.push({
        input1: this.OthersInput1_11_3,
        input2: this.OthersInput2_11_3,
        input3: this.OthersInput3_11_3,
        input4: this.OthersInput4_11_3
      });
      this.OthersInput1_11_3 = '';
      this.OthersInput2_11_3 = '';
      this.OthersInput3_11_3 = '';
      this.OthersInput4_11_3 = '';
    }
  }


  editOtherData_11_3(index: number) {
    const data = this.OthersGridData_11_3[index];
    this.OthersInput1_11_3 = data.input1;
    this.OthersInput2_11_3 = data.input2;
    this.OthersInput3_11_3 = data.input3;
    this.OthersInput4_11_3 = data.input4;
    this.editOtherIndex_11_3 = index;
  }

  deleteOtherData_11_3(index: number) {
    this.OthersGridData_11_3.splice(index, 1);
    if (this.editOtherIndex_11_3 === index) {
      this.editOtherIndex_11_3 = null;
    }
  }


  isOthersChecked_11_3(): boolean {
    return this.options11_3.find(option => option.label === 'Others')?.checked || false;
  }

  options12 = [
    { id: "1", label: 'ESS', checked: false },
    { id: "2", label: 'Biometric', checked: false },
    { id: "3", label: 'Physical Register', checked: false },
    { id: "4", label: 'Face Recognition', checked: false },
    { id: "5", label: 'Hand Device', checked: false }
  ];

  options14 = [
    { label: 'Yes' },
    { label: 'No' }
  ];


  options15 = [
    { label: 'Email', checked: false },
    { label: 'Portal', checked: false },
    { label: 'Biometric', checked: false },
    { label: 'Others', checked: false }
  ];

  // Email 
  editEmailIndex_15: number | null = null;
  EmailInput1_15 = '';
  EmailInput2_15 = '';
  EmailInput3_15 = '';
  EmailInput4_15 = '';
  EmailGridData_15: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addEmailData_15() {

    this.isSubmitted15_1 = true;

    if (this.isValidMobile(this.EmailInput3_15) && this.isValidEmail(this.EmailInput2_15)) {
      if (this.EmailInput1_15 && this.EmailInput2_15 && this.EmailInput3_15 && this.EmailInput4_15) {

        const newEntry = {
          input1: this.EmailInput1_15,
          input2: this.EmailInput2_15,
          input3: this.EmailInput3_15,
          input4: this.EmailInput4_15
        };

        if (this.editEmailIndex_15 !== null) {
          // Edit existing
          this.EmailGridData_15[this.editEmailIndex_15] = newEntry;
          this.editEmailIndex_15 = null;
        } else {
          // Add new
          this.EmailGridData_15.push(newEntry);
        }


        this.EmailInput1_15 = '';
        this.EmailInput2_15 = '';
        this.EmailInput3_15 = '';
        this.EmailInput4_15 = '';
      }
      this.isSubmitted15_1 = false;
    }
    else {
      return;
    }


  }

  editEmailData_15(index: number) {
    const data = this.EmailGridData_15[index];
    this.EmailInput1_15 = data.input1;
    this.EmailInput2_15 = data.input2;
    this.EmailInput3_15 = data.input3;
    this.EmailInput4_15 = data.input4;
    this.editEmailIndex_15 = index;
  }

  deleteEmailData_15(index: number) {
    this.EmailGridData_15.splice(index, 1);
    if (this.editEmailIndex_15 === index) {
      this.editEmailIndex_15 = null;
    }
  }

  isEmailChecked_15(): boolean {
    return this.options15.find(option => option.label === 'Email')?.checked || false;
  }

  // Portal 
  editPortalIndex_15: number | null = null;
  PortalInput1_15 = '';
  PortalInput2_15 = '';
  PortalInput3_15 = '';
  PortalInput4_15 = '';
  PortalGridData_15: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addPortalData_15() {


    this.isSubmitted15_4 = true;

    if (this.isValidMobile(this.PortalInput3_15) && this.isValidEmail(this.PortalInput2_15)) {
      if (this.PortalInput1_15 && this.PortalInput2_15 && this.PortalInput3_15 && this.PortalInput4_15) {

        const newEntry = {
          input1: this.PortalInput1_15,
          input2: this.PortalInput2_15,
          input3: this.PortalInput3_15,
          input4: this.PortalInput4_15
        };

        if (this.editPortalIndex_15 !== null) {
          // Edit existing
          this.PortalGridData_15[this.editPortalIndex_15] = newEntry;
          this.editPortalIndex_15 = null;
        } else {
          // Add new
          this.PortalGridData_15.push(newEntry);
        }


        this.PortalInput1_15 = '';
        this.PortalInput2_15 = '';
        this.PortalInput3_15 = '';
        this.PortalInput4_15 = '';
      }
      this.isSubmitted15_4 = false;
    }
    else {
      return;
    }



  }

  editPortalData_15(index: number) {
    const data = this.PortalGridData_15[index];
    this.PortalInput1_15 = data.input1;
    this.PortalInput2_15 = data.input2;
    this.PortalInput3_15 = data.input3;
    this.PortalInput4_15 = data.input4;
    this.editPortalIndex_15 = index;
  }

  deletePortalData_15(index: number) {
    this.PortalGridData_15.splice(index, 1);
    if (this.editPortalIndex_15 === index) {
      this.editPortalIndex_15 = null;
    }
  }

  isPortalChecked_15(): boolean {
    return this.options15.find(option => option.label === 'Portal')?.checked || false;
  }

  // Biometric 
  editBiometricIndex_15: number | null = null;
  BiometricInput1_15 = '';
  BiometricInput2_15 = '';
  BiometricInput3_15 = '';
  BiometricInput4_15 = '';
  BiometricGridData_15: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addBiometricData_15() {

    this.isSubmitted15_2 = true;

    if (this.isValidMobile(this.BiometricInput3_15) && this.isValidEmail(this.BiometricInput2_15)) {
      if (this.BiometricInput1_15 && this.BiometricInput2_15 && this.BiometricInput3_15 && this.BiometricInput4_15) {

        const newEntry = {
          input1: this.BiometricInput1_15,
          input2: this.BiometricInput2_15,
          input3: this.BiometricInput3_15,
          input4: this.BiometricInput4_15
        };

        if (this.editBiometricIndex_15 !== null) {
          // Edit existing
          this.BiometricGridData_15[this.editBiometricIndex_15] = newEntry;
          this.editBiometricIndex_15 = null;
        } else {
          // Add new
          this.BiometricGridData_15.push(newEntry);
        }

        this.BiometricInput1_15 = '';
        this.BiometricInput2_15 = '';
        this.BiometricInput3_15 = '';
        this.BiometricInput4_15 = '';
      }
      this.isSubmitted15_2 = false;
    }
    else {
      return;
    }

  }

  editBiometricData_15(index: number) {
    const data = this.BiometricGridData_15[index];
    this.BiometricInput1_15 = data.input1;
    this.BiometricInput2_15 = data.input2;
    this.BiometricInput3_15 = data.input3;
    this.BiometricInput4_15 = data.input4;
    this.editBiometricIndex_15 = index;
  }

  deleteBiometricData_15(index: number) {
    this.BiometricGridData_15.splice(index, 1);
    if (this.editBiometricIndex_15 === index) {
      this.editBiometricIndex_15 = null;
    }
  }

  isBiometricChecked_15(): boolean {
    return this.options15.find(option => option.label === 'Biometric')?.checked || false;
  }

  // Others 
  editOtherIndex_15: number | null = null;
  OthersInput1_15 = '';
  OthersInput2_15 = '';
  OthersInput3_15 = '';
  OthersInput4_15 = '';
  OthersGridData_15: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addOthersData_15() {

    this.isSubmitted15_3 = true;

    if (this.isValidMobile(this.OthersInput3_15) && this.isValidEmail(this.OthersInput2_15)) {
      if (this.OthersInput1_15 && this.OthersInput2_15 && this.OthersInput3_15 && this.OthersInput4_15) {

        const newEntry = {
          input1: this.OthersInput1_15,
          input2: this.OthersInput2_15,
          input3: this.OthersInput3_15,
          input4: this.OthersInput4_15
        };

        if (this.editOtherIndex_15 !== null) {
          // Edit existing
          this.OthersGridData_15[this.editOtherIndex_15] = newEntry;
          this.editOtherIndex_15 = null;
        } else {
          // Add new
          this.OthersGridData_15.push(newEntry);
        }

        this.OthersInput1_15 = '';
        this.OthersInput2_15 = '';
        this.OthersInput3_15 = '';
        this.OthersInput4_15 = '';
      }
      this.isSubmitted15_3 = false;
    }
    else {
      return;
    }


  }

  editOtherData_15(index: number) {
    const data = this.OthersGridData_15[index];
    this.OthersInput1_15 = data.input1;
    this.OthersInput2_15 = data.input2;
    this.OthersInput3_15 = data.input3;
    this.OthersInput4_15 = data.input4;
    this.editOtherIndex_15 = index;
  }

  deleteOtherData_15(index: number) {
    this.OthersGridData_15.splice(index, 1);
    if (this.editOtherIndex_15 === index) {
      this.editOtherIndex_15 = null;
    }
  }


  isOthersChecked_15(): boolean {
    return this.options15.find(option => option.label === 'Others')?.checked || false;
  }

  options16_1 = [
    { label: 'Part of Salary' },
    { label: 'Supplementary Process' },
    { label: 'Both' }
  ];

  options16_2 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options16_3 = [
    { label: 'Customer Input' },
    { label: 'Formula Driven' }
  ];

  options17_1 = [
    { label: 'Separate' },
    { label: 'Along with Salary' },
    { label: 'Both' }
  ];

  options17_2 = [
    { label: 'Seperate' },
    { label: 'Part of Settlement' },
    { label: 'Both' },
  ];

  options18 = [
    { label: 'Client ESS' },
    { label: 'Quess ESS' },
    { label: 'Both' }
  ];

  options18_1 = [
    { label: 'Hamara HR' },
    { label: 'All Sec' }
  ];

  options19 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options20_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options20_2 = [
    { label: 'Designation Wise' },
    { label: 'As Per Client Instruction' }
  ];

  options21_1 = [
    { label: 'Part of Attendance' },
    { label: 'Seperate Email' },
    { label: 'Both' }
  ];

  options21_2 = [
    { label: 'Minimum 6 Months' },
    { label: 'Restricted to 12 Months' }
  ];

  options21_3 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options21_4 = [
    { label: 'Gross Salary' },
    { label: 'Basic Wage' },
    { label: 'No Pay (ESIC)' }
  ];

  options21_5 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options22_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options22_2 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options22_3 = [
    { label: 'Financial Calendar' },
    { label: 'Normal Calendar' },
    { label: 'Monthly' }
  ];

  options22_4 = [
    { label: 'Gross' },
    { label: 'Base' }
  ];

  options22_5 = [
    { label: 'Quess' },
    { label: 'Client' }
  ];

  options22_6 = [
    { id: '1', name: 'Casual Leave' },
    { id: '2', name: 'Personal Leave' },
    { id: '3', name: 'Sick Leave' },
    { id: '4', name: 'Wellness Leave' },
    { id: '5', name: 'Happiness Leave' },
    { id: '6', name: 'Vacation Leave' },
    { id: '7', name: 'Paternity Leave' },
    { id: '8', name: 'Sabbatical Leave' }
  ];

  options23_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options23_2 = [
    { label: 'Designation' },
    { label: 'State' },
    { label: 'District' }
  ];

  options23_3 = [
    { label: 'Client' },
    { label: 'Quess' },
    { label: 'Both' }
  ];

  options25_1 = [
    { label: 'Yearly' },
    { label: 'Quarterly' },
    { label: 'Monthly' }
  ];

  options25_2 = [
    { id: '1', name: 'January' },
    { id: '2', name: 'February' },
    { id: '3', name: 'March' },
    { id: '4', name: 'April' },
    { id: '5', name: 'May' },
    { id: '6', name: 'June' },
    { id: '7', name: 'July' },
    { id: '8', name: 'August' },
    { id: '9', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' }
  ];

  options25_3 = [
    { label: 'Financial Calendar' },
    { label: 'Normal Calendar' }
  ];

  options25_4 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options27_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options27_2 = [
    { id: "1", label: 'Montly' },
    { id: "2", label: 'Quarterly' },
    { id: "3", label: 'Yearly' }
  ];

  options27_3 = [
    { label: 'Part of Bill Rate' },
    { label: 'Separate Billing' }
  ];

  options28_1 = [
    { label: 'Part of Attendance' },
    { label: 'Separate Email' },
    { label: 'Both' }
  ];

  options28_2 = [
    { label: 'Minimum 3 Months' },
    { label: 'Minimum 6 Months' },
    { label: 'Restricted to 12 Months' }
  ];

  options28_3 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options28_4 = [
    { label: 'Gross Salary' },
    { label: 'Basic Wage' },
    { label: 'No Pay (ESIC)' }
  ];

  options28_5 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options29_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options29_2 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options30_1 = [
    { label: 'CAP' },
    { label: 'NONCAP' },
    { label: 'CAPFW' },
    { label: 'BOTH (CAP/NON CAP/CAPFW)' }
  ];

  options31_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options32_1 = [
    { label: 'Quess' },
    { label: 'Client Input' }
  ];

  options33 = [
    { label: 'Email', checked: false },
    { label: 'Portal', checked: false }
  ];

  options24_1 = [
    { id: "1", name: 'Financial Calendar' },
    { id: "2", name: 'Normal Calendar' }
  ];

  minDate: string = '';
  maxDate: string = '';

  options24_2 = [
    { id: "1", name: 'NH' },
    { id: "2", name: 'H' },
    { id: "3", name: 'WO' },
  ];

  options24_3 = [
    { id: "1", name: 'Billable' },
    { id: "2", name: 'Non Billable' }
  ];

  options24_4 = [
    { id: "1", name: 'Comp Off' },
    { id: "2", name: 'OT' }
  ];

  // Vertical 
  editEmailIndex_33: number | null = null;
  EmailInput1_33 = '';
  EmailInput2_33 = '';
  EmailGridData_33: { input1: string; input2: string, input3: string; input4: string }[] = [];

  addEmailData_33() {

    this.isSubmitted33_1 = true;

    if (this.isValidEmail(this.EmailInput1_33)) {
      if (this.EmailInput1_33 && this.EmailInput2_33) {

        const newEntry = {
          input1: this.EmailInput1_33,
          input2: this.EmailInput2_33,
          input3: '',
          input4: ''
        };

        if (this.editEmailIndex_33 !== null) {
          // Edit existing
          this.EmailGridData_33[this.editEmailIndex_33] = newEntry;
          this.editEmailIndex_33 = null;
        } else {
          // Add new
          this.EmailGridData_33.push(newEntry);
        }


        this.EmailInput1_33 = '';
        this.EmailInput2_33 = '';
      }
      this.isSubmitted33_1 = false;
    }
    else {
      return;
    }


  }

  editEmailData_33(index: number) {
    const data = this.EmailGridData_33[index];
    this.EmailInput1_33 = data.input1;
    this.EmailInput2_33 = data.input2;
    this.editEmailIndex_33 = index;
  }

  deleteEmailData_33(index: number) {
    this.EmailGridData_33.splice(index, 1);
    if (this.editEmailIndex_33 === index) {
      this.editEmailIndex_33 = null;
    }
  }


  isEmailChecked_33(): boolean {
    return this.options33.find(option => option.label === 'Email')?.checked || false;
  }

  // Department 
  editPortalIndex_33: number | null = null;
  PortalInput1_33 = '';
  PortalInput2_33 = '';
  PortalGridData_33: { input1: string; input2: string; input3: string; input4: string }[] = [];

  addPortalData_33() {
    if (this.PortalInput1_33 && this.PortalInput2_33) {

      const newEntry = {
        input1: this.PortalInput1_33,
        input2: this.PortalInput2_33,
        input3: '',
        input4: ''
      };

      if (this.editPortalIndex_33 !== null) {
        // Edit existing
        this.PortalGridData_33[this.editPortalIndex_33] = newEntry;
        this.editPortalIndex_33 = null;
      } else {
        // Add new
        this.PortalGridData_33.push(newEntry);
      }


      this.PortalInput1_33 = '';
      this.PortalInput2_33 = '';
    }
  }

  editPortalData_33(index: number) {
    const data = this.PortalGridData_33[index];
    this.PortalInput1_33 = data.input1;
    this.PortalInput2_33 = data.input2;
    this.editPortalIndex_33 = index;
  }

  deletePortalData_33(index: number) {
    this.PortalGridData_33.splice(index, 1);
    if (this.editPortalIndex_33 === index) {
      this.editPortalIndex_33 = null;
    }
  }


  isPortalChecked_33(): boolean {
    return this.options33.find(option => option.label === 'Portal')?.checked || false;
  }


  options36_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options36_2 = [
    { label: 'Sourced by Quess' },
    { label: 'TAT Completion' },
    { label: 'Based on the Designation' }
  ];

  options36_3 = [
    { label: '3 Months' },
    { label: '6 Months' },
    { label: 'Both' },
  ];

  options36_4 = [
    { label: 'Flat' },
    { label: 'Percentage' }
  ];

  options36_5 = [
    { label: 'Gross' },
    { label: 'CTC' }
  ];

  options37 = [
    { label: 'Collection' },
    { label: 'Upfront' }
  ];

  options38 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options39_1 = [
    { label: 'Yes' },
    { label: 'No' }
  ];

  options39_2 = [
    { label: 'Hourly' },
    { label: 'Daily' },
    { label: 'Weekly' },
    { label: 'Monthly' },
    { label: 'Others' }
  ];

  options39_3 = [
    { id: '1', label: 'Employeewise', checked: false },
    { id: '2', label: 'Manager', checked: false },
    { id: '3', label: 'Vertical', checked: false },
    { id: '4', label: 'Open', checked: false }
  ];

  options39_4 = [
    { label: 'Salary' },
    { label: 'Onetime' },
    { label: 'Salary+Onetime' },
    { label: 'Vendor' }
  ];

  options35_1 = [
    { id: '0', name: '-Select-' },
    { id: 'Collect and Pay', name: 'Collect and Pay' },
    { id: 'Upfront', name: 'Upfront' }
  ];

  options35_2 = [
    { id: '0', name: '-Select-' },
    { id: 'LOI Available', name: 'LOI Available' },
    { id: 'Client Signed Agreement Available', name: 'Client Signed Agreement Available' },
    { id: 'Quess Signed Agreement Available', name: 'Quess Signed Agreement Available' },
    { id: 'Both Party Signed Agreement Available', name: 'Both Party Signed Agreement Available' },
    { id: 'BH Approval', name: 'BH Approval' }
  ];

  options35_3 = [
    { id: '0', name: 'No' },
    { id: '1', name: 'Yes' }
  ];

  options35_4 = [
    { id: '0', name: '-Select-' },
    { id: 'Fixed', name: 'Fixed' },
    { id: 'Percentage', name: 'Percentage' }
  ];

  options35_5 = [
    { id: '', name: '-Select-' },
    { id: '0', name: '0' },
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' },
  ];

  options34_1 = [
    { label: 'NON SEZ' },
    { label: 'SEZ' },
  ];

  options34_2 = [
    { id: '0', name: '-Select-' },
    { id: 'B2B', name: 'B2B' },
    { id: 'B2B EXEMPT', name: 'B2B EXEMPT' },
    { id: 'B2C', name: 'B2C' },
    { id: 'EXPORT', name: 'EXPORT' }
  ];

  options34_3 = [
    { id: '0', name: '-Select-' },
    { id: 'SEZ WITHOUT GST', name: 'SEZ WITHOUT GST' },
    { id: 'SEZ WITH GST', name: 'SEZ WITH GST' }
  ];


  options40 = [
    { label: 'Active' },
    { label: 'In Active' },
  ];

  options41_1 = [
    { id: "1", label: 'Statutory', checked: false },
    { id: "2", label: 'TimeSheet', checked: false },
    { id: "3", label: 'Invoice', checked: false }
  ];

  options41_2 = [
    { label: 'Client SPOC' },
    { label: 'Internal SPOC' },
  ];

  options42_1 = [
    { label: 'Factory' },
    { label: 'Shops Establishment' },
    { label: 'Mines' },
    { label: 'Manufacturing' },
    { label: 'Hospital' },
    { label: 'Construction' },
  ];

  options42_2 = [
    { label: 'State' },
    { label: 'Central' }
  ];


  options42_3 = [
    { label: 'Gross' },
    { label: 'Basic' }
  ];

  options42_4 = [
    { id: '1', name: 'Skilled' },
    { id: '2', name: 'Semi-Skilled' },
    { id: '3', name: 'Highly Skilled' },
    { id: '4', name: 'Unskilled' }
  ];

  onSubmitQuestion1() {
    this.isSubmitted1 = true;
    if (this.Answer1.Company_Id == '0' || this.Answer1.Company_Id == '' || this.Answer1.Company_Name == ''
      || this.Answer1.SAP_Code == '' || this.Answer1.Client_Website_link == '' ||
      this.Answer1.Client_Onboarding_Month == ''
    ) {

      return;
    }

    if (!this.isValidUrl(this.Answer1.Client_Website_link)) {
      this.isvalidateurl1 = true;
      return;
    }

    const payload = {
      QuestionId: String(1),
      Company_Id: String(this.Answer1.Company_Id),
      Company_Code: String(this.Answer1.Company_Code),
      Company_Name: String(this.Answer1.Company_Name),
      SAP_Code: String(this.Answer1.SAP_Code),
      MyContract_Reference_ID: String(this.Answer1.MyContract_Reference_ID),
      Client_Website_link: String(this.Answer1.Client_Website_link),
      First_Month_Payroll: String(this.Answer1.First_Month_Payroll),
      Client_Onboarding_Month: String(this.Answer1.Client_Onboarding_Month),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer1(payload).subscribe({
      next: res => {
        this.Answer1Post = res.Data;
        this.Answer1.Company_Id = '';
        this.isvalidateurl1 = false;
        this.isSubmitted1 = false;
        this.GetSOPAnswer1(String(1), String(this.employeeId));

        this.Marked_Answerd(1);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });

  }

  isValidUrl(url: string): boolean {
    const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    return urlPattern.test(url);
  }

  Marked_Answerd(questionid: any) {
    const index = this.questions.findIndex(q => String(q.questionId) === String(questionid));
    if (index !== -1) {
      this.questions[index].answered = true; // or set it to questionid if that's your logic
    }
  }

  onSubmitQuestion2() {
    this.isSubmitted2 = true;

    if (this.Answer2.company_Code == '') {
      return;
    }

    if (this.Answer2.company_Name == '') {
      return;
    }

    if (this.Answer2.saP_Code == '') {
      return;
    }

    if (this.Answer2.myContract_Reference_ID == '') {
      return;
    }

    const payload = {
      QuestionId: String(2),
      Company_Code: String(this.Answer2.company_Code),
      Company_Name: String(this.Answer2.company_Name),
      SAP_Code: String(this.Answer2.saP_Code),
      MyContract_Reference_ID: String(this.Answer2.myContract_Reference_ID),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer2(payload).subscribe({
      next: res => {
        this.Answer2Post = res.Data;

        this.Marked_Answerd(2);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  selectOption3(label: string) {
    this.Answer3.selection = label;
  }

  selectbuOption3(label: string) {
    this.Answer3.bulocation = label;
  }

  onSubmitQuestion3() {
    this.isSubmitted3 = true;
    if (this.Answer3.selection == '' || this.Answer3.bulocation == '') {
      return;
    }

    const payload = {
      QuestionId: String(3),
      Company_Id: String(this.selectedCompany1),
      POC_Change: String(this.Answer3.selection),
      BU_Location_Change: String(this.Answer3.bulocation),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer3(payload).subscribe({
      next: res => {
        this.Answer3Post = res.Data;

        this.Marked_Answerd(3);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  selectOption6(label: string) {
    this.Answer6.selection = label;
  }

  onSubmitQuestion6() {
    this.isSubmitted6 = true;

    if (this.Answer6.selection == '') {
      return;
    }

    const payload = {
      QuestionId: String(6),
      Company_Id: String(this.selectedCompany1),
      FF_Payment_Mode: String(this.Answer6.selection),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer6(payload).subscribe({
      next: res => {
        this.Answer6Post = res.Data;

        this.Marked_Answerd(6);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  selectOption8(label: string) {
    this.Answer8.selection = label;
  }

  onSubmitQuestion8() {
    this.isSubmitted8 = true;

    if (this.Answer8.selection == '') {
      return;
    }

    const payload = {
      QuestionId: String(8),
      Company_Id: String(this.selectedCompany1),
      Sim_Card_Management_tracker: String(this.Answer8.selection),
      Email_Id_Management_tracker: String(this.Answer8.email),
      Id_Card_Management_tracker: String(this.Answer8.id),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer8(payload).subscribe({
      next: res => {
        this.Answer8Post = res.Data;

        this.Marked_Answerd(8);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  selectOption9(label: string) {
    this.Answer8.email = label;
  }

  onSubmitQuestion9() {
    this.isSubmitted9 = true;

    if (this.Answer9.selection == '') {
      return;
    }

    const payload = {
      QuestionId: String(9),
      Email_ID_Managemnet_Tracker: String(this.Answer9.selection),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer9(payload).subscribe({
      next: res => {
        this.Answer9Post = res.Data;

        this.Marked_Answerd(9);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  selectOption10(label: string) {
    this.Answer8.id = label;
  }

  onSubmitQuestion10() {
    this.isSubmitted10 = true;

    if (this.Answer10.selection == '') {
      return;
    }

    const payload = {
      QuestionId: String(10),
      ID_Card_Managemnet_Tracker: String(this.Answer10.selection),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer10(payload).subscribe({
      next: res => {
        this.Answer10Post = res.Data;

        this.Marked_Answerd(10);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion5() {
    this.isSubmitted5 = true;

    if (this.Answer5.Attendance_Cycle_From == '' || this.Answer5.Attendance_Cycle_To == '' ||
      this.Answer5.Payroll_Cycle_From == '' || this.Answer5.Payroll_Cycle_To == '' ||
      this.Answer5.Collection_Date == '' ||
      this.Answer5.Group_Name_Site_Master == '' ||
      this.Answer5.Pay_Out_Date == '' ||
      this.Answer5.Payment_Proof == '') {
      return;
    }

    const payload = {
      QuestionId: String(5),
      Company_Id: String(this.selectedCompany1),
      Attendance_Cycle_From: String(this.Answer5.Attendance_Cycle_From),
      Attendance_Cycle_To: String(this.Answer5.Attendance_Cycle_To),
      Payroll_Cycle_From: String(this.Answer5.Payroll_Cycle_From),
      Payroll_Cycle_To: String(this.Answer5.Payroll_Cycle_To),
      Collection_Date: String(this.Answer5.Collection_Date),
      Group_Name_Site_Master: String(this.Answer5.Group_Name_Site_Master),
      PayOut_Date: String(this.Answer5.Pay_Out_Date),
      Payment_Proof: String(this.Answer5.Payment_Proof),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer5(payload).subscribe({
      next: res => {
        this.Answer5Post = res.Data;
        this.GetSOPAnswer5(5, this.selectedCompany1, this.employeeId);
        this.Marked_Answerd(5);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  Addvalues7() {
    this.isSubmitted7 = true;

    console.log('CompanyId:', this.Answer7.CompanyId);
    console.log('first_month_Payroll:', this.Answer7.first_month_Payroll);

    if ((this.Answer7.CompanyId == '' || this.Answer7.CompanyId == '0') ||
      this.Answer7.first_month_Payroll == '') {
      return;
    }

    const payload = {
      QuestionId: String(7),
      CompanyId: String(this.Answer7.CompanyId),
      Company_Code: '',
      First_month_Payroll: String(this.Answer7.first_month_Payroll),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer7(payload).subscribe({
      next: res => {
        this.Answer7Post = res.Data;
        this.GetSOPAnswer7(String(7), String(this.employeeId));

        this.selectedCompany7 = '';
        this.Answer7.CompanyId == '';
        this.Answer7.first_month_Payroll = '';
        this.isSubmitted7 = false;
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion7() {
    this.isSubmitted7 = true;
    if (this.answer7GridData.length == 0) {
      return;
    }
    this.Marked_Answerd(7);
    this.goToNextQuestion();
  }

  toggleCheckbox12(item: any) {
    item.checked = !item.checked;
  }

  onSubmitQuestion12() {
    this.isSubmitted12 = true;


    const selectedOptions = this.options12
      .filter(opt => opt.checked)
      .map(opt => ({
        questionId: "12",
        Company_Id: String(this.selectedCompany1),
        subId: opt.id,
        filling_Attendance: opt.label,
        createdBy: String(this.employeeId)
      }));

    if (selectedOptions.length > 0) {
      this.Answer12.selection = 'yes';
    }

    if (this.Answer12.selection == '') {
      return;
    }

    this._authService.PostSOPAnswer12(selectedOptions).subscribe({
      next: res => {
        this.Answer12Post = res.Data;

        this.Marked_Answerd(12);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q12', err),

    });
  }


  onSubmitQuestion13() {
    this.isSubmitted13 = true;

    if (this.Answer13.Attendance_Checking == '') {
      return;
    }

    const payload = {
      QuestionId: String(13),
      Company_Id: String(this.selectedCompany1),
      Attendance_Checking: String(this.Answer13.Attendance_Checking),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer13(payload).subscribe({
      next: res => {
        this.Answer13Post = res.Data;

        this.Marked_Answerd(13);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion14() {
    this.isSubmitted14 = true;

    if (this.Answer14.Major_Correction == '') {
      return;
    }

    const payload = {
      QuestionId: String(14),
      Company_Id: String(this.selectedCompany1),
      Major_Correction: String(this.Answer14.Major_Correction),
      Remarks: String(this.Answer14.Remarks),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer14(payload).subscribe({
      next: res => {
        this.Answer14Post = res.Data;

        this.Marked_Answerd(14);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }


  onSubmitQuestion16() {
    this.isSubmitted16 = true;
    var payload: any;


    if (this.Answer16.Adhoc_Payment == '' || this.Answer16.Date_Of_Disbursal == '' ||
      this.Answer16.Payment_proof == '' || this.Answer16.Paycode == '' ||
      this.Answer16.Input_Type == '' || this.Answer16.Incentive_Calculation == '') {
      return;
    }

    payload = {
      QuestionId: String(16),
      Company_Id: String(this.selectedCompany1),
      Adhoc_Payment: String(this.Answer16.Adhoc_Payment),
      Date_Of_Disbursal: String(this.Answer16.Date_Of_Disbursal),
      Payment_proof: String(this.Answer16.Payment_proof),
      Paycode: String(this.Answer16.Paycode),
      Input_Type: String(this.Answer16.Input_Type),
      Incentive_Calculation: String(this.Answer16.Incentive_Calculation),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer16(payload).subscribe({
      next: res => {
        this.Answer16Post = res.Data;

        this.Marked_Answerd(16);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion17() {
    this.isSubmitted17 = true;
    var payload: any;


    // if (this.Answer17.Inactive_Employee_Load == "Yes") {

    //   if (this.Answer17.FF_Days == '' || this.Answer17.Gratuity == '' || this.Answer17.Date_Submission == '') {
    //     return;
    //   }

    //   payload = {
    //     QuestionId: String(17),
    //     Company_Id: String(this.selectedCompany1),
    //     Inactive_Employee_Load: String(this.Answer17.Inactive_Employee_Load),
    //     FF_Days: String(this.Answer17.FF_Days),
    //     Remarks: String(this.Answer17.Remarks),
    //     Gratuity: String(this.Answer17.Gratuity),
    //     Date_Submission: String(this.Answer17.Date_Submission),
    //     CreatedBy: String(this.employeeId)
    //   };
    // }
    // else if (this.Answer17.Inactive_Employee_Load == "No") {

    //   if (this.Answer17.Gratuity == '') {
    //     return;
    //   }

    //   payload = {
    //     QuestionId: String(17),
    //     Company_Id: String(this.selectedCompany1),
    //     Inactive_Employee_Load: String(this.Answer17.Inactive_Employee_Load),
    //     FF_Days: "",
    //     Remarks: "",
    //     Gratuity: String(this.Answer17.Gratuity),
    //     Date_Submission: "",
    //     CreatedBy: String(this.employeeId)
    //   };
    // }
    // else {
    if (this.Answer17.Inactive_Employee_Load == '') {
      return;
    }

    payload = {
      QuestionId: String(17),
      Company_Id: String(this.selectedCompany1),
      Inactive_Employee_Load: String(this.Answer17.Inactive_Employee_Load),
      FF_Days: "",
      Remarks: "",
      Gratuity: "",
      Date_Submission: "",
      CreatedBy: String(this.employeeId)
    };
    //}


    this._authService.PostSOPAnswer17(payload).subscribe({
      next: res => {
        this.Answer17Post = res.Data;

        this.Marked_Answerd(17);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion18() {
    this.isSubmitted18 = true;

    if (this.Answer18.Payslip_Distribution == '') {
      return;
    }

    if (this.Answer18.Payslip_Distribution == 'Quess ESS' && this.Answer18.Quess_Ess == '') {
      return;
    }

    const payload = {
      QuestionId: String(18),
      Company_Id: String(this.selectedCompany1),
      Payslip_Distribution: String(this.Answer18.Payslip_Distribution),
      Quess_Ess: String(this.Answer18.Quess_Ess),
      CreatedBy: String(this.employeeId)
    };


    this._authService.PostSOPAnswer18(payload).subscribe({
      next: res => {
        this.Answer18Post = res.Data;

        this.Marked_Answerd(18);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion19() {
    this.isSubmitted19 = true;
    var payload: any;

    if (this.Answer19.Notice_Period_Pay == "Yes") {

      if (this.Answer19.Threshold_Day == '' || this.Answer19.Applicable_Wages_BASIC_DA == '' ||
        this.Answer19.Applicable_Wages_GROSS == ''
      ) {
        return;
      }

      payload = {
        QuestionId: String(19),
        Company_Id: String(this.selectedCompany1),
        Notice_Period_Pay: String(this.Answer19.Notice_Period_Pay),
        Threshold_Day: String(this.Answer19.Threshold_Day),
        Applicable_Wages_BASIC_DA: String(this.Answer19.Applicable_Wages_BASIC_DA),
        Applicable_Wages_GROSS: String(this.Answer19.Applicable_Wages_GROSS),
        CreatedBy: String(this.employeeId)
      };
    }
    else {
      if (this.Answer19.Notice_Period_Pay == '') {
        return;
      }

      payload = {
        QuestionId: String(19),
        Company_Id: String(this.selectedCompany1),
        Notice_Period_Pay: String(this.Answer19.Notice_Period_Pay),
        Threshold_Day: "",
        Applicable_Wages_BASIC_DA: "",
        Applicable_Wages_GROSS: "",
        CreatedBy: String(this.employeeId)
      };
    }


    this._authService.PostSOPAnswer19(payload).subscribe({
      next: res => {
        this.Answer19Post = res.Data;

        this.Marked_Answerd(19);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion21() {
    this.isSubmitted21 = true;
    var payload: any;


    if (this.Answer21.Maternity == '' || this.Answer21.Applicable == '' || this.Answer21.Billable == '') {
      return;
    }


    if (this.Answer21.Maternity == "Both" && this.Answer21.Billable == 'Yes') {
      if (this.Answer21.Salary == '' || this.Answer21.Approval == '') {
        return;
      }

      if (this.Answer21.Approval == 'Yes') {
        if (this.Answer21.Point_Of_Contact == '' ||
          this.Answer21.Email == '' || this.Answer21.Mobile_Number == '' || this.Answer21.Name == '') {
          return;
        }


        if (this.isValidMobile(this.Answer21.Mobile_Number)) { }
        else {
          return;
        }

        if (this.isValidEmail(this.Answer21.Email)) { }
        else {
          return;
        }

        payload = {
          QuestionId: String(21),
          Company_Id: String(this.selectedCompany1),
          Maternity: String(this.Answer21.Maternity),
          Remarks: String(this.Answer21.Remarks ?? ''),
          Applicable: String(this.Answer21.Applicable),
          Billable: String(this.Answer21.Billable),
          Salary: String(this.Answer21.Salary),
          Approval: String(this.Answer21.Approval),
          Point_Of_Contact: String(this.Answer21.Point_Of_Contact),
          Email: String(this.Answer21.Email),
          Mobile_Number: String(this.Answer21.Mobile_Number),
          Name: String(this.Answer21.Name),
          CreatedBy: String(this.employeeId)
        };
      }
      else {
        if (this.Answer21.Salary == '') {
          return;
        }

        payload = {
          QuestionId: String(21),
          Company_Id: String(this.selectedCompany1),
          Maternity: String(this.Answer21.Maternity),
          Remarks: String(this.Answer21.Remarks ?? ''),
          Applicable: String(this.Answer21.Applicable),
          Billable: String(this.Answer21.Billable),
          Salary: String(this.Answer21.Salary),
          Approval: String(this.Answer21.Approval),
          Point_Of_Contact: '',
          Email: '',
          Mobile_Number: '',
          Name: '',
          CreatedBy: String(this.employeeId)
        };
      }

    }

    if (this.Answer21.Maternity == "Both" && this.Answer21.Billable != 'Yes') {
      payload = {
        QuestionId: String(21),
        Company_Id: String(this.selectedCompany1),
        Maternity: String(this.Answer21.Maternity),
        Remarks: String(this.Answer21.Remarks ?? ''),
        Applicable: String(this.Answer21.Applicable),
        Billable: String(this.Answer21.Billable),
        Salary: '',
        Approval: '',
        Point_Of_Contact: '',
        Email: '',
        Mobile_Number: '',
        Name: '',
        CreatedBy: String(this.employeeId)
      };
    }

    if (this.Answer21.Maternity != "Both" && this.Answer21.Billable == 'Yes') {
      if (this.Answer21.salary == '' || this.Answer21.Approval == '') {
        return;
      }

      if (this.Answer21.Approval == 'Yes') {
        if (this.Answer21.Point_Of_Contact == '' ||
          this.Answer21.Email == '' || this.Answer21.Mobile_Number == '' || this.Answer21.Name == '') {
          return;
        }


        if (this.isValidMobile(this.Answer21.Mobile_Number)) { }
        else {
          return;
        }

        if (this.isValidEmail(this.Answer21.Email)) { }
        else {
          return;
        }

        payload = {
          QuestionId: String(21),
          Company_Id: String(this.selectedCompany1),
          Maternity: String(this.Answer21.Maternity),
          Remarks: '',
          Applicable: String(this.Answer21.Applicable),
          Billable: String(this.Answer21.Billable),
          Salary: String(this.Answer21.Salary),
          Approval: String(this.Answer21.Approval),
          Point_Of_Contact: String(this.Answer21.Point_Of_Contact),
          Email: String(this.Answer21.Email),
          Mobile_Number: String(this.Answer21.Mobile_Number),
          Name: String(this.Answer21.Name),
          CreatedBy: String(this.employeeId)
        };
      }
      else {
        payload = {
          QuestionId: String(21),
          Company_Id: String(this.selectedCompany1),
          Maternity: String(this.Answer21.Maternity),
          Remarks: '',
          Applicable: String(this.Answer21.Applicable),
          Billable: String(this.Answer21.Billable),
          Salary: String(this.Answer21.Salary),
          Approval: String(this.Answer21.Approval),
          Point_Of_Contact: '',
          Email: '',
          Mobile_Number: '',
          Name: '',
          CreatedBy: String(this.employeeId)
        };
      }
    }

    if (this.Answer21.Maternity != "Both" && this.Answer21.Billable != 'Yes') {

      payload = {
        QuestionId: String(21),
        Company_Id: String(this.selectedCompany1),
        Maternity: String(this.Answer21.Maternity),
        Remarks: '',
        Applicable: String(this.Answer21.Applicable),
        Billable: String(this.Answer21.Billable),
        Salary: '',
        Approval: '',
        Point_Of_Contact: '',
        Email: '',
        Mobile_Number: '',
        Name: '',
        CreatedBy: String(this.employeeId)
      };
    }

    this._authService.PostSOPAnswer21(payload).subscribe({
      next: res => {
        this.Answer21Post = res.Data;

        this.Marked_Answerd(21);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion23() {
    this.isSubmitted23 = true;
    var payload: any;

    if (this.Answer23.BGV_Applicable == '') {
      return;
    }

    if (this.Answer23.BGV_Applicable == "Yes") {

      if (this.Answer23.Eligibility == '' || this.Answer23.Eligibility_By == '' ||
        this.Answer23.Cost == ''
      ) {
        return;
      }

      payload = {
        QuestionId: String(23),
        Company_Id: String(this.selectedCompany1),
        BGV_Applicable: String(this.Answer23.BGV_Applicable),
        Eligibility: String(this.Answer23.Eligibility),
        Eligibility_By: String(this.Answer23.Eligibility_By),
        Cost: String(this.Answer23.Cost),
        CreatedBy: String(this.employeeId)
      };


    }
    else {
      payload = {
        QuestionId: String(23),
        Company_Id: String(this.selectedCompany1),
        BGV_Applicable: String(this.Answer23.BGV_Applicable),
        Eligibility: "",
        Eligibility_By: "",
        Cost: "",
        CreatedBy: String(this.employeeId)
      };
    }


    this._authService.PostSOPAnswer23(payload).subscribe({
      next: res => {
        this.Answer23Post = res.Data;

        this.Marked_Answerd(23);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion25() {
    this.isSubmitted25 = true;
    var payload: any;

    if (this.Answer25.Billiable == '') {
      return;
    }
    if (this.Answer25.Billiable == "Yearly") {
      if (this.Answer25.Calandar_Type == '' || this.Answer25.Accumulated_FlushOut == '' ||
        this.Answer25.Billed_Paid == ''
      ) {
        return;
      }
      payload = {
        QuestionId: String(25),
        Company_Id: String(this.selectedCompany1),
        Billiable: String(this.Answer25.Billiable),
        Calandar_Type: String(this.Answer25.Calandar_Type),
        Accumulated_FlushOut: String(this.Answer25.Accumulated_FlushOut),
        Billed_Paid: String(this.Answer25.Billed_Paid),
        CreatedBy: String(this.employeeId)
      };
    }
    else {

      payload = {
        QuestionId: String(25),
        Company_Id: String(this.selectedCompany1),
        Billiable: String(this.Answer25.Billiable),
        Calandar_Type: '',
        Accumulated_FlushOut: '',
        Billed_Paid: '',
        CreatedBy: String(this.employeeId)
      };
    }

    this._authService.PostSOPAnswer25(payload).subscribe({
      next: res => {
        this.Answer25Post = res.Data;

        this.Marked_Answerd(25);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }


  onSubmitQuestion28() {
    this.isSubmitted28 = true;
    var payload: any;

    if (this.Answer28.Compensatory_Off == '' || this.Answer28.Applicable == '' ||
      this.Answer28.Billable == '' || this.Answer28.Salary == '' ||
      this.Answer28.Approval == ''
    ) {
      return;
    }

    if (this.Answer28.Compensatory_Off == "Both" && this.Answer28.Approval == "Yes") {
      if (this.Answer28.Point_Of_Contact == '' || this.Answer28.Email == '' ||
        this.Answer28.Mobile_Number == '' || this.Answer28.Name == '') {
        return;
      }

      if (this.Answer28.Mobile_Number != '') {
        if (this.isValidMobile(this.Answer28.Mobile_Number)) { }
        else {
          return;
        }
      }

      if (this.Answer28.Email != '') {
        if (this.isValidMobile(this.Answer28.Email)) { }
        else {
          return;
        }
      }

      payload = {
        QuestionId: String(28),
        Company_Id: String(this.selectedCompany1),
        Compensatory_Off: String(this.Answer28.Compensatory_Off),
        Remarks: String(this.Answer28.Remarks),
        Applicable: String(this.Answer28.Applicable),
        Billable: String(this.Answer28.Billable),
        Salary: String(this.Answer28.Salary),
        Approval: String(this.Answer28.Approval),
        Point_Of_Contact: String(this.Answer28.Point_Of_Contact),
        Email: String(this.Answer28.Email),
        Mobile_Number: String(this.Answer28.Mobile_Number),
        Name: String(this.Answer28.Name),
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer28.Compensatory_Off == "Both" && this.Answer28.Approval != "Yes") {
      payload = {
        QuestionId: String(28),
        Company_Id: String(this.selectedCompany1),
        Compensatory_Off: String(this.Answer28.Compensatory_Off),
        Remarks: String(this.Answer28.Remarks),
        Applicable: String(this.Answer28.Applicable),
        Billable: String(this.Answer28.Billable),
        Salary: String(this.Answer28.Salary),
        Approval: String(this.Answer28.Approval),
        Point_Of_Contact: "",
        Email: "",
        Mobile_Number: "",
        Name: "",
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer28.Compensatory_Off != "Both" && this.Answer28.Approval == "Yes") {
      if (this.Answer28.Point_Of_Contact == '' || this.Answer28.Email == '' ||
        this.Answer28.Mobile_Number == '' || this.Answer28.Name == '') {
        return;
      }



      if (this.Answer28.Mobile_Number != '') {
        if (this.isValidMobile(this.Answer28.Mobile_Number)) { }
        else {
          return;
        }
      }

      if (this.Answer28.Email != '') {
        if (this.isValidEmail(this.Answer28.Email)) { }
        else {
          return;
        }
      }

      payload = {
        QuestionId: String(28),
        Company_Id: String(this.selectedCompany1),
        Compensatory_Off: String(this.Answer28.Compensatory_Off),
        Remarks: "",
        Applicable: String(this.Answer28.Applicable),
        Billable: String(this.Answer28.Billable),
        Salary: String(this.Answer28.Salary),
        Approval: String(this.Answer28.Approval),
        Point_Of_Contact: String(this.Answer28.Point_Of_Contact),
        Email: String(this.Answer28.Email),
        Mobile_Number: String(this.Answer28.Mobile_Number),
        Name: String(this.Answer28.Name),
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer28.Compensatory_Off != "Both" && this.Answer28.Approval != "Yes") {
      payload = {
        QuestionId: String(28),
        Company_Id: String(this.selectedCompany1),
        Compensatory_Off: String(this.Answer28.Compensatory_Off),
        Remarks: "",
        Applicable: String(this.Answer28.Applicable),
        Billable: String(this.Answer28.Billable),
        Salary: String(this.Answer28.Salary),
        Approval: String(this.Answer28.Approval),
        Point_Of_Contact: "",
        Email: "",
        Mobile_Number: "",
        Name: "",
        CreatedBy: String(this.employeeId)
      };
    }

    this._authService.PostSOPAnswer28(payload).subscribe({
      next: res => {
        this.Answer28Post = res.Data;

        this.Marked_Answerd(28);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion29() {
    this.isSubmitted29 = true;
    var payload: any;

    if (this.Answer29.Billable == '') {
      return;
    }

    if (this.Answer29.Billable == "Yes") {
      payload = {
        QuestionId: String(29),
        Company_Id: String(this.selectedCompany1),
        Billable: String(this.Answer29.Billable),
        Display_Register: 'Yes',
        CreatedBy: String(this.employeeId)
      };
    }
    else {

      if (this.Answer29.Display_Register == '') {
        return;
      }

      payload = {
        QuestionId: String(29),
        Company_Id: String(this.selectedCompany1),
        Billable: String(this.Answer29.Billable),
        Display_Register: String(this.Answer29.Display_Register),
        CreatedBy: String(this.employeeId)
      };
    }


    this._authService.PostSOPAnswer29(payload).subscribe({
      next: res => {
        this.Answer29Post = res.Data;
        this.GetSOPAnswer29(29, this.selectedCompany1, this.employeeId);
        this.Marked_Answerd(29);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion30() {
    this.isSubmitted30 = true;
    var payload: any;

    if (this.Answer30.PO_Type == '') {
      return;
    }

    if (this.Answer30.PO_Type == "CAP") {

      payload = {
        QuestionId: String(30),
        Company_Id: String(this.selectedCompany1),
        PO_Type: String(this.Answer30.PO_Type),
        PF_Calculated_15K_BASED_ON_ATTENDANCE: 'PF CALCULATED CAPING TO 15K BASED ON ATTENDANCE PRO-RATE',
        PF_Calculated_Wages_Without_Any_Capping: "",
        PF_Calculated_Earnings_Restricting_15K: "",
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer30.PO_Type == "NONCAP") {

      payload = {
        QuestionId: String(30),
        Company_Id: String(this.selectedCompany1),
        PO_Type: String(this.Answer30.PO_Type),
        PF_Calculated_15K_BASED_ON_ATTENDANCE: "",
        PF_Calculated_Wages_Without_Any_Capping: 'PF CALCULATED WAGES WITHOUT ANY CAPPING',
        PF_Calculated_Earnings_Restricting_15K: "",
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer30.PO_Type == "CAPFW") {

      payload = {
        QuestionId: String(30),
        Company_Id: String(this.selectedCompany1),
        PO_Type: String(this.Answer30.PO_Type),
        PF_Calculated_15K_BASED_ON_ATTENDANCE: "",
        PF_Calculated_Wages_Without_Any_Capping: "",
        PF_Calculated_Earnings_Restricting_15K: 'PF CALCULATED ON EARNINGS BY RESTRICTING 15K',
        CreatedBy: String(this.employeeId)
      };
    }
    else if (this.Answer30.PO_Type == "BOTH (CAP/NON CAP/CAPFW)") {

      payload = {
        QuestionId: String(30),
        Company_Id: String(this.selectedCompany1),
        PO_Type: String(this.Answer30.PO_Type),
        PF_Calculated_15K_BASED_ON_ATTENDANCE: 'PF CALCULATED CAPING TO 15K BASED ON ATTENDANCE PRO-RATE',
        PF_Calculated_Wages_Without_Any_Capping: 'PF CALCULATED WAGES WITHOUT ANY CAPPING',
        PF_Calculated_Earnings_Restricting_15K: 'PF CALCULATED ON EARNINGS BY RESTRICTING 15K',
        CreatedBy: String(this.employeeId)
      };
    }


    this._authService.PostSOPAnswer30(payload).subscribe({
      next: res => {
        this.Answer30Post = res.Data;

        this.Marked_Answerd(30);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion32() {
    this.isSubmitted32 = true;
    var payload: any;

    if (this.Answer32.Calculation == '') {
      return;
    }

    if (this.Answer32.Calculation == "Quess") {
      if (this.Answer32.ATTRIBUTES == '') {
        return;
      }
      payload = {
        QuestionId: String(32),
        Company_Id: String(this.selectedCompany1),
        Calculation: String(this.Answer32.Calculation),
        ATTRIBUTES: String(this.Answer32.ATTRIBUTES),
        CreatedBy: String(this.employeeId)
      };
    }
    else {
      payload = {
        QuestionId: String(32),
        Company_Id: String(this.selectedCompany1),
        Calculation: String(this.Answer32.Calculation),
        ATTRIBUTES: "",
        CreatedBy: String(this.employeeId)
      };
    }



    this._authService.PostSOPAnswer32(payload).subscribe({
      next: res => {
        this.Answer32Post = res.Data;

        this.Marked_Answerd(32);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }


  onSubmitQuestion36() {
    this.isSubmitted36 = true;
    var payload: any;

    if (this.Answer36.Absorption_Fee == '') {
      return;
    }

    if (this.Answer36.Absorption_Fee == "Yes") {

      if (this.Answer36.Eligibility == '') {
        return;
      }
      else {
        if (this.Answer36.Eligibility == "TAT Completion") {
          if (this.Answer36.TAT == '') {
            return;
          }
        }
        if (this.Answer36.Eligibility == "Based on the Designation") {
          if (this.Answer36.Designation == '') {
            return;
          }
        }
      }

      if (this.Answer36.Commercials == "Percentage") {
        if (this.Answer36.Commercials == '' || this.Answer36.Pay_Code == ''
          || this.Answer36.Flat == ''
        ) {
          return;
        }
        payload = {
          QuestionId: String(36),
          Company_Id: String(this.selectedCompany1),
          Absorption_Fee: String(this.Answer36.Absorption_Fee),
          Eligibility: String(this.Answer36.Eligibility),
          Designation: String(this.Answer36.Designation),
          TAT: String(this.Answer36.TAT),
          Commercials: String(this.Answer36.Commercials),
          Flat: String(this.Answer36.Flat),
          Pay_Code: String(this.Answer36.Pay_Code),
          CreatedBy: String(this.employeeId)
        };
      }
      else {
        if (this.Answer36.Commercials == '' || this.Answer36.Flat == '') {
          return;
        }
        payload = {
          QuestionId: String(36),
          Company_Id: String(this.selectedCompany1),
          Absorption_Fee: String(this.Answer36.Absorption_Fee),
          Eligibility: String(this.Answer36.Eligibility),
          Designation: String(this.Answer36.Designation),
          TAT: String(this.Answer36.TAT),
          Commercials: String(this.Answer36.Commercials),
          Flat: String(this.Answer36.Flat),
          Pay_Code: "",
          CreatedBy: String(this.employeeId)
        };
      }
    }
    else {
      payload = {
        QuestionId: String(36),
        Company_Id: String(this.selectedCompany1),
        Absorption_Fee: String(this.Answer36.Absorption_Fee),
        Eligibility: "",
        Designation: "",
        TAT: "",
        Commercials: "",
        Flat: "",
        Pay_Code: "",
        CreatedBy: String(this.employeeId)
      };
    }



    this._authService.PostSOPAnswer36(payload).subscribe({
      next: res => {
        this.Answer36Post = res.Data;

        this.Marked_Answerd(36);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }


  onSubmitQuestion37() {
    this.isSubmitted37 = true;
    var payload: any;
    if (this.Answer37.Payment == '') {
      return;
    }

    if (this.Answer37.Payment == "Upfront") {
      if (this.Answer37.Payment_Days == '') {
        return;
      }

      payload = {
        QuestionId: String(37),
        Company_Id: String(this.selectedCompany1),
        Payment: String(this.Answer37.Payment),
        Payment_Days: String(this.Answer37.Payment_Days),
        CreatedBy: String(this.employeeId)
      };
    }
    else {
      payload = {
        QuestionId: String(37),
        Company_Id: String(this.selectedCompany1),
        Payment: String(this.Answer37.Payment),
        Payment_Days: "",
        CreatedBy: String(this.employeeId)
      };
    }



    this._authService.PostSOPAnswer37(payload).subscribe({
      next: res => {
        this.Answer37Post = res.Data;

        this.Marked_Answerd(37);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }


  onSubmitQuestion38() {
    this.isSubmitted38 = true;
    var payload: any;
    if (this.Answer38.Penalty_Clause == '') {
      return;
    }

    if (this.Answer38.Penalty_Clause == 'Yes') {
      payload = {
        QuestionId: String(38),
        Company_Id: String(this.selectedCompany1),
        Penalty_Clause: String(this.Answer38.Penalty_Clause),
        Payroll_Closure_Date: String(this.Answer38.Payroll_Closure_Date),
        CreatedBy: String(this.employeeId)
      };

    }
    else {
      payload = {
        QuestionId: String(38),
        Company_Id: String(this.selectedCompany1),
        Penalty_Clause: String(this.Answer38.Penalty_Clause),
        Payroll_Closure_Date: '',
        CreatedBy: String(this.employeeId)
      };

    }

    this._authService.PostSOPAnswer38(payload).subscribe({
      next: res => {
        this.Answer38Post = res.Data;

        this.Marked_Answerd(38);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion27() {
    this.isSubmitted27 = true;
    var payload: any;

    if (this.Answer27.Variable_Pay == '') {
      return;
    }

    if (this.Answer27.Variable_Pay == "Yes") {

      if (this.Answer27.Term == '' || this.Answer27.Billing_Type == '') {
        return;
      }


      payload = {
        QuestionId: String(27),
        Company_Id: String(this.selectedCompany1),
        Variable_Pay: String(this.Answer27.Variable_Pay),
        Term: String(this.Answer27.Term),
        Billing_Type: String(this.Answer27.Billing_Type),
        CreatedBy: String(this.employeeId)
      };
    }
    else {
      payload = {
        QuestionId: String(27),
        Company_Id: String(this.selectedCompany1),
        Variable_Pay: String(this.Answer27.Variable_Pay),
        Term: "",
        Billing_Type: "",
        CreatedBy: String(this.employeeId)
      };
    }


    this._authService.PostSOPAnswer27(payload).subscribe({
      next: res => {
        this.Answer27Post = res.Data;

        this.Marked_Answerd(27);
        this.goToNextQuestion();
      },
      error: error => console.error('Error:', error)
    });
  }

  onSubmitQuestion26() {
    this.isSubmitted26 = true;
    if (this.answer26GridData.length == 0) {
      return;
    }

    this.Marked_Answerd(27);
    this.goToNextQuestion();
  }

  toggleCheckbox39_3(item: any) {
    item.checked = !item.checked;
  }

  onSubmitQuestion39() {
    this.isSubmitted39 = true;

    if (this.Answer39.PO_Applicable == '') {
      return;
    }

    const selectedPOUtilizations = this.options39_3
      .filter(opt => opt.checked)
      .map(opt => ({
        SubId: opt.id, // Or use opt.id if available
        PO_Utiliziation: opt.label
      }));
    var answerData;

    if (selectedPOUtilizations.length > 0) {
      this.Answer39.selection = 'Yes';
    }

    if (this.Answer39.selection == '') {
      return;
    }

    if (this.Answer39.PO_Applicable == "Yes") {
      if (this.Answer39.PO_Type == '' || this.Answer39.PO_Category == '' || this.Answer39.Currency == '') {
        return;
      }

      answerData = {
        questionId: "39",
        Company_Id: String(this.selectedCompany1),
        PO_Applicable: String(this.Answer39.PO_Applicable),
        PO_Type: String(this.Answer39.PO_Type),
        PO_Category: String(this.Answer39.PO_Category),
        Currency: String(this.Answer39.Currency),
        CreatedBy: String(this.employeeId),
        POUtiliziation: selectedPOUtilizations // array of sub-selections
      };
    }
    else {
      answerData = {
        questionId: "39",
        Company_Id: String(this.selectedCompany1),
        PO_Applicable: String(this.Answer39.PO_Applicable),
        PO_Type: "",
        PO_Category: "",
        Currency: "",
        CreatedBy: String(this.employeeId),
        POUtiliziation: selectedPOUtilizations // array of sub-selections
      };
    }



    this._authService.PostSOPAnswer39(answerData).subscribe({
      next: res => {
        this.Marked_Answerd(39);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q39', err)
    });
  }
  onSubmitQuestion4() {
    this.isSubmitted4 = true;

    if (this.verticalGridData_4.length == 0 && this.departmentGridData_4.length == 0 &&
      this.managerGridData_4.length == 0 && this.circleGridData_4.length == 0) {
      return;
    }

    const payload = {
      QuestionId: String(4),
      Company_Id: String(this.selectedCompany1),
      Vertical: this.verticalGridData_4,
      Department: this.departmentGridData_4,
      Manager: this.managerGridData_4,
      Circle: this.circleGridData_4,
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer4(payload).subscribe({
      next: res => {
        this.Marked_Answerd(4);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q4', err)
    });
  }

  onSubmitQuestion33() {
    this.isSubmitted33 = true;

    if (this.EmailGridData_33.length == 0 && this.PortalGridData_33.length == 0) {
      return;
    }

    const payload = {
      QuestionId: String(33),
      Company_Id: String(this.selectedCompany1),
      Email: this.EmailGridData_33,
      Portal: this.PortalGridData_33,
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer33(payload).subscribe({
      next: res => {
        this.Marked_Answerd(33);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q33', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    const maxSizeInMB = 50; // Example: 5 MB
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file && file.size > maxSizeInBytes) {
      alert(`File exceeds the ${maxSizeInMB} MB limit.`);
      event.target.value = ''; // Clear file input
      return;
    }

    if (file) {
      this.Answer31.File_Upload = file;

    }
  }

  onSubmitQuestion31() {
    this.isSubmitted31 = true;
    if (this.Answer31.Bill_Applicable == "Yes")
      if (!this.Answer31.File_Upload) {
        alert("No file selected.");
        return;
      }
    const formData = new FormData();
    if (this.Answer31.File_Upload) {
      formData.append('File', this.Answer31.File_Upload);
      formData.append('billApplicable', this.Answer31.Bill_Applicable);
      formData.append('QuestionId', '31');
      formData.append('CompanyId', this.selectedCompany1);
      formData.append('CreatedBy', this.employeeId);
      this._authService.PostSOPAnswer31(formData).subscribe({
        next: res => {

          this.Marked_Answerd(31);
          this.goToNextQuestion();
        },
        error: err => {
          console.error('❌ Upload failed', err);
        }
      });
    }
    else {
      formData.append('billApplicable', this.Answer31.Bill_Applicable);
      formData.append('QuestionId', '31');
      formData.append('Company_Id', this.selectedCompany1);
      formData.append('CreatedBy', this.employeeId);
      this._authService.PostSOPAnswer31_1(formData).subscribe({
        next: res => {
          this.Marked_Answerd(31);
          this.goToNextQuestion();
        },
        error: err => {
          console.error('❌ Upload failed', err);
        }
      });
    }


  }

  GetSOPAnswer31(questionId: string, CompanyId: string, createdBy: string) {
    this._authService.GetSOPAnswer31(questionId, CompanyId, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        // Bind direct values
        this.Answer31 = {
          Bill_Applicable: data.bill_Applicable,
          File_Upload: null,
          FilePath: data.file_Path,
        };

      },
      error: err => {
        console.error('❌ Error loading Answer31', err);
      }
    });
  }

  onSubmitQuestion11() {
    this.isSubmitted11 = true;

    if (this.Answer11.Std_Working_Hours_Full_Day == '' ||
      this.Answer11.Std_Working_Hours_Half_Day == ''
    ) {
      return;
    }

    if (this.EmailGridData_11_3.length == 0 && this.PortalGridData_11_3.length == 0 &&
      this.BiometricGridData_11_3.length == 0 && this.OthersGridData_11_3.length == 0) {
      return;
    }

    const payload = {
      QuestionId: String(11),
      Company_Id: String(this.selectedCompany1),
      Std_Working_Hours_Full_Day: String(this.Answer11.Std_Working_Hours_Full_Day),
      Std_Working_Hours_Half_Day: String(this.Answer11.Std_Working_Hours_Half_Day),
      Email: this.EmailGridData_11_3,
      Portal: this.PortalGridData_11_3,
      Biometric: this.BiometricGridData_11_3,
      Others: this.OthersGridData_11_3,
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer11(payload).subscribe({
      next: res => {
        this.Marked_Answerd(11);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q11', err)
    });
  }


  onSubmitQuestion15() {
    this.isSubmitted15 = true;

    if (this.Answer15.First_Input_date == '') {
      return;
    }

    if (!this.isRevisedDateValid()) {
      return;
    }

    if (this.EmailGridData_15.length == 0 && this.PortalGridData_15.length == 0 &&
      this.BiometricGridData_15.length == 0 && this.OthersGridData_15.length == 0) {
      return;
    }

    const payload = {
      QuestionId: String(15),
      Company_Id: String(this.selectedCompany1),
      First_Input_date: String(this.Answer15.First_Input_date),
      Revised_Input_date: String(this.Answer15.Revised_Input_date),
      Email: this.EmailGridData_15,
      Portal: this.PortalGridData_15,
      Biometric: this.BiometricGridData_15,
      Others: this.OthersGridData_15,
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer15(payload).subscribe({
      next: res => {
        this.Marked_Answerd(15);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q15', err)
    });
  }

  onDesignationChange20(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.designationbyCompanydetails.find(
      d => d.designation_Id === selectedId
    );
    if (selected) {
      this.Answer20.Designation_Id = selected.designation_Id;
      this.Answer20.Designation_Name = selected.designation_Name;
    } else {
      this.Answer20.Designation_Id = '';
      this.Answer20.Designation_Name = '';
    }
  }


  Addvalues20() {
    this.isSubmitted20 = true;
    var payload;
    this.Answer20.CompanyId = this.selectedCompany1;

    if (this.Answer20.Applicable == "Yes") {

      if (this.Answer20.Applicable == "Yes" && this.Answer20.Applicable_Desc_Client == "Designation Wise") {

        if (this.Answer20.CompanyId == '0' || this.Answer20.CompanyId == '') {
          return;
        }

        if (this.Answer20.Designation_Id == '' || this.Answer20.Designationwise_Days == ''
          || this.Answer20.Applicable_Wages_BASIC_DA == '' || this.Answer20.Applicable_Wages_GROSS == ''
        ) {
          return;
        }

        const isDuplicate = this.answer20GridData.some(
          item => item.designation_Id === this.Answer20.Designation_Id &&
            item.company_Id === this.Answer20.CompanyId
        );

        if (isDuplicate) {
          this.isduplicate20 = true;
          //alert("❗ Designation already exists. Please choose a different one.");
          return;
        }

        payload = {
          Sopid: String(0),
          QuestionId: String(20),
          Applicable: String(this.Answer20.Applicable),
          Eligible_days: String(this.Answer20.Eligible_days),
          Applicable_Desc_Client: String(this.Answer20.Applicable_Desc_Client),
          CompanyId: String(this.selectedCompany1),
          Company_Code: "",
          Designation_Id: String(this.Answer20.Designation_Id),
          Designation_Name: String(this.Answer20.Designation_Name),
          Designationwise_Days: String(this.Answer20.Designationwise_Days),
          Applicable_Wages_BASIC_DA: String(this.Answer20.Applicable_Wages_BASIC_DA),
          Applicable_Wages_GROSS: String(this.Answer20.Applicable_Wages_GROSS),
          CreatedBy: String(this.employeeId)
        };
      }


    }
    else {
      payload = {
        Sopid: String(0),
        QuestionId: String(20),
        Applicable: String(this.Answer20.Applicable),
        Eligible_days: '',
        Applicable_Desc_Client: '',
        CompanyId: '',
        Company_Code: '',
        Designation_Id: '',
        Designation_Name: '',
        Designationwise_Days: '',
        Applicable_Wages_BASIC_DA: '',
        Applicable_Wages_GROSS: '',
        CreatedBy: String(this.employeeId)
      };
    }



    this._authService.PostSOPAnswer20(payload).subscribe({
      next: res => {
        if (this.Answer20.Applicable == "Yes") {
          this.GetSOPAnswer20(String(20), String(this.selectedCompany1), String(this.employeeId));

          this.selectedCompany20 = '';
          this.selecteddesignation20 = '';
          this.Answer20.Eligible_days = '';
          this.Answer20.Designation_Id = '';
          this.Answer20.Designation_Name = '';
          this.Answer20.Designationwise_Days = '';
          this.Answer20.Applicable_Wages_BASIC_DA = '';
          this.Answer20.Applicable_Wages_GROSS = '';

          this.isSubmitted20 = false;
        }

      },
      error: err => console.error('❌ Error saving Q20', err)
    });
  }

  onSubmitQuestion20() {
    this.isSubmitted20 = true;


    var payload;

    if (this.Answer20.Applicable == "No") {
      payload = {
        Sopid: String(0),
        QuestionId: String(20),
        Applicable: String(this.Answer20.Applicable),
        Eligible_days: '',
        Applicable_Desc_Client: '',
        Designation_Id: '',
        Designation_Name: '',
        Designationwise_Days: '',
        Applicable_Wages_BASIC_DA: '',
        Applicable_Wages_GROSS: '',
        CreatedBy: String(this.employeeId)
      };



      this._authService.PostSOPAnswer20(payload).subscribe({
        next: res => {
          this.Marked_Answerd(20);
          this.goToNextQuestion();

        },
        error: err => console.error('❌ Error saving Q20', err)
      });
    }
    else if (this.Answer20.Applicable == "Yes") {

      if (this.Answer20.Applicable_Desc_Client == '' && this.answer20GridData.length == 0) {
        return;
      }
      else if (this.Answer20.Applicable_Desc_Client == "As per Client Instruction") {

        if (this.Answer20.Eligible_days == '') {
          return;
        }

        payload = {
          Sopid: String(0),
          QuestionId: String(20),
          Applicable: String(this.Answer20.Applicable),
          Eligible_days: String(this.Answer20.Eligible_days),
          Applicable_Desc_Client: String(this.Answer20.Applicable_Desc_Client),
          Designation_Id: '',
          Designation_Name: '',
          Applicable_Wages_BASIC_DA: '',
          Applicable_Wages_GROSS: '',
          CreatedBy: String(this.employeeId)
        };
        this._authService.PostSOPAnswer20(payload).subscribe({
          next: res => {
            this.Marked_Answerd(20);
            this.goToNextQuestion();

          },
          error: err => console.error('❌ Error saving Q20', err)
        });

      }
      else if (this.Answer20.Applicable_Desc_Client == "Designation Wise"
        && this.answer20GridData.length == 0) {
        return;
      }
      else {
        this.Marked_Answerd(20);
        this.goToNextQuestion();
      }
    }
    else {
      return;
    }


  }

  onLeaveChange22(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;


    const selected = this.options22_6.find(item => item.id === selectedId);


    if (selected) {
      this.Answer22.Leave_Type_Id = selected.id;
      this.Answer22.Leave_Type = selected.name;
    } else {
      this.Answer22.Leave_Type_Id = '';
      this.Answer22.Leave_Type = '';
    }



  }



  Addvalues22() {
    this.isSubmitted22 = true;
    var payload;

    if (this.Answer22.Leave_Management == '' || this.Answer22.Calander_Type == '' ||
      this.Answer22.Leave_Type_Id == ''
    ) {
      return;
    }

    if (this.Answer22.Leave_Type == "Paternity Leave" || this.Answer22.Leave_Type == "Sabbatical Leave") {
      if (this.Answer22.No_Of_Leave == '') {
        return;
      }
      else {
        const isDuplicate = this.answer22GridData.some(
          item => item.leave_Type_Id === this.Answer22.Leave_Type_Id
        );

        payload = {
          Sopid: String(0),
          QuestionId: String(22),
          Company_Id: String(this.selectedCompany1),
          Applicable: String(this.Answer22.Applicable),
          Leave_Management: String(this.Answer22.Leave_Management),
          Calander_Type: String(this.Answer22.Calander_Type),
          Leave_Type_Id: String(this.Answer22.Leave_Type_Id),
          Leave_Type: String(this.Answer22.Leave_Type),
          No_Of_Leave: String(this.Answer22.No_Of_Leave),
          Carry_Forward: '',
          Carry_Forward_Days: '',
          Encashment: '',
          Leave_Encashment: '',
          CreatedBy: String(this.employeeId)
        };
      }
    }
    else {
      if (this.Answer22.Carry_Forward == '' || this.Answer22.Encashment == '') {
        return;
      }
      else {
        if (this.Answer22.Carry_Forward == "Yes") {
          if (this.Answer22.Carry_Forward_Days == '') {
            return;
          }
          else {
            if (this.Answer22.Encashment == "Yes") {
              if (this.Answer22.Leave_Encashment == '') {
                return;
              }
              else {
                payload = {
                  Sopid: String(0),
                  QuestionId: String(22),
                  Company_Id: String(this.selectedCompany1),
                  Applicable: String(this.Answer22.Applicable),
                  Leave_Management: String(this.Answer22.Leave_Management),
                  Calander_Type: String(this.Answer22.Calander_Type),
                  Leave_Type_Id: String(this.Answer22.Leave_Type_Id),
                  Leave_Type: String(this.Answer22.Leave_Type),
                  No_Of_Leave: '',
                  Carry_Forward: String(this.Answer22.Carry_Forward),
                  Carry_Forward_Days: String(this.Answer22.Carry_Forward_Days),
                  Encashment: String(this.Answer22.Encashment),
                  Leave_Encashment: String(this.Answer22.Leave_Encashment),
                  CreatedBy: String(this.employeeId)
                };
              }
            }
            else {
              payload = {
                Sopid: String(0),
                QuestionId: String(22),
                Company_Id: String(this.selectedCompany1),
                Applicable: String(this.Answer22.Applicable),
                Leave_Management: String(this.Answer22.Leave_Management),
                Calander_Type: String(this.Answer22.Calander_Type),
                Leave_Type_Id: String(this.Answer22.Leave_Type_Id),
                Leave_Type: String(this.Answer22.Leave_Type),
                No_Of_Leave: '',
                Carry_Forward: String(this.Answer22.Carry_Forward),
                Carry_Forward_Days: String(this.Answer22.Carry_Forward_Days),
                Encashment: String(this.Answer22.Encashment),
                Leave_Encashment: '',
                CreatedBy: String(this.employeeId)
              };
            }
          }

        }
        else {
          if (this.Answer22.Encashment == "Yes") {
            if (this.Answer22.Leave_Encashment == '') {
              return;
            }
            else {
              payload = {
                Sopid: String(0),
                QuestionId: String(22),
                Company_Id: String(this.selectedCompany1),
                Applicable: String(this.Answer22.Applicable),
                Leave_Management: String(this.Answer22.Leave_Management),
                Calander_Type: String(this.Answer22.Calander_Type),
                Leave_Type_Id: String(this.Answer22.Leave_Type_Id),
                Leave_Type: String(this.Answer22.Leave_Type),
                No_Of_Leave: '',
                Carry_Forward: String(this.Answer22.Carry_Forward),
                Carry_Forward_Days: '',
                Encashment: String(this.Answer22.Encashment),
                Leave_Encashment: String(this.Answer22.Leave_Encashment),
                CreatedBy: String(this.employeeId)
              };
            }
          }
          else {
            payload = {
              Sopid: String(0),
              QuestionId: String(22),
              Company_Id: String(this.selectedCompany1),
              Applicable: String(this.Answer22.Applicable),
              Leave_Management: String(this.Answer22.Leave_Management),
              Calander_Type: String(this.Answer22.Calander_Type),
              Leave_Type_Id: String(this.Answer22.Leave_Type_Id),
              Leave_Type: String(this.Answer22.Leave_Type),
              No_Of_Leave: '',
              Carry_Forward: String(this.Answer22.Carry_Forward),
              Carry_Forward_Days: '',
              Encashment: String(this.Answer22.Encashment),
              Leave_Encashment: '',
              CreatedBy: String(this.employeeId)
            };
          }

        }
      }
    }

    this._authService.PostSOPAnswer22(payload).subscribe({
      next: res => {
        if (this.Answer22.Applicable == "Yes") {
          this.GetSOPAnswer22(String(22), this.selectedCompany1, String(this.employeeId));

          this.selectedLeave22 = '';
          this.Answer22.Leave_Management = '';
          this.Answer22.Calander_Type = '';
          this.Answer22.Leave_Type_Id = '';
          this.Answer22.Leave_Type = '';
          this.Answer22.No_Of_Leave = '';
          this.Answer22.Carry_Forward = '';
          this.Answer22.Carry_Forward_Days = '';
          this.Answer22.Encashment = '';
          this.Answer22.Leave_Encashment = '';
          this.isSubmitted22 = false;

        }

      },
      error: err => console.error('❌ Error saving Q22', err)
    });
  }

  onSubmitQuestion22() {
    this.isSubmitted22 = true;

    if (this.Answer22.Applicable == '') {
      return;
    }
    if (this.Answer22.Applicable == "Yes") {

      if (this.Answer22.Leave_Management == '') {
        return;
      }
      else {
        if (this.Answer22.Leave_Management == 'Quess' && this.answer22GridData.length == 0) {
          return;
        }
      }
    }

    var payload;
    if (this.Answer22.Applicable == "Yes") {
      payload = {
        Sopid: String(0),
        QuestionId: String(22),
        Company_Id: String(this.selectedCompany1),
        Applicable: String(this.Answer22.Applicable),
        Leave_Management: String(this.Answer22.Leave_Management),
        Calander_Type: '',
        Leave_Type_Id: '',
        Leave_Type: '',
        No_Of_Leave: '',
        Carry_Forward: '',
        Carry_Forward_Days: '',
        Encashment: '',
        Leave_Encashment: '',

        CreatedBy: String(this.employeeId)
      };

    }
    else if (this.Answer22.Applicable == "No") {
      payload = {
        Sopid: String(0),
        QuestionId: String(22),
        Company_Id: String(this.selectedCompany1),
        Applicable: String(this.Answer22.Applicable),
        Leave_Management: '',
        Calander_Type: '',
        Leave_Type_Id: '',
        Leave_Type: '',
        No_Of_Leave: '',
        Carry_Forward: '',
        Carry_Forward_Days: '',
        Encashment: '',
        Leave_Encashment: '',

        CreatedBy: String(this.employeeId)
      };

    }

    this._authService.PostSOPAnswer22(payload).subscribe({
      next: res => {
        this.Marked_Answerd(22);
        this.goToNextQuestion();

      },
      error: err => console.error('❌ Error saving Q22', err)
    });

  }

  oncalandertype24(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.options24_1.find(item => item.id === selectedId);

    if (selected) {
      this.Answer24.Calander_Type_Id = selected.id;
      this.Answer24.Calander_Type = selected.name;
      this.updateDateRange();
    } else {
      this.Answer24.Calander_Type_Id = '';
      this.Answer24.Calander_Type = '';
    }

  }

  onstate24(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.statelist.find(item => item.state_Id === selectedId);

    if (selected) {
      this.Answer24.State_Id = selected.state_Id;
      this.Answer24.State_Name = selected.state_Name;
    } else {
      this.Answer24.State_Id = '';
      this.Answer24.State_Name = '';
    }

  }


  onleavetype24(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.options24_2.find(item => item.id === selectedId);

    if (selected) {
      this.Answer24.Leave_Type_Id = selected.id;
      this.Answer24.Leave_Type = selected.name;
    } else {
      this.Answer24.Leave_Type_Id = '';
      this.Answer24.Leave_Type = '';
    }

  }

  onbillable24(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.options24_3.find(item => item.id === selectedId);

    if (selected) {
      this.Answer24.Is_Billable_Id = selected.id;
      this.Answer24.Is_Billable = selected.name;
    } else {
      this.Answer24.Is_Billable_Id = '';
      this.Answer24.Is_Billable = '';
    }

  }

  onbilltype24(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.options24_4.find(item => item.id === selectedId);

    if (selected) {
      this.Answer24.Billable_Type_Id = selected.id;
      this.Answer24.Billable_Type = selected.name;
    } else {
      this.Answer24.Billable_Type_Id = '';
      this.Answer24.Billable_Type = '';
    }

  }

  convertToYyyyMmDd(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  Addvalues24() {
    this.isSubmitted24 = true;
    // 1. Check if a different calendar type already exists for the same State
    const existingStateRecords = this.answer24GridData.filter(
      item => item.state_Id === this.Answer24.State_Id
    );


    if (existingStateRecords.length > 0) {
      const existingCalendarType = existingStateRecords[0].calander_Type;

      if (existingCalendarType !== this.Answer24.Calander_Type) {
        alert(`Calendar type mismatch! Existing entries for ${this.Answer24.State_Name} are using '${existingCalendarType}'. Please select the same calendar type.`);
        return;
      }

      // 2. Check if Holiday_Date is already added for this state
      const isDuplicateDate = existingStateRecords.some(
        item => this.convertToYyyyMmDd(item.holiday_Date) === this.Answer24.Holiday_Date
      );

      if (isDuplicateDate) {
        alert(`Holiday date ${this.Answer24.Holiday_Date} already exists for ${this.Answer24.State_Name}. Please choose a different date.`);
        return;
      }
    }

    var payload;

    if (this.Answer24.Calander_Type == '' || this.Answer24.State_Id == '' ||
      this.Answer24.Leave_Type == '' || this.Answer24.Holiday_Date == '' ||
      this.Answer24.Leave_Description == '' || this.Answer24.Is_Billable == ''
    ) {
      return;
    }

    if (this.Answer24.Is_Billable_Id == "1") {
      if (this.Answer24.Billable_Type == '') {
        return;
      }
      payload = {
        QuestionId: String(24),
        Calander_Type: String(this.Answer24.Calander_Type),
        State_Id: String(this.Answer24.State_Id),
        State_Name: String(this.Answer24.State_Name),
        Leave_Type: String(this.Answer24.Leave_Type),
        Holiday_Date: String(this.Answer24.Holiday_Date),
        Leave_Description: String(this.Answer24.Leave_Description),
        Is_Billable: String(this.Answer24.Is_Billable),
        Billable_Type: String(this.Answer24.Billable_Type),
        CreatedBy: String(this.employeeId)
      };
    }
    else {
      payload = {
        QuestionId: String(24),
        Calander_Type: String(this.Answer24.Calander_Type),
        State_Id: String(this.Answer24.State_Id),
        State_Name: String(this.Answer24.State_Name),
        Leave_Type: String(this.Answer24.Leave_Type),
        Holiday_Date: String(this.Answer24.Holiday_Date),
        Leave_Description: String(this.Answer24.Leave_Description),
        Is_Billable: String(this.Answer24.Is_Billable),
        Billable_Type: '',
        CreatedBy: String(this.employeeId)
      };
    }



    this._authService.PostSOPAnswer24(payload).subscribe({
      next: res => {
        this.GetSOPAnswer24(String(24), String(this.employeeId));
        // this.Answer24.Calander_Type_Id = '';
        // this.Answer24.Calander_Type = '';
        // this.Answer24.State_Id = '';
        // this.Answer24.State_Name = '';
        this.selectedCalanderType24 = '';
        this.selectedState24 = '';
        this.selectedLeaveType24 = '';
        this.selectedbillable24 = '';
        this.selectedbilltype24 = '';

        this.Answer24.Leave_Type_Id = '';
        this.Answer24.Leave_Type = '';
        this.Answer24.Holiday_Date = '';
        this.Answer24.Leave_Description = '';
        this.Answer24.Is_Billable_Id = '';
        this.Answer24.Is_Billable = '';
        this.Answer24.Billable_Type_Id = '';
        this.Answer24.Billable_Type = '';

        this.isSubmitted24 = false;
      },
      error: err => console.error('❌ Error saving Q24', err)
    });
  }

  onSubmitQuestion24() {
    this.isSubmitted24 = true;

    if (this.answer24GridData.length == 0) {
      return;
    }

    this.Marked_Answerd(24);
    this.goToNextQuestion();
  }

  onCompanyChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.userwisecompanydetails.find(
      d => d.company_Id === selectedId
    );

    if (selected) {
      this.Answer26.CompanyId = selected.company_Id;
      this.GetGroupbyCompany(selected.company_Id);
      this.GetDesignationbyCompany(selected.company_Id);
      this.GetInsuranceVertical(selected.company_Id);
    } else {

    }
  }

  onGroupChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.groupbycompanydetails.find(
      d => d.group_Detail_Id === selectedId
    );

    if (selected) {
      this.Answer26.GroupDetailId = selected.group_Detail_Id;
    } else {

    }
  }

  onPremiumTrackerChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.premiumtrackerdetails.find(
      d => d.geN_iID === selectedId
    );

    if (selected) {
      this.Answer26.PremiumTrackerId = selected.geN_iID;

      if (this.Answer26.PremiumTrackerId != "1365") {
        this.GetDesignationbyCompany(this.Answer26.CompanyId);
        this.GetMartialStatus26();
        this.selectedMaritalStatus = '-Select-';
        this.GetEmployeeType26();
      }
    } else {
      this.GetInsuranceVertical(this.Answer26.CompanyId);
    }
  }

  onDesignationChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.designationbyCompanydetails.find(
      d => d.designation_Id === selectedId
    );

    if (selected) {
      this.Answer26.Designation_Id = selected.designation_Id;
    } else {

    }
  }

  onCoverageTypeChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.coveragetypedetails.find(
      d => d.coverageTypeId === selectedId
    );

    if (selected) {
      this.Answer26.CoverageTypeId = selected.coverageTypeId;
      this.GetPolicyConditionByCoverageType(selected.coverageTypeId);
    } else {

    }
  }

  onGMCPolicyConditionChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.policyconditioncycoveragetypedetails.find(
      d => d.policyConditionId === selectedId
    );

    if (selected) {

      this.Answer26.PolicyConditionId = selected.policyConditionId;
      this.GetPolicyNoByCondition(this.Answer26.CoverageTypeId, selected.policyConditionId);
    } else {

    }
  }

  onGMCPolicyNoChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.policynobyconditiondetails.find(
      d => d.policyNumberId === selectedId
    );

    if (selected) {
      this.Answer26.PolicyNumberId = selected.policyNumberId;
    } else {

    }
  }

  onGPAPolicyNoChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.gpapolicydetails.find(
      d => d.id === selectedId
    );

    if (selected) {
      this.Answer26.GPAPolicyNumberId = selected.id;
    } else {

    }
  }


  onGTLIPolicyNoChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.gtlipolicydetails.find(
      d => d.id === selectedId
    );

    if (selected) {
      this.Answer26.GTLIPolicyNumberId = selected.id;
    } else {

    }
  }

  onDeductionPayCodeChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.deductionpaycodedetails.find(
      d => d.paycode_Id === selectedId
    );

    if (selected) {
      this.Answer26.PayCodeId = selected.paycode_Id;
    } else {

    }
  }

  onBillingPayCodeChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.billingpaycodedetails.find(
      d => d.paycode_Id === selectedId
    );

    if (selected) {
      this.Answer26.BillingPayCodeId = selected.paycode_Id;
    } else {

    }
  }


  onEmployeeTypeChange26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.employeetypedetails.find(
      d => d.employeeTypeId === selectedId
    );

    if (selected) {
      this.Answer26.EmployeeTypeId = selected.employeeTypeId;
    } else {

    }
  }

  onInsuranceVertical26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.insuranceverticaldetails.find(
      d => d.insurance_Vertical_ID === selectedId
    );

    if (selected) {
      this.Answer26.Insurance_Vertical_ID = selected.insurance_Vertical_ID;
    } else {

    }
  }

  onNewJoineeArrear26(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.newjoineedetails.find(
      d => d.newJoineeArrearId === selectedId
    );

    if (selected) {
      this.Answer26.NewJoineeArrearId = selected.newJoineeArrearId;
    } else {

    }
  }

  toggleEsiNonApplicable(): void {
    if (this.Answer26.PremiumTrackerId !== '1365') return;
    this.isEsiNonApplicable = !this.isEsiNonApplicable;
  }

  toggleEsiApplicable(): void {

    if (this.Answer26.PremiumTrackerId !== '1365') return;
    this.isEsiApplicable = !this.isEsiApplicable;
    console.log('isEsiApplicable', this.isEsiApplicable);
  }

  toggleTillServiceTerminate(): void {
    this.isTillServiceTerminate = !this.isTillServiceTerminate;
    this.Answer35.Agreement_End_Date = '';
  }

  Addvalues26() {
    this.isSubmitted26 = true;


    if (this.Answer26.CompanyId == "0" || this.Answer26.PremiumTrackerId == "0" ||
      this.Answer26.PayCodeId == "0" || this.Answer26.BillingPayCodeId == "0" ||
      this.Answer26.DeductionAmount == '' || this.Answer26.BillingAmount == '' ||
      this.Answer26.DeductionAmount == "0" || this.Answer26.BillingAmount == "0"
    ) {
      return;
    }

    if (this.Answer26.CoverageTypeId != '' && this.Answer26.CoverageTypeId != "0") {
      if (this.Answer26.PolicyConditionId == "0" || this.Answer26.PolicyConditionId == '' ||
        this.Answer26.PolicyNumberId == "0" || this.Answer26.PolicyNumberId == '' ||
        this.Answer26.GMCAmount == '' || this.Answer26.GPAAmount == '') {
        return;
      }
    }

    if (this.Answer26.GPAPolicyNumberId != '' && this.Answer26.GPAPolicyNumberId != "0") {
      if (this.Answer26.GPAAmount == '') {
        return;
      }
    }
    var payload;

    payload = {

      CompanyId: String(this.Answer26.CompanyId),
      GroupDetailId: String(this.Answer26.GroupDetailId),
      PremiumTrackerId: String(this.Answer26.PremiumTrackerId),
      EffectiveDate: String(this.Answer26.EffectiveDate),
      Insurance_Vertical_ID: String(this.Answer26.Insurance_Vertical_ID)
    };

    this._authService.InsuranceExists(payload).subscribe({
      next: res => {
        if (res.Data.response == "Success") {
          var payloadcreate;

          payloadcreate = {

            QuestionId: String(26),
            CompanyId: String(this.Answer26.CompanyId),
            GroupDetailId: String(this.Answer26.GroupDetailId),
            PremiumTrackerId: String(this.Answer26.PremiumTrackerId),
            Designation_Id: String(this.Answer26.Designation_Id),
            CoverageTypeId: String(this.Answer26.CoverageTypeId),
            PolicyConditionId: String(this.Answer26.PolicyConditionId),
            GMCAmount: this.Answer26.GMCAmount === '' ? '0' : String(this.Answer26.GMCAmount),
            PolicyNumberId: String(this.Answer26.PolicyNumberId),
            GPAAmount: this.Answer26.GPAAmount === '' ? '0' : String(this.Answer26.GPAAmount),
            GPAPolicyNumberId: String(this.Answer26.GPAPolicyNumberId),
            GTLIAmount: this.Answer26.GTLIAmount === '' ? '0' : String(this.Answer26.GTLIAmount),
            GTLIPolicyNumberId: String(this.Answer26.GTLIPolicyNumberId),
            PayCodeId: String(this.Answer26.PayCodeId),
            DeductionAmount: this.Answer26.DeductionAmount === '' ? '0' : String(this.Answer26.DeductionAmount),
            BillingPayCodeId: String(this.Answer26.BillingPayCodeId),
            BillingAmount: this.Answer26.BillingAmount === '' ? '0' : String(this.Answer26.BillingAmount),
            EffectiveDate: String(this.Answer26.EffectiveDate),
            Remarks: String(this.Answer26.Remarks),
            MaritalStatus: String(this.Answer26.MaritalStatus),
            Is_ESIApplicable: String(this.isEsiApplicable),
            Is_ESINonApplicable: String(this.isEsiNonApplicable),
            EmployeeTypeId: String(this.Answer26.EmployeeTypeId),
            Insurance_Vertical_ID: String(this.Answer26.Insurance_Vertical_ID),
            NewJoineeArrearId: String(this.Answer26.NewJoineeArrearId),
            CreatedBy: String(this.employeeId)
          };



          this._authService.InsuranceCreate(payloadcreate).subscribe({
            next: res => {
              this.GetSOPAnswer26(String(26), this.employeeId);

              this.Answer26.CompanyId = '0';
              this.Answer26.GroupDetailId = '0';
              this.Answer26.PremiumTrackerId = '0';
              this.Answer26.Designation_Id = '0';
              this.Answer26.CoverageTypeId = '0';
              this.Answer26.PolicyConditionId = '0';
              this.Answer26.GMCAmount = '';
              this.Answer26.PolicyNumberId = '0';
              this.Answer26.GPAAmount = '';
              this.Answer26.GPAPolicyNumberId = '0';
              this.Answer26.GTLIAmount = '';
              this.Answer26.GTLIPolicyNumberId = '0';
              this.Answer26.PayCodeId = '0';
              this.Answer26.DeductionAmount = '';
              this.Answer26.BillingPayCodeId = '0';
              this.Answer26.BillingAmount = '';
              this.Answer26.EffectiveDate = '';
              this.Answer26.Remarks = '';
              this.Answer26.MaritalStatus = '';
              this.Answer26.Is_ESIApplicable = '0';
              this.Answer26.Is_ESINonApplicable = '0';
              this.Answer26.EmployeeTypeId = '0';
              this.Answer26.Insurance_Vertical_ID = '0';
              this.Answer26.NewJoineeArrearId = '0';

              this.selectedCompany26 = '';
              this.selectedGroup26 = '';
              this.selectedPremium26 = '';
              this.selectedDesignation26 = '';
              this.selectedCoverage26 = '';
              this.selectedGmcCondition26 = '';
              this.selectedGmcPolicy26 = '';
              this.selectedGpaPolicy26 = '';
              this.selectedGtliPolicy26 = '';
              this.selectedDeductionPaycode26 = '';
              this.selectedBillingPaycode26 = '';
              this.selectedEmployeeType26 = '';
              this.selectedInsuranceVertical26 = '';
              this.selectedNewJoineeArrear26 = '';
              this.selectedMaritalStatus = '-Select-';
              this.isSubmitted26 = false;
            },
            error: err => console.error('❌ Error saving Q26', err)
          });

        }
        else {
          alert('Insurance Policy Mapping is Already Available');
        }
      },
      error: err => console.error('❌ Error saving Q26', err)
    });
  }

  onClientNamechange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer35.Client_ID = selectedId;
    this.Answer35.Full_Name_Of_Organization = selectedName;
  }

  onModeofpaymentchange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.Type_Of_Contact = selectedId;
  }

  onAgreementStatuschange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.Agreement_Status = selectedId;
  }

  onOBApplicablechange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.OBApplicable = selectedId;
  }

  onServicefeeType35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.Service_Fee_Type = selectedId;
  }
  onSupplementaryChargesTypeChange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.Supplementary_Fee_Type = selectedId;
  }

  onPAYROLLWITHDECIMALChange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.PAYROLL_WITH_DECIMAL = selectedId;
  }

  onSERVICEFEEWITHDECIMALChange35(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    this.Answer35.SERVICE_FEE_WITH_DECIMAL = selectedId;
  }

  Addvalues35() {
    this.isSubmitted35 = true;
    var payloadcreate;

    if (this.Answer35?.Client_ID === '0' || this.Answer35?.Client_ID === '') {
      return;
    }

    if (this.Answer35?.Type_Of_Contact === '0' || this.Answer35?.Type_Of_Contact === '') {
      return;
    }

    if (this.Answer35.Type_Of_Contact === 'Upfront') {
      if (this.Answer35.Credit_Days_Agreed === '') {
        return;
      }
    }

    if (this.Answer35.Agreement_Start_Date === '') {
      return;
    }

    if (this.isTillServiceTerminate === false && this.Answer35.Agreement_End_Date === '') {
      return;
    }

    if (this.Answer35.Agreement_Status === '0' || this.Answer35.Agreement_Status === '') {
      return;
    }

    if (this.Answer35.Agreement_Status !== 'Both party signed agreement available' && this.Answer35.Busniess_Head_Approval === '') {
      return;
    }

    if (this.Answer35.One_Time_Onboarding_Fees === '') {
      return;
    }

    if (this.Answer35.Service_Fee_Type === '0' || this.Answer35.Service_Fee_Type === '') {
      return;
    }

    if (this.Answer35.Service_Fee === '') {
      return;
    }

    if (this.Answer35.Sourcing_Fee === '') {
      return;
    }
    if (this.Answer35.Replacement_Clause === '') {
      return;
    }
    if (this.Answer35.Absorption_Fee === '') {
      return;
    }
    if (this.Answer35.Upfront_Charges === '') {
      return;
    }

    if (this.Answer35.Supplementary_Fee_Type === '0' || this.Answer35.Supplementary_Fee_Type === '') {
      return;
    }

    if (this.Answer35.Supplementary_Charges === '') {
      return;
    }
    payloadcreate = {
      sr_no: '',
      QuestionId: String(35),
      Client_ID: String(this.Answer35.Client_ID),
      Full_Name_Of_Organization: String(this.Answer35.Full_Name_Of_Organization),
      Type_Of_Contact: String(this.Answer35.Type_Of_Contact),
      Credit_Days_Agreed: String(this.Answer35.Credit_Days_Agreed),
      Agreement_Start_Date: String(this.Answer35.Agreement_Start_Date),
      Agreement_End_Date: String(this.Answer35.Agreement_End_Date),
      Agreement_Status: String(this.Answer35.Agreement_Status),
      Busniess_Head_Approval: String(this.Answer35.Busniess_Head_Approval),
      One_Time_Onboarding_Fees: this.Answer35.One_Time_Onboarding_Fees?.trim() !== ''
        ? String(this.Answer35.One_Time_Onboarding_Fees)
        : '0',
      Service_Fee_Type: String(this.Answer35.Service_Fee_Type),
      Service_Fee: this.Answer35.Service_Fee?.trim() !== ''
        ? String(this.Answer35.Service_Fee)
        : '0',
      Sourcing_Fee: this.Answer35.Sourcing_Fee?.trim() !== ''
        ? String(this.Answer35.Sourcing_Fee)
        : '0',
      Replacement_Clause: String(this.Answer35.Replacement_Clause),
      Absorption_Fee: this.Answer35.Absorption_Fee?.trim() !== ''
        ? String(this.Answer35.Absorption_Fee)
        : '0',
      Upfront_Charges: this.Answer35.Upfront_Charges?.trim() !== ''
        ? String(this.Answer35.Upfront_Charges)
        : '0',
      InEdge_Charges: this.Answer35.InEdge_Charges?.trim() !== ''
        ? String(this.Answer35.InEdge_Charges)
        : '0',

      Supplementary_Fee_Type: String(this.Answer35.Supplementary_Fee_Type),
      Supplementary_Charges: this.Answer35.Supplementary_Charges?.trim() !== ''
        ? String(this.Answer35.Supplementary_Charges)
        : '0',

      LatePayment_Fee: this.Answer35.LatePayment_Fee?.trim() !== ''
        ? String(this.Answer35.LatePayment_Fee)
        : '0',

      Other_Fees: String(this.Answer35.Other_Fees),
      PAYROLL_WITH_DECIMAL: String(this.Answer35.PAYROLL_WITH_DECIMAL),
      SERVICE_FEE_WITH_DECIMAL: String(this.Answer35.SERVICE_FEE_WITH_DECIMAL),
      OBApplicable: String(this.Answer35.OBApplicable),
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer35(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswer35(String(35), this.employeeId);

        this.isSubmitted35 = false;
        this.selectedClientName35
        this.selectedModeofpayment35 = '';
        this.selectedAgreement35 = '';
        this.selectedServiceFee35 = '';
        this.selectedSupplementary35 = '';
        this.selectedOBApplicable35 = '';
        this.selectedPAYROLL35 = '';
        this.selectedSERVICE35 = '';
        this.Answer35.Credit_Days_Agreed = '';
        this.Answer35.Agreement_Start_Date = '';
        this.Answer35.Agreement_End_Date = '';
        this.Answer35.Busniess_Head_Approval = '';
        this.Answer35.One_Time_Onboarding_Fees = '';
        this.Answer35.Service_Fee = '';
        this.Answer35.Sourcing_Fee = '';
        this.Answer35.Replacement_Clause = '';
        this.Answer35.Absorption_Fee = '';
        this.Answer35.Upfront_Charges = '';
        this.Answer35.InEdge_Charges = '';

        this.Answer35.Supplementary_Charges = '';
        this.Answer35.LatePayment_Fee = '';
        this.Answer35.Other_Fees = '';

      },
      error: err => console.error('❌ Error saving Q26', err)
    });
  }

  GetSOPAnswer35(Questionid, Createdby) {
    this._authService.GetSOPAnswer35(Questionid, Createdby).subscribe({
      next: res => {

        if (res.Data.length > 0) {
          this.answer35GridData = res.Data || [];
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  GetSOPAnswer34(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer34(Questionid, CompanyId, Createdby).subscribe({
      next: res => {

        if (res.Data.length > 0) {
          this.answer34GridData = res.Data || [];
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onSubmitQuestion35() {
    this.isSubmitted35 = true;
    if (this.answer35GridData.length == 0) {
      return;
    }
    this.Marked_Answerd(35);
    this.goToNextQuestion();
  }

  isRevisedDateValid(): boolean {
    const first = this.Answer15?.First_Input_date;
    const revised = this.Answer15?.Revised_Input_date;

    if (!first || !revised) return true; // Allow empty values

    return new Date(revised) > new Date(first);
  }

  onStatechange34(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer34.State_Id = selectedId;
    this.Answer34.State_Name = selectedName;
  }



  updateInvoiceCategoryOptions() {
    this.invoicecategoryoptions = this.Answer34.Certificate_Type === 'NON SEZ'
      ? this.options34_2
      : this.options34_3;

    // Optional: reset previously selected value
    this.Answer34.Invoice_Category = '';
  }

  onInvoiceCategorychange34(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer34.Invoice_Category = selectedId;
    this.Answer34.Invoice_Category = selectedName;
  }

  onFileGSTSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileGST = file;

    }
  }

  onFileSEZSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileSEZ = file;

    }
  }

  onFileLUTSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileLUT = file;

    }
  }

  onSubmitQuestion34() {
    this.isSubmitted34 = true;

    if (this.answer34GridData.length == 0) {
      return;
    }

    this.Marked_Answerd(34);
    this.goToNextQuestion();
  }

  Addvalues34() {
    this.isSubmitted34 = true;
    var payloadcreate;



    payloadcreate = {
      sr_no: String(34),
      SOPId: String(34),
      QuestionId: String(34),
      Company_Id: String(this.selectedCompany1),
      State_Id: String(this.Answer34.State_Id ?? ''),
      State_Name: String(this.Answer34.State_Name ?? ''),
      Certificate_Type: String(this.Answer34.Certificate_Type ?? ''),
      Invoice_Category: String(this.Answer34.Invoice_Category ?? ''),
      Bill_To: String(this.Answer34.Bill_To ?? ''),
      Bill_To_Pin: String(this.Answer34.Bill_To_Pin ?? ''),
      Ship_To: String(this.Answer34.Ship_To ?? ''),
      Ship_To_Pin: String(this.Answer34.Ship_To_Pin ?? ''),
      GST_Certificate_Path: String(34),
      GST_No: String(this.Answer34.GST_No ?? ''),
      PAN_No: String(this.Answer34.PAN_No ?? ''),
      TAN_No: String(this.Answer34.TAN_No ?? ''),
      SAC_Code: String(this.Answer34.SAC_Code ?? ''),
      Client_Invoice_State: String(this.Answer34.Client_Invoice_State ?? ''),
      Quess_Invoice_State: String(this.Answer34.Quess_Invoice_State ?? ''),
      SEZ_Certificate_path: String(34),
      LUT_No: this.Answer34.LUT_No?.trim() ? String(this.Answer34.LUT_No) : "34",
      LUT_From_Date: this.Answer34.LUT_From_Date?.trim() ? String(this.Answer34.LUT_From_Date) : "1900-01-01",
      LUT_End_Date: this.Answer34.LUT_End_Date?.trim() ? String(this.Answer34.LUT_End_Date) : "1900-01-01",
      LUT_Certificate_Path: String(34),
      SUB_Code: String(this.Answer34.SUB_Code ?? ''),
      CreatedBy: String(this.employeeId)
    };



    const formData = new FormData();

    Object.keys(payloadcreate).forEach(key => {
      const value = payloadcreate[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (this.fileGST instanceof File && this.fileGST.size > 0) {
      formData.append('fileGST', this.fileGST);
    }

    if (this.fileSEZ instanceof File && this.fileSEZ.size > 0) {
      formData.append('fileSEZ', this.fileSEZ);
    }

    if (this.fileLUT instanceof File && this.fileLUT.size > 0) {
      formData.append('fileLUT', this.fileLUT);
    }



    this._authService.PostSOPAnswer34(formData).subscribe({
      next: res => {
        this.GetSOPAnswer34(String(34), this.selectedCompany1, this.employeeId);
        this.clearAnswer34();
      },
      error: err => console.error('❌ Error saving Q34', err)
    });
  }



  clearAnswer34() {

    this.isSubmitted34 = false;
    this.selectedstate34 = '';
    this.Answer34.State_Id = '';
    this.Answer34.State_Name = '';
    this.Answer34.Certificate_Type = '';
    this.Answer34.Invoice_Category = '';
    this.Answer34.Bill_To = '';
    this.Answer34.Bill_To_Pin = '';
    this.Answer34.Ship_To = '';
    this.Answer34.Ship_To_Pin = '';
    this.Answer34.GST_Certificate_Path = '';
    this.Answer34.GST_No = '';
    this.Answer34.PAN_No = '';
    this.Answer34.TAN_No = '';
    this.Answer34.SAC_Code = '';
    this.Answer34.Client_Invoice_State = '';
    this.Answer34.Quess_Invoice_State = '';
    this.Answer34.SEZ_Certificate_Path = '';
    this.Answer34.LUT_No = '';
    this.Answer34.LUT_From_Date = '';
    this.Answer34.LUT_End_Date = '';
    this.Answer34.LUT_Certificate_Path = '';
    this.Answer34.SUB_Code = '';
  }

  oncountry40(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer40.CountryCode = selectedId;
    this.Answer40.CountryName = selectedName;
  }

  onstate40(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer40.RegionId = selectedId;
    this.Answer40.RegionName = selectedName;
    this.GetCity(this.Answer40.RegionId);
  }

  GetCity(stateid: any) {
    this._authService.GetCity(stateid).subscribe({
      next: res => {
        this.citylist = res.Data;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  oncity40(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer40.CityId = selectedId;
    this.Answer40.CityName = selectedName;
  }

  oncurrency40(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer40.PurchaseOrderCurrency = selectedId;
  }

  Addvalues40() {
    this.isSubmitted40 = true;
    var payloadcreate;

    if (this.Answer40.VendorCode == '' || this.Answer40.VendorName == '' ||
      this.Answer40.CountryCode == '' || this.Answer40.GSTIN == '' ||
      this.Answer40.MSMENumber == '' || this.Answer40.PANNumber == '' ||
      this.Answer40.PurchaseOrderCurrency == '' || this.Answer40.VendorStatus == '' ||
      this.Answer40.VendorCreationDate == '' || this.Answer40.VendorAddress == ''
    ) {
      return;
    }

    if (this.Answer40.CountryName == "India") {
      if (this.Answer40.RegionId == '' || this.Answer40.CityId == '') {
        return;
      }
    }

    payloadcreate = {
      SOPId: String(40),
      Company_Id: String(this.selectedCompany1),
      QuestionId: String(40),
      VendorCode: String(this.Answer40.VendorCode),
      VendorName: String(this.Answer40.VendorName),
      CountryCode: String(this.Answer40.CountryCode),
      CountryName: String(this.Answer40.CountryName),
      CityId: String(this.Answer40.CityId),
      CityName: String(this.Answer40.CityName),
      RegionId: String(this.Answer40.RegionId),
      RegionName: String(this.Answer40.RegionName),
      GSTIN: String(this.Answer40.GSTIN),
      MSMENumber: String(this.Answer40.MSMENumber),
      PANNumber: String(this.Answer40.PANNumber),
      PurchaseOrderCurrency: String(this.Answer40.PurchaseOrderCurrency),
      VendorStatus: String(this.Answer40.VendorStatus),
      VendorCreationDate: String(this.Answer40.VendorCreationDate),
      VendorAddress: String(this.Answer40.VendorAddress),
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer40(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswer40(String(40), this.selectedCompany1, this.employeeId);

        this.Answer40.VendorCode = '';
        this.Answer40.VendorName = '';
        this.Answer40.CountryCode = '';
        this.Answer40.CountryName = '';
        this.Answer40.CityId = '';
        this.Answer40.CityName = '';
        this.Answer40.RegionId = '';
        this.Answer40.RegionName = '';
        this.Answer40.GSTIN = '';
        this.Answer40.MSMENumber = '';
        this.Answer40.PANNumber = '';
        this.Answer40.PurchaseOrderCurrency = '';
        this.Answer40.VendorStatus = '';
        this.Answer40.VendorCreationDate = '';
        this.Answer40.VendorAddress = '';

        this.selectedCountry40 = '';
        this.selectedState40 = '';
        this.selectedCurrency40 = '';
        this.selectedCity40 = '';
        this.isSubmitted40 = false;

      },
      error: err => console.error('❌ Error saving Q26', err)
    });

  }

  GetSOPAnswer40(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer40(Questionid, CompanyId, Createdby).subscribe({
      next: res => {

        if (res.Data.length > 0) {
          this.answer40GridData = res.Data || [];
        }

      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onSubmitQuestion40() {
    this.isSubmitted40 = true;
    if (this.answer40GridData.length == 0) {
      return;
    }

    this.Marked_Answerd(40);
    this.goToNextQuestion();
  }

  onCompanyChange41(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer41.CompanyCode = selectedName;
  }

  toggleCheckbox41_1(item: any) {
    item.checked = !item.checked;

    const selectedLabels = this.options41_1
      .filter(option => option.checked)
      .map(option => option.label);

    // Join with comma and store in Answer41.MasterChecklist
    this.Answer41.MasterChecklist = selectedLabels.join(', ');
  }

  GetSOPAnswer41_1(questionId: string, createdBy: string) {
    this._authService.GetSOPAnswer4(questionId, this.selectedCompany1, createdBy).subscribe({
      next: res => {
        const data = res.Data;

        this.verticalGridData_4 = data.vertical || [];
        this.departmentGridData_4 = data.department || [];
        this.managerGridData_4 = data.manager || [];
        this.circleGridData_4 = data.circle || [];
      },
      error: err => {
        console.error('❌ Error loading Answer4', err);
      }
    });
  }

  Addvalues41() {
    this.isSubmitted41 = true;
    var payloadcreate;

    if (this.Answer41.MasterChecklist == '' ||
      this.Answer41.SpocDetails == '' || this.Answer41.CompletionActivity == ''
    ) {
      return;
    }

    payloadcreate = {
      SOPId: String(41),
      QuestionId: String(41),
      Company_Id: String(this.selectedCompany1),
      MasterChecklist: String(this.Answer41.MasterChecklist),
      SpocDetails: String(this.Answer41.SpocDetails),
      CompletionActivity: String(this.Answer41.CompletionActivity),
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer41(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswer41(String(41), this.selectedCompany1, this.employeeId);

        this.Answer41.CompanyCode = '';
        this.Answer41.MasterChecklist = '';
        this.Answer41.SpocDetails = '';
        this.Answer41.CompletionActivity = '';
        this.selectedCompany41 = '';
        this.isSubmitted41 = false;
      },
      error: err => console.error('❌ Error saving Q26', err)
    });

  }

  GetSOPAnswer41(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswer41(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {

          this.Answer41.SpocDetails = res.Data[0].spocDetails;

          var completionActivity_date;
          const rawDate = res.Data[0].completionActivity;

          if (rawDate && rawDate.trim() !== '') {
            const parts = rawDate.split('-'); // because format is "dd-MM-yyyy"
            if (parts.length === 3) {
              completionActivity_date = `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-MM-dd
            }
          }

          this.Answer41.CompletionActivity = completionActivity_date;

          if (res.Data[0].masterChecklist) {

            this.Answer41.MasterChecklist = res.Data[0].masterChecklist;

            const selectedItems = res.Data[0].masterChecklist
              .split(',')
              .map(x => x.trim());

            this.options41_1.forEach(item => {
              item.checked = selectedItems.includes(item.label);
            });
          } else {
            this.Answer41.MasterChecklist = '';
            this.options41_1.forEach(item => {
              item.checked = false;
            });
          }
        }
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onSubmitQuestion41() {
    this.isSubmitted41 = true;
    var payloadcreate;

    if (this.Answer41.MasterChecklist == '' ||
      this.Answer41.SpocDetails == '' || this.Answer41.CompletionActivity == ''
    ) {
      return;
    }

    payloadcreate = {
      SOPId: String(41),
      QuestionId: String(41),
      Company_Id: String(this.selectedCompany1),
      MasterChecklist: String(this.Answer41.MasterChecklist),
      SpocDetails: String(this.Answer41.SpocDetails),
      CompletionActivity: String(this.Answer41.CompletionActivity),
      CreatedBy: String(this.employeeId)
    };



    this._authService.PostSOPAnswer41(payloadcreate).subscribe({
      next: res => {

        this.Marked_Answerd(41);
        this.goToNextQuestion();

        this.isSubmitted41 = false;
      },
      error: err => console.error('❌ Error saving Q26', err)
    });

  }

  onstate42_1(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.statelist.find(item => item.state_Id === selectedId);

    if (selected) {
      this.Answer42_2.StateId = selected.state_Id;
      this.Answer42_2.StateName = selected.state_Name;
    } else {
      this.Answer42_2.StateId = '';
      this.Answer42_2.StateName = '';
    }

  }

  Addvalues42_1() {
    this.isSubmitted42_1 = true;

    if (this.Answer42_2.Category == '' || this.Answer42_2.StateId == '' || this.Answer42_2.Structure == '') {
      return;
    }

    const isDuplicate = this.answer42_2GridData.some(
      item =>
        item.category === this.Answer42_2.Category &&
        item.stateName === this.Answer42_2.StateName
    );

    if (isDuplicate) {
      this.isduplicate42_1 = true;
      return;
    }

    var payloadcreate;

    payloadcreate = {
      SOPId: String(42),
      Company_Id: String(this.selectedCompany1),
      QuestionId: String(42),
      Category: String(this.Answer42_2.Category),
      StateId: String(this.Answer42_2.StateId),
      StateName: String(this.Answer42_2.StateName),
      Structure: String(this.Answer42_2.Structure),
      CreatedBy: String(this.employeeId)
    };

    this._authService.PostSOPAnswerMinimumwages42(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswerMinimumwages42(String(42), this.selectedCompany1, this.employeeId);
        this.isSubmitted42_1 = false;
        this.isduplicate42_1 = false;
        this.selectedstate42_1 = '';
        this.selectedcentral42_1 = '';
        this.Answer42_2.Category = '';
        this.Answer42_2.StateId = '';
        this.Answer42_2.StateName = '';
        this.Answer42_2.Structure = '';

      },
      error: err => console.error('❌ Error saving Q26', err)
    });
  }

  GetSOPAnswerMinimumwages42(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswerMinimumwages42(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.answer42_2GridData = res.Data || [];
        }
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }


  onDesignationChange42(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.designationbyCompanydetails.find(
      d => d.designation_Id === selectedId
    );
    if (selected) {
      this.Answer42_3.Designationid = selected.designation_Id;
      this.Answer42_3.DesignationName = selected.designation_Name;
    } else {
      this.Answer42_3.Designationid = '';
      this.Answer42_3.DesignationName = '';
    }
  }

  onSkilledCategoryChange42(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;

    const selected = this.options42_4.find(item => item.id === selectedId);
    if (selected) {
      this.Answer42_3.SkilledCategoryId = selected.id;
      this.Answer42_3.SkilledCategoryName = selected.name;
    } else {
      this.Answer42_3.SkilledCategoryId = '';
      this.Answer42_3.SkilledCategoryName = '';
    }
  }

  Addvalues42_2() {
    this.isSubmitted42_2 = true;
    var payloadcreate;

    if (this.Answer42_3.Designationid === '0' || this.Answer42_3.Designationid === '') {
      return;
    }

    if (this.Answer42_3.SkilledCategoryId === '0' || this.Answer42_3.SkilledCategoryId === '') {
      return;
    }

    const isDuplicate = this.answer42_3GridData.some(
      item =>
        item.designationName === this.Answer42_3.DesignationName
    );

    if (isDuplicate) {
      this.isduplicate42_2 = true;
      return;
    }

    payloadcreate = {
      SOPId: String(42),
      QuestionId: String(42),
      CompanyId: String(this.selectedCompany1),
      Company_Code: '',
      Designationid: String(this.Answer42_3.Designationid),
      DesignationName: String(this.Answer42_3.DesignationName),
      SkilledCategoryId: String(this.Answer42_3.SkilledCategoryId),
      SkilledCategoryName: String(this.Answer42_3.SkilledCategoryName),
      CreatedBy: String(this.employeeId)
    };

    this._authService.PostSOPAnswerDesignation42(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswerDesignation42(String(42), this.selectedCompany1, this.employeeId);
        this.isSubmitted42_2 = false;
        this.isduplicate42_2 = false;
        this.selectedCompany42 = '';
        this.selectedDesignation42 = '';
        this.selectedSkilled42 = '';
        this.Answer42_3.Designationid = '';
        this.Answer42_3.DesignationName = '';
        this.Answer42_3.SkilledCategoryId = '';
        this.Answer42_3.SkilledCategoryName = '';

      },
      error: err => console.error('❌ Error saving Q26', err)
    });
  }

  GetSOPAnswerDesignation42(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswerDesignation42(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.answer42_3GridData = res.Data || [];
        }
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onstate42(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer42_4.StateId = selectedId;
    this.Answer42_4.StateName = selectedName;
    this.GetCity(this.Answer42_4.StateId);
  }

  oncity42(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer42_4.CityId = selectedId;
    this.Answer42_4.CityName = selectedName;
  }

  Addvalues42_3() {
    this.isSubmitted42_3 = true;

    if (this.Answer42_4.StateId == '0' || this.Answer42_4.StateId == '') {
      return;
    }
    if (this.Answer42_4.CityId == '0' || this.Answer42_4.CityId == '') {
      return;
    }

    if (this.Answer42_4.HC == '') {
      return;
    }

    const isDuplicate = this.answer42_4GridData.some(
      item =>
        item.stateName === this.Answer42_4.StateName &&
        item.cityName === this.Answer42_4.CityName
    );

    if (isDuplicate) {
      this.isduplicate42_3 = true;
      return;
    }

    var payloadcreate;

    payloadcreate = {
      SOPId: String(42),
      Company_Id: String(this.selectedCompany1),
      QuestionId: String(42),
      StateId: String(this.Answer42_4.StateId),
      StateName: String(this.Answer42_4.StateName),
      CityId: String(this.Answer42_4.CityId),
      CityName: String(this.Answer42_4.CityName),
      HC: String(this.Answer42_4.HC),
      CreatedBy: String(this.employeeId)
    };

    this._authService.PostSOPAnswerCLRA42(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswerCLRA42(String(42), this.selectedCompany1, this.employeeId);

        this.isSubmitted42_3 = false;
        this.selectedstate42_3 = '';
        this.selectedcity42_3 = '';
        this.Answer42_4.StateId = '';
        this.Answer42_4.StateName = '';
        this.Answer42_4.CityId = '';
        this.Answer42_4.CityName = '';
        this.Answer42_4.HC = '';

      },
      error: err => console.error('❌ Error saving Q26', err)
    });
  }

  GetSOPAnswerCLRA42(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswerCLRA42(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.answer42_4GridData = res.Data || [];
        }
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onSubmitQuestion42() {
    this.isSubmitted42 = true;

    if (this.Answer42_1.IndustryType == '') {
      return;
    }
    var payloadcreate;

    payloadcreate = {
      SOPId: String(42),
      Company_Id: String(this.selectedCompany1),
      QuestionId: String(42),
      IndustryType: String(this.Answer42_1.IndustryType),
      CreatedBy: String(this.employeeId)
    };

    this._authService.PostSOPAnswerCompliance42(payloadcreate).subscribe({
      next: res => {
        this.GetSOPAnswerCompliance42(String(42), this.selectedCompany1, this.employeeId);

        this.Answer42_1.IndustryType = '';

        this.Marked_Answerd(42);
        this.goToNextQuestion();
      },
      error: err => console.error('❌ Error saving Q26', err)
    });



  }

  GetSOPAnswerCompliance42(Questionid, CompanyId, Createdby) {
    this._authService.GetSOPAnswerCompliance42(Questionid, CompanyId, Createdby).subscribe({
      next: res => {
        if (res.Data.length > 0) {
          this.Answer42_1.IndustryType = res.Data[0].industryType;
        }
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  DeleteSOPAnswer31() {
    this._authService.DeleteSOPAnswer31(String(31), this.employeeId).subscribe({
      next: res => {
        this.GetSOPAnswer31(String(31), this.selectedCompany1, this.employeeId);
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  // ViewReimbursmentPolicy() {
  //   window.open(this.Answer31.FilePath, '_blank');
  // }

  ViewReimbursmentPolicy() {

    const fileUrl = this.Answer31.FilePath;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = ''; // Optional - will use the filename from the URL
    a.target = '_blank'; // Optional - opens in new tab if needed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getFileNameFromPath(path: string): string {
    return path.split('/').pop() || 'downloaded-file';
  }

  onCompanyChange7(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer7.CompanyId = selectedId;
    this.GetFirstMonthPayroll(this.Answer7.CompanyId);
  }


  onCompanyChange1(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;
    this.Answer1.Company_Id = selectedId;
    this.Answer1.Company_Code = selectedName;
    this.GetFirstMonthPayroll(this.Answer1.Company_Id);
    this.GetDesignationbyCompany(this.Answer1.Company_Id);
    this.onCategoryClick(this.categorylist[0]);
  }

  GetFirstMonthPayroll(company_Id: any) {
    this._authService.GetFirstMonthPayroll(company_Id).subscribe({
      next: res => {

        this.Answer1.Company_Name = res.Data[0].company_Name;
        this.Answer1.SAP_Code = res.Data[0].saP_Code;
        this.Answer1.MyContract_Reference_ID = res.Data[0].myContract_Reference_ID;
        this.Answer1.Client_Website_link = res.Data[0].client_Website_link;
        this.Answer1.First_Month_Payroll = res.Data[0].first_Month_Payroll;
        this.Answer1.Client_Onboarding_Month = res.Data[0].client_Onboarding_Month;
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  isEnddateserviceDateValid(): boolean {
    const start = this.Answer35?.Agreement_Start_Date;
    const end = this.Answer35?.Agreement_End_Date;

    if (!start || !end) return true; // Allow empty values

    return new Date(end) > new Date(start);
  }

  onCompanyChange42(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;

    const selected = this.userwisecompanydetails.find(
      d => d.company_Id === selectedId
    );

    if (selected) {
      this.Answer42_3.CompanyId = selected.company_Id;
      this.Answer42_3.Company_Code = selectedName;
      this.GetDesignationbyCompany(selected.company_Id);
    } else {
      this.Answer42_3.CompanyId = '';
      this.Answer42_3.Company_Code = '';
    }
  }

  onCompanyChange20(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    const selectedName = selectElement.options[selectElement.selectedIndex].text;

    const selected = this.userwisecompanydetails.find(
      d => d.company_Id === selectedId
    );

    if (selected) {
      this.Answer20.CompanyId = selected.company_Id;
      this.Answer20.Company_Code = selectedName;
      this.GetDesignationbyCompany(selected.company_Id);
    } else {
      this.Answer20.CompanyId = '';
      this.Answer20.Company_Code = '';
    }
  }

  isValidMobile(value: string): boolean {
    return /^[6-9]\d{9}$/.test(value?.trim());
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
    return emailRegex.test(email?.trim());
  }

}
