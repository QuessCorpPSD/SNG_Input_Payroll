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

}

