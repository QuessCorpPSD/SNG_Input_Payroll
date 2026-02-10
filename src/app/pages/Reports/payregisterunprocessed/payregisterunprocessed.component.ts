import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { PayregisterunprocessedService } from '../../../Service/Reports/payregisterunprocessed.service';


@Component({
  selector: 'payregisterunprocessed',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PayPeriodComponent],
  templateUrl: './payregisterunprocessed.component.html',
  styleUrl: './payregisterunprocessed.component.css'
})
export class PayregisterunprocessedComponent {
  companyId: any;
  selectedCompanyCode: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPP?: any;
  isLoading: boolean = false;
  selectedPPName?: any
  constructor(private payregisterService: PayregisterunprocessedService) { }

  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = String(payperiod.payfrequencyid);
    this.selectedPPName = String(payperiod.payPeriod);
  }

  Download() {
    this.isLoading = true;
    if (!this.companyId) {
      this.companyId = 0;

    }

    if (!this.selectedPP) {
      this.selectedPP = 0;

    }

    this.payregisterService.GetExporttoExcel(
      this.companyId,
      this.selectedPP
    ).subscribe({
      next: (res: APIResponse) => {
        const tables = res?.Data?.data;

        if (!tables || (!tables.Table0 && !tables.Table1)) {
          this.isLoading = false;
          console.warn("No valid tables found in API response.");
          return;
        }

        // Prepare function to convert a table to worksheet
        function convertTableToSheet(tableData: any[]): XLSX.WorkSheet {
          if (!tableData || tableData.length === 0) {

            return XLSX.utils.aoa_to_sheet([["No Data"]]);
          }

          const finalData: any[][] = [];
          finalData.push(Object.keys(tableData[0])); // headers
          tableData.forEach((row) => {
            finalData.push(Object.values(row));
          });
          return XLSX.utils.aoa_to_sheet(finalData);
        }

        // Convert both tables to worksheets
        const payRegisterSheet = convertTableToSheet(tables.Table0 || []);
        const unprocessedSheet = convertTableToSheet(tables.Table1 || []);

        // Create workbook with both sheets
        const workbook: XLSX.WorkBook = {
          Sheets: {
            "Pay Register": payRegisterSheet,
            "UnProcessed List": unprocessedSheet
          },
          SheetNames: ["Pay Register", "UnProcessed List"]
        };

        // Generate filename
        const today = new Date();
        const dateStr = today.toISOString().split("T")[0];
        const fileName = `Pay_Register_${dateStr}.xlsx`;

        // Write workbook to file
        const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob: Blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        FileSaver.saveAs(blob, fileName);
        this.isLoading = false;
      },
      error: (err) => {
        // this.isLoading = false;
        console.error("Download error:", err);
      }
    });

  }
  exportToExcel(): void {
    if (!this.companyId) {
      alert('Please select Company Code');
      return;
    }

    if (!this.selectedPP) {
      alert('Please select PayP');
      return;
    }

    const payload = {
      companyId: this.companyId,
      payPeriodId: this.selectedPP,
      payPeriod: this.selectedPPName
    };

    this.isLoading = true;

    this.payregisterService.payregisterDownload(payload).subscribe({
      next: (res) => {
        const base64String = res.Data.file;

        if (base64String) {
          const fileName = res?.Data?.fileName || 'PayRegister';
          this.downloadExcelFromBase64(base64String, fileName, 'xlsx');
        } else {
          alert('No template data available.');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error downloading file:', err);
        alert('Failed to download template');
        this.isLoading = false;
      }
    });
  }


  downloadExcelFromBase64(
    base64String: string,
    fileName: string,
    fileType: string
  ): void {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, char =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${fileName}.${fileType}`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error('Error downloading from base64:', error);
      alert('Failed to process download file');
    }
  }

}

