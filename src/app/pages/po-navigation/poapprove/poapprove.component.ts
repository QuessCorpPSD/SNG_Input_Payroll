import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CompanyComponent } from '../../../common/company/company.component';
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';
import { POStatus, POStatusComponent } from '../../../common/postatus/postatus.component';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EPoRespository } from '../../../Service/EPORepository';
import { PoRespository } from '../../../Service/PoRespository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AddEpoComponent } from '../add-epo/add-epo.component';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { MatCheckbox } from "@angular/material/checkbox";
import { EmApproveService } from '../../../Service/Emapprove.service';
import { IEmApproveRepository } from '../../../Repository/IEmApprove.service';
import saveAs from 'file-saver';
import { PotypeComponent } from "../../../common/potype/potype.component";

type RawRow = Record<string, any>;

interface ViewRow1 {
  // remarks: any;
  remarks: string;
  selected: any;
  EMployeeListID: number;
  EmployeeListSubID: number;
  PO_ID: number;
  // "Company_Code": string;
  // "SITENAME": string;
  // "EMP_ID": string;
  "CLIENT_EMP_ID": string;
  // "PO Rate": string;
  // "PO Start Date": string;
  // "PO End Date": string;
  // "EMP_NAME": string;
  // Employee_Code: string;
  // DOJ: string;
  // FixedRate: string;
  // "PO START DATE": string;
  // "PO END DATE": string;
  // StatusID: number;
  // EmployeePOAttachment: string;
  // STATUS_NAME: string;
  // PricingType: string;
  // IsActive: number;
  // PoNumber: string;
  // ItemType: string;
  // IS_POEXT: string;
  // RevExt: string;
  // Quantity: string;
  // MonthlyRate: string;
  company_Code: string;
  SITENAME: string;
  PoNumber: string;
  ClientEmpNo: string;
  OfferPOValue: string;
  QuantityType: string;
  Quantity: string;
  PoRate: string;
  StartDate: string;
  EndDate: string;
  MonthlyRate: string;
  ItemType: string;
  STATUS_NAME: string;
  StatusID: number;
  PricingType: string;
}


