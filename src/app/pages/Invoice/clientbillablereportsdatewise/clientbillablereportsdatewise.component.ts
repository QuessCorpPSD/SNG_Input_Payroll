import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { ClientBillableReportDatewiseService } from '../../../Service/invoice/client-billable-report-datewise.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { IClientBillableReport } from '../../../Repository/invoice/Iclientbillablereports';
import * as XLSX from 'xlsx';

export const Pay_TOKEN = new InjectionToken<IClientBillableReport>('Pay_TOKEN');

@Component({
  selector: 'app-clientbillablereportsdatewise',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, FormsModule, FormsModule],
  templateUrl: './clientbillablereportsdatewise.component.html',
  styleUrl: './clientbillablereportsdatewise.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ClientBillableReportDatewiseService,
    }
  ]
})
export class ClientbillablereportsdatewiseComponent {
  entitySearch: any;
  data: any;
  today: string = new Date().toISOString().split('T')[0];
  Startdate = '';
  Enddate = '';
  Entity: any;

  constructor(@Inject(Pay_TOKEN) private service: IClientBillableReport, private fb: FormBuilder,) { }

  ngOnInit() {
    this.BindEntityName()

  }

  BindEntityName() {
    this.service.EntitySearch().subscribe({
      next: (res: any) => {
        this.entitySearch = res?.Data?.data?.Table0;
      }
    });
  }
  exportToExcel(): void {

    const Entityid = this.Entity;
    const fromdate = this.Startdate;
    const todate = this.Enddate;

    if (!Entityid) {
      alert("Please select Entity");
      return;
    }

    if ((!fromdate)) {
      alert("Please select from date.");
      return;
    }
    if ((!todate)) {
      alert("Please select todate.");
      return;
    }

    if (fromdate > todate) {
      alert("From Date cannot be greater than todate.");
      return;
    }


    this.service.Exporttoexcel(Entityid, fromdate, todate).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, "BillingpayFrequency");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `BillingpayFrequency_${timestamp}.xlsx`;

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
