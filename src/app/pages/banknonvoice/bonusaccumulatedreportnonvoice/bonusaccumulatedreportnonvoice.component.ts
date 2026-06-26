import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { IBonusAccumulatedReport } from '../../../Repository/banknonvoice/IBonusAccumulatedReport.service';
import { BonusaccumulatedService } from '../../../Service/banknonvoice/bonusaccumulated.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


const Pay_TOKEN = new InjectionToken<IBonusAccumulatedReport>('Pay_TOKEN');

@Component({
  selector: 'app-bonusaccumulatedreportnonvoice',
  standalone:true,
  imports: [MatIcon, CompanyallComponent, CommonModule, FormsModule],
  templateUrl: './bonusaccumulatedreportnonvoice.component.html',
  styleUrl: './bonusaccumulatedreportnonvoice.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BonusaccumulatedService,
    }
  ]
})
export class BonusaccumulatedreportnonvoiceComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  isLoading: boolean = false;
  companyId: any;
  fromdate: any;
  todate: any;

  constructor(
    @Inject(Pay_TOKEN) private service: IBonusAccumulatedReport,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }

  formatDateForAPI(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`; 
  }

  exportToExcel(): void {
    this.isLoading = true;
    const companyId = this.selectedCompanyId;
    const fromdate = this.formatDateForAPI(this.fromdate);
    const todate = this.formatDateForAPI(this.todate);

    this.service.ExportToExcel(companyId, fromdate, todate).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert(res.Data.data?.Table0.NIBonusAccumatedReportMessage);
            this.isLoading = false;
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `bonusaccumulatedreport${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }
}
