import { Component, Inject, InjectionToken } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeReportProcessService } from '../../../Service/Reports/employee-report-process.service';
import { IEmployeeReportProcess } from '../../../Repository/Reports/IEmployeeReportService';

export const Pay_TOKEN = new InjectionToken<IEmployeeReportProcess>('Pay_TOKEN');

@Component({
  selector: 'app-employee-report-process',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './employee-report-process.component.html',
  styleUrl: './employee-report-process.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeReportProcessService,
    }
  ]
})
export class EmployeeReportProcessComponent {

  Payperiod: any;
  PayPeriod: any;
  data: any;
  isLoading = false;
  constructor(@Inject(Pay_TOKEN) private service: EmployeeReportProcessService,) { }
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
      payPeriod: this.PayPeriod
    };
    console.log('Payload', payload)

    this.service.Exporttoexcel(payload).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data.data.Table0;
          this.data = res.Data.message;

          if (jsonData.length === 0) {
            alert(this.data || "No records found.");
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "EmployeeReportProcess");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `employeeReportProcess_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) { }
      },
      error: (err) => { }
    });
  }





}

