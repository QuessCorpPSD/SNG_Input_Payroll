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
    'SNo',
    'Map Name',
    'Business Unit Name',
    'Company code',
    'company Name',
    'Cost Center',
    'Company Location'
  ];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private dialog: MatDialog,
    private costService: CostMappingCenterService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private idletimeout: IdletimeoutService
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

  onSearchClick() {
    this.isLoading = true;
    this.showTable = false;

    this.costService.GetAllCostDetails().subscribe({
      next: (res) => {

        // Invalid / no data
        if (res?.StatusCode !== 200 || !res?.Data || res.Data.length === 0) {
          alert("No cost center records found");
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          this.isLoading = false;
          return;
        }

        let filteredData = res.Data;

        // APPLY FILTER
        if (this.searchMapName?.trim() !== "") {
          const filterValue = this.searchMapName.trim().toLowerCase();

          filteredData = res.Data.filter(item =>
            item.map_Name?.toLowerCase().includes(filterValue)
          );
        }

        //  No matching results
        if (filteredData.length === 0) {
          alert("No matching Cost Center Map Name found");
          this.uploadedData = [];
          this.uploadedDataSource.data = [];
          this.isLoading = false; // ✅ STOP LOADING
          return;
        }

        // ✅ SUCCESS
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

        this.isLoading = false;
      },

      error: () => {
        alert("Failed to load cost center mapping");
        this.uploadedData = [];
        this.uploadedDataSource.data = [];
        this.isLoading = false;
      }
    });
  }

  exportExcelBase64() {
    this.isLoading = true;

    this.costService.ExportCostCenterMapping({}).subscribe({
      next: (res) => {

        if (!res?.Data?.file) {
          alert("No data received from server!");
          this.isLoading = false;
          return;
        }

        const base64 = res.Data.file;

        const byteCharacters = atob(base64);
        const byteArray = new Uint8Array(
          [...byteCharacters].map(c => c.charCodeAt(0))
        );

        const wb = XLSX.read(byteArray, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];

        let excelData: any[] = XLSX.utils.sheet_to_json(ws);

        if (this.searchMapName?.trim() !== "") {
          const filterValue = this.searchMapName.trim().toLowerCase();
          excelData = excelData.filter(row =>
            row["Map Name"]?.toLowerCase().includes(filterValue)
          );
        }

        if (excelData.length === 0) {
          alert("No matching records found to export");
          this.isLoading = false;
          return;
        }

        const newSheet = XLSX.utils.json_to_sheet(excelData);

        const newWB = {
          Sheets: { Filtered: newSheet },
          SheetNames: ["Filtered"]
        };

        XLSX.writeFile(newWB, "CostCenter_Filtered.xlsx");
        this.isLoading = false;
      },

      error: () => {
        alert("Failed to export excel");
        this.isLoading = false;
      }
    });
  }


  ImportClick(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }

    if (!this.userdetail?.user_Id) {
      alert("User not loaded. Please re-login.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);

    this.isLoading = true;

    this.costService.UploadCostCenterMapping(formData).subscribe({
      next: (res) => {
        this.isLoading = false;

        //  SUCCESS
        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully")) {
          this.showAlertPopup("Row(s) Uploaded Successfully!");
          return;
        }

        //  VALIDATION ERRORS
        if (res?.Data?.errors) {
          const errors = res.Data.errors;

          if (errors.file) {
            alert(errors.file[0]);
            return;
          }

          if (errors.userId) {
            alert(errors.userId[0]);
            return;
          }
        }

        // ARRAY ERROR MESSAGE
        if (Array.isArray(res?.Data) && res.Data.length > 0) {
          alert(res.Data[0]?.Error_Message || "Error occurred");
          return;
        }
        //  FALLBACK
        alert("Unexpected server response.");
      },

      error: (err) => {
        console.error("UPLOAD ERROR:", err);
        this.isLoading = false; //  STOP LOADING
        this.showAlertPopup("Upload failed. Please try again.");
      }
    });
  }

  DownloadTemplate() {

    const templateData = [
      { Map_Name: "", Company_Code: "", Cost_Center: "" }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'table': workSheet },
      SheetNames: ['table']
    };

    XLSX.writeFile(workbook, 'CostCenterMapping_Template.xlsx');

    // const blob = new Blob([buffer], {
    //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    // });

    // FileSaver.saveAs(blob, `CostCenterMapping_Template_${Date.now()}.xlsx`);

    // this.showAlertPopup("Template Downloaded Successfully!");
  }

  AddPOOpen() {
    this.dialog.open(AddcostCenterMappingComponent, {
      width: '30%',
      height: '52vh',
      disableClose: true
    });
  }
}
