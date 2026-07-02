import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankInvoiceComponent } from '../bank-invoice-Onboarding/bank-invoice.component'
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatDialog } from '@angular/material/dialog';
import { IutrDetails } from '../../../Repository/banknonvoice/IutrDetails';
import { UtrDetailsService } from '../../../Service/banknonvoice/utr-details.service';
export const Common_TOKEN = new InjectionToken<IutrDetails>('Common_TOKEN');


@Component({
  selector: 'app-utr-details',
  standalone:true,
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    BankInvoiceComponent],
  templateUrl: './utr-details.component.html',
  styleUrl: './utr-details.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: UtrDetailsService }]
})
export class UtrDetailsComponent {
  companyUI: any;
  isLoading = false;
  userdetail!: any;
  payperiodUI: any;
  payPeriodTypefromParent: string = '';
  dataSource = new MatTableDataSource<any>([]);

  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private service: IutrDetails,
    private dialog: MatDialog
  ) { }

  @ViewChild(MatSort) sort!: MatSort;




  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      //alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      //alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      //alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

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
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParent = "All";


  }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onTemplateClick() {

    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    this.isLoading = true;

    const companyId = this.companyUI.companyId;
    const payPeriodId = this.payperiodUI.payfrequencyid;

    this.service.DownloadUtrDetails(companyId, payPeriodId)
      .subscribe({
        next: (res: any) => {
          if (res.Data) {
            const base64 = res.Data.file;
            let fileName = res.Data.fileName || 'UtrDetails_NonInvoice';
            if (!fileName.endsWith('.xlsx')) {
              fileName += '.xlsx';
            }

            if (base64) {
              this.downloadExcelFromBase64(base64, fileName);
            } else {
              alert("File data is empty");
            }

          } else {
            alert(res?.message || "No record(s) found!");
          }

          this.isLoading = false;
        },

        error: err => {
          console.error('Error downloading UTR Details', err);
          alert("Download failed");
          this.isLoading = false;
        }
      });
  }
  downloadExcelFromBase64(base64: string, filename: string) {

    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    alert("File downloaded successfully!");
  }

}
