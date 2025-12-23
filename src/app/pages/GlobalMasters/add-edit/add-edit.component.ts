import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IBankRepository } from '../../../Repository/GlobalMasters/IBankrepository';
import { BankService } from '../../../Service/GlobalMasters/Bank.service';


export const Bank_TOKEN = new InjectionToken<IBankRepository>('Bank_TOKEN');

@Component({
  selector: 'app-add-edit',
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
    AlertpopupComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
  providers: [
    {
      provide: Bank_TOKEN,
      useClass: BankService,
    }
  ]
})
export class AddEditComponent {
  EditbankForm!: FormGroup;
  showPopup = false;
  popupMessage: string = "";
  isLoading = false;
  userdetail: any;
  constructor(private dialogRef: MatDialogRef<AddEditComponent>
    , @Inject(Bank_TOKEN) private bankService: IBankRepository,
    @Inject(MAT_DIALOG_DATA) public Editdata: any,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.EditbankForm = new FormGroup({
      Bank_Name: new FormControl("", Validators.required),
      Digit_Length_Condition: new FormControl("", Validators.required),
      Bank_Account_Number_Digits: new FormControl("", Validators.required),
      // IFSCCode: new FormControl("", Validators.required),
      // IFSCTreatment: new FormControl("")
    })

    if (this.Editdata) {
      this.EditbankForm.patchValue({
        Bank_Id: this.Editdata.Bank_Id,
        Bank_Name: this.Editdata.Bank_Name,
        Digit_Length_Condition: this.Editdata.Digit_Length_Condition,
        Bank_Account_Number_Digits: this.Editdata.Bank_Account_Number_Digits,
      });
    }
  }

  Save() {

    if (this.EditbankForm.invalid) {
      this.EditbankForm.markAllAsTouched();
      return;
    }

    const formValue = this.EditbankForm.value;

    const BankAdd = {
      Bank_Id: this.Editdata.Bank_Id,
      Serial_No: 1,
      Error_Message: '',
      Bank_Name: formValue.Bank_Name,
      Bank_Account_Number_Digits: formValue.Bank_Account_Number_Digits,
      Digit_Length_Condition: formValue.Digit_Length_Condition,
    };

    const BankRequest = {
      createdBy: this.userdetail.user_Id,
      mode: 'Edit',
      detail: BankAdd
    };

    this.bankService.PostAddBank(BankRequest).subscribe({
      next: (res) => {
        const msg = res.Data.data;

        if (msg === "Bank Updated Successfully") {
          this.dialogRef.close('updated');
          return;
        }

        alert(msg);
        this.isLoading = false;
        this.onClose();
      },
      error: (err) => {
        console.error("Error saving:", err);
      }
    });
  }


  onClose() {
    this.dialogRef.close('updated'); // return callback for close button
  }


}