@Component({
  selector: 'app-poapprove',
  standalone: true,
  imports: [CompanyComponent, POStatusComponent, PonumbersearchComponent, MatIconModule, CommonModule, FormsModule, AlertpopupComponent, MatPaginatorModule, MatCheckbox, PotypeComponent],
  templateUrl: './poapprove.component.html',
  styleUrl: './poapprove.component.css'
})
export class POApproveComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  comapnyId: number = 0;
  ponumber: string = '';
  statusId: number = 0;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  EmployeePOsearchdeails: any;
  clientEmployeeId: string = '';
  dataSource = new MatTableDataSource<ViewRow1>([]);
  filteredRows: ViewRow1[] = [];
  userId: any;
  PricingType: any;

  constructor(private dialog: MatDialog, private epoRespository: EmApproveService,
    private _sessionStoreage: SessionStorageService, private decry: EncryptionService,
    private poService: EmApproveService, private cd: ChangeDetectorRef) { }





  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
  }
  handleponumbersearchEvent(event: any) {
    this.ponumber = event.ponumber;
  }
  PostatusEvent(event: POStatus) {
    // console.log("Parent got PO Status:", event);
    this.statusId = event.statuS_ID;
    // console.log("Parent updated statusId to:", this.statusId);
  }

  potypeEvent(event) {
    this.PricingType = event.invoiceTypeID;
  }
  IsActiveEvent(event: any) { }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName
    }

  }
  // Get only rows visible in current page
  get pagedRows(): ViewRow1[] {
    const start = (this.paginator?.pageIndex ?? 0) * (this.paginator?.pageSize ?? 5);
    const end = start + (this.paginator?.pageSize ?? 5);
    return this.filteredRows.slice(start, end);
  }

  // Check if all visible rows are selected
  isAllSelected(): boolean {
    return this.pagedRows.length > 0 && this.pagedRows.every(r => r.selected);
  }

  // Check if some visible rows are selected (indeterminate state)
  isSomeSelected(): boolean {
    return this.pagedRows.some(r => r.selected) && !this.isAllSelected();
  }

  // Toggle all only for current page
  toggleAllRows(event: any): void {
    const checked = event.checked;
    this.pagedRows.forEach(r => (r.selected = checked));
  }

  // Handle single row selection change (refresh header checkbox state)
  onRowChange(): void {
    // nothing special, header checkbox will re-evaluate
  }





  Searchclick() {
    if (this.comapnyId == 0) {
      alert('Please select Company');
      return;
    }

    if (this.statusId == 0) {
      alert('Please select Status');
      return;
    }
    if(this.PricingType==0){
      alert('Please select PO Type');
    }

    const requestPayload = {
      companyId: this.comapnyId.toString(),
      poNumber: this.ponumber || "",
      employeeId: this.clientEmployeeId || "",
      status: this.statusId.toString(),
      pricingType: this.PricingType?.toString() || "",
      siteId: ""
    };

    // console.log("Search Payload:", JSON.stringify(requestPayload));

    this.poService.GetEmployeePOSerach(requestPayload).subscribe({
      next: res => {
        this.EmployeePOsearchdeails = res.Data;
        // console.log("Employee PO Search Details:", this.EmployeePOsearchdeails);

        const table: RawRow[] = this.EmployeePOsearchdeails?.data?.Table0 ?? [];

        if (table.length > 0) {
          this.filteredRows = table.map((r: RawRow): ViewRow1 => {
            return {
              EMployeeListID: r['EMployeeListID'],
              EmployeeListSubID: r['EmployeeListSubID'],
              PO_ID: r['PO_ID'],
              // Company_Code: r['Company_Code'],
              // SITENAME: r['SITE NAME'],
              // EMP_ID: r['employee_id'],
              // EMP_NAME: r['EMPNAME'],
              CLIENT_EMP_ID: r['ClientEmpNo'],
              // DOJ: r['Radar DOJ'] || r['CLIENT_DOJ'],
              // PoNumber: r['PoNumber'],
              // "PO Rate": r['PO Rate'],
              // "PO Start Date": r['PO Start Date'],
              // "PO End Date": r['PO End Date'],
              // ItemType: r['ItemType'],
              // STATUS_NAME: r['STATUS_NAME'],
              // PricingType: r['PricingType'],
              selected: false,
              // StatusID: r['StatusID'] ?? 0,
              // IS_POEXT: r['IS_POEXT'] ?? '',
              // RevExt: r['RevExt'] ?? '',
              remarks: '',
              company_Code: r['Company_Code'],
              SITENAME: r['SITE NAME'],
              PoNumber: r['PoNumber'],
              ClientEmpNo: r['ClientEmpNo'],
              OfferPOValue: r['OfferPOValue'],
              QuantityType: r['QuantityType'],
              Quantity: r['Quantity'],
              PoRate: r['FixedRate'],
              StartDate: r['StartDate'],
              EndDate: r['ENDDate'],
              MonthlyRate: r['MonthlyRate'],
              ItemType: r['ItemType'],
              STATUS_NAME: r['STATUS_NAME'],
              StatusID: r['StatusID'] ?? 0,
              PricingType: r['PricingType'],
            };
          });

          // console.log("Mapped Rows:", this.filteredRows);
          this.dataSource.data = this.filteredRows;
        } else {
          // Clear data if no results for the selected status
          this.filteredRows = [];
          this.dataSource.data = [];
          alert("No records found for the selected status.");
        }

        this.cd.markForCheck();
      },
      error: err => {
        console.error('Error loading data', err);
      }
    });
  }


  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getBorderColor(statusId: number): string {
    switch (statusId) {
      case 0:
        return 'lightgray';
      case 2:
        return 'Black';
      case 3:
        return 'green';
      case 4:
        return 'red';
      case 5:
        return 'blue';
      default:
        return 'lightgray';
    }
  }

