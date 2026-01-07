import { Component, Inject, InjectionToken } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IGstRepository } from '../../../Repository/GlobalMasters/IGstRepository';
import { GSTService } from '../../../Service/GlobalMasters/gst.service';
export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');

@Component({
  selector: 'app-gst-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './gst-edit.component.html',
  styleUrl: './gst-edit.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GSTService,
    }
  ]
})
export class GSTEditComponent {
  Gsteditform!: FormGroup;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';
  userdetail: any;
  entity: any;


  constructor(
    private dialogRef: MatDialogRef<GSTEditComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }

    this.Gsteditform = this.fb.group({
      Gstmasterid: [this.editData.GstMasterId ?? '', Validators.required],
      EffectiveDate: [this.formatDate(this.editData.EffectiveDate) ?? '', Validators.required],
      GSTNumber: [this.editData.GstNumber ?? '', [Validators.required]],
      CompanyName: [this.editData.CompanyName ?? '', Validators.required],
      CompanyAddress: [this.editData.CompanyAddress ?? '', Validators.required],
      PinCode: [this.editData.PinCode ?? '', [Validators.required]],
      cgstPercentage: [this.editData.Gst_Percentage ?? '', [Validators.required]],
      Entity: [this.editData.EntityId ?? '', [Validators.required]]
    });
    this.LoadEntity();
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
  LoadEntity() {
    this.gstService.GetEntity().subscribe({
      next: (res: any) => {


        if (res?.Data?.data?.Table0) {
          this.entity = res.Data.data.Table0;
        }
      },
      error: err => console.error(" Pay Category API Error:", err)
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }

  SaveClick() {
    if (this.Gsteditform.invalid) {
      this.Gsteditform.markAllAsTouched();
      alert("Please fill all mandatory fields with valid data.");
      return;
    }

    this.isLoading = true;

    const form = this.Gsteditform.value;

    const payload = {
      "Action": "Edit",
      "UserId": String(this.userdetail.user_Id),
      "GstMasterId": Number(form.Gstmasterid),
      "EffectiveDate": String(form.EffectiveDate),
      "GstNumber": String(form.GSTNumber),
      "CompanyName": String(form.CompanyName),
      "CompanyAddress": String(form.CompanyAddress),
      "CreatedBy": this.userdetail.user_Id,
      "Gst_Percentage":String(form.cgstPercentage),
      "EntityId": Number(form.Entity),
      "Pincode": String(form.PinCode)
    };
    this.gstService.Edit(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.response;
        if (msg.toLowerCase().includes('success')) {
          alert(res.Data.response);
          this.dialogRef.close('refresh');
        } else {
          alert(res?.Data?.response || "Unexpected response");
          this.dialogRef.close('refresh');
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while processing");
      }
    });
  }



}
