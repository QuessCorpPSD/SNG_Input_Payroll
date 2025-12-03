import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginatorModule } from "@angular/material/paginator";
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { APIResponse } from '../../../Models/apiresponse';

@Component({
  selector: 'app-employee-personaldetail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './employee-personaldetail.component.html',
  styleUrl: './employee-personaldetail.component.css'
})
export class EmployeePersonaldetailComponent {

  personalForm!: FormGroup;
  submitted = false;
  rowData: any;
  religion: any;
  rfundcode1: any;
  rfundcode2: any;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<EmployeePersonaldetailComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: EmployeeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) {
    this.rowData = data.rowData;
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.personalForm = this.fb.group({
      birthPlace: [this.rowData.Birth_Place ?? '', Validators.required],
      nominee: [this.rowData.Nominee ?? '', Validators.required],
      relationship: [this.rowData.Relationship ?? '', Validators.required],
      racecode: [this.rowData.RACE_CODE ?? '', Validators.required],
      Nationalcode: [this.rowData.NATIONAL_CODE ?? '', Validators.required],
      RFUNDCode1: [this.rowData.RFUND_CODE1 ?? '', Validators.required],
      RFUNDCode2: [this.rowData.RFUND_CODE2 ?? ''],
      COB: [this.rowData.COUNTRY_OF_BIRTH ?? '']
    });

    this.BindRFUNDCODE();
    this.BindRFUNDCODE1();
  }


  BindRFUNDCODE() {
    this.service.GetRfundcode().subscribe({
      next: (res) => {
        this.rfundcode1 = res.Data.data;
      }
    });
  }
  BindRFUNDCODE1() {
    this.service.GetRfundcode().subscribe({
      next: (res) => {
        this.rfundcode2 = res.Data.data;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise<void>((resolve, reject) => {

      if (this.personalForm.invalid) {
        this.personalForm.markAllAsTouched();
        reject("Form validation failed");
        return;
      }
      const raw = this.personalForm.getRawValue();

      const payload = {
        createdBy: this.userdetail.user_Id,
        detail: {
          Employee_Personal_Detail_Id: this.rowData.Employee_Personal_Detail_Id ?? '',
          Employee_Id: this.rowData.Employee_Id ?? '',

          Birth_Place: raw.birthPlace ?? '',
          Nominee: raw.nominee ?? '',
          Relationship: raw.relationship ?? '',
          RACE_CODE: raw.racecode ?? '',

          NATIONAL_CODE: raw.Nationalcode ?? '',
          RFUND_CODE1: raw.RFUNDCode1 ?? '',
          RFUND_CODE2: Number(raw.RFUNDCode2) ?? 0,

          COUNTRY_OF_BIRTH: raw.COB ?? '',

        }
      };

      console.log("Payload:", JSON.stringify(payload));

      this.service.AddemployeePersonalsave(payload).subscribe({
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
