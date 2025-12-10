import { Component, Inject, InjectionToken } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio'; // <-- import this
import { EmployeeInformationComponent } from '../employee-information/employee-information.component';
import { EmployeeContactdetailsComponent } from '../employee-contactdetails/employee-contactdetails.component';
import { EmployeePersonaldetailComponent } from '../employee-personaldetail/employee-personaldetail.component';
import { MatTabsModule } from "@angular/material/tabs";
import { EmployeePreviousemploymentComponent } from '../employee-previousemployment/employee-previousemployment.component';
import { EmployeeBankdetailsComponent } from '../employee-bankdetails/employee-bankdetails.component';
import { EmployeeSalarydetailsComponent } from '../employee-salarydetails/employee-salarydetails.component';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { APIResponse } from '../../../Models/apiresponse';
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');


@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [MatCardModule, MatIconModule, FormsModule, CommonModule, ReactiveFormsModule, MatRadioModule, MatTabsModule, PayPeriodComponent],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeeAddComponent {
  employeeForm!: FormGroup
  rowData: any;
  sprstatus: any;
  Mapname: any;
  Paycategory: any;
  Costcenter: any;
  Department: any;
  Businessunit: any;
  Designation: any;
  Billingdesignation: any;
  groupname: any;
  Hiringstatus: any[] = [];
  employmenttype: any;
  row: any;
  payPeriod!: Payperiodclass;
  payperiodId: any;
  payperiods: any;
  payPeriodType!: string;
  selectedCompanyId: any;
  userdetail: any;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IEmployeeservice, private dialogRef: MatDialogRef<EmployeeAddComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) {
    this.rowData = data.rowData;
    this.selectedCompanyId = this.rowData.Company_Id;

  }
  handleFFPayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log(this.selectedCompanyId)
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log(this.selectedCompanyId)
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.selectedCompanyId = this.rowData.Company_Id;
    console.log('company', this.selectedCompanyId);

    // Initialize the form
    this.employeeForm = this.fb.group({
      empid: [this.rowData.Employee_Code, Validators.required],
      CompanyCode: [this.rowData.Company_Code, Validators.required],
      sprstatus: [this.rowData.spr_status_id || '', Validators.required],
      firstname: [this.rowData.First_Name, Validators.required],
      middlename: [this.rowData.Middle_Name || ''],
      lastname: [this.rowData.Last_Name || ''],
      fathername: [this.rowData.Father_Name || ''],
      LanguageKnown: [this.rowData.Languages_Known || ''],
      gender: [this.rowData.Gender === true ? true : false, Validators.required],
      materialstatus: [this.rowData.Marital_Status, Validators.required],
      DOB: [this.rowData.Date_Of_Birth ? this.formatDate(this.rowData.Date_Of_Birth) : '', Validators.required],
      disability: [this.rowData.Disability === true ? true : false, Validators.required],
      Mapname: [this.rowData.Cost_Center_Mapping_Id || ''],
      DOJ: [this.rowData.Date_Of_Joining ? this.formatDate(this.rowData.Date_Of_Joining) : '', Validators.required],
      paycategory: [Number(this.rowData.Pay_Category_Id), Validators.required],
      Costcenter: [this.rowData.Cost_Center_Mapping_Id || ''],
      joinpayperiod: [this.rowData.Joining_Pay_Period, Validators.required],
      PTState: [this.rowData.PT_State || ''],
      Businessunit: [this.rowData.Entity_Id, Validators.required],
      Effectivedate: [this.rowData.Effective_Date ? this.formatDate(this.rowData.Effective_Date) : '', Validators.required],
      LWFState: [this.rowData.LWF_State || ''],
      Businessunitlocation: [this.rowData.Entity_Location_Id || ''],
      department: [this.rowData.Department_Id || '', Validators.required],
      worklocation: [this.rowData.Work_Location || ''],
      usergroup: [this.rowData.User_Group_Id || ''],
      designation: [this.rowData.Designation_Id || ''],
      ikyalocation: [this.rowData.IKYA_Location || ''],
      DateOfResignation: [this.rowData.Resignation_Date ? this.formatDate(this.rowData.Resignation_Date) : ''],
      DMSId: [this.rowData.DMS_Id || ''],
      Billingdesignation: [this.rowData.Billing_Designation_Name || ''],
      FandFPayPeriod: [this.rowData.F_Resign_Period || ''],
      ETDSSequence: [this.rowData.ETDS_Sequence || ''],
      PT: [this.rowData.PT || ''],
      ResignPayPeriod: [this.rowData.Resign_Period || ''],
      Contractexpirydate: [this.rowData.Contract_Expiry_Date ? this.formatDate(this.rowData.Contract_Expiry_Date) : ''],
      Active: [this.rowData.EActive === true ? true : false, Validators.required],
      Lastworkingdays: [this.rowData.Last_Working_Day || ''],
      groupname: [Number(this.rowData.Group_Detail_Id) || 0],
      Metrocity: [this.rowData.Is_Metro_City || ''],
      blacklisted: [this.rowData.is_black_listed === true ? true : false],
      ROL: [this.rowData.Abscond_Reporting_Date || ''],
      Hiringstatus: [this.rowData.Hiring_Status || ''],
      PF: [this.rowData.Is_PF_Applicable === true ? true : false, Validators.required || ''],
      Reportmanager: [this.rowData.Report_Manager || ''],
      Deputeeid: [this.rowData.Deputee_Id || ''],
      ESI: [this.rowData.ESI_Number || ''],
      blank: [''],
      Reportheademail: [this.rowData.Reporting_Head_Email || ''],
      Rejoineedate: [this.rowData.Rejoining_Date ? this.formatDate(this.rowData.Rejoining_Date) : ''],
      Insurance: [this.rowData.Is_Insurance_Applicable === true ? true : false],
      Businesshead: [this.rowData.Business_Head || ''],
      Rejoinmonth: [this.rowData.Rejoin_Month || ''],
      stoppayment: [this.rowData.Stop_Payment === true ? true : false],
      axpertid: [this.rowData.Axpert_Id || ''],
      bloodgroup: [this.rowData.Blood_Group || ''],
      employmenttype: [this.rowData.EMPLOYMENT_TYPE || ''],
      TaxRegime: [this.rowData.New_Tax_Regime || ''],
      Vertical: [this.rowData.Vertical_Name || ''],
      Product: [this.rowData.ProductId || ''],
      Channel: [this.rowData.ChannelId || ''],
      subvertical: [this.rowData.SubVerticalId || ''],
      Abscondreportingdate: [this.rowData.Abscond_Reporting_Date ? this.formatDate(this.rowData.Abscond_Reporting_Date) : ''],
      DOD: [this.rowData.Date_Of_Death ? this.formatDate(this.rowData.Date_Of_Death) : '']
    });

    console.log('Row Data:', this.rowData);
    this.BindSprstatus();
    this.BindMaterialStatus();
    this.BindMapname();
    this.BindPayCategory();
    this.Bindcostcenter();
    this.BindDepatment();
    this.BindBusinessunit();
    this.BindDesination();
    this.BindBillingDesignation();
    this.BindGroupname();
    this.BindHiringStatus();
    this.BindEmployeementType();
    this.BindBloodGroup();
    this.payPeriodType = "All";
  }

  BindSprstatus() {
    this.service.Getsprstatus().subscribe({
      next: res => { this.sprstatus = res.Data.data }
    });
  }
  materialstatus: string[] = [];

  BindMaterialStatus() {
    this.service.GetMaterialStatus().subscribe({
      next: (res) => {
        this.materialstatus = res.Data.data;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindMapname() {
    const companyid = this.rowData.Company_Id;
    this.service.GetMapname(companyid).subscribe({
      next: (res) => {
        this.Mapname = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindPayCategory() {
    const companyid = this.rowData.Company_Id;
    this.service.GetPaycategory(companyid).subscribe({
      next: (res) => {
        this.Paycategory = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  Bindcostcenter() {
    const companyid = this.rowData.Company_Id;
    this.service.Getcostcenter(companyid).subscribe({
      next: (res) => {
        this.Costcenter = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindBusinessunit() {
    this.service.GetBusinessunit().subscribe({
      next: (res) => {
        this.Businessunit = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindDepatment() {
    const companyid = this.rowData.Company_Id;
    this.service.GetDepartment(companyid).subscribe({
      next: (res) => {
        this.Department = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindDesination() {
    const companyid = this.rowData.Company_Id;
    this.service.GetDesignation(companyid).subscribe({
      next: (res) => {
        this.Designation = res.Data.data.Table0;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindBillingDesignation() {
    const companyid = this.rowData.Company_Id;
    this.service.GetBillingDesignation(companyid).subscribe({
      next: res => { this.Billingdesignation = res.Data.data }
    });
  }
  BindGroupname() {
    const companyid = this.rowData.Company_Id;
    this.service.GetGroupName(companyid).subscribe({
      next: res => { this.groupname = res.Data.data.Table0 }
    });
  }
  BindHiringStatus() {
    this.service.GetHiringstatus().subscribe({
      next: (res) => {
        this.Hiringstatus = res.Data.data;
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  BindEmployeementType() {
    this.service.GetEmploymenttype().subscribe({
      next: (res) => {
        this.employmenttype = res.Data.data.Table0;
        console.log(this.employmenttype)
      },
      error: (err) => {
        console.error('Error fetching material status', err);
      }
    });
  }
  Bloodgroup: string[] = [];

  BindBloodGroup() {
    this.service.GetBloodGroup().subscribe({
      next: (res) => {
        this.Bloodgroup = res.Data?.data ?? [];
        console.log("Bloodgroup List:", this.Bloodgroup);
      },
      error: (err) => {
        console.error("Error fetching blood group", err);
        this.Bloodgroup = [];
      }
    });

  }

  onsave(): Promise<void> {
    this.submitted = true;

    return new Promise<void>((resolve, reject) => {

      if (this.employeeForm.invalid) {
        this.employeeForm.markAllAsTouched();
        reject("Form validation failed");
        return;
      }

      const raw = this.employeeForm.getRawValue();

      const payload = {
        createdBy: this.userdetail.user_Id,
        detail: {
          Employee_Id: this.rowData.Employee_Id ?? '',
          Employee_Code: raw.empid ?? '',
          SPR_Status: raw.sprstatus ?? '',
          Effective_Date: raw.Effectivedate ?? '',
          First_Name: raw.firstname ?? '',
          Middle_Name: raw.middlename ?? '',
          Last_Name: raw.lastname ?? '',
          Father_Name: raw.fathername ?? '',
          Company_Id: this.rowData.Company_Id ?? '',
          Company_Code: raw.CompanyCode ?? '',
          Gender: raw.gender ?? '',
          Languages_Known: raw.LanguageKnown ?? '',
          Blood_Group: raw.bloodgroup ?? '',
          Disability: raw.disability ?? '',
          Date_Of_Birth: raw.DOB ?? '',
          Cost_Center_Mapping_Id: raw.Mapname ?? '',
          Marital_Status: raw.materialstatus ?? '',
          Hiring_Status: raw.Hiringstatus ?? '',
          Deputee_Id: raw.Deputeeid ?? '',
          DMS_Id: raw.DMSId ?? '',
          Entity_Location_Id: raw.Businessunitlocation ?? '',
          Group_Detail_Id: raw.groupname ?? '',
          Business_Head: raw.Businesshead ?? '',
          Report_Manager: raw.Reportmanager ?? '',
          Reporting_Head_Email: raw.Reportheademail ?? '',
          Reason_Of_Leaving: raw.ROL ?? '',
          Date_Of_Joining: raw.DOJ ?? '',
          Rejoinee_Date: raw.Rejoineedate ?? '',
          Joining_Pay_Period: raw.joinpayperiod ?? '',
          Department_Id: raw.department ?? '',
          Band_Id: raw.paycategory ?? '',
          Rejoin_Month: raw.Rejoinmonth ?? '',
          Stop_Payment: raw.stoppayment ?? '??',
          Designation_Id: raw.designation ?? '',
          Work_Location: raw.worklocation ?? '',
          Is_PF_Applicable: raw.PF ?? '',
          Is_Insurance_Applicable: raw.Insurance ?? '',
          Resignation_Date: raw.DateOfResignation ?? '',
          Last_Working_Day: raw.Lastworkingdays ?? '',
          Resign_Period: raw.ResignPayPeriod ?? '',
          EntityID: raw.Businessunit ?? '',
          EActive: raw.Active ?? '',
          Axpert_Id: raw.axpertid ?? '',
          Is_Black_Listed: raw.blacklisted ?? '',
          Date_Of_Death: raw.DOD ?? '',
          Death_DocPath: ""
        }
      };



      console.log("Payload:", JSON.stringify(payload));

      this.service.Addemployeesave(payload).subscribe({
        next: (res: APIResponse) => {
          console.log(res)
          const msg = res.Data.message;

          if (msg.includes('Success')) {
            alert(msg)
            resolve();
          } else {
            alert(msg);
            reject('API returned failure');
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          reject(err);
        }
      });

    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  InfoOpen() {
    this.dialog.open(EmployeeInformationComponent, {
      width: '50%',
      height: '80vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }

  ContactdetailsOpen() {
    this.dialog.open(EmployeeContactdetailsComponent, {
      width: '50%',
      height: '43vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }
  PersonaldetailsOpen() {
    this.dialog.open(EmployeePersonaldetailComponent, {
      width: '50%',
      height: '55vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }

  BankdetailsOpen() {
    this.dialog.open(EmployeeBankdetailsComponent, {
      width: '50%',
      height: '80vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }
  PreviousemployementOpen() {
    this.dialog.open(EmployeePreviousemploymentComponent, {
      width: '60%',
      height: '43vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }
  SalaryDetailsOpen() {
    this.dialog.open(EmployeeSalarydetailsComponent, {
      width: '65%',
      height: '78vh',
      disableClose: true,
      data: { rowData: this.rowData }
    });
  }

}
