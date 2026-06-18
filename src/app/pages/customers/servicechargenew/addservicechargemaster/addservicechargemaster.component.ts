import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapnameComponent } from '../../../../common/Mapname/mapname/mapname.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { AddServiceChargeComponent } from '../../ServiceChargeMaster/add-service-charge/add-service-charge.component';
import { AddServicefeeComponent } from '../../ServiceChargeMaster/add-servicefee/add-servicefee.component';
import { ServiceBillToRateComponent } from '../../ServiceChargeMaster/service-bill-to-rate/service-bill-to-rate.component';
import { ServiceSlabComponent } from '../../ServiceChargeMaster/service-slab/service-slab.component';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { COMM_TOKEN } from '../../../PayrollInput/onboarding/onboarding.component';

interface serviceChargemaster {
  Company_Service_Charge_Master_Id: number
  Company_Service_Charge_Type_Id: number
  Service_Charge_Slab_Item_Id: number
  Service_Charge_Slab_Inner_Item_Id: number
  Slab_Id: number
  Cost_Center_Mapping_Id: number
  Map_Name: string
  Invoicing_Type: boolean
  Service_Charge_Name: string
  PayCode_Code: string
  MaxAmount: number
  Type: number
  Value: string
  Effective_Date: string
  IsBillToRate: number
  IsCTC: number
  IsHeadCount: number
  IsAttendanceProrated: number
  IsCriteriaApplicable: number
  Criteria: string
  IsReplacementClauseApplicable: number
  Replacement: number
  IsSourcingWaitingPeriod_Id: number
  SourcingValue: number
  TATDays: number
  IsMapNameRequired: number
  Category_Id: number
  Invoice_Map_Name_Id: number
  Compliance_Fee: number
  RandStad_Fee: number
  UnitType_Id: number
  Discount_Type_Id: number
  Discount_Amount: number
  Type_Id: number
  Pay_Code_Id: number
  From: number
  To: number
  Slab_Calculation_Type_Id: number
  Cap_Value: number
  Upfront_Charge: number
  Upfront_PayCode: string
  Upfront_Type_Id: number
  Insurance_Amount: string
  MarginalPayCodeId: number
  QDemyFee: number
  InEdgeFee: number
  IsNewjoineeProrate: number
  IsFAndFProrate: number
  IsFAndFArrearProrate: number
  IsNewJoineeArrearProrate: number
  QDemyFee_Type_Id: number
  InEdgeFee_Type_Id: number
  employee_Id: number
  employee_code: string
}


@Component({
  selector: 'app-addservicechargemaster',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    AddServicefeeComponent,
    // SupplementaryFeeComponent,
    ReactiveFormsModule,
    // ServiceFixedComponent,
    ServiceBillToRateComponent,
    // ServiceSlabComponent,
    // ServicePercentageComponent,
    // SupplementaryFixedComponent,
    // SupplementaryPercentageComponent,
    MapnameComponent,
    MatAutocompleteModule
  ],
  templateUrl: './addservicechargemaster.component.html',
  styleUrl: './addservicechargemaster.component.css'
})
export class AddservicechargemasterComponent {
  serviceFeeTypes: any;
  selectedService: any;
  supplementaryTypes: any;
  sourcingTypes: any;
  userdetail: any;
  mapnameUI: any;
  mapNameList: any[] = [];
  suppFixForm!: FormGroup;
  employeeSearch: any;
  constructor(
    private dialogRef: MatDialogRef<AddServiceChargeComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService
  ) { }

  // MAIN SECTION VISIBILITIES
  showServiceFeeSection = false;
  showSupplementSection = false;
  showSourcingSection = false;
  showBillToRate = false;

  // SERVICE FEE SUB SECTIONS
  showFixed = false;
  showPercentage = false;
  showBill = false;
  showSlab = false;

  // SUPPLEMENTARY SUB SECTIONS
  showSuppFixed = false;
  showSuppPercentage = false;

  //Billtorate Sub sections
  showBillToRateTable = false;

