import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CpfsummaryService } from '../../../Service/Reports/cpfsummary.service';
import { ICpfsummary } from '../../../Repository/Reports/ICpfSummaryservice';
import { finalize } from 'rxjs';
export const Pay_TOKEN = new InjectionToken<ICpfsummary>('Pay_TOKEN');

@Component({
  selector: 'app-cpfsummary',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './cpfsummary.component.html',
  styleUrl: './cpfsummary.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CpfsummaryService,
    }
  ]
})
export class CPFsummaryComponent {
  isLoading = false;
  Entity: any;
  PayPeriod: any
  entitySearch: any;
  Payperiod: any;
  constructor(@Inject(Pay_TOKEN) private service: ICpfsummary,) { }
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
  // exportToTxt(): void {
  //   const payload = {
  //     "EntityId": this.Entity,
  //     "PayPeriod":  this.PayPeriod?.pay_Period
  //   };

  //   this.service.Exporttoexcel(payload).subscribe({
  //     next: (res) => {
  //       console.log('export', res);
  //       try {
  //         const jsonData = res.Data.data.Table0;
  //         const data = res.Data.message;

  //         if (!jsonData || jsonData.length === 0) {
  //           alert(data);
  //           return;
  //         }

  //         const headers = Object.keys(jsonData[0]);
  //         const rows = jsonData.map(row => headers.map(h => row[h]).join('\t')); 
  //         const txtContent = [headers.join('\t'), ...rows].join('\n');

  //         const blob = new Blob([txtContent], { type: 'text/plain' });
  //         const timestamp = new Date().toISOString().split('T')[0];
  //         const fileName = `CPFSummary_${timestamp}.txt`;

  //         const link = document.createElement('a');
  //         link.href = URL.createObjectURL(blob);
  //         link.download = fileName;
  //         link.click();

  //       } catch (err) {
  //         console.error('Error exporting to TXT:', err);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading data for export', err);
  //     },
  //   });
  // }

  exportToTxt(): void {
    const payload = {
      "EntityId": this.Entity,
      "PayPeriod": this.PayPeriod?.pay_Period
    };
    this.isLoading = true;
    this.service.Exporttoexcel(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {

        try {
          const jsonData = res?.Data?.data?.Table0;
          const data = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(data);
            return;
          }

          const rows = jsonData.map(row => Object.values(row).join('\t'));
          const txtContent = rows.join('\n');

          const blob = new Blob([txtContent], { type: 'text/plain' });
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CPFfile_${this.PayPeriod?.pay_Period}.DTL`;

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();

        } catch (err) {
          console.error('Error exporting to TXT:', err);
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }


}
