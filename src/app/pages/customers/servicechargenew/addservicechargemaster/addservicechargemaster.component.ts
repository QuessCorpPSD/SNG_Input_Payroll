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
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { AddServiceChargeComponent } from '../../ServiceChargeMaster/add-service-charge/add-service-charge.component';
import { AddServicefeeComponent } from '../../ServiceChargeMaster/add-servicefee/add-servicefee.component';
import { ServiceBillToRateComponent } from '../../ServiceChargeMaster/service-bill-to-rate/service-bill-to-rate.component';
import { ServiceSlabComponent } from '../../ServiceChargeMaster/service-slab/service-slab.component';

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
  Upfront_PayCode: number
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
    //NapsserviceFixedComponent,
    //NapsservicePercentageComponent,
    //SourcingFeeComponent,
    //NAPSserviceFeeComponent,
  ],
  templateUrl: './addservicechargemaster.component.html',
  styleUrl: './addservicechargemaster.component.css'
})
export class AddservicechargemasterComponent {
  serviceFeeTypes: any;
  selectedService: any;
  supplementaryTypes: any;
  userdetail: any;
  mapnameUI: any;
  mapNameList: any[] = [];
  suppFixForm!: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<AddServiceChargeComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // MAIN SECTION VISIBILITIES
  showServiceFeeSection = false;
  showSupplementSection = false;

  // SERVICE FEE SUB SECTIONS
  showFixed = false;
  showPercentage = false;
  showBill = false;
  showSlab = false;

  // SUPPLEMENTARY SUB SECTIONS
  showSuppFixed = false;
  showSuppPercentage = false;

  serviceChargeMasterList: any[] = [];
  selectedMasterId: number | null = null;
  selectedCompanyId?: number;
  selectedCompanyCode?: string;
  selectedSupplementary: any;
  invoiceForm!: FormGroup;
  percentageForm!: FormGroup
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

  ngOnInit() {
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

  // -------------------------------------------------------
  // MAIN DROPDOWN CHANGE
  // -------------------------------------------------------
  onMasterSelected() {
    this.resetAllSections();

    const selected = this.serviceChargeMasterList.find(
      x => x.Service_Charge_Master_Id == this.selectedMasterId
    );

    if (!selected) return;

    const name = selected.Service_Charge_Master_Name.toLowerCase();

    if (name === "service fee") {
      this.showServiceFeeSection = true;
      this.loadServiceFeeTypes();
    }
    else if (name === "supplementary fee") {
      this.showSupplementSection = true;
      this.loadSupplementaryTypes();
    }
  }

  onServiceFeeChange() {
    console.log(this.selectedService);
    this.resetSubSections();

    this.showFixed = this.selectedService == 1;
    this.showPercentage = this.selectedService == 2;

    this.showBill = this.selectedService == 3;
    this.showSlab = this.selectedService == 4;

    if (this.showFixed) {
      const json = this._sessionStoreage.getItem('UserProfile');
      if (json) {
        this.userdetail = JSON.parse(this.decry.decrypt(json));
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
        this.userdetail = JSON.parse(this.decry.decrypt(json));
      }
      this.percentageForm = this.fb.group({
        mapName: [null],
        paycode: ['', Validators.required],
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
      this.billRateForm = this.fb.group({
        billingCategory: ['', Validators.required],
        unitPrice: ['', Validators.required],
        unitType: ['', Validators.required],

        invoiceCategory: ['', Validators.required],
        mapName: ['', Validators.required],
        startDate: ['', Validators.required],

        discountType: ['', Validators.required],
        discountAmount: ['', Validators.required],
        prorate: ['', Validators.required]
      });

      this.loadMapNames();
      this.getBillingCategories();
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
    console.log(mapname);
    this.mapnameUI = mapname;
  }

  onSave() {
    this.showErrors = true;
    if (!this.mapnameUI) {
      alert("Please select Map Name");
      return;
    }
    if (this.invoiceForm.invalid) return;

    const f = this.invoiceForm.value;
    console.log("master", this.selectedMasterId);
    console.log("subid", this.selectedService)

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
      InEdgeFee_Type_Id: f.inedgeFeeType
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    console.log(JSON.stringify(request));
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: () => alert("Failed")
    });
  }

  onReset() {
    this.invoiceForm.reset();
    this.showErrors = false;
  }


  onSubmit() {
    this.showErrors = true;
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
      InEdgeFee_Type_Id: f.inedgeFeeType
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    console.log(JSON.stringify(request));
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: () => alert("Failed")
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

  allowNumbersOnly(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, '');
    input.value = input.value.replace(/(\..*)\./g, '$1');
    this.suppFixForm.get(input.getAttribute('formControlName')!)?.setValue(input.value);
  }

  onSuppFixedSubmit() {
    this.showErrors = true;

    if (this.suppFixForm.invalid) {
      return;
    }

    console.log("Supplementary Fixed Form Submitted:", this.suppFixForm.value);

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

  onSuppPerSubmit() {
    this.showErrors = true;

    if (this.suppPerForm.invalid) {
      return; // show errors and stop
    }

    console.log("Supplementary Percentage Submitted:", this.suppPerForm.value);
    this.dialogRef.close(this.suppPerForm.value);
  }

  onSuppPerReset() {
    this.suppPerForm.reset();
    this.showErrors = false;
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
      Upfront_PayCode: 0,
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
      InEdgeFee_Type_Id: 0
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    console.log(JSON.stringify(request));
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: () => alert("Failed")
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
      Upfront_PayCode: 0,
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
      InEdgeFee_Type_Id: 0
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    console.log(JSON.stringify(request));
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: () => alert("Failed")
    });

    console.log("Slab Fix HeadCount Submitted:", this.headCountForm.value);
    this.dialogRef.close(this.headCountForm.value);
  }

  onSlabHeadCountReset() {
    this.headCountForm.reset();
    this.showErrors = false;
  }

  onSlabPerCtcSubmit() {
    this.showErrors = true;

    if (this.ctcForm.invalid) return;

    console.log("Slab Percentage CTC Submitted:", this.ctcForm.value);
    this.dialogRef.close(this.ctcForm.value);
  }

  onSalbPerCtcReset() {
    this.ctcForm.reset();
    this.showErrors = false;
  }

  onSlabPerheadcountSubmit() {
    this.showErrors = true;

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
      Upfront_PayCode: 0,
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
      InEdgeFee_Type_Id: 0
    });

    const request = {
      Created_By: this.userdetail.user_Id?.toString(),
      Mode: "ADD",
      CompanyId: this.selectedCompanyId,
      ServiceChargemaster: ServiceChargemaster
    }

    console.log(JSON.stringify(request));
    this.serviceChargeService.SaveServiceCharge(request).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Service Charge saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
        }
      },
      error: () => alert("Failed")
    });

    console.log("Slab Percentage Head Count Submitted:", this.slabPerHeadForm.value);
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
    this.resetSubSections();
  }

  resetSubSections() {
    this.showFixed = false;
    this.showPercentage = false;
    this.showBill = false;
    this.showSlab = false;

    this.showSuppFixed = false;
    this.showSuppPercentage = false;
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
