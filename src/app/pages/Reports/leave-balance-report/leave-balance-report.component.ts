import { Component, Inject } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Common_TOKEN } from '../../POProcess/add-po/add-po.component';
import { ILeaveBalanceReport } from '../../../Repository/Reports/ileavebalancereport';
import { LeaveBalanceReportService } from '../../../Service/Reports/leavebalancereport.service';
import { APIResponse } from '../../../Models/apiresponse';
import { MatTableDataSource } from '@angular/material/table';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-leave-balance-report',
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
    { provide: Common_TOKEN, useClass: LeaveBalanceReportService }
  ],
  templateUrl: './leave-balance-report.component.html',
  styleUrl: './leave-balance-report.component.css'
})
export class LeaveBalanceReportComponent {
  companyId: any;
  selectedCompanyCode: any;
  siteId: any;
  selectedSiteName: any;
  years: any[] = [];
  selectedYear: any;
  dataSource = new MatTableDataSource<any>();

  constructor(@Inject(Common_TOKEN) private leave: ILeaveBalanceReport
  ) { }

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
  this.leave.GetAllLeaveBalanceReport(this.selectedCompanyCode, this.siteId, this.selectedYear).subscribe({
    next: (res: APIResponse) => {
      const tables = res?.Data?.data;
      if (!tables) {
        console.warn("No tables found in API response.");
        return;
      }

      const tableNames: string[] = [
        "Employee Info",
        "PL Applied",
        "PL Considered",
        "PL Credit",
        "PL LOP",
        "PL Closing Balance",
        "CL Applied",
        "CL Considered",
        "CL Credit",
        "CL LOP",
        "CL Closing Balance",
        "SL Applied",
        "SL Considered",
        "SL Credit",
        "SL LOP"
      ];

      const tableDataArrays: any[][] = [];
      let maxRows = 0;

      for (let i = 0; i <= 14; i++) {
        const key = `Table${i}`;
        const data = tables[key] || [];
        tableDataArrays.push(data);
        if (data.length > maxRows) maxRows = data.length;
      }

      const finalData: any[][] = [];

      // Calculate total columns for merged heading
      const totalColumns = tableDataArrays.reduce((sum, t) => sum + (t[0] ? Object.keys(t[0]).length : 0) + 1, 0); // +1 spacing

      // Main heading
      finalData.push(["Leave Balance Report"]);

      // Table name row
      const tableNameRow: any[] = [];
      let colIndex = 0;
      tableDataArrays.forEach((table, idx) => {
        const cols = table[0] ? Object.keys(table[0]).length : 0;
        tableNameRow[colIndex] = tableNames[idx];
        colIndex += cols + 1;
      });
      finalData.push(tableNameRow);

      // Column headers
      const headerRow: any[] = [];
      colIndex = 0;
      tableDataArrays.forEach((table) => {
        if (table[0]) {
          Object.keys(table[0]).forEach((c, j) => {
            headerRow[colIndex + j] = c;
          });
          colIndex += Object.keys(table[0]).length + 1;
        } else {
          colIndex += 1;
        }
      });
      finalData.push(headerRow);

      // Data rows
      for (let row = 0; row < maxRows; row++) {
        const dataRow: any[] = [];
        colIndex = 0;
        tableDataArrays.forEach((table) => {
          const cols = table[0] ? Object.keys(table[0]).length : 0;
          if (table[row]) {
            Object.keys(table[row]).forEach((c, j) => {
              dataRow[colIndex + j] = table[row][c];
            });
          } else {
            for (let j = 0; j < cols; j++) dataRow[colIndex + j] = "";
          }
          colIndex += cols + 1;
        });
        finalData.push(dataRow);
      }

      // Create worksheet
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);

      // Merge main heading
      if (totalColumns > 1) {
        worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } }];
      }

      // Apply styles and borders
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
      let tableStartCol = 0;

      tableDataArrays.forEach((table, tIndex) => {
        const cols = table[0] ? Object.keys(table[0]).length : 0;
        const tableEndCol = tableStartCol + cols - 1;

        // Bold table name
        if (worksheet[XLSX.utils.encode_cell({ r: 1, c: tableStartCol })]) {
          worksheet[XLSX.utils.encode_cell({ r: 1, c: tableStartCol })].s = { font: { bold: true } };
        }

        // Bold column headers
        for (let c = tableStartCol; c <= tableEndCol; c++) {
          const cell_ref = XLSX.utils.encode_cell({ r: 2, c });
          if (!worksheet[cell_ref]) continue;
          worksheet[cell_ref].s = { font: { bold: true }, alignment: { horizontal: "center" } };
        }

        // Add borders for table
        for (let r = 2; r < 3 + maxRows; r++) { // column headers + data rows
          for (let c = tableStartCol; c <= tableEndCol; c++) {
            const cell_ref = XLSX.utils.encode_cell({ r, c });
            if (!worksheet[cell_ref]) worksheet[cell_ref] = { v: "" };
            worksheet[cell_ref].s = worksheet[cell_ref].s || {};
            worksheet[cell_ref].s.border = {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            };
            worksheet[cell_ref].s.alignment = { horizontal: "center", vertical: "center" };
          }
        }

        tableStartCol += cols + 1; // +1 spacing
      });

      // Bold main heading
      const mainCell = worksheet[XLSX.utils.encode_cell({ r: 0, c: 0 })];
      if (mainCell) mainCell.s = { font: { bold: true, sz: 14 }, alignment: { horizontal: "center" } };

      // Create workbook
      const workbook: XLSX.WorkBook = { Sheets: { "Leave Balance Report": worksheet }, SheetNames: ["Leave Balance Report"] };

      // File name
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      const fileName = `LeaveBalanceReport_${dateStr}.xlsx`;

      // Export
      // const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      // const blob: Blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      // FileSaver.saveAs(blob, fileName);
      XLSX.writeFile(workbook, fileName);
    },
    error: (err) => {
      console.error("Download error:", err);
    }
  });
}
}
