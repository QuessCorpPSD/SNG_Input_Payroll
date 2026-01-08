import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';

import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';

import { TimesheetSummaryService } from '../../../Service/Reports/itimesheetsummary.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';

@Component({
  selector: 'app-timesheet-report',
  standalone: true,
  imports: [CompanyallComponent,
    GroupnameComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  PayPeriodComponent],

  providers: [
    { provide: Common_TOKEN, useClass: TimesheetSummaryService }
  ],
  templateUrl: './timesheet-report.component.html',
  styleUrl: './timesheet-report.component.css'
})
export class TimesheetReportComponent {
  companyId: any;
  siteId: any;
  selectedCompanyCode: any;
  selectedSiteName: any;
  years: any[] = [];
  selectedYear: any;
  Location: any[] = [];
  selectedLocation: string = '';
  selectedStatus: any;
  payPeriodTypefromParentall: string = '';
  selectedPP?: any;
  constructor(private timesheetService: TimesheetSummaryService) { }


  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;

    // If siteId already exists, load locations
    if (this.siteId) {
      this.BindLocation();
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = String(payperiod.payfrequencyid);
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;

    // If companyId already exists, load locations
    if (this.companyId) {
      this.BindLocation();
    }
  }


  BindYear() {
    this.timesheetService.GetLeaveYear().subscribe({
      next: res => {
        console.log('Leave Year response:', res.Data);
        this.years = res.Data;   // <-- assign properly
      },
      error: err => {
        console.log('Leave year error:', err);
      }
    });
  }

  BindLocation() {
    this.timesheetService.GetLocation(this.companyId, this.siteId).subscribe({
      next: res => {
        console.log('Location response:', res);
        this.Location = res.Data ?? res;   // depends on API structure
      },
      error: err => {
        console.error('Location error:', err);
      }
    });
  }

  ngOnInit(): void {

    this.payPeriodTypefromParentall = "All";
    //this.BindYear();
  }

  Download() {
    if (!this.companyId) {
      alert('Please select Company');
      return;
    }

    if (!this.selectedPP) {
      alert('Please select Payperiod');
      return;
    }


    this.timesheetService.GetAllTimesheetSummaryReport(
      this.companyId.toString(),
      this.siteId,
      this.selectedLocation,
      this.selectedPP,
      this.selectedStatus,
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


        finalData.push(["Timesheet Summary Report"]);

        finalData.push([tableName]);

        if (tableData[0]) {
          finalData.push(Object.keys(tableData[0]));
        }

        tableData.forEach((row) => {
          finalData.push(Object.values(row));
        });

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);

        const workbook: XLSX.WorkBook = {
          Sheets: { "Timesheet Summary Report": worksheet },
          SheetNames: ["Timesheet Summary Report"]
        };

        const today = new Date();
        const dateStr = today.toISOString().split("T")[0];
        const fileName = `TimesheetSummary_${dateStr}.xlsx`;

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
