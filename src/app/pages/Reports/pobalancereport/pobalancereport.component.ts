import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { IPobalancereport } from '../../../Repository/Reports/IPobalance.service';
import { PobalancereportService } from '../../../Service/Reports/pobalancereport.service';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

export const Pay_TOKEN = new InjectionToken<IPobalancereport>('Pay_TOKEN');

@Component({
  selector: 'app-pobalancereport',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule, CompanyallComponent, AlertpopupComponent],
  templateUrl: './pobalancereport.component.html',
  styleUrl: './pobalancereport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: PobalancereportService,
    }
  ]
})

export class PobalancereportComponent {

  data: any;
  isLoading = false;
  selectedCompanyId: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;

  constructor(@Inject(Pay_TOKEN) private service: IPobalancereport,) { }

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


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
  }

  exportToExcel(): void {

    const companyId = this.selectedCompanyId ?? 0;

    this.isLoading = true;

    this.service.Exporttoexcel(companyId).subscribe({
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

        XLSX.utils.book_append_sheet(wb, ws, "POBalanceReport");

        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `POBalanceReport_${timestamp}.xlsx`;

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


  // exportToExcel(): void {
  //   const companyId = this.selectedCompanyId ? this.selectedCompanyId : 0;

  //   this.service.Exporttoexcel(companyId).subscribe({
  //     next: (res) => {
  //       console.log('export', res);

  //       try {
  //         const jsonData = res.Data.data.Table0;
  //         console.log("josn", jsonData)
  //         const message = res.Data.message;

  //         if (!jsonData || jsonData.length === 0) {
  //           alert(message || 'No records found');
  //           return;
  //         }

  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //         XLSX.utils.book_append_sheet(wb, ws, 'BillingUBRreport');

  //         const timestamp = new Date().toISOString().split('T')[0];
  //         const fileName = `BillingUBRreport_${timestamp}.xlsx`;

  //         XLSX.writeFile(wb, fileName);
  //         this.showAlertPopup(message)
  //       } catch (err) {
  //         console.error('Error exporting to Excel:', err);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading data for export', err);
  //     }
  //   });
  // }


}
