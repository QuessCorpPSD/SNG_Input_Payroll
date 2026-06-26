import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { IBankNonInvoiceNEFTCulture } from '../../../Repository/banknonvoice/Ibankneftculture';
import { BankneftcultureService } from '../../../Service/banknonvoice/bankneftculture.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

const Pay_TOKEN = new InjectionToken<IBankNonInvoiceNEFTCulture>('Pay_TOKEN');

@Component({
  selector: 'app-financeholdreport',
  standalone:true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './financeholdreport.component.html',
  styleUrl: './financeholdreport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BankneftcultureService,
    }
  ]
})
export class FinanceholdreportComponent {
  userdetail: any;
  payperiod: any;
  selectedpayperiod: any
  constructor(@Inject(Pay_TOKEN) private service: IBankNonInvoiceNEFTCulture, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }


  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.bindpayperiod();
  }
  bindpayperiod() {
    this.service.getpayperiod().subscribe({

      next: (res) => {
        this.payperiod = res.Data.data.Table0;
      }
    })
  }

  exportToExcel(): void {
    const companyid = this.selectedpayperiod?.Pay_Period;

    this.service.exporttoexcel(companyid).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;
          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert(res.Data.message);
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'company');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `finanaceholdreport_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          alert('An error occurred while exporting data.')
        }
      },
      error: (err) => {
        alert('Failed to load data from server.')
      },
    });
  }

}
