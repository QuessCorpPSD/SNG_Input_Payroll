import { Component, Inject, InjectionToken } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientaddressService } from '../../../Service/customersserv/clientaddress.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { IClientaddress } from '../../../Repository/customer/IClientaddress';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
export const Pay_TOKEN = new InjectionToken<IClientaddress>('Pay_TOKEN');

@Component({
  selector: 'app-clientaddress-new',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MapnameComponent, AlertpopupComponent],
  templateUrl: './clientaddress-new.component.html',
  styleUrl: './clientaddress-new.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ClientaddressService,
    }
  ]
})
export class ClientaddressNewComponent {
  clientaddress!: FormGroup;
  sameAsBilling = false;
  submitted = false;
  userdetail: any;
  Costcenter: any;
  companyUI: any;
  mapnameUI: any;
  selectedCC?: number;
  selectedMN?: number;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ClientaddressNewComponent>,
    private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IClientaddress, private decry: EncryptionService,
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

  // When company dropdown emits
  handleCompanyEvent(company: any) {
    this.selectedCC = company.companyId;
    this.companyUI = company;
    this.clientaddress.patchValue({
      company: company
    });
  }

  handleMapNameEvent(mapname: any) {
    this.selectedMN = mapname.mapName;
    this.mapnameUI = mapname;
  }

  // Mark single field touched
  markFieldTouched(field: string) {
    this.clientaddress.get(field)?.markAsTouched();
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
        CostCenterMappingId: this.mapnameUI.mapNameId || 0,

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

      this.service.clientaddressaddsave(payload).subscribe({
        next: (res: string) => {
          const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
          if (cleanMessage.includes('Success')) {
            alert('Client Address Created Successfully');
            resolve();
            this.dialogRef.close('refresh');
          } else {
            alert(cleanMessage);
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
}
