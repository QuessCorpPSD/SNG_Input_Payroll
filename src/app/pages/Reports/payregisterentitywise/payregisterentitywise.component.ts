import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { IpayregisterentitywiseService } from '../../../Repository/Reports/Ipayregisterentitywise';
import { PayregisterentitywiseService } from '../../../Service/Reports/payregisterentitywise.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
export const Pay_TOKEN = new InjectionToken<IpayregisterentitywiseService>('Pay_TOKEN');

@Component({
  selector: 'app-payregisterentitywise',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './payregisterentitywise.component.html',
  styleUrl: './payregisterentitywise.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: PayregisterentitywiseService,
    }
  ]
})
export class PayregisterentitywiseComponent {
  entitySearch: any;
  Entity: any;
  isLoading = false;
  Payperiod: any;
  PayPeriod: any;
  data: any;
  constructor(@Inject(Pay_TOKEN) private service: IpayregisterentitywiseService,) { }
  ngOnInit() {
    this.BindEntityName();
    this.BindPayPeriod();

  }

  BindEntityName() {
    this.service.EntitySearch().subscribe({
      next: (res: any) => {
        this.entitySearch = res?.Data?.data?.Table0;
      }
    });
  }
  BindPayPeriod() {
    this.service.GetPayPeriod().subscribe({
      next: (res: any) => {
        this.Payperiod = res?.Data;
      }
    });
  }

  exportToExcel(): void {
    if (!this.Entity) {
      alert('Please select entity');
      return;
    }
    if (!this.PayPeriod) {
      alert('Please select payperiod');
      return;
    }

    const payload = {
      "EntityId": this.Entity,
      "PayPeriod": this.PayPeriod?.pay_Period
    }
    console.log(JSON.stringify(payload))
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

          XLSX.utils.book_append_sheet(wb, ws, "Payregisterentitywise");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Payregisterentitywise_${timestamp}.xlsx`;

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
