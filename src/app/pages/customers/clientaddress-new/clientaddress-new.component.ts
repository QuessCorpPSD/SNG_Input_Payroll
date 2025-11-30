import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-clientaddress-new',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clientaddress-new.component.html',
  styleUrl: './clientaddress-new.component.css'
})
export class ClientaddressNewComponent {
  clientaddress!: FormGroup;
  sameAsBilling = false;
  submitted = false;
  userdetail: any;
  Costcenter: any;

  constructor(
    private dialogRef: MatDialogRef<ClientaddressNewComponent>,
    private fb: FormBuilder, private service: ClientaddressService, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }


    this.clientaddress = this.fb.group({
      company: ['', Validators.required],
      Costcentermapping: [''],

      subCustomerCode: ['', Validators.required],
      gstNumber: [''],

      billingClientName: ['', Validators.required],
      billingAddress: ['', Validators.required],

      shippingClientName: ['', Validators.required],
      shippingAddress: ['', Validators.required],

      effectiveDate: [''],

      IsShippingAddressSameAsBilling: [false],
      gstApplicable: [false]
    });

    this.BindCostcenter();
  }

  // When company dropdown emits
  handleCompanyEvent(company: any) {
    this.clientaddress.patchValue({
      company: company
    });
  }

  // Mark single field touched
  markFieldTouched(field: string) {
    this.clientaddress.get(field)?.markAsTouched();
  }

  onSameAsBillingChange(event: any) {
    this.sameAsBilling = event.target.checked;

    this.clientaddress.patchValue({
      IsShippingAddressSameAsBilling: this.sameAsBilling
    });

    if (this.sameAsBilling) {
      this.clientaddress.patchValue({
        shippingClientName: this.clientaddress.get('billingClientName')?.value,
        shippingAddress: this.clientaddress.get('billingAddress')?.value
      });

      this.clientaddress.get('shippingClientName')?.disable();
      this.clientaddress.get('shippingAddress')?.disable();
    }
    else {
      this.clientaddress.get('shippingClientName')?.enable();
      this.clientaddress.get('shippingAddress')?.enable();

      this.clientaddress.patchValue({
        shippingClientName: '',
        shippingAddress: ''
      });
    }
  }

  BindCostcenter() {
    this.service.getcostcenter().subscribe({
      next: res => { this.Costcenter = res.Data }
    });
  }


  onClose() {
    this.dialogRef.close();
  }

  ValidatedSubmit(): Promise<void> {
    this.submitted = true;

    return new Promise((resolve, reject) => {

      if (this.clientaddress.invalid) {
        this.clientaddress.markAllAsTouched();
        reject("Form validation failed");
        return;
      }

      const raw = this.clientaddress.getRawValue();

      const payload = {
        Action: "Add",
        UserId: this.userdetail.user_Id,
        ClientAddressId: null,

        CompanyId: raw.company?.companyId || 0,
        CostCenterMappingId: raw.Costcentermapping || 0,

        BillingClientName: raw.billingClientName,
        BillingAddress: raw.billingAddress,

        IsShippingAddressSameAsBilling: raw.IsShippingAddressSameAsBilling,

        ShippingClientName: this.sameAsBilling
          ? this.clientaddress.get('billingClientName')?.value
          : raw.shippingClientName,

        ShippingAddress: this.sameAsBilling
          ? this.clientaddress.get('billingAddress')?.value
          : raw.shippingAddress,

        EffectiveDate: raw.effectiveDate || "",
        GstApplicable: raw.gstApplicable || false,

        SAC_Code: raw.subCustomerCode,
        GstNumber: raw.gstNumber,

        CreatedBy: this.userdetail.user_Id
      };

      console.log("Payload:", JSON.stringify(payload));

      this.service.clientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');

          if (cleanMessage.includes('Success')) {
            // success logic
            resolve();
          } else {
            alert(cleanMessage);
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
