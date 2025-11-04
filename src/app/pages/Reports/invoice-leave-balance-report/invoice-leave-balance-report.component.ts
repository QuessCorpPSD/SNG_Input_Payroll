import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { InvoiceLeaveBalanceReportService } from '../../../Service/Reports/invoiceleavebalancereport.service';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { IInvoiceLeaveBalanceReport } from '../../../Repository/Reports/iinvoiceleavebalancereport.service';
import { APIResponse } from '../../../Models/apiresponse';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-invoice-leave-balance-report',
  standalone: true,
  imports: [CompanyallComponent,
    GroupnameComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule],
  providers: [
    { provide: Common_TOKEN, useClass: InvoiceLeaveBalanceReportService }
  ],
  templateUrl: './invoice-leave-balance-report.component.html',
  styleUrl: './invoice-leave-balance-report.component.css'
})
export class InvoiceLeaveBalanceReportComponent {
  companyId: any;
  selectedCompanyCode: any;
  siteId: any;
  selectedSiteName: any;
  years: any[] = [];
  selectedFromYear: any;
  selectedToYear: any;
  months: { name: string, value: string }[] = [
    { name: 'June', value: 'JUN' },
    { name: 'July', value: 'JUL' },
    { name: 'August', value: 'AUG' },
    { name: 'September', value: 'SEP' },
    { name: 'October', value: 'OCT' },
    { name: 'November', value: 'NOV' },
    { name: 'December', value: 'DEC' },
    { name: 'January', value: 'JAN' },
    { name: 'February', value: 'FEB' },
    { name: 'March', value: 'MAR' },
    { name: 'April', value: 'APR' },
    { name: 'May', value: 'MAY' }
  ];

  selectedFromMonth: string = '';
  selectedToMonth: string = '';

  constructor(@Inject(Common_TOKEN) private leave: IInvoiceLeaveBalanceReport) { }

  onFromMonthChange(event: any) {
    this.selectedFromMonth = event.target.value;
    console.log('From Month selected:', this.selectedFromMonth);
  }

  onToMonthChange(event: any) {
    this.selectedToMonth = event.target.value;
    console.log('To Month selected:', this.selectedToMonth);
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }


  BindYear() {
    this.leave.GetLeaveYear().subscribe({
      next: res => {
        console.log('Leave Year response:', res.Data);
        this.years = res.Data;
      },
      error: err => {
        console.log('Leave year error:', err);
      }
    });
  }

  ngOnInit(): void {
    this.BindYear();
  }

  Download() {
    this.leave.GetAllInvoiceLeaveBalanceReport(
      this.companyId.toString(),
      this.siteId,
      this.selectedFromMonth,
      this.selectedFromYear,
      this.selectedToMonth,
      this.selectedToYear
    ).subscribe({
      next: (res: APIResponse) => {
        const tables = res?.Data?.data;
        if (!tables || !tables.Table0) {
          console.warn("No Table0 found in API response.");
          return;
        }

        const tableName = "Employee Info";
        const tableData = tables.Table0 || [];

        const finalData: any[][] = [];


        finalData.push(["Invoice Leave Balance Report"]);

        finalData.push([tableName]);

        if (tableData[0]) {
          finalData.push(Object.keys(tableData[0]));
        }

        tableData.forEach((row) => {
          finalData.push(Object.values(row));
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);

        const workbook: XLSX.WorkBook = {
          Sheets: { "Invoice Leave Balance Report": worksheet },
          SheetNames: ["Invoice Leave Balance Report"]
        };

        const today = new Date();
        const dateStr = today.toISOString().split("T")[0];
        const fileName = `InvoiceLeaveBalanceReport_${dateStr}.xlsx`;

        const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob: Blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        FileSaver.saveAs(blob, fileName);
      },
      error: (err) => {
        console.error("Download error:", err);
      }
    });
  }

}
