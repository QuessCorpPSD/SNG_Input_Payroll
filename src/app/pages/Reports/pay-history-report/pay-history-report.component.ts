import { Component, Inject, InjectionToken } from '@angular/core';
import { IPayHistoryService } from '../../../Repository/Reports/IPayHistory.service';
import { PayHistoryService } from '../../../Service/Reports/PayHistory.service';

export const Pay_Token = new InjectionToken<IPayHistoryService>('Pay_Token');

@Component({
  selector: 'app-pay-history-report',
  standalone: true,
  imports: [],
  templateUrl: './pay-history-report.component.html',
  styleUrl: './pay-history-report.component.css',
  providers: [
    {
      provide: Pay_Token, useClass: PayHistoryService,
    }
  ]
})
export class PayHistoryReportComponent {

  constructor(@Inject(Pay_Token) private payHistoryService: IPayHistoryService) { }


  downloadPayHistory() {

    this.payHistoryService
      .downloadPayHistory(2, '', '2026')
      .subscribe({
        next: (res) => {
          try {
            const base64File = res?.Data?.file;
            let apiFileName = res?.Data?.fileName;

            if (!base64File) {
              alert("No file received from the API");
              return;
            }

            // 🔧 Fix invalid characters in the filename
            apiFileName = apiFileName
              .replace(/\//g, "-")
              .replace(/:/g, "-")
              .replace(/ /g, "_");

            // remove .xlsx because your download function adds extension
            apiFileName = apiFileName.replace(".xlsx", "");

            this.downloadExcelFromBase64(base64File, apiFileName, "Excel");
          } catch (err) {
            console.error("Error exporting to Excel:", err);
          }
        },
        error: (err) => {
          console.error("Error loading data for export", err);
        },
      });
  }

  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}
