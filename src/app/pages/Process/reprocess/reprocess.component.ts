import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardHeader, MatCardContent, MatCardModule } from "@angular/material/card";
import { MatTabsModule } from '@angular/material/tabs';
import { IPayProcessRepository } from '../../../Repository/Process/IPayProcessRepository';
import { PayProcessRepository } from '../../../Service/Process/PayProcessRepository';
import { PayperiodsequenceComponent } from '../../../common/payperiodsequence/payperiodsequence.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { PayprocesstypeComponent } from '../../../common/payprocesstype/payprocesstype.component';
import { constants } from 'node:fs';


export const Pay_TOKEN = new InjectionToken<IPayProcessRepository>('Pay_TOKEN');

@Component({
  selector: 'reprocess',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CompanyallComponent,
    PayperiodsequenceComponent, MatIconModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatSelectModule, AlertpopupComponent,PayprocesstypeComponent],
  templateUrl: './reprocess.component.html',
  styleUrl: './reprocess.component.css',
  providers: [DatePipe,
    {
      provide: Pay_TOKEN,
      useClass: PayProcessRepository,
    }
  ]
})
export class ReprocessComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  isLoading: boolean = false;
  selectedDate: string = '';
  actual_Or_delcare: string = '';
  selectoption: string = 'PP';
  userdetail!: any;
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
   constructor(private datePipe: DatePipe, @Inject(Pay_TOKEN) private _payProcessService: IPayProcessRepository,
    private _sessionStoreage: SessionStorageService, private decry: EncryptionService,) {

  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;

  }

  
handleuserEvent(user:any)
{
  this.selectoption=user;
  //console.log(user)
}
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;

    console.log(this.selectedCompanyId);
    if (this.selectedCompanyId != 0 || this.selectedCompanyId != undefined) {
      console.log(this.payPeriod)

      const request = {
        "company_Id": this.selectedCompanyId,
        "End_At": this.selectedDate
      }
      console.log(request);
      this._payProcessService.GetITCalenderCompany(request).subscribe({
        next: res => {
          console.log(res.Data)
          if (res?.Data?.actual_declared) {
            this.actual_Or_delcare = res.Data.actual_declared;
          } else {
            this.actual_Or_delcare = '';
          }

        },
        error: err => { console.log(err) }
      })
    }
  }


  ngOnInit(): void {
    this.payPeriodType = "All";
    const now = new Date();
    const formatted = this.datePipe.transform(now, 'dd-MM-yyyy');
    this.selectedDate = String(formatted);
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      console.log('Userdetails',this.userdetail);

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };
  }

  ProcessClick() {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }

    if (!this.payPeriod) {
      alert("Please select Payperiod");
      this.isLoading = false;
      return;
    }

    if (this.actual_Or_delcare == '') {
      alert("Actual Or Delcare is empty");
      this.isLoading = false;
      return;
    }

    const payload = {
      Company_Id:String(this.selectedCompanyId),
      Pay_Period_Id: String(this.payPeriod.payfrequencyid),
      Declaration_type: String(this.actual_Or_delcare),
      CreatedBy: String(this.userdetail.user_Id)

    };

        if (this.selectoption === "PP") {
      this._payProcessService.PayProcess(payload).subscribe({
        next: res => {
          this.UploadedResponse = res;

          if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'ReProcessed Successfully.') {
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Processed Successfully.';
          }
          else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'Failed.') {

            const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
            const exportData = errorArray.map((item: any) => ({
              MESSAGE: item.Error_Message || item.ERROR_MESSAGE || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { 'ErrorMessages': worksheet },
              SheetNames: ['ErrorMessages']
            };

            // Export the file
            XLSX.writeFile(workbook, 'ErrorMessages_Timesheet.xlsx');
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Failed to Process.';

          }
          else {
            if (this.UploadedResponse.data.response != '') {
              alert(this.UploadedResponse.data.response);
              this.isLoading = false;
            }
            else {
              alert('Error while processing response.');
              this.isLoading = false;
            }

          }
        },
        error: err => {
          console.error("Error:", err);
          this.isLoading = false;
        }
      });
    }
    else if (this.selectoption === "FPP") {
      this._payProcessService.FandFPayProcess(payload).subscribe({
        next: res => {
          this.UploadedResponse = res;

          if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'Processed Successfully.') {
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Processed Successfully.';
          }
          else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'Failed.') {

            const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
            const exportData = errorArray.map((item: any) => ({
              MESSAGE: item.Error_Message || item.ERROR_MESSAGE || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { 'ErrorMessages': worksheet },
              SheetNames: ['ErrorMessages']
            };

            // Export the file
            XLSX.writeFile(workbook, 'ErrorMessages_Timesheet.xlsx');
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Failed to Process.';

          }
          else {
            if (this.UploadedResponse.data.response != '') {
              alert(this.UploadedResponse.data.response);
              this.isLoading = false;
            }
            else {
              alert('Error while processing response.');
              this.isLoading = false;
            }

          }
        },
        error: err => {
          console.error("Error:", err);
          this.isLoading = false;
        }
      });
    }


  }
}
