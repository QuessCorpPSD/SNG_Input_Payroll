import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ICorporatebabk } from '../../../Repository/customer/Icorporatebank';
import { CorporateBankService } from '../../../Service/CUSTOMER/corporatebank.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<ICorporatebabk>('Pay_TOKEN');

@Component({
  selector: 'app-corporatebankadd',
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
    AlertpopupComponent
  ],
  templateUrl: './corporatebankadd.component.html',
  styleUrl: './corporatebankadd.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CorporateBankService,
    }
  ]
})
export class CorporatebankaddComponent {
  CorporateBankAddForm!: FormGroup;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';
  isLoading: boolean = false;
  isEditMode = false;   // default is Add mode
  buttonText = "Save";

  constructor(private dialogRef: MatDialogRef<CorporatebankaddComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private fb: FormBuilder,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private corporatebankService: ICorporatebabk
  ) { }

  ngOnInit(): void {

    this.createForm();
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));


    if (this.editData) {
      this.isEditMode = true;
      this.buttonText = "Update";  // Change button text in edit mode
      this.patchFormData();
    }
  }

  createForm() {
    this.CorporateBankAddForm = new FormGroup({
      BankId: new FormControl(''),
      BankName: new FormControl('', Validators.required),
      Branch: new FormControl(''),
      BranchCode: new FormControl(''),
      BankCode: new FormControl(''),
      SwiftCode: new FormControl('', Validators.required),
      AccountNo: new FormControl('', Validators.required),
      BankAddress: new FormControl('', Validators.required)
    });
  }

  patchFormData() {
    this.CorporateBankAddForm.patchValue({
      BankId: this.editData.Bank_Id,
      BankName: this.editData.Bank_Name,
      Branch: this.editData.BranchName,
      BranchCode: this.editData.BranchCode,
      BankCode: this.editData.bank_code,
      SwiftCode: this.editData.Swift_Code,
      AccountNo: this.editData.Account_No,
      BankAddress: this.editData.Address
    });
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
    this.isLoading = true;
    if (this.CorporateBankAddForm.invalid) {
      // Highlight all fields (makes touched = true)
      this.CorporateBankAddForm.markAllAsTouched();
      this.isLoading = false;
      return;
    }

    const formValue = this.CorporateBankAddForm.value;
    var payload;
    if (this.isEditMode) {
      payload = {
        createdBy: this.userdetail.user_Id,
        mode: "Edit",
        parentDetail: {
          Bank_Id: this.editData.Bank_Id,
          Bank_Name: formValue.BankName,
          Ifsc_Code: formValue.SwiftCode,
          Account_No: formValue.AccountNo,
          Address: formValue.BankAddress,
          Error_Message: "",
          Serial_No: "",
          BranchName: formValue.Branch,
          BrsCode: formValue.BranchCode,
          BankCode: formValue.BankCode
        }
      };
    } else {

      payload = {

        createdBy: this.userdetail.user_Id,
        mode: "Add",
        parentDetail: {
          Bank_Id: 0,
          Bank_Name: formValue.BankName,
          Ifsc_Code: formValue.SwiftCode,
          Account_No: formValue.AccountNo,
          Address: formValue.BankAddress,
          Error_Message: "",
          Serial_No: "",
          BranchName: formValue.Branch,
          BrsCode: formValue.BranchCode,
          BankCode: formValue.BankCode
        }
      };
    }

    this.corporatebankService.Create(payload).subscribe({
      next: (res: any) => {

        let isSuccess = String(res?.StatusCode) === '200' &&
          String(res?.Data?.statusCode) === '200';

        if (isSuccess) {

          // SUCCESS CASE
          const table = res?.Data?.data?.Table0;
          const message = table?.[0]?.Error_Message || res?.Data?.message;
          alert(message);
          this.onClose();

        } else {

          // FAILURE CASE
          const errorMessage =
            res?.Data?.message ||
            res?.Error?.ErrorMessage ||
            res?.Message ||
            "Failed. Please try again.";

          alert(errorMessage.trim());
          this.onClose();
        }

        // <-- show popup for both cases
        //this.dialogRef?.close();
        this.isLoading = false;
      },

      error: (err) => {
        alert("Error while processing");
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
