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
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

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
    ReactiveFormsModule,
    AlertpopupComponent
  ],
  templateUrl: './addcost-center-mapping.component.html',
  styleUrl: './addcost-center-mapping.component.css'
})
export class AddcostCenterMappingComponent {

  costForm!: FormGroup;
  showErrors = false;
  selectedCompanyCode: any;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  showPopupvalidate = false;
  isLoading: boolean = false;
  showPopup = false;

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

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyCode = company.companyId;
    this.costForm.patchValue({ companyCode: company.companyId });
  }

  saveCostCenter() {
    this.showErrors = true;

    if (this.costForm.invalid) {
      return;
    }
    this.isLoading = true;

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

    this.costService.SaveCostCenterDetails(payload).subscribe({
      next: (res) => {

        const response = res?.Data?.response;
        const errors = res?.Data?.errors;

        //  FAILED RESPONSE
        if (response && response.toLowerCase().includes("failed")) {

          let msg = "Error!";

          if (errors && errors.length > 0) {
            msg = errors.join("\n"); // Example: "Cost center mapping already exists"
          } else {
            msg = response;
          }

          alert(msg);
          this.isLoading = false;
          return;
        }

        //  SUCCESS RESPONSE
        if (response && response.toLowerCase().includes("success")) {
          alert("Cost Center Mapping Added Successfully!");
          this.dialogRef.close(true);
          return;
        }

        alert(response || "Unexpected response from server");
        this.isLoading = false;
      },

      error: (err) => {
        console.error("Error saving cost center mapping:", err);
        alert("Failed to save cost center mapping");
        this.isLoading = false;
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

