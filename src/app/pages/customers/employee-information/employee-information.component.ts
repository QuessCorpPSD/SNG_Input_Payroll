import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');

@Component({
  selector: 'app-employee-information',
  standalone: true,
  imports: [MatCardModule, MatIconModule, FormsModule, CommonModule, ReactiveFormsModule,],
  templateUrl: './employee-information.component.html',
  styleUrl: './employee-information.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeeInformationComponent {

  infoForm!: FormGroup;
  submitted = false;
  rowData: any;
  sprstatus: any;
  fundlevy: any;
  religion: any;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<EmployeeInformationComponent>,
    private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Pay_TOKEN) private service: IEmployeeservice,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) {
    console.log("Received Data:", data);

    this.rowData = data.rowData;
  }
  
  formatDate(date?: string): string {
    if (!date) {
      return '';
    }

    // If ISO format like 1753-01-01T00:00:00
    if (date.includes('T')) {
      return date.split('T')[0];
    }

    // If DD-MM-YYYY
    const parts = date.split('-');
    if (parts.length !== 3) {
      return '';
    }

    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.infoForm = this.fb.group({
      passportNo: [this.rowData.Passport_Number ?? '', Validators.required],

      passportExpiry: [
        this.formatDate(this.rowData.Passport_Expiry_Date),
        Validators.required
      ],

      placeOfIssue: [this.rowData.Place_Of_Issue ?? '', Validators.required],
      gunLicenseNo: [this.rowData.Gun_License_No ?? '', Validators.required],
      drivingLicenseNo: [this.rowData.Driving_License_Number ?? '', Validators.required],
      nricFinNo: [this.rowData.Total_CTC ?? '', Validators.required],
      fundLevy: [this.rowData.FUND_LEVY ?? '', Validators.required],
      sprStatus: [this.rowData.spr_status_id ?? '', Validators.required],

      sprApprovedDate: [
        this.formatDate(this.rowData.SPR_APPROVE_DATE),
        Validators.required
      ],

      visaNumber: [this.rowData.VISA_NUMBER ?? '', Validators.required],
      insuranceNumber: [this.rowData.INSURANCE_NUMBER ?? '', Validators.required],

      visaStartDate: [
        this.formatDate(this.rowData.VISA_DURATION_START_DATE),
        Validators.required
      ],

      visaEndDate: [
        this.formatDate(this.rowData.VISA_DURATION_END_DATE),
        Validators.required
      ],

      workPassId: [this.rowData.WORK_PASS_ID ?? '', Validators.required],
      religion: [this.rowData.Religion ?? '']
    });

    this.BindSprstatus();
    this.BindReligion();
  }

  BindSprstatus() {
    this.service.Getsprstatus().subscribe({
      next: res => { this.sprstatus = res.Data.data }
    });
  }
  BindReligion() {
    this.service.Getreligion().subscribe({
      next: res => { this.religion = res.Data.data }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
  onSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise<void>((resolve, reject) => {

      if (this.infoForm.invalid) {
        this.infoForm.markAllAsTouched();
        reject("Form validation failed");
        return;
      }
      const raw = this.infoForm.getRawValue();

      const payload = {
        createdBy: this.userdetail.user_Id,
        detail: {
          Employee_Information_Id: this.rowData.Employee_Information_Id ?? '',
          Employee_Id: this.rowData.Employee_Id ?? '',

          Passport_Number: raw.passportNo ?? '',
          Passport_Expiry_Date: raw.passportExpiry ?? '',
          Place_Of_Issue: raw.placeOfIssue ?? '',
          Gun_License_Number: raw.gunLicenseNo ?? '',

          Driving_License_Number: raw.drivingLicenseNo ?? '',
          NRIC_FIN_NUMBER: raw.nricFinNo ?? '',
          FUND_LEVY: raw.fundLevy ?? '',

          SPR_STATUS_ID: raw.sprStatus ?? '',
          SPR_APPROVE_DATE: raw.visaNumber ?? '',
          VISA_NUMBER: raw.insuranceNumber ?? '',
          INSURANCE_NUMBER: raw.visaStartDate ?? '',

          VISA_DURATION_START_DATE: (raw.visaStartDate ?? '').toString(),
          VISA_DURATION_END_DATE: raw.visaEndDate ?? '',

          WORK_PASS_ID: (raw.workPassId ?? '').toString(),
          RELIGION: raw.religion ?? ''
        }
      };

      console.log("Payload:", JSON.stringify(payload));

      this.service.AddemployeeINFOsave(payload).subscribe({
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
}