  serviceChargeMasterList: any[] = [];
  selectedMasterId: number | null = null;
  selectedCompanyId?: number;
  selectedCompanyCode?: string;
  selectedSupplementary: any;
  selectedBillToRate: any;
  invoiceForm!: FormGroup;
  percentageForm!: FormGroup;
  SourcingForm!: FormGroup;
  showErrors = false;
  suppPerForm!: FormGroup;
  billRateForm!: FormGroup;
  selectedSlab = "";                // fixed | percentage
  selectedFixedType = "";           // ctc | headcount
  selectedPercentageType = "";
  ctcForm!: FormGroup;
  headCountForm!: FormGroup;
  ctcPerForm!: FormGroup;
  slabPerHeadForm!: FormGroup;
  billToRateForm!: FormGroup;
  billToRateTypes: any;
  unitTypeList: any;
  empCode: any;
  isLoading = false;
  // employeeControl = new FormControl();
  searchText: any = '';
  filteredEmpCode: any[] = [];

  displayFn(item: any): string {
    return item ? item.Employee_Code : '';
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.selectedCompanyId = this.data.companyId;
    this.selectedCompanyCode = this.data.companyCode;
    this.loadServiceChargeMaster();
  }

  // -------------------------------------------------------
  // LOAD MAIN DROPDOWN (Service Fee / Supplementary Fee)
  // -------------------------------------------------------
  loadServiceChargeMaster() {
    this.serviceChargeService.GetServiceCharge().subscribe({
      next: (res) => {
        this.serviceChargeMasterList =
          res?.Data?.data?.Table0 || [];
      },
      error: () => {
        alert("Failed to load service charge master list");
      }
    });
  }

