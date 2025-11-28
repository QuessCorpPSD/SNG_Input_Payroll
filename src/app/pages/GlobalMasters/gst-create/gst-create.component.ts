import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-gst-create',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './gst-create.component.html',
  styleUrl: './gst-create.component.css'
})
export class GSTCreateComponent {
  constructor(private dialogRef: MatDialogRef<GSTCreateComponent>,
    private decry: EncryptionService,
        private _sessionStoreage: SessionStorageService,
  ) { }

userdetail:any;

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

    const DEFAULT_DATE = '1900-01-01';

    if (!this.EffectiveDate || this.EffectiveDate === '1900-01-01') {
    alert('Please select Effective Date');
    return;
  }

    if (this.GSTNumber == '') {
      alert('Please Enter GST Number');
      return;
    }

    if (this.CompanyName == '') {
      alert('Please Enter Company Name');
      return;
    }

    if (this.CompanyAddress == '') {
      alert('Please Enter Company Address');
      return;
    }

    if (this.PinCode == '') {
      alert('Please Enter PinCode');
      return;
    }

    if (this.cgstPercentage == 0) {
      alert('Please Enter GST Percentage');
      return;
    }
const today = new Date();
     const payload = {
      
  "Action": "Add",
  "UserId": String(this.userdetail.user_Id),
  "GstMasterId": 0,
  "EffectiveDate": this.EffectiveDate,
  "GstNumber": String(this.GSTNumber),
  "CompanyName": String(this.CompanyName),
  "CompanyAddress": String(this.CompanyAddress),
  "CreatedBy": String(this.userdetail.user_Id),
  "CreatedOn": today,
  "Gst_Percentage": String(this.cgstPercentage),
  "EntityId": 0,
  "Pincode": String(this.PinCode)

    };
 
  }
}
