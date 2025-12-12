import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Pay_TOKEN } from '../payregisterentitywise/payregisterentitywise.component';
import * as XLSX from 'xlsx';
import { OtherincomereportentitywiseService } from '../../../Service/Reports/otherincomereportentitywise.service';
import { IotherincomeentitywiseService } from '../../../Repository/Reports/IOtherIncomeReportEntitywise.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-otherincomeentitywisereport',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './otherincomeentitywisereport.component.html',
  styleUrl: './otherincomeentitywisereport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: OtherincomereportentitywiseService,
    }
  ]
})
export class OtherincomeentitywisereportComponent {

  entitySearch: any;
  Entity: any;
  isLoading = false;
  Payperiod: any;
  PayPeriod: any;
  data: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;

  constructor(@Inject(Pay_TOKEN) private service: IotherincomeentitywiseService,) { }

  ngOnInit() {
    this.BindEntityName();
    this.BindPayPeriod();

  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopupalert = true;
  }

  closePoopup() {
    this.showPopupalert = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  BindEntityName() {
    this.service.getEntity().subscribe({
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
      EntityId: Number(this.Entity),
      PayPeriod: this.PayPeriod
    }

    this.service.Exporttoexcel(payload).subscribe({
      next: (res) => {
        console.log('export response:', res);

        // Case 1: API returned inner 400 → No Records Found
        if (res.Data?.statusCode === 400) {
          this.isLoading = false;
          alert(res.Data.message || "No records found.");
          return;
        }

        // Case 2: Actual export data is available
        const jsonData = res.Data?.data?.Table0;
        const msg = res.Data.message;

        if (!jsonData || jsonData.length === 0) {
          this.isLoading = false;
          alert("No records available for export.");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "OtherIncomeReportEntitywise");

        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `OtherIncomeReportEntitywise_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);

        this.isLoading = false;
        this.showAlertPopup(msg || "Export successful!");
      },

      error: (err) => {
        console.error("Error loading data for export", err);
        this.isLoading = false;
      }
    });
  }


}
