import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');

@Component({
  selector: 'app-employee-contactdetails',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-contactdetails.component.html',
  styleUrl: './employee-contactdetails.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeeContactdetailsComponent {
  submitted = false;

  contactForm!: FormGroup;
  rowData: any;
  userdetail: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeContactdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Pay_TOKEN) private service: IEmployeeservice,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) {
    console.log("Received Data:", data);

    this.rowData = data.rowData;
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.contactForm = this.fb.group({
      address: [this.rowData.Address ?? '', Validators.required],
      pincode: [this.rowData.Pin_Code ?? '', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: [this.rowData.Country ?? ''],
      mobile: [this.rowData.Mobile_Number ?? '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: [this.rowData.Email_Id ?? '', [Validators.required, Validators.email]],
      contactperson: [this.rowData.Contact_Person ?? ''],
      emergencycontact: [this.rowData.Emergency_Contact_Person ?? '']
    });
  }


  onSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise<void>((resolve, reject) => {

      if (this.contactForm.invalid) {
        this.contactForm.markAllAsTouched();
        reject("Form validation failed");
        return;
      }
      const raw = this.contactForm.getRawValue();

      const payload = {
        createdBy: this.userdetail.user_Id,
        detail: {
          Employee_Contact_Detail_Id: this.rowData.Employee_Contact_Detail_Id ?? '',
          Employee_Id: this.rowData.Employee_Id ?? '',
          Address: raw.address ?? '',
          Pin_Code: raw.pincode ?? '',
          Mobile_Number: raw.mobile ?? '',
          Email_Id: raw.email ?? '',
          Contact_Person: raw.contactperson ?? '',
          Emergency_Contact_Person: raw.emergencycontact ?? '',
        }
      };

      console.log("Payload:", JSON.stringify(payload));

      this.service.Addemployeecontactsave(payload).subscribe({
        next: (res: APIResponse) => {
          console.log(res)
          const msg = res.Data.message;

          if (msg.includes('Success')) {
            alert(msg)
            resolve();
          } else {
            alert(msg);
            reject('API returned failure');
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          reject(err);
        }
      });

    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
