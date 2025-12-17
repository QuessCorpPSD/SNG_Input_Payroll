import { CommonModule } from '@angular/common';
import { Component, InjectionToken, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PaycodeserviceService } from '../../../Service/GlobalMasters/paycodeservice.service';
import { IPAycodeService } from '../../../Repository/GlobalMasters/Ipaycode.service';

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

  constructor(@Inject(Paycode_TOKEN) private payCode: PaycodeserviceService, private dialogRef: MatDialogRef<PaycodeaddComponent>,) { }

  ngOnInit(): void {
    this.BindPageType();
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
  }

  BindPageType() {
    this.payCode.GetPageType().subscribe({
      next: res => { this.pagetype = res.Data.data.Table0 }
    });
  }

  onSavePayCode(): void {
    if (this.AddPaycodeform.invalid) {
      console.warn('Form invalid. Please fill all required fields.');

      this.AddPaycodeform.markAllAsTouched();

      alert("Please enter all required fields.")
      return;
    }

    const formValue = this.AddPaycodeform.getRawValue();
    const boolToNum = (val: any) => (val ? 1 : 0);

    // Construct XML string
    const xmlDetails = `
<Root>
  <Row
    PayCode="${formValue.PayCode || ''}"
    Description="${formValue.Description || ''}"
    PrintAs="${formValue.PrintAs || ''}"
    PayType_Id="${formValue.PayType || 0}"
    Is_Taxable="${boolToNum(formValue.Taxable)}"
    Is_ProjectTax="${boolToNum(formValue.ProjectTax)}"
    Is_MarginalTax="${boolToNum(formValue.MarginalTax)}"
    PayCode_Type="${formValue.PayCodeType || 0}"
    Is_LOP_Applicable="${boolToNum(formValue.LOPApplicable)}"
    Is_PF_Applicable="${boolToNum(formValue.PFApplicable)}"
    Is_ESI_Applicable="${boolToNum(formValue.ESIApplicable)}"
    Is_PT_Applicable="${boolToNum(formValue.PTApplicable)}"
    Page_Type="${formValue.PageType || 0}"
    Account_Number="${formValue.GLAccountNumber || ''}"
    Posting_Key="${formValue.PostingKey || ''}"
  />
</Root>
`.trim();

    const payload = {
      strXmlDetails: xmlDetails,
      mode: 'Add',
      userId: 3
    };


 
    this.payCode.CreatePayCode(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && res?.Data?.statusCode === '200') {
          alert("PayCode created successfully.")
          this.dialogRef?.close();
        } else {
          const message =
            res?.Data?.message ||
            res?.Message ||
            'PayCode creation failed. Please try again.';
        }
      },
      error: (err) => {
        console.error('Error while creating PayCode:', err);
      }
    });
  }


  onClose() {
    this.dialogRef.close();
  }

}
