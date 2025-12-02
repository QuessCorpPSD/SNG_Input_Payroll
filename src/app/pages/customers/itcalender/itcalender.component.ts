import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ITcalenderAddComponent } from '../itcalender-add/itcalender-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ITcalenderEditComponent } from '../itcalender-edit/itcalender-edit.component';
import { IItcalender } from '../../../Repository/customer/Iitcalender';
import { ItcalenderService } from '../../../Service/CUSTOMER/itcalender.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Pay_TOKEN = new InjectionToken<IItcalender>('Pay_TOKEN');

@Component({
  selector: 'app-itcalender',
  standalone: true,
  imports: [AlertpopupComponent, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './itcalender.component.html',
  styleUrl: './itcalender.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ItcalenderService,
    }
  ]
})
export class ITcalenderComponent {
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  isuploadgridvisible = false;
  uploadDisplayedColumns: string[] = ['Action', 'SNo', 'CompanyCode', 'FinancialYear', 'Declarationcutoffdate', 'Submissioncutoffdate'];
  uploadedData: any[] = [];
  selectedfinacialyearId: number = 0;

  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  constructor(private dialog: MatDialog,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private itcalenderService: IItcalender
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedCompanyId: number = 0;
  selectedCompanyCode: any;
  userdetail: any;
  finacialyearres: any;

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.finacialyear();
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

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  // Method to close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  onsearch() {
    this.isLoading = true;   // <-- Start loader

    this.itcalenderService.Search(this.selectedCompanyId, this.selectedfinacialyearId).subscribe({
      next: (res: any) => {

        if (res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0 || res?.Data || [];

          if (Array.isArray(data) && data.length > 0) {
            this.uploadedData = data;
            this.uploadedDataSource.data = this.uploadedData;
            this.isuploadgridvisible = true;
          }
          else if (res?.Data?.errors) {
            const validationErrors = res.Data.errors;
            const messages: string[] = [];

            Object.keys(validationErrors).forEach(key => {
              messages.push(`${key}: ${validationErrors[key].join(', ')}`);
            });

            alert('Validation Errors:\n' + messages.join('\n'));
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
          }
          else {
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
            alert('No data found.');
          }
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
  onFinancialYearChange(event: any) {
    this.selectedfinacialyearId = event.target.value;
  }

  AddPOOpen() {
    this.dialog.open(ITcalenderAddComponent, {
      width: '50%',
      height: '50vh',
      disableClose: true,
      data: null
    });
  }
  EditOpen(row: any) {
    console.log(row);
    this.dialog.open(ITcalenderEditComponent, {
      width: '50%',
      height: '50vh',
      disableClose: true,
      data: row
    });
  }
}