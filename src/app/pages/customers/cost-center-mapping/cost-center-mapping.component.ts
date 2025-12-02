import { Component, ViewChild } from '@angular/core';
import { AddcostCenterMappingComponent } from '../addcost-center-mapping/addcost-center-mapping.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CostMappingCenterService } from '../../../Service/CUSTOMER/cost-mapping-center.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { IdletimeoutService } from '../../../Service/idletimeout.service';

@Component({
  selector: 'app-cost-center-mapping',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatTooltipModule,
    MatTableModule, MatPaginator, FormsModule, ReactiveFormsModule, AlertpopupComponent
  ],
  templateUrl: './cost-center-mapping.component.html',
  styleUrl: './cost-center-mapping.component.css'
})
export class CostCenterMappingComponent {

  // POPUP + LOADING
  showPopup = false;
  popupMessage: string = "";
  popupSubMessage: string = "";
  isLoading = false;

  uploadedData: any[] = [];
  showTable = false;
  searchMapName = "";

  selectedFile: File | null = null;
  userdetail: any;

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Map Name',
    'Business Unit Name',
    'Company code',
    'company Name',
    'Cost Center',
    'Company Location'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private dialog: MatDialog,
    private costService: CostMappingCenterService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private idletimeout:IdletimeoutService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
  }

  showAlertPopup(msg: string, sub: string = "") {
    this.popupMessage = msg;
    this.popupSubMessage = sub;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

    ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  // -----------------------------------------------------------
  // SEARCH
  // -----------------------------------------------------------
  onSearchClick() {
    this.costService.GetAllCostDetails().subscribe({
      next: (res) => {

        if (res?.StatusCode === 200 && res?.Data?.length > 0) {

          let filteredData = res.Data;

          if (this.searchMapName.trim() !== "") {
            const filterValue = this.searchMapName.trim().toLowerCase();

            filteredData = res.Data.filter(item =>
              item.map_Name?.toLowerCase().includes(filterValue)
            );
          }

          if (filteredData.length === 0) {
            alert("No matching Cost Center Map Name found");
            return;
          }

          this.uploadedData = filteredData.map((item, index) => ({
            SNo: index + 1,
            'Map Name': item.map_Name,
            'Business Unit Name': item.business_Unit_Name,
            'Company code': item.company_Code,
            'company Name': item.company_Name,
            'Cost Center': item.cost_Center_Name,
            'Company Location': item.city_Name
          }));

          this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
          this.uploadedDataSource.paginator = this.paginator;
          this.uploadedDataSource.sort = this.sort;
          this.showTable = true;

        } else {
          alert("No cost center records found");
        }
      },

      error: () => alert("Failed to load cost center mapping")
    });
  }

  // -----------------------------------------------------------
  // EXPORT EXCEL WITH SEARCH FILTER (LOCAL)
  // -----------------------------------------------------------
  exportExcelBase64() {

    this.costService.ExportCostCenterMapping({}).subscribe({
      next: (res) => {

        if (!res?.Data?.file) {
          alert("No data received from server!");
          return;
        }

        const base64 = res.Data.file;

        const byteCharacters = atob(base64);
        const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));

        const wb = XLSX.read(byteArray, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];

        let excelData: any[] = XLSX.utils.sheet_to_json(ws);

        if (this.searchMapName.trim() !== "") {
          const filterValue = this.searchMapName.trim().toLowerCase();
          excelData = excelData.filter(row =>
            row["Map Name"]?.toLowerCase().includes(filterValue)
          );
        }

        if (excelData.length === 0) {
          alert("No matching records found to export");
          return;
        }

        const newSheet = XLSX.utils.json_to_sheet(excelData);

        const newWB = {
          Sheets: { "Filtered": newSheet },
          SheetNames: ["Filtered"]
        };

        XLSX.writeFile(newWB, "CostCenter_Filtered.xlsx");

        this.showAlertPopup("Excel Exported Successfully!");

      },
      error: () => alert("Failed to export excel")
    });
  }


  ImportClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      this.showAlertPopup("Please upload an Excel file.");
      return;
    }

    if (!this.userdetail || !this.userdetail.user_Id) {
      this.showAlertPopup("User not loaded. Please re-login.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);

    this.isLoading = true;

    this.costService.UploadCostCenterMapping(formData).subscribe({
      next: (res) => {
        this.isLoading = false;

        console.log("SERVER RESPONSE:", res);

        // ✅ CASE 1: Successful upload
        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully")) {
          this.showAlertPopup("Row(s) Uploaded Successfully!");
          return;
        }

        // ✅ CASE 2: Validation errors (file / userId)
        if (res?.Data?.errors) {
          const errors = res.Data.errors;

          if (errors.file) {
            this.showAlertPopup(errors.file[0]);
            return;
          }

          if (errors.userId) {
            this.showAlertPopup(errors.userId[0]);
            return;
          }
        }

        // ✅ CASE 3: Error_Message returned as array
        if (Array.isArray(res?.Data) && res.Data.length > 0) {

          const msg = res.Data[0].Error_Message || "Error occurred";
          this.showAlertPopup(msg);
          return;
        }

        // ❓ UNKNOWN RESPONSE
        this.showAlertPopup("Unexpected server response.");
      },

      error: (err) => {
        this.isLoading = false;
        console.error("UPLOAD ERROR:", err);
        this.showAlertPopup("Upload failed. Please try again.");
      }
    });
  }




  DownloadTemplate() {

    const templateData = [
      { Map_Name: "", companyCode: "", costCenter: "" }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'CostCenterTemplate': ws },
      SheetNames: ['CostCenterTemplate']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `CostCenterMapping_Template_${Date.now()}.xlsx`);

    this.showAlertPopup("Template Downloaded Successfully!");
  }

  AddPOOpen() {
    this.dialog.open(AddcostCenterMappingComponent, {
      width: '40%',
      height: '43vh',
      disableClose: true
    });
  }
}
