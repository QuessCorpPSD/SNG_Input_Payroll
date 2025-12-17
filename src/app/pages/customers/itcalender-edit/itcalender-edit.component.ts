import { Component, Inject, InjectionToken } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ItcalenderService } from '../../../Service/CUSTOMER/itcalender.service';
import { IItcalender } from '../../../Repository/customer/Iitcalender';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<IItcalender>('Pay_TOKEN');

@Component({
  selector: 'app-itcalender-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule,
    MatTooltipModule, AlertpopupComponent],
  templateUrl: './itcalender-edit.component.html',
  styleUrl: './itcalender-edit.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ItcalenderService,
    }
  ]
})
export class ITcalenderEditComponent {
  ITcalenderform!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  constructor(private dialogRef: MatDialogRef<ITcalenderEditComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
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

    const Declaration_CutOff_Dateapi = this.editData.Declaration_CutOff_Date;  // e.g. "28/11/2025"
    const Submission_CutOff_Dateapi = this.editData.Submission_CutOff_Date;  // e.g. "28/11/2025"
    this.ITcalenderform = this.fb.group({
      IT_Calender_Id: this.editData.IT_Calender_Id,
      Financialyear_id: this.editData.Financial_Year_Id,
      Financialyear: this.editData.Financial_Year_Name,
      Company_Id: this.editData.Company_Id,
      companycode: this.editData.Company_Code,
      declarationdate: this.convertDdMmYyyyToInput(Declaration_CutOff_Dateapi),
      submisiondate: this.convertDdMmYyyyToInput(Submission_CutOff_Dateapi),
    });

    this.ITcalenderform.get('companycode')?.disable();
    this.ITcalenderform.get('Financialyear')?.disable();
  }

  convertDdMmYyyyToInput(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;   // yyyy-MM-dd
  }

  Update() {
    this.isLoading = true;
    var payload;
    const formValue = this.ITcalenderform.value;

    payload = {
      "createdBy": this.userdetail.user_Id,
      "mode": "Edit",
      "parentDetail": {
        "IT_Calender_Id": this.editData.IT_Calender_Id,
        "Company_Id": this.editData.Company_Id,
        "Company_Code": String(this.editData.Company_Code),
        "Financial_Year_Id": this.editData.Financial_Year_Id,
        "Financial_Year_Name": String(this.editData.Financial_Year_Name),
        "Declaration_CutOff_Date": String(this.formatDate(formValue.declarationdate)),
        "Submission_CutOff_Date": String(this.formatDate(formValue.submisiondate)),
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
          alert(message);
          this.onClose();

        } else {

          // FAILURE CASE
          const errorMessage =
            res?.Data?.message ||
            res?.Error?.ErrorMessage ||
            res?.Message ||
            "Failed. Please try again.";

          alert(errorMessage.trim());
          this.onClose();
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

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  formatDate = (dateString: string) => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }


}

