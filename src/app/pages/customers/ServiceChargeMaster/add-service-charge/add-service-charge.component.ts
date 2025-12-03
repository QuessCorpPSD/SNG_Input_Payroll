import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AddServicefeeComponent } from '../add-servicefee/add-servicefee.component';
import { SupplementaryFeeComponent } from '../supplementary-fee/supplementary-fee.component';
import { SourcingFeeComponent } from '../sourcing-fee/sourcing-fee.component';
import { NAPSserviceFeeComponent } from '../napsservice-fee/napsservice-fee.component';

import { ServiceFixedComponent } from '../service-fixed/service-fixed.component';
import { ServiceBillToRateComponent } from '../service-bill-to-rate/service-bill-to-rate.component';
import { ServiceSlabComponent } from '../service-slab/service-slab.component';
import { ServicePercentageComponent } from '../service-percentage/service-percentage.component';

import { SupplementaryFixedComponent } from '../supplementary-fixed/supplementary-fixed.component';
import { SupplementaryPercentageComponent } from '../supplementary-percentage/supplementary-percentage.component';

import { NapsserviceFixedComponent } from '../napsservice-fixed/napsservice-fixed.component';
import { NapsservicePercentageComponent } from '../napsservice-percentage/napsservice-percentage.component';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';


@Component({
  selector: 'app-add-service-charge',
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
    SupplementaryFeeComponent,
    //SourcingFeeComponent,
    //NAPSserviceFeeComponent,
    ServiceFixedComponent,
    ServiceBillToRateComponent,
    ServiceSlabComponent,
    ServicePercentageComponent,
    SupplementaryFixedComponent,
    SupplementaryPercentageComponent,
    //NapsserviceFixedComponent,
    //NapsservicePercentageComponent
  ],
  templateUrl: './add-service-charge.component.html',
  styleUrl: './add-service-charge.component.css'
})
export class AddServiceChargeComponent {

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
    }
    else if (name === "supplementary fee") {
      this.showSupplementSection = true;
    }
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