bulkUpdate(action: 'APPROVED' | 'REJECTED' | 'REVOKE') {
  const selectedRows = this.filteredRows.filter(r => r.selected);

  if (selectedRows.length === 0) {
    alert('Please select at least one row');
    return;
  }

 
  const rowsWithMissingRemarks = selectedRows.filter(r =>
    (r.StatusID === 4 || r.StatusID === 5) && r.remarks
  );

  // console.log('rowsWithMissingRemarks', rowsWithMissingRemarks);

  if (rowsWithMissingRemarks.length > 0) {
    alert('Please enter remarks for all rejected or revoked rows');
    return;
  }


  const payload = {
    employeePOApproveReject: selectedRows.map(row => ({
      PO_ID: row.PO_ID?.toString() ?? '',
      EMP_LIST_ID: row.EMployeeListID?.toString() ?? '',
      CLIENT_EMP_ID: row.CLIENT_EMP_ID?.toString() ?? '',
      STATUS: action,
      REMARKS: row.remarks || "No remarks", // Include remarks in the request payload
    })),
    CreatedBy: this.userdetail.user_Id ? this.userdetail.user_Id.toString() : '10001426'
  };

  // console.log("Bulk Update Payload:", payload);

  this.poService.BulkApproveReject(payload).subscribe({
    next: (res) => {

      if (res?.Data?.response?.includes("SUCCESSFULLY  APPROVED")) {
          this.showPopup = true;

          this.popupMessage = "Successfully Approved";
          this.isLoading = false;
          this.Searchclick(); 
          return;
        }
        else if (res?.Data?.response?.includes("PO REJECTED")) {
          this.showPopup = true;

          this.popupMessage = "PO Rejected";
          this.isLoading = false;
          this.Searchclick(); 
          return;
        }
        else if (res?.Data?.response?.includes("PO REVOKED")) {
          this.showPopup = true;

          this.popupMessage = "PO Revoked";
          this.isLoading = false;
          this.Searchclick(); 
          return;
        }
        else
        {
            this.showPopup = true;
          this.popupMessage = 'Failed.';
          this.isLoading=false;
          return;
        }

      
    },
    error: (err) => {
      console.error("Bulk update failed", err);
      alert("Something went wrong while processing");
    }
  });
}
  searchAndDownloadExcel(): void {
    // Check if the Company and Status are selected
    if (this.comapnyId == 0) {
      alert('Please select Company');
      return;
    }

    if (this.statusId == 0) {
      alert('Please select Status');
      return;
    }

    // Prepare the payload for the API request
    const payload = {
      companyId: this.comapnyId?.toString() || "",
      poNumber: this.ponumber || "",
      employeeId: this.clientEmployeeId || "",
      status: this.statusId?.toString() || "",
      pricingType: "",
      siteId: ""
    };

    // Make the API call to download Excel
    this.poService.downloadExcel(payload).subscribe(
      (response: Blob) => {
        // Create a FileReader to read the response
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const text = reader.result as string;
            let jsonData = JSON.parse(text);

            // Log the parsed JSON for debugging
             //console.log("Parsed JSON:", jsonData);

            // Extract tables from the response
            const tables = jsonData.Data.data;
            const tableNames: string[] = [

            ];

            const tableDataArrays: any[][] = [];
            let maxRows = 0;

            // Loop through Table0 to Table14 and collect data
            for (let i = 0; i <= 14; i++) {
              const key = `Table${i}`;
              const data = tables[key] || [];
              if (data.length > 0) { // Only push non-empty tables
                tableDataArrays.push(data);
                if (data.length > maxRows) maxRows = data.length;
              }
            }

            // If no data found in any table, show a warning and exit
            if (tableDataArrays.length === 0) {
              console.warn("No data found in any table.");
              alert("No data found for the selected filters.");
              return;
            }

            const finalData: any[][] = [];

            // Calculate total columns for merged heading
            const totalColumns = tableDataArrays.reduce((sum, t) => sum + (t[0] ? Object.keys(t[0]).length : 0) + 1, 0); // +1 spacing

            // Main heading
            finalData.push(["Employee po Approval "]);

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
            const workbook: XLSX.WorkBook = { Sheets: { "Employee PO Approval": worksheet }, SheetNames: ["Employee PO Approval"] };

            // File name
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            const fileName = `PO_Report_${dateStr}.xlsx`;

            // Export the file
            // const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            // const blob: Blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            // saveAs(blob, fileName);
            XLSX.writeFile(workbook, fileName);
          } catch (err) {
            // Catch and log any errors that occur during parsing or Excel conversion
            console.error("Failed to parse JSON from Blob:", err);
          }
        };

        // Read the response as text
        reader.readAsText(response);
      },
      (error) => {
        // Handle errors in the API call
        console.error('Error downloading the file:', error);
        alert('Error fetching the data. Please try again later.');
      }
    );
  }




  // bulkUpdate(action: 'APPROVED' | 'REJECTED' | 'REVOKED') {
  //   const selectedRows = this.filteredRows.filter(r => r.selected);

  //   if (selectedRows.length === 0) {
  //     alert('Please select at least one row');
  //     return;
  //   }

  //   const payload = {
  //     employeePOApproveReject: selectedRows.map(row => ({
  //       PO_ID: row.PO_ID?.toString(),
  //       EMP_LIST_ID: row.EMployeeListID?.toString(),
  //       CLIENT_EMP_ID: row.CLIENT_EMP_ID?.toString(),
  //       STATUS: action,                  // APPROVED | REJECTED | REVOKED
  //       REMARKS: "Test" // you can pass a default remark or popup value
  //     })),
  //     CreatedBy: this.userId.toString() // get from session/localStorage
  //   };

  //   console.log("Bulk Update Payload:", payload);

  //   this.poService.BulkApproveReject(payload).subscribe({
  //     next: (res) => {
  //       console.log("Bulk update response:", res);
  //       alert(`${action} successful for ${selectedRows.length} rows`);
  //       this.Searchclick();  // refresh table after update
  //     },
  //     error: (err) => {
  //       console.error("Bulk update failed", err);
  //       alert("Something went wrong while processing");
  //     }
  //   });
  // }




}
