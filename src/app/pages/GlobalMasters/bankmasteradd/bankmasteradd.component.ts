import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IBankRepository } from '../../../Repository/GlobalMasters/IBankrepository';
import { BankService } from '../../../Service/GlobalMasters/Bank.service';
import { finalize } from 'rxjs/operators';


export const Bank_TOKEN = new InjectionToken<IBankRepository>('Bank_TOKEN');

@Component({
  selector: 'app-bankmasteradd',
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
  templateUrl: './bankmasteradd.component.html',
  styleUrl: './bankmasteradd.component.css',
  providers: [
    {
      provide: Bank_TOKEN,
      useClass: BankService,
    }
  ]
})
export class BankmasteraddComponent {
  AddbankForm!: FormGroup;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  userdetail: any;
  constructor(private dialogRef: MatDialogRef<BankmasteraddComponent>
    , @Inject(Bank_TOKEN) private bankService: IBankRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.AddbankForm = new FormGroup({
      Bank_Name: new FormControl("", Validators.required),
      Digit_Length_Condition: new FormControl("", Validators.required),
      Bank_Account_Number_Digits: new FormControl("", Validators.required),
      Swift_Code: new FormControl("", Validators.required)
      // IFSCCode: new FormControl("", Validators.required),
      // IFSCTreatment: new FormControl("")
    })
  }

  Save() {
    if (this.AddbankForm.invalid) {
      this.AddbankForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.AddbankForm.value;

    const BankAdd = {
      Bank_Id: 0,
      Serial_No: 1,
      Error_Message: '',
      Bank_Name: formValue.Bank_Name,
      Bank_Account_Number_Digits: formValue.Bank_Account_Number_Digits,
      Digit_Length_Condition: formValue.Digit_Length_Condition,
      Swift_Code: formValue.Swift_Code
    };

    const BankRequest = {
      createdBy: this.userdetail.user_Id,
      mode: 'Add',
      detail: BankAdd
    };

    this.bankService.PostAddBank(BankRequest)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res: any) => {
          const msg = res.Data.data;

          if (msg === "Bank Created Successfully") {
            this.dialogRef.close('saved');
         
         } else {
            alert("Bank Name already available");

            this.AddbankForm.reset({
              Bank_Name: '',
              Bank_Account_Number_Digits: '',
              Digit_Length_Condition: '',
              Swift_Code: ''
            });

            this.onClose();
          }
        },
        error: (err) => {
          console.error("Error saving:", err);
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
