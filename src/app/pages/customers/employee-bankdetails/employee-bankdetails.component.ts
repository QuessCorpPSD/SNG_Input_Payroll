import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-employee-bankdetails',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-bankdetails.component.html',
  styleUrl: './employee-bankdetails.component.css'
})
export class EmployeeBankdetailsComponent {
  submitted = false;

  bankForm!: FormGroup;
  rowData: any;
  bankname: any;
  nomineebankname: any;
  userdetail: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeBankdetailsComponent>,
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
    this.bankForm = this.fb.group({
      bankname: ['', Validators.required],
      Branchname: ['', Validators.required],
      bankacno: ['', [Validators.required, Validators.pattern(/^[0-9]{6,20}$/)]],

      swiftcode: ['', Validators.required],
      Backcode: ['', Validators.required],
      Branchcode: ['', Validators.required],

      nomineename: [''],
      nomineerelationship: [''],
      nomineeage: ['', Validators.pattern(/^[0-9]+$/)],

      nomineeswiftcode: [''],
      Nomineebankname: [''],
      nomineeaccountno: ['', Validators.pattern(/^[0-9]*$/)],
      nomineebankcode: [''],
      nomineebranchcode: ['']
    });
    this.bankForm = this.fb.group({
      bankname: [this.rowData.Employee_Bank_Id],
      Branchname: [this.rowData.Branch_Name],
      bankacno: [this.rowData.Bank_Account_Number],

      swiftcode: [this.rowData.SWIFT_CODE],
      Backcode: [this.rowData.Bank_code],
      Branchcode: [this.rowData.Branch_code],

      nomineename: [this.rowData.Nominee_Name],
      nomineerelationship: [this.rowData.Nominee_Relationship],
      nomineeage: [this.rowData.Nominee_Age],
      nomineeswiftcode: [this.rowData.NOMINEE_SWIFT_CODE],
      Nomineebankname: [Number(this.rowData.Nominee_Bank_Account)],
      nomineeaccountno: [this.rowData.Nominee_Bank_Account_Number],
      nomineebankcode: [''],
      nomineebranchcode: ['']
    });
    this.BindBankname();
    this.BindNomineeBankname();
  }
  BindBankname() {
    this.service.GetBankname().subscribe({
      next: res => { this.bankname = res.Data.data.Table0 }
    });
  }

  BindNomineeBankname() {
    this.service.GetBankname().subscribe({
      next: res => { this.nomineebankname = res.Data.data.Table0 }
    });
  }

  onSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise<void>((resolve, reject) => {

      if (this.bankForm.invalid) {
        this.bankForm.markAllAsTouched();
        reject("Form validation failed");
        return;
      }
      const raw = this.bankForm.getRawValue();

      const payload = {
        createdBy: this.userdetail.user_Id,
        detail: {
          Employee_Bank_Detail_Id: this.rowData.Employee_Bank_Detail_Id ?? '',

          Employee_Id: this.rowData.Employee_Id ?? '',

          Bank_Id: raw.bankname ?? '',
          Bank_Name: '',
          Branch_Name: raw.Branchname ?? '',
          Bank_Account_Number: raw.bankacno ?? '',

          Swift_Code: raw.swiftcode ?? '',
          Bank_Code: raw.Backcode ?? '',
          Branch_Code: raw.Branchcode ?? '',

          Nominee_Name: raw.nomineename ?? '',
          Nominee_Relationship: raw.nomineerelationship ?? '',
          Nominee_Age: raw.nomineeage ?? '',
          Nominee_Swift_Code: raw.nomineeswiftcode ?? '',
          Nominee_Bank_Account: (raw.Nomineebankname ?? '').toString(),
          Nominee_Bank_Account_Number: raw.nomineeaccountno ?? '',
          Nominee_Bank_Code: raw.nomineebankcode ?? '',
          Nominee_Branch_Code: raw.nomineebranchcode ?? ''
        }
      };

      console.log("Payload:", JSON.stringify(payload));

      this.service.AddemployeeBanksave(payload).subscribe({
        next: (res: APIResponse) => {
          console.log(res)
          const msg = res.Data.data.Table0?.[0].Error_Message;

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
