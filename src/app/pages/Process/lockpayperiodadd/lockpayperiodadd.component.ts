import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { LockpayperiodService } from '../../../Service/Process/lockpayperiod.service';

@Component({
  selector: 'app-lockpayperiodadd',
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
    AlertpopupComponent
  ],
  templateUrl: './lockpayperiodadd.component.html',
  styleUrl: './lockpayperiodadd.component.css'
})
export class LockpayperiodaddComponent {

  AddLockPayPeriod!: FormGroup;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  userdetail: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialogRef: MatDialogRef<LockpayperiodaddComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private addLock: LockpayperiodService) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.AddLockPayPeriod = new FormGroup({
      CompanyCode: new FormControl(''),
      CompanyName: new FormControl(''),
      PayPeriod: new FormControl('')
    })
    this.AddLockPayPeriod.get('CompanyCode')?.disable();
    this.AddLockPayPeriod.get('CompanyName')?.disable();
    this.AddLockPayPeriod.get('PayPeriod')?.disable();

    if (this.data?.row) {
      this.AddLockPayPeriod.patchValue({
        CompanyCode: this.data.row.Company_Code,
        CompanyName: this.data.row.Company_Name,
        PayPeriod: this.data.row.Pay_Period
      });
    }
  }

  onClose() {
    this.dialogRef.close();
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

  addLockPayPPeriod() {

    const formValue = this.AddLockPayPeriod.getRawValue();

    // Validation
    if (!this.data?.row?.Pay_Frequency_Detail_Id) {
      this.showAlertPopup("No Pay Period selected");
      return;
    }

    const payload = {
      "Company_Id": this.data.row.Company_Id?.toString(),
      "Pay_Frequency_Detail_Id": this.data.row.Pay_Frequency_Detail_Id?.toString(),
      "CreatedBy": this.userdetail.user_Id?.toString()
    };

    this.isLoading = true;

    this.addLock.addLockPayPeriod(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const responseMsg = res?.Data?.response;

        //  CASE 1: API returned "Row(s) Uploaded Successfully."
        if (responseMsg && responseMsg.includes("Successfully")) {
          this.showAlertPopup("Pay Period Locked Successfully");
          this.dialogRef.close(true);
          return;
        }

        // CASE 2: API returned "Failed."
        if (responseMsg && responseMsg.trim() === "Failed.") {

          // If there are error messages inside errors[], show them
          if (res?.Data?.errors?.length > 0) {
            const firstError = res.Data.errors[0];
            this.showAlertPopup(firstError?.Error_Message || "Failed to lock Pay Period.");
          } else {
            this.showAlertPopup("Failed to lock Pay Period.");
          }

          return;
        }

        // CASE 3: Unexpected response
        this.showAlertPopup(res?.Message || "Unknown response from server.");
      }

    });

  }



}
