import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IGstRepository } from '../../../Repository/GlobalMasters/IGstRepository';
import { GSTService } from '../../../Service/GlobalMasters/gst.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');


@Component({
  selector: 'app-gst-create',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, AlertpopupComponent],
  templateUrl: './gst-create.component.html',
  styleUrl: './gst-create.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GSTService,
    }
  ]
})
export class GSTCreateComponent {
  constructor(private dialogRef: MatDialogRef<GSTCreateComponent>,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }

  userdetail: any;

  onClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }

  }

  cgstApplicable: boolean = false;
  sgstApplicable: boolean = false;
  utgstApplicable: boolean = false;

  cgstPercentage: number = 0;
  sgstPercentage: number = 0;
  utgstPercentage: number = 0;
  cessPercentage: number = 0;
  EffectiveDate: string = '';
  GSTNumber = '';
  CompanyName = '';
  CompanyAddress = '';
  PinCode = '';
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';

  toggleField(type: string) {
    switch (type) {
      case 'cgst':
        if (!this.cgstApplicable) this.cgstPercentage = 0;
        break;
      case 'sgst':
        if (!this.sgstApplicable) this.sgstPercentage = 0;
        break;
      case 'utgst':
        if (!this.utgstApplicable) this.utgstPercentage = 0;
        break;
    }
  }

  SaveClick() {
    this.isLoading = true;
    const DEFAULT_DATE = '1900-01-01';

    if (!this.EffectiveDate || this.EffectiveDate === '1900-01-01') {
      alert('Please select Effective Date');
      this.isLoading = false;
      return;
    }

    if (this.GSTNumber == '') {
      alert('Please Enter GST Number');
      this.isLoading = false;
      return;
    }

    if (this.CompanyName == '') {
      alert('Please Enter Company Name');
      this.isLoading = false;
      return;
    }

    if (this.CompanyAddress == '') {
      alert('Please Enter Company Address');
      this.isLoading = false;
      return;
    }

    if (this.PinCode == '') {
      alert('Please Enter PinCode');
      this.isLoading = false;
      return;
    }

    if (this.cgstPercentage == 0) {
      alert('Please Enter GST Percentage');
      this.isLoading = false;
      return;
    }
    const today = new Date();
    const payload = {
      
        "Action": "Add",
        "UserId": String(this.userdetail.user_Id),
        "GstMasterId": 0,
        "EffectiveDate": String(this.EffectiveDate),
        "GstNumber": String(this.GSTNumber),
        "CompanyName": String(this.CompanyName),
        "CompanyAddress": String(this.CompanyAddress),
        "CreatedBy": this.userdetail.user_Id,
        "CreatedOn": today,
        "Gst_Percentage": String(this.cgstPercentage),
        "EntityId": 0,
        "Pincode": String(this.PinCode)
      
    };

    this.gstService.Create(payload).subscribe({
      next: (res: any) => {

        let isSuccess = String(res?.StatusCode) === '200' &&
          String(res?.Data?.response) === 'Created Successfully';

        if (isSuccess) {
          this.showPopup = true;
          this.popupMessage = res?.Data?.response;
          this.isLoading = false;

        } else {

          this.isLoading = false;
          alert(res?.Data?.response);
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
}
