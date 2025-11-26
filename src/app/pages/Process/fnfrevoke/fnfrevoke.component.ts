import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { FNFRevokeService } from '../../../Service/Process/fnfrevoke.service';

@Component({
  selector: 'app-fnfrevoke',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    AlertpopupComponent
  ],
  templateUrl: './fnfrevoke.component.html',
  styleUrl: './fnfrevoke.component.css'
})
export class FNFRevokeComponent {

  userdetail: any;
  payPeriodType!: string;
  UploadedResponse: any;
  popupMessage: any;


  isLoading: boolean = false;
  showPopup: boolean = false;
  popupSubMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private leave: FNFRevokeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }


  showAlertPopup(message: string, sub: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = sub;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }


  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      this.showAlertPopup('Validation Error', 'Please upload an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("User", this.userdetail.user_Id);

    this.isLoading = true;

    this.leave.UploadFNFrevoke(formData).subscribe({
      next: (res: any) => {

        this.isLoading = false;
        this.UploadedResponse = res;

        const status = this.UploadedResponse.StatusCode;
        const response = this.UploadedResponse.Data?.response || "";
        const errors = this.UploadedResponse.Data?.errors || [];

     
        if (
          status === 200 &&
          (response.includes('Import Successfully Done.') ||
            response.includes('Uploaded faild due to'))
        ) {
          this.showAlertPopup('Success', response);
          return;
        }


        else if (status === 200 && response === 'Failed to import.') {

          let errorArray: any[] = [];

          try {
            errorArray = JSON.parse(errors[0]);
          } catch (e) {
            console.error("Error parsing error array:", e);
            errorArray = [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item.Error_Message ||
              item.ERROR_MESSAGE ||
              item.Message ||
              item.MESSAGE ||
              item.message ||
              ""
          }));


          this.showAlertPopup('Import Failed', response);

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_OneTimeReplacement.xlsx');

          this.popupMessage = response;
          return;
        }


        else {
          if (response !== '') this.showAlertPopup('Info', response);
          else this.showAlertPopup('Error', 'Error while processing response.');
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("Upload failed", err);
        this.showAlertPopup('Error', 'Upload Failed');
      }
    });
  }


  DownloadTemplate() {
    const templateData = [
      {
        CompanyCode: "",
        EmployeeCode: "",
        PayPeriod: "",
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'FNF_Revoke': worksheet },
      SheetNames: ['FNF_Revoke']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `FNF_Revoke_Template_${Date.now()}.xlsx`);

    this.showAlertPopup('Success', 'Template Downloaded Successfully.');
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }

    this.payPeriodType = "All";
  }
}
