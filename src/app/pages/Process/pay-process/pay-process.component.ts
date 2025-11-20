import { Component } from '@angular/core';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-pay-process',
  standalone: true,
  imports: [CompanyallComponent, CommonModule, MatTooltipModule, FormsModule, ReactiveFormsModule, PayPeriodComponent],
  templateUrl: './pay-process.component.html',
  styleUrl: './pay-process.component.css'
})
export class PayProcessComponent {
  selectedCompanyId: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = ''; AddForm!: FormGroup;
  selectedCompanyCode: any;

  constructor(private fb: FormBuilder, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.payPeriodType = "All";

    this.AddForm = this.fb.group({
      date: [{ value: '',}, Validators.required], // Disable date field
      month: [{ value: '', disabled: true }], // Disable month field
      'actual/declared': [{ value: '', disabled: true }], // Disable actual/declared field
      companyCode: [{ value: '' }], // Disable companyCode field (if needed)
      payPeriod: [{ value: ''}], // Disable payPeriod field (if needed)
      // Add other form controls and disable them similarly
    });

  }
}
