import { Component, Inject, InjectionToken } from '@angular/core';
import * as XLSX from 'xlsx';
import { IotherIncomeProcess } from '../../../Repository/Reports/IotherIncomeProcess';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OtherIncomeProcessService } from '../../../Service/Reports/other-income-process.service';

export const Pay_TOKEN = new InjectionToken<IotherIncomeProcess>('Pay_TOKEN');

@Component({
  selector: 'app-other-income-process-report',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './other-income-process-report.component.html',
  styleUrl: './other-income-process-report.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: OtherIncomeProcessService,
    }
  ]
})
export class OtherIncomeProcessReportComponent {

  Payperiod: any = [];
  PayPeriod: string = '';  
  data: any;
  isLoading = false;

  constructor(@Inject(Pay_TOKEN) private service: OtherIncomeProcessService) { }

  ngOnInit() {
    this.BindPayPeriod();
  }

  BindPayPeriod() {
    this.service.GetPayPeriod().subscribe({
      next: (res: any) => {
        this.Payperiod = res?.Data ?? [];
      }
    });
  }

  exportToExcel(): void {
    if (!this.PayPeriod) {
      alert('Please select payperiod');
      return;
    }

    this.service.Exporttoexcel(this.PayPeriod).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data?.data?.Table0 ?? [];
          this.data = res.Data?.message;

          if (jsonData.length === 0) {
            alert(this.data || "No records found.");
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "OtherIncomeProcess");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `OtherIncomeProcess_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        }
        catch (err) {
          console.error(err);
        }
      }
    });
  }
}
