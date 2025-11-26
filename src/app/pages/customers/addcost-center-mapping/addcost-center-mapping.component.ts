import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CostMappingCenterService } from '../../../Service/CUSTOMER/cost-mapping-center.service';

@Component({
  selector: 'app-addcost-center-mapping',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginator,
    MatCardModule,
    CompanyallComponent,
    ReactiveFormsModule
  ],
  templateUrl: './addcost-center-mapping.component.html',
  styleUrl: './addcost-center-mapping.component.css'
})
export class AddcostCenterMappingComponent {

  costForm!: FormGroup;
  showErrors = false;

  selectedCompanyCode: any;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<AddcostCenterMappingComponent>,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private costService: CostMappingCenterService
  ) { }

  ngOnInit(): void {

    // Load user info
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.costForm = this.fb.group({
      mapName: ['', Validators.required],
      companyCode: ['', Validators.required],
      CostCenter: [{ value: '', disabled: false }, Validators.required],

    });
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyCode = company.companyId;
    this.costForm.patchValue({ companyCode: company.companyId });
  }

  // ============================
  //    SAVE FUNCTION (UPDATED)
  // ============================
  saveCostCenter() {
    this.showErrors = true;

    if (this.costForm.invalid) {
      alert("Please fill all required fields");
      return;
    }

    const form = this.costForm.value;

    const createdBy =
      this.userdetail?.user_Id ? this.userdetail.user_Id.toString() : "0";

    const payload = {
      Created_By: createdBy,
      Mode: "Add",
      CostCentermaster: [
        {
          Cost_Center_Mapping_Id: null,
          Map_Name: form.mapName,
          Company_Id: this.selectedCompanyCode,
          IsActive: true,
          SPOC_Name: "",
          Cost_Center_Name: form.CostCenter,
          GRN_Number: "",
          Serial_No: 1,
          Error_Message: null
        }
      ]
    };

    console.log("Cost Center Save Payload:", payload);

    this.costService.SaveCostCenterDetails(payload).subscribe({
      next: (res) => {

        const response = res?.Data?.response;
        const errors = res?.Data?.errors;

        console.log(response);

        // ❌ FAILED RESPONSE
        if (response && response.toLowerCase().includes("failed")) {

          let msg = "Error!";

          if (errors && errors.length > 0) {
            msg = errors.join("\n"); // Example: "Cost center mapping already exists"
          } else {
            msg = response;
          }

          alert(msg);
          return;
        }

        // ✅ SUCCESS RESPONSE
        if (response && response.toLowerCase().includes("success")) {
          alert("Cost Center Mapping Added Successfully!");
          this.dialogRef.close(true);
          return;
        }

        alert(response || "Unexpected response from server");
      },

      error: (err) => {
        console.error("Error saving cost center mapping:", err);
        alert("Failed to save cost center mapping");
      }
    });
  }

  onCancel() {
    this.costForm.reset();
    this.showErrors = false;
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }
}

