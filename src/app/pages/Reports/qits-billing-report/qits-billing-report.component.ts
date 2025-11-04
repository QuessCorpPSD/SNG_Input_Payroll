import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { MatTableDataSource } from '@angular/material/table';
import { QITSBillingReportService } from '../../../Service/Reports/qitsbillingreport.service';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { IIqitsBillingReport } from '../../../Repository/Reports/iqitsbillingreport.service';
import { APIResponse } from '../../../Models/apiresponse';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-qits-billing-report',
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
        { provide: Common_TOKEN, useClass: QITSBillingReportService }
      ],
  templateUrl: './qits-billing-report.component.html',
  styleUrl: './qits-billing-report.component.css'
})
export class QITSBillingReportComponent {
  companyId: any;
  selectedCompanyCode: any;
  siteId: any;
  selectedSiteName: any;
    years: any[] = [];
  selectedYear: any;
  dataSource = new MatTableDataSource<any>();


  constructor(@Inject(Common_TOKEN) private leave: IIqitsBillingReport){}

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
        this.years = res.Data;   // <-- assign properly
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
      this.leave.GetAllBillingReport(
        this.companyId.toString(),
        this.siteId,
        this.selectedYear
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
  
  
          finalData.push(["Billing Report"]);
  
          finalData.push([tableName]);
  
          if (tableData[0]) {
            finalData.push(Object.keys(tableData[0]));
          }
  
          tableData.forEach((row) => {
            finalData.push(Object.values(row));
          });
  
          const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);
  
          const workbook: XLSX.WorkBook = {
            Sheets: { "Billing Report": worksheet },
            SheetNames: ["Billing Report"]
          };
  
          const today = new Date();
          const dateStr = today.toISOString().split("T")[0];
          const fileName = `BillingReport_${dateStr}.xlsx`;
  
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
