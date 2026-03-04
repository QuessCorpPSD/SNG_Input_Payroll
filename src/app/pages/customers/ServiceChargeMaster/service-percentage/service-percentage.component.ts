import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { AddServicefeeComponent } from '../add-servicefee/add-servicefee.component';
import { MapnameComponent } from "../../../../common/Mapname/mapname/mapname.component";

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
  selector: 'app-service-percentage',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, ReactiveFormsModule, FormsModule, MapnameComponent],
  templateUrl: './service-percentage.component.html',
  styleUrl: './service-percentage.component.css'
})
export class ServicePercentageComponent {
  @Input() selectedCompanyId?: number;
  percentageForm!: FormGroup;
  showErrors = false;
  mapnameUI:any;

  mapNameList: any[] = [];
  userdetail: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddServicefeeComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
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

  handleMapNameEvent(mapname: any) {
    console.log(mapname);
    this.mapnameUI = mapname;
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
      Company_Service_Charge_Master_Id: 0,
      Company_Service_Charge_Type_Id: 0,
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


  onReset() {
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
}