  loadServiceFeeTypes() {
    const masterId = 1;

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.serviceFeeTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load service fee types", err);
        this.snackBar.open("Failed to load Service Fee types", "Close", { duration: 3000 });
      }
    });
  }

  loadBillToRateTypes() {
    const masterId = 7;

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.billToRateTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load bill to rate types", err);
        this.snackBar.open("Failed to load Bill To Rate types", "Close", { duration: 3000 });
      }
    });
  } s

  // -------------------------------------------------------
  // MAIN DROPDOWN CHANGE
  // -------------------------------------------------------
  onMasterSelected() {
    this.resetAllSections();
    const id = Number(this.selectedMasterId);
    if (id === 1) {
      this.showServiceFeeSection = true;
      this.loadServiceFeeTypes();
    }
    else if (id === 2) {
      this.showSupplementSection = true;
      this.loadSupplementaryTypes();
    }
    else if (id === 3) {

      this.showSourcingSection = true;
      this.SourcingForm = this.fb.group({
        mapName: [''],
        type: ['', Validators.required],
        paycode: ['', Validators.required],
        value: ['', Validators.required],
        replacement_clause: ['', Validators.required],
        replacement: ['', Validators.required],
        source_wait: ['', Validators.required],
        source_value: ['', Validators.required],
        criteria_value: ['', Validators.required],
        tat_days: ['', Validators.required],
        tat_days_type: ['', Validators.required],
        startDate: ['', Validators.required],
        category: ['', Validators.required],
      });
      this.loadSourcingTypes();
      this.loadMapNames();
    }
    // else if (id === 7) {
    //   this.showBillToRate = true;
    //   this.loadBillToRateTypes();
    // }

  }

  onServiceFeeChange() {
    this.resetSubSections();

    this.showFixed = this.selectedService == 1;
    this.showPercentage = this.selectedService == 2;

    this.showBill = this.selectedService == 3;
    this.showSlab = this.selectedService == 4;

    if (this.showFixed) {
      const json = this._sessionStoreage.getItem('UserProfile');
      if (json) {
        this.userdetail = JSON.parse(this._decrypt.decrypt(json));
      }
      this.invoiceForm = this.fb.group({

        //mapName: [null],
        value: [''],
        prorate: ['', Validators.required],

        ffProrate: ['', Validators.required],
        ffArrearprorate: ['', Validators.required],
        newJoineeProrate: ['', Validators.required],

        newJoineeArrearprorate: ['', Validators.required],
        startDate: ['', Validators.required],
        complianceFee: ['', Validators.required],

        randstadFee: ['', Validators.required],
        upfrontFeeType: ['', Validators.required],
        upfrontFee: ['', Validators.required],
        upfrontPayCode: [''],

        insuranceAmount: ['', Validators.required],
        qdemyFeeType: ['', Validators.required],
        qdemyCharge: ['', Validators.required],

        inedgeFeeType: ['', Validators.required],
        inedgeCharge: ['', Validators.required]
      });
    }

    if (this.showPercentage) {
      const json = this._sessionStoreage.getItem('UserProfile');
      if (json) {
        this.userdetail = JSON.parse(this._decrypt.decrypt(json));
      }

      this.percentageForm = this.fb.group({
        mapName: [null],
        paycode: ['FCTC', Validators.required],
        value: ['', Validators.required],
        capValue: ['', Validators.required],
        maxAmount: ['', Validators.required],

        startDate: ['', Validators.required],
        complianceFee: ['', Validators.required],
        randstadFee: ['', Validators.required],
        upfrontFeeType: ['', Validators.required],

        upfrontFee: ['', Validators.required],
        upfrontPaycode: [''],
        insuranceAmount: ['', Validators.required],
        qdemyFeeType: ['', Validators.required],

        qdemyCharge: ['', Validators.required],
        inedgeFeeType: ['', Validators.required],
        inedgeCharge: ['', Validators.required]
      });
      this.loadMapNames();

    }

    if (this.showBill) {
      this.loadUnitType();
      this.loadEmployeeCode();
      this.filteredEmpCode = this.empCode;
      this.billToRateForm = this.fb.group({
        mapName: [''],
        employeeCode: ['', Validators.required],
        UnitPrice: ['', Validators.required],
        UnitType: ['', Validators.required],
        EffectiveDate: ['', Validators.required],
        DiscountType: ['', Validators.required],
        DiscountAmount: ['', Validators.required]
      });
      // this.billRateForm = this.fb.group({
      //   billingCategory: ['', Validators.required],
      //   unitPrice: ['', Validators.required],
      //   unitType: ['', Validators.required],

      //   invoiceCategory: ['', Validators.required],
      //   mapName: ['', Validators.required],
      //   startDate: ['', Validators.required],

      //   discountType: ['', Validators.required],
      //   discountAmount: ['', Validators.required],
      //   prorate: ['', Validators.required]
      // });

      // this.loadMapNames();
      // this.getBillingCategories();
    }

    if (this.showSlab) {
      this.openSlabSection();
      if (this.selectedFixedType == 'ctc') {
        this.ctcForm = this.fb.group({
          mapName: ['', Validators.required],
          type: ['', Validators.required],
          paycode: ['', Validators.required],
          fromValue: ['', Validators.required],
          toValue: ['', Validators.required],
          value: ['', Validators.required],
          capValue: ['', Validators.required],
          prorate: ['', Validators.required],
          startDate: ['', Validators.required],
          slabCalcType: ['', Validators.required]
        });
      }
      if (this.selectedFixedType == 'headcount') {
        this.headCountForm = this.fb.group({
          mapName: ['', Validators.required],
          isMapNameRequired: ['', Validators.required],
          slab: ['', Validators.required],
          value: ['', Validators.required],
          startDate: ['', Validators.required]
        });
      }
      if (this.selectedPercentageType === 'ctc') {
        this.ctcPerForm = this.fb.group({
          mapName: ['', Validators.required],
          value: ['', Validators.required],
          prorate: ['', Validators.required],

          ffProrate: ['', Validators.required],
          ffArrearProrate: ['', Validators.required],
          newJoineeProrate: ['', Validators.required],

          newJoineeArrearProrate: ['', Validators.required],
          startDate: ['', Validators.required],
          complianceFee: ['', Validators.required],

          randstadFee: ['', Validators.required],
          upfrontFeeType: ['', Validators.required]
        });
      }
      if (this.selectedPercentageType === 'headcount') {
        this.slabPerHeadForm = this.fb.group({
          mapName: ['', Validators.required],
          isMapNameRequired: ['', Validators.required],
          slab: ['', Validators.required],
          value: ['', Validators.required],
          startDate: ['', Validators.required]
        });
      }
    }
  }

  handleMapNameEvent(mapname: any) {
    this.mapnameUI = mapname;
  }

  onSave() {
    this.showErrors = true;
    this.isLoading = true;
    if (!this.mapnameUI) {
      alert("Please select Map Name");
      return;
    }
    if (this.invoiceForm.invalid) return;

    const f = this.invoiceForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: Number(this.selectedMasterId),
      Company_Service_Charge_Type_Id: Number(this.selectedService),
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: "",
      MaxAmount: 0,
      Type: 0,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: f.prorate,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: 0,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: f.complianceFee,
      RandStad_Fee: f.randstadFee,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: 0,
      Cap_Value: 0,
      Upfront_Charge: f.upfrontFee,
      Upfront_PayCode: f.upfrontPayCode,
      Upfront_Type_Id: f.upfrontFeeType,
      Insurance_Amount: f.insuranceAmount,
      MarginalPayCodeId: 0,
      QDemyFee: f.qdemyCharge,
      InEdgeFee: f.inedgeCharge,
      IsNewjoineeProrate: f.newJoineeProrate,
      IsFAndFProrate: f.ffProrate,
      IsFAndFArrearProrate: f.ffArrearprorate,
      IsNewJoineeArrearProrate: f.newJoineeArrearprorate,
      QDemyFee_Type_Id: f.qdemyFeeType,
      InEdgeFee_Type_Id: f.inedgeFeeType,
      employee_Id: 0,
      employee_code: ""
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          // this.dialogRef.close(true);
          this.showFixed = false;
          this.onReset();
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });
  }

  onReset() {
    this.invoiceForm.reset();
    this.showErrors = false;
  }


  onSubmit() {
    this.showErrors = true;
    this.isLoading = true;
    if (!this.mapnameUI) {
      alert("Please select Map Name");
      return;
    }
    if (this.percentageForm.invalid) return;

    const f = this.percentageForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: Number(this.selectedMasterId),
      Company_Service_Charge_Type_Id: Number(this.selectedService),
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: f.paycode,
      MaxAmount: f.maxAmount,
      Type: 0,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: 0,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: 0,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: f.complianceFee,
      RandStad_Fee: f.randstadFee,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: 0,
      Cap_Value: 0,
      Upfront_Charge: f.upfrontFee,
      Upfront_PayCode: f.upfrontPayCode,
      Upfront_Type_Id: f.upfrontFeeType,
      Insurance_Amount: f.insuranceAmount.toString(),
      MarginalPayCodeId: 0,
      QDemyFee: f.qdemyCharge,
      InEdgeFee: f.inedgeCharge,
      IsNewjoineeProrate: 0,
      IsFAndFProrate: 0,
      IsFAndFArrearProrate: 0,
      IsNewJoineeArrearProrate: 0,
      QDemyFee_Type_Id: f.qdemyFeeType,
      InEdgeFee_Type_Id: f.inedgeFeeType,
      employee_Id: 0,
      employee_code: ""
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.showPercentage = false;
          // this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });
  }


  onResetPercentageForm() {
    this.percentageForm.reset();
    this.showErrors = false;
  }

  loadMapNames() {
    this.serviceChargeService.GetCostCenterMapping().subscribe({
      next: (res: any) => {
        this.mapNameList = res?.Data || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }

  onSupplementaryChange() {
    this.resetSubSections();

    this.showSuppFixed = this.selectedSupplementary == 1;
    this.showSuppPercentage = this.selectedSupplementary == 2;
    if (this.showSuppFixed) {
      this.suppFixForm = this.fb.group({
        mapName: ['', Validators.required],
        paycode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        slab: ['', Validators.required],
        value: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        startDate: ['', Validators.required]
      });
      this.loadMapNames();
    }
    if (this.showSuppPercentage) {
      this.suppPerForm = this.fb.group({
        mapName: ['', Validators.required],
        paycode: ['', Validators.required],
        value: ['', Validators.required],

        maxAmount: ['', Validators.required],
        startDate: ['', Validators.required],
        marginalPaycode: ['', Validators.required]
      });
      this.loadMapNames();
    }
  }

  loadUnitType() {
    this.serviceChargeService.LoadUnitType().subscribe({
      next: (res: any) => {
        this.unitTypeList = res?.Data.data.Table0 || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }

  loadEmployeeCode() {
    const companyId = this.data.companyId;
    const empid = 0;

    this.serviceChargeService.loadEmployee(companyId, empid).subscribe({
      next: (res: any) => {
        this.empCode = res?.Data?.data?.Table0 || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }

  filterEmployee(event: any) {

    const search = event.target.value.toLowerCase();

    this.filteredEmpCode = this.empCode.filter((x: any) =>
      x.Employee_Code.toLowerCase().includes(search)
    );

  }

  onEmployeeSelected(item: any) {

    this.billToRateForm.patchValue({
      employeeCode: item
    });

  }
  clearSearch() {
    this.searchText = '';
    this.billToRateForm.get('employeeCode')?.setValue('');
    this.filteredEmpCode = this.empCode;
  }


  // onBillToRateChange() {
  //   // this.resetBillSections();
  //   this.showBillToRateTable =
  //     this.selectedBillToRate == 1 ||
  //     this.selectedBillToRate == 2;

  //   if (this.showBillToRateTable) {
  //     this.loadUnitType();
  //     this.loadEmployeeCode();
  //     this.filteredEmpCode = this.empCode;
  //     this.billToRateForm = this.fb.group({
  //       employeeCode: ['', Validators.required],
  //       UnitPrice: ['', Validators.required],
  //       UnitType: ['', Validators.required],
  //       EffectiveDate: ['', Validators.required],
  //       DiscountType: ['', Validators.required],
  //       DiscountAmount: ['', Validators.required]
  //     });
  //   }
  // }
  allowNumbersOnly(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');
    input.value = input.value.replace(/(\..*)\./g, '$1');
    this.suppFixForm.get(input.getAttribute('formControlName')!)?.setValue(input.value);
  }

  fixedslabChange() {
    if (this.selectedFixedType == 'headcount') {
      this.headCountForm = this.fb.group({
        mapName: ['', Validators.required],
        isMapNameRequired: ['', Validators.required],
        slab: ['', Validators.required],
        value: ['', Validators.required],
        startDate: ['', Validators.required]
      });
    }
  }

  onSuppFixedReset() {
    this.suppFixForm.reset();
    this.showErrors = false;
  }

  onSuppFixedSubmit() {
    this.showErrors = true;

    if (this.suppFixForm.invalid) {
      return;
    }

  }

  onSuppPerSubmit() {
    this.showErrors = true;

    if (this.suppPerForm.invalid) {
      return; // show errors and stop
    }

    this.dialogRef.close(this.suppPerForm.value);
  }

  onSuppPerReset() {
    this.suppPerForm.reset();
    this.showErrors = false;
  }

  onBillToRateReset() {
    this.billRateForm.reset();
    this.showBillToRateTable = false;
  }

  onSourceReset() {
    this.SourcingForm.reset();
    this.showErrors = false;
  }

  onSourceSubmit() {
    this.showErrors = true;
    this.isLoading = true;
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this._decrypt.decrypt(json));
    }
    if (this.SourcingForm.invalid) {
      return; // show errors and stop
    }

    if (!this.mapnameUI) {
      alert("Please select Map Name");
      return;
    }

    const f = this.SourcingForm.value;
    const Sourcingmaster: any[] = [];

    Sourcingmaster.push({
      Company_Service_Charge_Master_Id: Number(this.selectedMasterId),
      Company_Service_Charge_Type_Id: Number(f.type),
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: f.paycode,
      MaxAmount: 0,
      Type: 0,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: f.prorate,
      IsCriteriaApplicable: 0,
      Criteria: f.criteria_value,
      IsReplacementClauseApplicable: f.replacement_clause,
      Replacement: f.replacement,
      IsSourcingWaitingPeriod_Id: f.source_wait,
      SourcingValue: f.source_value,
      TATDays: f.tat_days,
      IsMapNameRequired: 0,
      Category_Id: f.category,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: f.complianceFee,
      RandStad_Fee: f.randstadFee,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: 0,
      Cap_Value: 0,
      Upfront_Charge: f.upfrontFee,
      Upfront_PayCode: f.upfrontPayCode,
      Upfront_Type_Id: f.upfrontFeeType,
      Insurance_Amount: f.insuranceAmount,
      MarginalPayCodeId: 0,
      QDemyFee: f.qdemyCharge,
      InEdgeFee: f.inedgeCharge,
      IsNewjoineeProrate: f.newJoineeProrate,
      IsFAndFProrate: f.ffProrate,
      IsFAndFArrearProrate: f.ffArrearprorate,
      IsNewJoineeArrearProrate: f.newJoineeArrearprorate,
      QDemyFee_Type_Id: f.qdemyFeeType,
      InEdgeFee_Type_Id: f.inedgeFeeType,
      TATDaysType: f.tat_days_type
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: Sourcingmaster
    }

    this.serviceChargeService.SaveSourcingType(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Sourcing Type saved successfully");
          this.showSourcingSection = false;
          // this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });
  }


  getBillingCategories() {
    this.serviceChargeService.GetCostCenterMapping().subscribe({
      next: (res: any) => {
        this.mapNameList = res?.Data || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }

  onBillSubmit() {
    this.showErrors = true;

    if (this.billRateForm.invalid) return;
  }

  onBillReset() {
    this.billRateForm.reset();
    this.showErrors = false;
  }

  // Called when "Slab" dropdown changes
  openSlabSection() {
    // Reset inner dropdowns
    this.selectedFixedType = "";
    this.selectedPercentageType = "";
  }

  onSlabCtcSubmit() {
    alert("true");

    if (this.ctcForm.invalid) {
      return;
    }
    this.showErrors = true;

    this.isLoading = true;
    const f = this.ctcForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: 0,
      Company_Service_Charge_Type_Id: 0,
      Service_Charge_Slab_Item_Id: Number(this.selectedSlab),
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: f.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: f.paycode,
      MaxAmount: 0,
      Type: f.type,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: f.prorate,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: 0,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: 0,
      RandStad_Fee: 0,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: f.fromValue,
      To: f.toValue,
      Slab_Calculation_Type_Id: f.slabCalcType,
      Cap_Value: f.capValue,
      Upfront_Charge: 0,
      Upfront_PayCode: '',
      Upfront_Type_Id: 0,
      Insurance_Amount: "",
      MarginalPayCodeId: 0,
      QDemyFee: 0,
      InEdgeFee: 0,
      IsNewjoineeProrate: 0,
      IsFAndFProrate: 0,
      IsFAndFArrearProrate: 0,
      IsNewJoineeArrearProrate: 0,
      QDemyFee_Type_Id: 0,
      InEdgeFee_Type_Id: 0,
      employee_Id: 0,
      employee_code: ""
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.selectedFixedType = "";
          // this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });

    // console.log("Slab Fixed CTC Submitted:", this.ctcForm.value);
    // this.dialogRef.close(this.ctcForm.value);
  }

  onSlabCtcReset() {
    this.ctcForm.reset();
    this.showErrors = false;
  }

  onSlabHeadCountSubmit() {
    this.showErrors = true;
    this.isLoading = true;
    if (this.headCountForm.invalid) {
      return; // stop and show errors
    }

    const f = this.headCountForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: 0,
      Company_Service_Charge_Type_Id: 0,
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: f.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: "",
      MaxAmount: 0,
      Type: 0,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: f.prorate,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: f.isMapNameRequired,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: 0,
      RandStad_Fee: 0,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: f.slab,
      Cap_Value: 0,
      Upfront_Charge: 0,
      Upfront_PayCode: '',
      Upfront_Type_Id: 0,
      Insurance_Amount: "",
      MarginalPayCodeId: 0,
      QDemyFee: 0,
      InEdgeFee: 0,
      IsNewjoineeProrate: 0,
      IsFAndFProrate: 0,
      IsFAndFArrearProrate: 0,
      IsNewJoineeArrearProrate: 0,
      QDemyFee_Type_Id: 0,
      InEdgeFee_Type_Id: 0,
      employee_Id: 0,
      employee_code: ""
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.selectedFixedType = "";
          // this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });

    this.dialogRef.close(this.headCountForm.value);
  }

  onSlabHeadCountReset() {
    this.headCountForm.reset();
    this.showErrors = false;
  }

  onSlabPerCtcSubmit() {
    this.showErrors = true;

    if (this.ctcForm.invalid) return;

    this.selectedPercentageType = "";
    this.dialogRef.close(this.ctcForm.value);
  }

  onSalbPerCtcReset() {
    this.ctcForm.reset();
    this.showErrors = false;
  }

  onBillToRateSubmit() {
    this.showErrors = true;
    this.isLoading = true;
    if (this.billToRateForm.invalid) {
      alert("Please fill all required fields")
      return;
    }

    const f = this.billToRateForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: Number(this.selectedMasterId),
      Company_Service_Charge_Type_Id: Number(this.selectedService),
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: '',
      MaxAmount: 0,
      Type: 0,
      Value: f.UnitPrice,
      Effective_Date: f.EffectiveDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: 0,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: 0,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: 0,
      RandStad_Fee: 0,
      UnitType_Id: f.UnitType,
      Discount_Type_Id: f.DiscountType,
      Discount_Amount: f.DiscountAmount,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: 0,
      Cap_Value: 0,
      Upfront_Charge: 0,
      Upfront_PayCode: '',
      Upfront_Type_Id: 0,
      Insurance_Amount: "",
      MarginalPayCodeId: 0,
      QDemyFee: 0,
      InEdgeFee: 0,
      IsNewjoineeProrate: 0,
      IsFAndFProrate: 0,
      IsFAndFArrearProrate: 0,
      IsNewJoineeArrearProrate: 0,
      QDemyFee_Type_Id: 0,
      InEdgeFee_Type_Id: 0,
      employee_Id: f.employeeCode.Employee_Id,
      employee_code: f.employeeCode.Employee_Code

    });

    const request = {
      Created_By: this.userdetail?.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }
    console.log("service", JSON.stringify(request));

    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          // this.dialogRef.close(true);
          this.showBillToRateTable = false;
          this.billToRateForm.reset();
          this.billToRateTypes = null;
          this.onBillToRateReset();
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });
  }

  onSlabPerheadcountSubmit() {
    this.showErrors = true;
    this.isLoading = true;
    if (this.slabPerHeadForm.invalid) {
      return; // show error and stop
    }

    const f = this.slabPerHeadForm.value;

    const ServiceChargemaster: serviceChargemaster[] = [];

    ServiceChargemaster.push({
      Company_Service_Charge_Master_Id: 0,
      Company_Service_Charge_Type_Id: 0,
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Slab_Id: 0,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Map_Name: f.mapName,
      Invoicing_Type: false,
      Service_Charge_Name: "",
      PayCode_Code: "",
      MaxAmount: 0,
      Type: 0,
      Value: f.value.toString(),
      Effective_Date: f.startDate,
      IsBillToRate: 0,
      IsCTC: 0,
      IsHeadCount: 0,
      IsAttendanceProrated: f.prorate,
      IsCriteriaApplicable: 0,
      Criteria: "",
      IsReplacementClauseApplicable: 0,
      Replacement: 0,
      IsSourcingWaitingPeriod_Id: 0,
      SourcingValue: 0,
      TATDays: 0,
      IsMapNameRequired: f.isMapNameRequired,
      Category_Id: 0,
      Invoice_Map_Name_Id: 0,
      Compliance_Fee: 0,
      RandStad_Fee: 0,
      UnitType_Id: 0,
      Discount_Type_Id: 0,
      Discount_Amount: 0,
      Type_Id: 0,
      Pay_Code_Id: 0,
      From: 0,
      To: 0,
      Slab_Calculation_Type_Id: f.slab,
      Cap_Value: 0,
      Upfront_Charge: 0,
      Upfront_PayCode: '',
      Upfront_Type_Id: 0,
      Insurance_Amount: "",
      MarginalPayCodeId: 0,
      QDemyFee: 0,
      InEdgeFee: 0,
      IsNewjoineeProrate: 0,
      IsFAndFProrate: 0,
      IsFAndFArrearProrate: 0,
      IsNewJoineeArrearProrate: 0,
      QDemyFee_Type_Id: 0,
      InEdgeFee_Type_Id: 0,
      employee_Id: 0,
      employee_code: ""
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.selectedPercentageType = "";
          // this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: (err) => {

        this.isLoading = false;

        console.error(err);

        alert("Failed");

      }
    });

    this.dialogRef.close(this.slabPerHeadForm.value);
  }

  onSlabPerheadcountReset() {
    this.slabPerHeadForm.reset();
    this.showErrors = false;
  }

  loadSupplementaryTypes() {

    const masterId = 2; // Supplementary Fee master ID

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.supplementaryTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load supplementary fee types", err);
      }
    });
  }

  loadSourcingTypes() {

    const masterId = 3; // Supplementary Fee master ID

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.sourcingTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load supplementary fee types", err);
      }
    });
  }

  // -------------------------------------------------------
  // CHILD → SERVICE FEE SELECTED TYPE
  // -------------------------------------------------------
  showFixedSection() {
    this.resetSubSections();
    this.showFixed = true;
  }

  showPercentageSection() {
    this.resetSubSections();
    this.showPercentage = true;
  }

  showBillToRateSection() {
    this.resetSubSections();
    this.showBill = true;
  }

  showSlabSection() {
    this.resetSubSections();
    this.showSlab = true;
  }

  // -------------------------------------------------------
  // CHILD → SUPPLEMENTARY SELECTED TYPE
  // -------------------------------------------------------
  selectSupplementType(type: string) {
    this.resetSubSections();

    this.showSuppFixed = type === "fixed";
    this.showSuppPercentage = type === "percentage";
  }

  // -------------------------------------------------------
  // RESET HELPERS
  // -------------------------------------------------------
  resetAllSections() {
    this.showServiceFeeSection = false;
    this.showSupplementSection = false;
    this.showSourcingSection = false;
    this.showBillToRate = false;
    this.resetSubSections();
  }

  resetSubSections() {
    this.showFixed = false;
    this.showPercentage = false;
    this.showBill = false;
    this.showSlab = false;

    this.showSuppFixed = false;
    this.showSuppPercentage = false;
    //billtorate rest
    this.showBillToRateTable = false;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  downloadTemplate() {
    const templateData = [
      {
        COMPANY_CODE: this.selectedCompanyCode,
        MAP_NAME: "",
        EMPLOYEE_CODE: "",
        EFFECTIVE_DATE: "",
        UNIT_PRICE: "",
        UNIT_TYPE: "",
        DISCOUNT_TYPE: "",
        DISCOUNT_AMOUNT: ""

      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    const today = new Date();

    const formattedDate =
      today.getDate().toString().padStart(2, '0') + '_' +
      (today.getMonth() + 1).toString().padStart(2, '0') + '_' +
      today.getFullYear();

    FileSaver.saveAs(blob, `ServiceFeeBillToRate_${formattedDate}.xlsx`);
  }


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please upload only one Excel file")
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.serviceChargeService.upload(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Uploaded Successfully.")) {
          this.isLoading = false;
          alert(res?.Data?.response)
          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200) {
          // Optional debug
          // alert('1');
          this.isLoading = false;
          // errors[0] may be a JSON string, an array, or a plain string/object
          const rawErr = res?.Data?.errors?.[0];
          let errorArray: any[] = [];
          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_ServiceFeeBilltoRate.xlsx');
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          alert(res.Data[0].Error_Message)
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → fallback
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback)
        } else {
          alert('Error while processing response.')
        }

        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
        alert("Upload Failed")
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }

}
