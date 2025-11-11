import { Component, EventEmitter } from '@angular/core';
import { CompanyComponent } from '../../../common/company/company.component';
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import saveAs from 'file-saver';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayperiodSalaryComponent } from "../../../common/payperiod-salary/payperiod-salary.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { NetpaysummaryService } from '../../../Service/SalaryRelease/netpaysummary.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-net-pay-sammary',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    PayperiodSalaryComponent,
    CompanyallComponent,
    AlertpopupComponent
  ],
  templateUrl: './net-pay-sammary.component.html',
  styleUrls: ['./net-pay-sammary.component.css']
})
export class NetPaySammaryComponent {
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  comapnyId: any;
  selectedCompanyCode: any;
  payperiod: any;
  selectedPayPeriod: { payPeriod?: string } | null = null;
  InvoiceCultureForm!: FormGroup;
  companyId: any;
  selectedCC: any;
  selectedPP: any;
  payPeriodId: any;
  userdetail: any;
  payperiodUI = new EventEmitter<Payperiodclass>();
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private _sessionStoreage: SessionStorageService, private decry: EncryptionService, private service: NetpaysummaryService) { }



  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCC = event.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiodUI.emit(payperiod);
  }


  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    }

  }

  searchAndDownloadExcel(): void {
    this.isLoading = true;
    if (!this.companyId) {
      this.showAlertPopup('Please select Company');
      this.isLoading = false;
      return;
    }

    if (!this.payPeriodId) {
      this.showAlertPopup('Please select Status');
      this.isLoading = false;
      return;
    }

    const companyCode = this.companyId;
    const payPeriodId = this.payPeriodId;
    const QzoneUsername = this.userdetail.userId;

    console.log(companyCode, payPeriodId, QzoneUsername);

    this.service.ExporttoExcel(companyCode, payPeriodId, QzoneUsername).subscribe(
      (response: APIResponse) => {
        try {
          console.log('API Response:', response);
          const base64String = response?.Data?.file;
          if (!base64String) {
            console.warn("No data found in the response.");
            this.showAlertPopup("No data found for the selected filters.");
            this.isLoading = false;
            return;
          }
          const byteCharacters = atob(base64String);
          const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `NetPay_Summary_Report_${dateStr}.xlsx`;
          saveAs(blob, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error("Failed to process data:", err);
          this.showAlertPopup("An error occurred while processing the data.");
          this.isLoading = false;
        }
      },
      (error) => { 
        console.error("Error downloading the file:", error);
        this.showAlertPopup("Error fetching the data. Please try again later.");
        this.isLoading = false;
      }
    );
  }
}


