import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
import { IClientaddress } from '../../../Repository/customer/IClientaddress';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
export const Pay_TOKEN = new InjectionToken<IClientaddress>('Pay_TOKEN');

@Component({
  selector: 'app-clientaddress-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './clientaddress-edit.component.html',
  styleUrl: './clientaddress-edit.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ClientaddressService,
    }
  ]
})
export class ClientaddressEditComponent {
  clientaddress!: FormGroup;
  sameAsBilling = false;
  submitted = false;
  rowData: any;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ClientaddressEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private service: IClientaddress,
  ) {
    this.rowData = data.rowData;
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.clientaddress = this.fb.group({
      company: [this.rowData.company_Code ?? '', Validators.required],
      Costcentermapping: [this.rowData.map_Name ?? ''],
      subCustomerCode: [this.rowData.saC_Code ?? '', Validators.required],
      gstNumber: [this.rowData.gstNumber ?? ''],
      billingClientName: [this.rowData.billingClientName ?? '', Validators.required],
      billingAddress: [this.rowData.billingAddress ?? '', Validators.required],
      shippingsameasbilling: [this.rowData.isShippingAddressSameAsBilling ?? false],
      shippingClientName: [this.rowData.shippingClientName ?? '', Validators.required],
      shippingAddress: [this.rowData.shippingAddress ?? '', Validators.required],
      effectiveDate: [this.formatDate(this.rowData.effectiveDate) ?? ''],
      gstApplicable: [this.rowData.gstApplicable ?? false]
    });
  }

  handleCompanyEvent(company: any) {
    this.clientaddress.patchValue({
      company: company.companyCode
    });
  }

  markFieldTouched(field: string) {
    this.clientaddress.get(field)?.markAsTouched();
  }

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

  onSameAsBillingChange(event: any) {
    const value = event.target.checked;  // true or false
    this.sameAsBilling = value;          // update local variable

    if (value) {
      this.clientaddress.patchValue({
        shippingClientName: this.clientaddress.value.billingClientName,
        shippingAddress: this.clientaddress.value.billingAddress
      });

      this.clientaddress.get('shippingClientName')?.disable();
      this.clientaddress.get('shippingAddress')?.disable();

    } else {
      this.clientaddress.get('shippingClientName')?.enable();
      this.clientaddress.get('shippingAddress')?.enable();

      this.clientaddress.patchValue({
        shippingClientName: this.clientaddress.value.billingClientName ?? '',
        shippingAddress: this.clientaddress.value.billingAddress ?? ''
      });
    }
  }


  // Submit button
  onSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise((resolve, reject) => {

      if (this.clientaddress.invalid) {
        this.clientaddress.markAllAsTouched();
        reject("Form validation failed");
        return;
      }

      const raw = this.clientaddress.getRawValue();

      const payload = {
        Action: "Edit",
        UserId: this.userdetail.user_Id,
        ClientAddressId: this.rowData.clientAddressId ?? null,

        CompanyId: this.rowData.companyId ?? '',
        CostCenterMappingId: this.rowData.costCenterMappingId,

        BillingClientName: raw.billingClientName,
        BillingAddress: raw.billingAddress,

        IsShippingAddressSameAsBilling: raw.shippingsameasbilling,

        ShippingClientName: raw.shippingClientName,

        ShippingAddress: raw.shippingAddress,

        EffectiveDate: this.formatDate(raw.effectiveDate) ?? "",
        GstApplicable: raw.gstApplicable || false,

        SAC_Code: raw.subCustomerCode,
        GstNumber: raw.gstNumber,

        CreatedBy: this.userdetail.user_Id
      };

      this.service.clientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
          if (cleanMessage.includes('Success')) {
            alert('Client Address updated Successfully');
            resolve();
            this.dialogRef.close('refresh');
          } else {
            alert(cleanMessage)
            reject('API returned failure');
            this.dialogRef.close('refresh');
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          reject(err);
        }
      });
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
