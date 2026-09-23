import { Component, Inject, InjectionToken } from '@angular/core';
import { IPayHistoryService } from '../../../Repository/Reports/IPayHistory.service';
import { PayHistoryService } from '../../../Service/Reports/PayHistory.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

export const Pay_Token = new InjectionToken<IPayHistoryService>('Pay_Token');

@Component({
  selector: 'app-pay-history-report',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatTooltipModule, CommonModule, FormsModule, CompanyallComponent],
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

  isLoading = false;
  Entity: any;
  entitySearch: any;
  Payperiod: any;
  getYear: any[] = [];
  formName: any = '';
  Year: any;
  companyId: any;
  selectedCompanyCode: any;

  ngOnInit() {
    //this.BindEntityName();
    this.BindYear();
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  BindEntityName() {
    this.payHistoryService.GetEntity().subscribe({
      next: (res: any) => {
        this.entitySearch = res?.Data?.data?.Table0;
      }
    });
  }

  BindYear() {
    this.payHistoryService.bindYear().subscribe({
      next: res => {
        this.getYear = res.Data.data.Table0;
      }
    });
  };

  downloadPayHistory() {

    if (!this.formName) {
      alert('Please select Report Type');
      return;
    }

    if (!this.companyId) {
      alert('Please select Company');
      return;
    }

    if (this.formName === 'PH' || this.formName === 'PHP') {
      if (!this.Year) {
        alert('Please select Year');
        return;
      }
    }

    if (this.formName === 'PH') {
      this.isLoading = true;
      this.payHistoryService
        .downloadPayHistory(this.companyId, this.Year).pipe(
          finalize(() => this.isLoading = false)
        )
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

    else if (this.formName === 'PHP') {
      this.isLoading = true;
      this.payHistoryService
        .downloadPayHistoryPDF(this.companyId, this.Year)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: async (response) => {
            const blob = response.body;
            if (!blob) {
              this.showError('Empty response received from server.');
              return;
            }

            const contentType =
              response.headers.get('Content-Type') || '';

            if (contentType.includes('application/pdf')) {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `PayHistory_${this.Year}.pdf`;
              document.body.appendChild(link);

              link.click();

              document.body.removeChild(link);

              window.URL.revokeObjectURL(url);

              return;
            }
            const message = await this.getErrorMessage(blob);
            this.showError(message);
          },
          error: async (error) => {
            if (error.error instanceof Blob) {
              const message =
                await this.getErrorMessage(error.error);
              this.showError(message);
            } else {
              this.showError(
                error?.message ||
                'Unable to generate Pay History PDF.'
              );
            }
          }
        });
    }
    else if (this.formName === 'PV') {
      this.isLoading = true;
      this.payHistoryService
        .downloadPayVarience(this.companyId).pipe(
          finalize(() => this.isLoading = false)
        )
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
  }

  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  private async getErrorMessage(blob: Blob): Promise<string> {

    try {
      const text = await blob.text();
      if (!text) {
        return 'Unknown error occurred.';
      }
      const json = JSON.parse(text);
      return (
        json.Message ||
        json.message ||
        'Unable to generate Pay History PDF.'
      );
    } catch {
      return 'Unable to generate Pay History PDF.';
    }
  }

  private showError(message: string): void {
    alert(message);
  }

}
