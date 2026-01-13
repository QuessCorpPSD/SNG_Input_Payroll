import { CommonModule } from '@angular/common';
import { Component, InjectionToken, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PaycodeserviceService } from '../../../Service/GlobalMasters/paycodeservice.service';
import { IPAycodeService } from '../../../Repository/GlobalMasters/Ipaycode.service';
import { number } from 'echarts';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Paycode_TOKEN = new InjectionToken<IPAycodeService>('Paycode_TOKEN');
@Component({
  selector: 'app-paycodeadd',
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
  ],
  templateUrl: './paycodeadd.component.html',
  styleUrl: './paycodeadd.component.css',
  providers: [{
    provide: Paycode_TOKEN,
    useClass: PaycodeserviceService
  }]
})
export class PaycodeaddComponent {
  pagetype: any;
  AddPaycodeform!: FormGroup;
  paytype: any;
  isEditMode: boolean = false;
  editingRowId: number | null = null;
  userdetail: any;

  constructor(@Inject(Paycode_TOKEN) private payCode: PaycodeserviceService, private dialogRef: MatDialogRef<PaycodeaddComponent>, @Inject(MAT_DIALOG_DATA) public editData: any, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.BindPageType();
    this.BindPayType();
    this.AddPaycodeform = new FormGroup({
      PayCode: new FormControl('', Validators.required),
      Description: new FormControl(''),
      PrintAs: new FormControl(''),
      LOPApplicable: new FormControl(''),
      PFApplicable: new FormControl(''),
      ESIApplicable: new FormControl(''),
      PTApplicable: new FormControl('', Validators.required),
      PageType: new FormControl('', Validators.required),
      GLAccountNumber: new FormControl('', Validators.required),
      PostingKey: new FormControl('', Validators.required),
      PayCodeType: new FormControl('', Validators.required),
      Taxable: new FormControl(''),
      ProjectTax: new FormControl(''),
      MarginalTax: new FormControl(''),
      PayType: new FormControl('', Validators.required),
    });
    if (this.editData?.mode?.toLowerCase() === 'edit') {
      this.isEditMode = true;
      this.patchEditData();
    }
  }

  BindPayType() {
    this.payCode.GetPayType().subscribe({
      next: res => { this.paytype = res.Data }
    });
  }

  BindPageType() {
    this.payCode.GetPageType().subscribe({
      next: res => { this.pagetype = res.Data.data.Table0 }
    });
  }

  patchEditData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.AddPaycodeform.patchValue({
      PayCode: row.Paycode_Code,
      Description: row.Description,
      PrintAs: row.Print_As,
      LOPApplicable: row.Is_LOP_Applicable ? '1' : '0',
      PFApplicable: row.Is_PF_Applicable ? '1' : '0',
      ESIApplicable: row.Is_ESI_Applicable ? '1' : '0',
      PTApplicable: row.Is_PT_Applicable ? '1' : '0',
      Taxable: row.IsTaxable ? '1' : '0',
      ProjectTax: row.IsProjectTax ? '1' : '0',
      MarginalTax: row.IsMarginalTax ? '1' : '0',
      PageType: row.Page_Type,
      GLAccountNumber: row.Account_Number,
      PostingKey: row.Account_Number,
      PayCodeType: row.PayCode_Type ? '1' : '0',
      PayType: row.PayType_Id
    });
    this.AddPaycodeform.get('PayCode')?.disable();
  }

  onSavePayCode(): void {
    if (this.AddPaycodeform.invalid) {
      this.AddPaycodeform.markAllAsTouched();
      alert("Please enter all required fields.")
      return;
    }

    const formValue = this.AddPaycodeform.getRawValue();

    const payload = {
      mode: 'Add',
      userId: this.userdetail.user_Id,
      detail: {
        Paycode_Id: 0,
        Paycode_Code: formValue.PayCode ?? '',
        Description: formValue.Description ?? '',
        Print_As: formValue.PrintAs ?? '',
        PayType_Id: Number(formValue.PayType),
        IsTaxable: formValue.Taxable == 1,
        IsProjectTax: formValue.ProjectTax == 1,
        IsMarginalTax: formValue.MarginalTax == 1,
        Paycode_Type: formValue.PayCodeType == 1,
        Is_LOP_Applicable: formValue.LOPApplicable == 1,
        Is_PF_Applicable: formValue.PFApplicable == 1,
        Is_ESI_Applicable: formValue.ESIApplicable == 1,
        Is_PT_Applicable: formValue.PTApplicable == 1,
        Page_Type: Number(formValue.PageType) || 0,
        Account_Number: Number(formValue.GLAccountNumber) || 0,
        Posting_key: Number(formValue.PostingKey) || 0,
        Tax_Type_ID: Number(formValue.TaxTypeId) || 0
      }

    };
    console.log('payload', JSON.stringify(payload));
    this.payCode.CreatePayCode(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res.Data?.data?.Table0[0]?.Error_Message);
          this.dialogRef.close('updated');
        } else {
          const message =
            res?.Data?.message ||
            res?.Message ||
            'PayCode creation failed. Please try again.';
          alert(message);
        }
      },
      error: (err) => {
        console.error('Error while creating PayCode:', err);
      }
    });
  }

  onUpdatePayCode(): void {
    if (this.AddPaycodeform.invalid) {
      this.AddPaycodeform.markAllAsTouched();
      alert("Please enter all required fields.");
      return;
    }

    const formValue = this.AddPaycodeform.getRawValue();

    const payload = {
      mode: 'Edit',
      userId: this.userdetail.user_Id,
      detail: {
        Paycode_Id: this.editData.row.Paycode_Id,
        Paycode_Code: formValue.PayCode ?? '',
        Description: formValue.Description ?? '',
        Print_As: formValue.PrintAs ?? '',
        PayType_Id: Number(formValue.PayType),
        IsTaxable: formValue.Taxable == 1,
        IsProjectTax: formValue.ProjectTax == 1,
        IsMarginalTax: formValue.MarginalTax == 1,
        Paycode_Type: formValue.PayCodeType == 1,
        Is_LOP_Applicable: formValue.LOPApplicable == 1,
        Is_PF_Applicable: formValue.PFApplicable == 1,
        Is_ESI_Applicable: formValue.ESIApplicable == 1,
        Is_PT_Applicable: formValue.PTApplicable == 1,
        Page_Type: Number(formValue.PageType) || 0,
        Account_Number: Number(formValue.GLAccountNumber) || 0,
        Posting_key: Number(formValue.PostingKey) || 0,
        Tax_Type_ID: Number(formValue.TaxTypeId) || 0
      }
    };
    console.log('payload', JSON.stringify(payload));

    this.payCode.CreatePayCode(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res.Data?.data?.Table0[0]?.Error_Message);
          this.dialogRef.close('updated');
        } else {
          alert(
            res?.Data?.message ||
            res?.Message ||
            'PayCode update failed.'
          );
        }
      },
      error: (err) => {
        console.error('Error while updating PayCode:', err);
        alert('Something went wrong while updating.');
      }
    });
  }



  onClose() {
    this.dialogRef.close();
  }

}
