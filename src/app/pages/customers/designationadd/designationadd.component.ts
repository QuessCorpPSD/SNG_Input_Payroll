import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { DesignationService } from '../../../Service/company/designation.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IdletimeoutService } from '../../../Service/idletimeout.service';

@Component({
  selector: 'app-designationadd',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    CompanyallComponent,
    AlertpopupComponent
  ],
  templateUrl: './designationadd.component.html',
  styleUrl: './designationadd.component.css'
})
export class DesignationaddComponent {

  DesinationAddForm!: FormGroup;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  constructor(private dialogRef: MatDialogRef<DesignationaddComponent>, private designation: DesignationService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private idleTimeOutService: IdletimeoutService) { }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  ngOnInit(): void {
    this.DesinationAddForm = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      DepartmentCode: new FormControl(''),
      DesignationName: new FormControl('', Validators.required),
      StandardDesignation: new FormControl(''),
      Amount: new FormControl(''),
      Skill_Category: new FormControl(''),
      NPDays: new FormControl('')
    })
    this.DesinationAddForm.get('DepartmentCode')?.disable();
  }

  showValidatePopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
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

  Save() {

    if (this.DesinationAddForm.invalid) {

      // Highlight all fields (makes touched = true)
      this.DesinationAddForm.markAllAsTouched();

      return;
    }

    const form = this.DesinationAddForm.value;

    const createdBy =
      this.userdetail?.user_Id ? this.userdetail.user_Id.toString() : "0";

    const payload = {
      Created_By: createdBy,
      Mode: "Add",
      Designationmaster: [
        {
          Department_Id: null,
          Designation_Name: form.DesignationName,
          Standard_Designation: form.StandardDesignation,
          Amount: form.Amount,
          Skill_Category: form.Skill_Category,
          NpDays: form.NPDays,
          Company_Id: this.selectedCompanyId,
          Serial_No: 1,
          Error_Message: null
        }
      ]
    };

    this.designation.saveDesignation(payload).subscribe({
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
          alert(msg)
          return;
        }

        // SUCCESS RESPONSE
        if (response && response.toLowerCase().includes("success")) {
          this.showAlertPopup("Desigantion Added Successfully!");
          this.dialogRef.close(true);
          return;
        }

        // UNKNOWN
        alert(response || "Unexpected server response")
      },

      error: (err) => {
        alert("Error saving band details")
      }
    });


  }


  onClose() {
    this.dialogRef.close();
  }


}
