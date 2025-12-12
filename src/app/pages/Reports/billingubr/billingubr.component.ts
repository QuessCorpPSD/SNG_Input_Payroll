import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { IBillingUbr } from '../../../Repository/Reports/IBillingubr';
import { BillingubrService } from '../../../Service/Reports/billingubr.service';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export const Pay_TOKEN = new InjectionToken<IBillingUbr>('Pay_TOKEN');

@Component({
  selector: 'app-billingubr',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './billingubr.component.html',
  styleUrl: './billingubr.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BillingubrService,
    }
  ]
})
export class BillingubrComponent {
  Payperiod: any;
  PayPeriod: any;
  data: any;
  isLoading = false;
  constructor(@Inject(Pay_TOKEN) private service: IBillingUbr,) { }
  ngOnInit() {
    this.BindPayPeriod();

  }
  BindPayPeriod() {
    this.service.GetPayPeriod().subscribe({
      next: (res: any) => {
        this.Payperiod = res?.Data;
      }
    });
  }

  exportToExcel(): void {

    if (!this.PayPeriod) {
      alert('Please select payperiod');
      return;
    }
    const payload = {
      "PayPeriod": this.PayPeriod
    }

    this.service.Exporttoexcel(payload).subscribe({
      next: (res) => {
        console.log('export', res)
        try {
          const jsonData = res.Data.data.Table0;
          this.data = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(this.data);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "BillingUBRreport");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `BillingUBRreport_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }


}


