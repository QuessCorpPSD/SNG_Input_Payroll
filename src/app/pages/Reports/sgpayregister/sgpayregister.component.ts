import { CommonModule } from '@angular/common';
import { Component, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { SgpayregisterService } from '../../../Service/Reports/sgpayregister.service';
import { ISgPayRegisterService } from '../../../Repository/Reports/ISgpayRegister.service';
import { APIResponse } from '../../../Models/apiresponse';
import { Console } from 'console';
export const Pay_Token = new InjectionToken<ISgPayRegisterService>('Pay_Token');


@Component({
  selector: 'app-sgpayregister',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sgpayregister.component.html',
  styleUrl: './sgpayregister.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: SgpayregisterService,
    }
  ]
})
export class SgpayregisterComponent {
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPP?: any;
  isLoading: boolean = false;
  PayPeriod: any;
  Payperiod: any[] = [];
  constructor(private service: SgpayregisterService) { }

  ngOnInit(): void {
    this.BindPayPeriod();
  }

  BindPayPeriod() {
    this.service.GetPayPeriod().subscribe({
      next: (res: any) => {
        this.Payperiod = res?.Data;
      }
    });
  }

  Download() {

    if (!this.PayPeriod) {
      alert("Please select a pay period.");
      return;
    }

    this.isLoading = true;

    const payload = {
      Pay_Period: this.PayPeriod
    };
    this.service.downloadReport(payload).subscribe({
      next: (res: APIResponse) => {

        const tables = res?.Data?.data;

        if (!tables || (!tables.Table0 && !tables.Table1)) {
          this.isLoading = false;
          console.warn("No valid tables found in API response.");
          return;
        }

        function convertTableToSheet(tableData: any[]): XLSX.WorkSheet {

          if (!tableData || tableData.length === 0) {
            return XLSX.utils.aoa_to_sheet([["No Data"]]);
          }

          const finalData: any[][] = [];

          finalData.push(Object.keys(tableData[0]));

          tableData.forEach((row) => {
            finalData.push(Object.values(row));
          });

          return XLSX.utils.aoa_to_sheet(finalData);
        }

        const payRegister = convertTableToSheet(tables.Table0 || []);

        const workbook: XLSX.WorkBook = {
          Sheets: {
            "Pay Register": payRegister
          },
          SheetNames: ["Pay Register"]
        };

        const today = new Date();
        const dateStr = today.toISOString().split("T")[0];

        const fileName = `Pay_Register_${dateStr}.xlsx`;

        const excelBuffer: any = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });

        const blob: Blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        FileSaver.saveAs(blob, fileName);

        this.isLoading = false;
      },

      error: (err) => {
        this.isLoading = false;
        console.error("Download error:", err);
      }
    });
  }

}
