import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BandDeatialsService } from '../../../Service/CUSTOMER/band-deatials.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-band-add',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    CompanyallComponent,
    ReactiveFormsModule,
    AlertpopupComponent
  ],
  templateUrl: './band-add.component.html',
  styleUrl: './band-add.component.css'
})
export class BandADDComponent {

  selectedCompanyId!: number;
  selectedCompanyCode: any;
  bandForm!: FormGroup;
  userdetail: any;
  showErrors = false;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  showPopupvalidate = false;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<BandADDComponent>,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private fb: FormBuilder,
    private bandService: BandDeatialsService
  ) { }

  ngOnInit(): void {

    // Load User
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    // Form
    this.bandForm = this.fb.group({
      bandCode: ['', Validators.required],
      bandName: ['', Validators.required],
      companyCode: ['', Validators.required],
      serialNo: ['1', Validators.required]
    });
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopupalert = true;
  }

  closePoopup() {
    this.showPopupalert = false;
    this.showPopupvalidate = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.bandForm.patchValue({ companyCode: company.companyCode });
  }

  saveBandDetails() {
    this.showErrors = true;

    if (this.bandForm.invalid) {
      return;
    }
    this.isLoading = true;

    const form = this.bandForm.value;

    const createdBy =
      this.userdetail?.user_Id ? this.userdetail.user_Id.toString() : "0";

    const payload = {
      Created_By: createdBy,
      Mode: "Add",
      Bandmaster: [
        {
          Band_Id: null,
          Band_Code: form.bandCode,
          Band_Name: form.bandName,
          Company_Id: this.selectedCompanyId,
          Company_Code: this.selectedCompanyCode,
          Serial_No: form.serialNo,
          Error_Message: null
        }
      ]
    };
    this.bandService.SaveBandDetails(payload).subscribe({
      next: (res) => {
        const response = res?.Data?.response;
        const errors = res?.Data?.errors;


        if (response && response.toLowerCase().includes("failed")) {

          let msg = "Error";

          if (errors && errors.length > 0) {
            msg = errors.join("\n");   // <-- Shows "Band already Exists"
          } else {
            msg = response;            // fallback
          }

          alert(msg);
          this.isLoading = false;
          return;
        }

        // SUCCESS RESPONSE
        if (response && response.toLowerCase().includes("success")) {
          alert("Band Added Successfully!");
          this.dialogRef.close(true);
          return;
        }

        //  UNKNOWN
        alert(response || "Unexpected server response");
        this.isLoading = false;
      },

      error: (err) => {
        console.error("Error saving band:", err);
        alert("Error saving band details");
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}
