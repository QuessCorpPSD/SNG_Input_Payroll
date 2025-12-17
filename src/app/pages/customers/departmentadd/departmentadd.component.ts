import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { DepartmentService } from '../../../Service/company/department.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IdletimeoutService } from '../../../Service/idletimeout.service';

@Component({
  selector: 'app-departmentadd',
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
    CompanyallComponent,
    AlertpopupComponent
  ],
  templateUrl: './departmentadd.component.html',
  styleUrl: './departmentadd.component.css'
})
export class DepartmentaddComponent {
  companyCode: any;

  constructor(private dialogRef: MatDialogRef<DepartmentaddComponent>, private _decrypt: EncryptionService, private department: DepartmentService, private _sessionStoreage: SessionStorageService, private idleTimeOutService: IdletimeoutService) { }

  AddDepartmentForm!: FormGroup;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
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

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.AddDepartmentForm = new FormGroup({
      companyCode: new FormControl('', Validators.required),
      DepartmentCode: new FormControl(''),
      DepartmentName: new FormControl('', Validators.required)
    })
    this.AddDepartmentForm.get('DepartmentCode')?.disable();
  }

  Save() {

    if (this.AddDepartmentForm.invalid) {
      this.AddDepartmentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const form = this.AddDepartmentForm.value;
    const createdBy =
      this.userdetail?.user_Id ? this.userdetail.user_Id.toString() : "0";

    const payload = {
      Created_By: createdBy,
      Mode: "Add",
      Departmentmaster: [
        {
          Department_Id: null,
          Department_Name: form.DepartmentName,
          Company_Id: this.selectedCompanyId,
          Serial_No: 1,
          Error_Message: null
        }
      ]
    };

    this.department.saveDepartment(payload).subscribe({
      next: (res) => {
        const response = res?.Data?.response;
        const errors = res?.Data?.errors;

        if (response && response.toLowerCase().includes("failed")) {

          let msg = "Error";

          if (errors && errors.length > 0) {
            msg = errors.join("\n");
          } else {
            msg = response;            // fallback
          }
          alert(msg)
          this.isLoading = false;
          return;
        }

        // SUCCESS RESPONSE
        if (response && response.toLowerCase().includes("success")) {
          alert("Department Added Successfully!");
          this.isLoading = false;
          this.onClose();
        }
      },

      error: (err) => {
        console.error("Error saving band:", err);
        alert("Error saving department details");
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
