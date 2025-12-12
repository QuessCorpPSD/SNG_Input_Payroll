import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddSiteMasterComponent } from '../add-site-master/add-site-master.component';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { SiteMasterService } from '../../../Service/GlobalMasters/site-master.service';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { AddFormulasComponent } from '../add-formulas/add-formulas.component';


interface APIResponse {
  data: any;
}

@Component({
  selector: 'app-site-master',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    FormsModule,
    CompanyallComponent,
    AlertpopupComponent,
  ],
  templateUrl: './site-master.component.html',
  styleUrl: './site-master.component.css'
})
export class SiteMasterComponent {

  selectedCompanyId: number = 0;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  selectedGroupId: number = 0;

  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;

  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;

  VendorName: string = "";
  vendor: any[] = [];

  // FIXED missing variables
  companyId: any = null;
  payPeriodId: any = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  formData: FormData | null = null;

  isUploadGridVisible: boolean = false;
  isUploadDataVisible: boolean = false;
  UploadedResponse: any;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private siteservice: SiteMasterService
  ) { }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'Company Code', 'Vendor Name', 'Group Name', 'WBS/Cost center',
    'SAP Customer Code', 'SAP Customer Name', 'WBS2', 'WBS Name', 'Establishment Name',
    'Establishment Address1', 'Principal Employer Name', 'Principal Employe Address1',
    'Contractor Name', 'Contractor Address1', 'PAYSLIP FORMAT', 'IsLeaveApplicable', 'Active',
    'IsBonusPayThroughFFDisplay', 'StartDate', 'SalaryDate', 'Portal_Payslip_Format'
  ];

  dataSource = new MatTableDataSource<any>();


  onSearchClick() {
    this.isLoading = true;
    this.showTable = true;


    const companyId = this.selectedCompanyId === 0 ? '' : this.selectedCompanyId;
    const groupId = this.selectedGroupId === 0 ? '' : this.selectedGroupId;

    this.siteservice.SiteSearch(companyId, groupId).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.vendor = res.Data.data.Table0 || [];
        let table = this.vendor;

        if (this.VendorName.trim() !== "") {
          const keyword = this.VendorName.toLowerCase();
          table = table.filter((x: any) =>
            (x.Client_Name || "").toLowerCase().includes(keyword)
          );
        }

        if (table.length > 0) {
          this.dataSource = new MatTableDataSource(table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
          this.showAlertPopup('No data found for the selected criteria');
        }
      },
      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Failed to load vendor data');
      }
    });
  }
  exportToExcel(): void {
    // if (!this.selectedCompanyId) {
    //   this.showAlertPopup("Please select Company");
    //   return;
    // }

    const companyId = this.selectedCompanyId;
    const groupId = this.selectedGroupId;

    this.isLoading = true;

    this.siteservice.SiteExportExcel(companyId, groupId).subscribe({
      next: (res) => {
        this.isLoading = false;

        const data = res.Data?.data?.Table0 || [];

        if (!data || data.length === 0) {
          this.showAlertPopup("No data available to export");
          return;
        }


        const ws = XLSX.utils.json_to_sheet(data);


        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SiteMaster");


        const fileName = `SiteMaster_${companyId}_${groupId}_${new Date().toISOString().split("T")[0]}.xlsx`;

        XLSX.writeFile(wb, fileName);

        this.showAlertPopup("Excel downloaded successfully");
      },

      error: () => {
        this.isLoading = false;
        this.showAlertPopup("Failed to export data");
      }
    });
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  AddPOOpen() {
    this.dialog.open(AddSiteMasterComponent, {
      width: '70%',
      height: '93vh',
      disableClose: true,
      data: { mode: 'add' }
    });
  }

  openEdit(row: any) {
    const dialogRef = this.dialog.open(AddSiteMasterComponent, {
      width: '70%',
      height: '93vh',
      disableClose: true,
      data: { mode: 'edit', row: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onSearchClick();
      }
    });
  }

  handleCompanyEvent(company: any) {
    this.companyId = company.companyId;
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }

  readExcelFile(file: File) {
    this.isLoading = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.isLoading = false;
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          this.uploadDisplayedColumns = jsonData[0] as string[];

          this.uploadedData = jsonData.slice(1).map((row: any, index: number) => {
            const rowData: any = { id: index };
            this.uploadDisplayedColumns.forEach((header, colIndex) => {
              rowData[header] = row[colIndex];
            });
            return rowData;
          });

          this.dataSource = new MatTableDataSource(this.uploadedData);

          this.formData = new FormData();
          this.formData.append('File', file, file.name);
          this.formData.append('QZoneUserName', this.userdetail.userId);
          this.formData.append('CreatedBy', '3');

          this.isUploadGridVisible = true;
          this.isUploadDataVisible = true;

          this.showAlertPopup('Success', 'Please review the data and click Submit when ready.');
        } else {
          this.showAlertPopup('Error', 'The Excel file appears to be empty!');
        }
      } catch (error) {
        this.showAlertPopup('Error', 'Error reading Excel file.');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadedData() {
    if (!this.formData || !this.selectedFile) {
      this.showAlertPopup('Error', 'No file data to submit!');
      return;
    }

    this.showAlertPopup('Info', 'Submit API not implemented in this component.');
  }

  resetUploadState() {
    this.uploadedData = [];
    this.uploadDisplayedColumns = [];
    this.isUploadGridVisible = false;
    this.isUploadDataVisible = false;
    this.selectedFile = null;
    this.formData = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  DownloadTemplate() {

    this.isLoading = true;

    const templateData = [
      {
        Company_Code: "",
        Group_Name: "",
        Vendor_Name: "",
        CostCenter_Id: "",
        Establishment_Name: "",
        Establishment_Adress1: "",
        PrincipalEmployerName: "",
        PrincipalEmployeAddress1: "",
        ContractorName: "",
        ContractorAddress1: "",
        PAYSLIP_FORMAT: "",
        Active: "",
        StartDate: "",
        IsBonusPayThroughFF: "",
        LeaveApplicable: "",
        SalaryDate: "",
        SAP_Cust_Name: "",
        WBS_Name: "",
        Portal_Payslip_Format: "",
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = { Sheets: { 'Site_Master': ws }, SheetNames: ['Site_Master'] };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `Site_Master_Template.xlsx`);

    //this.showAlertPopup('Template downloaded.');
    this.isLoading = false;
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.siteservice.UploadSiteMaster(formData).subscribe({
      next: (res) => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response.includes('Row(s) Uploaded Successfully.')) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = this.UploadedResponse.Data.response;
        }
        else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to Import.') {

          const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.Error_Message || ''
              || item.Message || item.MESSAGE || item.message
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_SiteMaster.xlsx');
          this.isLoading = false;
          alert(this.UploadedResponse.Data.response);
          return;
        }
        else {
          if (this.UploadedResponse.Data.response != '') {
            alert(this.UploadedResponse.Data.response);
            this.isLoading = false;
            return;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
            return;
          }

        }
      },
      error: (err) => {
        console.error('❌ Upload failed', err);
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Upload failed.';
      }
    });
  }
}
