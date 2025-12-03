import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AlertpopupComponent } from '../../../../common/alertpopup/alertpopup.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { MapnameComponent } from '../../../../common/Mapname/mapname/mapname.component';

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
  selector: 'app-service-fixed',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MapnameComponent
  ],
  templateUrl: './service-fixed.component.html',
  styleUrls: ['./service-fixed.component.css']
})
export class ServiceFixedComponent {
  @Input() selectedCompanyId?: number;
  invoiceForm!: FormGroup;
  showErrors = false;

  mapNameList: any[] = [];
  userdetail: any;
  mapnameUI: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceFixedComponent>,
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

    //this.loadMapNames();
  }


  // loadMapNames() {
  //   this.serviceChargeService.GetCostCenterMapping().subscribe({
  //     next: (res: any) => {
  //       this.mapNameList = res?.Data || [];


  //     },
  //     error: () => {
  //       alert("Failed to load Map Names");
  //     }
  //   });
  // }

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
}
