import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../../common/CompanyAll/companyall.component';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { AddservicechargemasterComponent } from '../../../customers/servicechargenew/addservicechargemaster/addservicechargemaster.component';

@Component({
  selector: 'app-servicechargenew',
  standalone: true,
  imports: [CommonModule, MatIconModule, AlertpopupComponent, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, CompanyallComponent],
  templateUrl: './servicechargenew.component.html',
  styleUrl: './servicechargenew.component.css'
})
export class ServicechargenewComponent {
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  leave: any;
  UploadedResponse: any;
  uploadedDataSource: any;
  serviceChargeService: any;
  servicechargedata: any;
  servicechargetypedata: any;
  selectedMasterId: any = null;
  selectedTypeId: any = null;
  dataSource = new MatTableDataSource<any>([]);
  Gridtype: string = "ServiceFeeFixed";
  gridData: string[] = [];
  isAddclicked = false;

  constructor(
    private dialog: MatDialog,
    private servicecharge: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private serviceChargeServiceNew: ServiceChargeService,
  ) { }

  uploadDisplayedColumns: string[] = [];
  uploadedDaeavetaSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild("pagiantor") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];

  // onSearchClick() {
  //   this.showTable = true;
  //   this.uploadedDataSource.data = this.uploadedData;
  // }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };

    //this.BindserviceCharge()

  }

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

  AddPOOpen() {
    if (!this.selectedCompanyId) {
      alert("Please Select Company for Add");
      return;
    }

    // this.isAddclicked = true;
    this.dialog.open(AddservicechargemasterComponent, {
      width: '60%',
      height: '100vh',
      panelClass: 'full-dialog-scroll',
      disableClose: true,
      data: {
        companyId: this.selectedCompanyId,
        companyCode: this.selectedCompanyCode
      }
    });
  }

  closeclick() {
    this.isAddclicked = false;
  }
  view(row: any) {
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
    this.BindserviceChargeNew(this.selectedCompanyId);
  }
  BindserviceChargeNew(companyId: number) {
    this.servicecharge.GetServiceChargeNew(companyId).subscribe({
      next: res => { this.servicechargedata = res.Data.data.Table0 }
    });

  }
  onServiceChargeChangeNew(event: any) {
    this.selectedMasterId = event.target.value;
    this.dataSource.data = [];

    if (this.selectedMasterId = 'ServiceFeeFixed') {
      this.gridData = ['Action', 'SNo', 'Map_Name', 'Value', 'IsAttendanceProrated_Text', 'IsFAndFProrate_Text',
        'IsFAndFArrearProrate_Text', 'IsNewjoineeProrate_Text', 'IsNewJoineeArrearProrate_Text',
        'Effective_Date', 'Compliance_Fee', 'RandStad_Fee', 'Upfront_Type', 'Upfront_Charge',
        'Upfront_PayCode', 'Insurance_Amount', 'QDemyFee_Type', 'QDemyFee', 'InEdgeFee_Type', 'InEdgeFee'
      ];
      this.displayedColumns = this.gridData;
    }
    else if (this.selectedMasterId = 'ServiceFeePercentage') {
      this.gridData = ['Action', 'SNo', 'Map_Name', 'PayCode_Code', 'Value', 'MaxAmount', 'Effective_Date', 'Compliance_Fee', 'RandStad_Fee',
        'Effective_Date', 'Compliance_Fee', 'RandStad_Fee', 'Upfront_Type', 'Upfront_Charge',
        'Upfront_PayCode', 'Insurance_Amount', 'QDemyFee_Type', 'QDemyFee', 'InEdgeFee_Type', 'InEdgeFee'
      ];
    }
    else if (this.selectedMasterId = 'SuppFeeFixed') {
      this.gridData = [];
    }
    else if (this.selectedMasterId = 'SuppFeePercentage') {

      this.gridData = [];
    }
    else {
      alert("Couldnot find Service Charge Type");
      return;
    }
  }

  // BindserviceCharge() {
  //   this.servicecharge.GetServiceCharge().subscribe({
  //     next: res => { this.servicechargedata = res.Data.data.Table0 }
  //   });

  // }
  // onServiceChargeChange(event: any) {
  //   this.selectedMasterId = event.target.value;  // <-- store selected master ID
  //   this.BindserviceChargetype(this.selectedMasterId);
  // }


  // BindserviceChargetype(masterId: any) {
  //   this.servicecharge.GetServicechargetype(masterId).subscribe({
  //     next: res => {
  //       this.servicechargetypedata = res.Data.data.Table0;
  //     }
  //   });
  // }
  // onServiceChargeTypeChange(event: any) {
  //   this.selectedTypeId = event.target.value;   // <-- store selected type ID
  // }

  onSearchClick() {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.selectedMasterId) {
      alert("Please select Service Charge Master");
      return;
    }

    // if (!this.selectedTypeId) {
    //   alert("Please select Service Charge Type");
    //   return;
    // }

    this.isLoading = true;
    const Company_Id = this.selectedCompanyId;

    this.servicecharge.GetSearch(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (!res?.Data.data.Table0 || res.Data.data.Table0.length === 0) {
          this.uploadedDataSource.data = [];
          alert("No Records Found");
          return;
        }
        this.dataSource = new MatTableDataSource<any>(res.Data.data.Table0);
        console.log("Search results:", res.Data.data.Table0);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;

        this.showTable = true;
      },

      error: (err) => {
        this.isLoading = false;
        console.error("Search failed:", err);
        alert("Search Failed.");
      }
    });
  }


  // exportToExcel(): void {
  //   if (!this.selectedCompanyId) {
  //     alert('Please select Company');
  //     return;
  //   }

  //   if (!this.payPeriodId) {
  //     alert('Please select Payperiod');
  //     return;
  //   }

  //   this.isLoading = true;

  //   const exportPayload = {
  //     Company_id: this.selectedCompanyId.toString(),
  //     Pay_Frequency_Id: this.payPeriodId.toString(),

  //   };

  //   this.leave.downloadExcel(exportPayload).subscribe({
  //     next: (res) => {
  //       this.isLoading = false;

  //       if (res?.Data?.statusCode === 400) {
  //         alert('No records found');
  //         return;
  //       }

  //       const jsonData = Array.isArray(res?.Data) ? res.Data : [];

  //       if (!jsonData.length) {
  //         alert('No Records Found');
  //         return;
  //       }

  //       const ws = XLSX.utils.json_to_sheet(jsonData);
  //       const wb = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'OneTimeReplacement');

  //       const fileName = `one_time_replacement_${new Date().toISOString().split('T')[0]}.xlsx`;

  //       XLSX.writeFile(wb, fileName);

  //       alert('Excel exported successfully!');
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       alert('Failed to load data for export');
  //     }
  //   });
  // }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }


  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ServiceChargeMaster", String(this.selectedMasterId));
    formData.append("ServiceChargeType", String(this.selectedTypeId));
    formData.append("SlabType", "0");
    formData.append("SlabInnerType", "0");
    formData.append("CreatedBy", this.userdetail.user_Id);

    this.servicecharge.UploadOneTime(formData).subscribe({
      next: (res: any) => {
        const status = res?.StatusCode;
        const response = res?.Data?.response || "";
        const errors = res?.Data?.errors || [];

        if (
          status === 200 &&
          (response.includes("Import Successfully Done.") ||
            response.includes("Uploaded successfully") ||
            response === "Success")
        ) {
          alert("Service Charge Imported Successfully!");
          return;
        }

        if (status === 200 && response === "Failed to import.") {

          let errorArray: any[] = [];

          try {
            if (errors?.length > 0) {
              errorArray = JSON.parse(errors[0]);
            } else {
              errorArray = [{ Error_Message: "Unknown error occurred" }];
            }
          } catch {
            errorArray = [{ Error_Message: "Invalid error format from server" }];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item.Error_Message ||
              item.ERROR_MESSAGE ||
              item.Message ||
              item.MESSAGE ||
              item.message ||
              "Unknown Error"
          }));

          alert(response);

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'ServiceCharge_ErrorMessages.xlsx');
          return;
        }

        if (response !== "") alert(response);
        else alert("Unexpected response from server");
      },

      error: (err) => {
        console.error("Upload failed", err);
        alert("Upload Failed.");
      }
    });
  }

  deleteServiceCharge(row: any) {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isLoading = true;
    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id?.toString(),
      serviceChargeId: row.Service_Charge_Id,
      // ServiceCharge: []
    };
    console.log("Delete payload:", JSON.stringify(payload));

    this.serviceChargeServiceNew.SaveServiceCharge(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res?.Data.response);
          this.onSearchClick()
        } else {
          alert(res?.Message || 'Delete failed');
        }
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        alert('API error during deletion');
        this.isLoading = false;
      }
    });
  }

}
