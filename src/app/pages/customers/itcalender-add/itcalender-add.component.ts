import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { IItcalender } from '../../../Repository/customer/Iitcalender';
import { ItcalenderService } from '../../../Service/CUSTOMER/itcalender.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<IItcalender>('Pay_TOKEN');

@Component({
  selector: 'app-itcalender-add',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule,
    MatTooltipModule, CompanyallComponent, AlertpopupComponent],
  templateUrl: './itcalender-add.component.html',
  styleUrl: './itcalender-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ItcalenderService,
    }
  ]
})
export class ITcalenderAddComponent {
  ITcalenderform!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  selectedfinacialyearId:any;
  selectedfinacialyear:any;
  constructor(private dialogRef: MatDialogRef<ITcalenderAddComponent>, private fb: FormBuilder,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private itcalenderService: IItcalender
  ) { }

  userdetail: any;
  isLoading: boolean = false;
  finacialyearres: any;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';


  onClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.finacialyear();

    this.ITcalenderform = this.fb.group({
      Financialyear: ['', Validators.required],
      companycode: ['', Validators.required],
      declarationdate: ['', Validators.required],
      submisiondate: ['', Validators.required]
    })
  }

  finacialyear() {
    this.itcalenderService.GetFinancialYear().subscribe({
      next: (res: any) => {

        if (res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0 || res?.Data || [];
          this.finacialyearres = data;
        }
        else {
          alert('Unexpected API response. Check console.');
          console.warn('Unexpected:', res);
        }

        this.isLoading = false;  // <-- Stop loader on success
      },

      error: (err) => {
        console.error('Error fetching GST slab data:', err);
        this.isLoading = false;  // <-- Stop loader on error
      }
    });
  }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  onFinancialYearChange(event: any) {
  const selectedId = event.target.value; // Financial_Year_Id
  const selectedObj = this.finacialyearres.find(fy => fy.Financial_Year_Id == selectedId);

  if (selectedObj) {
    this.selectedfinacialyearId = selectedObj.Financial_Year_Id;
    this.selectedfinacialyear = selectedObj.Financial_Year_Name;

  }
}

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  Save() {
    this.isLoading = true;
    var payload;



    const formValue = this.ITcalenderform.value;

    if (String(formValue.companycode) == '') {
      alert('Please select Company code');
      this.isLoading = false;
      return;
    }

    if (String(formValue.Financialyear) == '') {
      alert('Please select Financial year');
      this.isLoading = false;
      return;
    }


    if (String(formValue.declarationdate) == '') {
      alert('Please select declaration date');
      this.isLoading = false;
      return;
    }

    if (String(formValue.submisiondate) == '') {
      alert('Please select submisiond date');
      this.isLoading = false;
      return;
    }
    payload = {
      "createdBy": this.userdetail.user_Id,
      "mode": "Add",
      "parentDetail": {
        "IT_Calender_Id": 0,
        "Company_Id": this.selectedCompanyId,
        "Company_Code": String(this.selectedCompanyCode),
        "Financial_Year_Id": this.selectedfinacialyearId,
        "Financial_Year_Name": String(this.selectedfinacialyear),
        "Declaration_CutOff_Date": String(formValue.declarationdate),
        "Submission_CutOff_Date": String(formValue.submisiondate),
        "IsActive": true,
        "Error_Message": "",
        "Serial_No": 0
      }
    };

    

    this.itcalenderService.Create(payload).subscribe({
      next: (res: any) => {

        let isSuccess = String(res?.StatusCode) === '200' &&
          String(res?.Data?.statusCode) === '200';

        if (isSuccess) {

          // SUCCESS CASE
          const table = res?.Data?.data?.Table0;
          const message = table?.[0]?.Error_Message || res?.Data?.message;
          this.showPopup = true;
          this.popupMessage = message;

        } else {

          // FAILURE CASE
          const errorMessage =
            res?.Data?.message ||
            res?.Error?.ErrorMessage ||
            res?.Message ||
            "Failed. Please try again.";

          alert(errorMessage.trim());
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
