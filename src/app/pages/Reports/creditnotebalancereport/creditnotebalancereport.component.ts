import { Component, Inject, InjectionToken } from '@angular/core';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { CreditnotebalancereportService } from '../../../Service/Reports/creditnotebalancereport.service';
import { ICreditNoteBalanceReport } from '../../../Repository/Reports/ICreditNoteBalanceReport.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
export const Pay_TOKEN = new InjectionToken<ICreditNoteBalanceReport>('Pay_TOKEN');
@Component({
  selector: 'app-creditnotebalancereport',
  standalone: true,
  imports: [CompanyallComponent, MatIconModule, CommonModule, FormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './creditnotebalancereport.component.html',
  styleUrl: './creditnotebalancereport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CreditnotebalancereportService,
    }
  ]
})
export class CreditnotebalancereportComponent {

  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  selectedCompanyId!: number;
  StartDate: any;
  EndDate: any;
  isLoading = false;

  constructor(@Inject(Pay_TOKEN) private balanceReprort: ICreditNoteBalanceReport,) { }

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

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.StartDate = today;
    this.EndDate = today;
  }


  onStartChange(event: any) {
    this.StartDate = event.target.value;
    // const [year, month, day] = inputDate.split("-");
    // this.StartDate = `${day}/${month}/${year}`;
  }

  onEndChange(event: any) {
    this.EndDate = event.target.value;
    // const [year, month, day] = inputDateend.split("-");
    // this.EndDate = `${day}/${month}/${year}`;
  }
  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert('Please select company');
      return;
    }

    this.isLoading = true;

    const payload = {
      CompanyId: this.selectedCompanyId,
      FromDate: this.StartDate,
      ToDate: this.EndDate
    }

    this.balanceReprort.Exporttoexcel(payload).subscribe({
      next: (res) => {
        try {
          console.log(res);
          const jsonData = res?.Data?.data?.Table0 || res.Data.data;
          const msg = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            this.isLoading = false;
            alert(msg);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "CreditNoteBalanceReport");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CreditNoteBalanceReport${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          this.isLoading = false;
          console.error('Error exporting to Excel:', err);
          alert("Server Error,Please try again later");
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading data for export', err);
        alert("Server Error,Please try again later");
      },
    });
  }


}
