import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { NetpaysummaryService } from '../../../Service/Reports/netpaysummary.service';
import * as XLSX from 'xlsx';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-netpayreport',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    CompanyallComponent,
    PayPeriodComponent,
    AlertpopupComponent
  ],
  templateUrl: './netpayreport.component.html',
  styleUrls: ['./netpayreport.component.css']
})
export class NetpayreportComponent {
  netpayForm!: FormGroup;
  entityList: any[] = [];
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  // payperiods: string = '';
  // payPeriodId: number = 0;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;
  selectedEntity: any = "";
  selectedCompany: any = "";
  payPeriodList: any[] = [];
  payPeriodId: number = 0;
  payperiods: string = "";
  isEntitySelected = false;
  isCompanySelected = false;
  entity: any;
  company: any;
  payperiod: any;
  disabled = false;
  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private service: NetpaysummaryService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }

    this.payPeriodType = "All";
    this.loadEntityNames();
    this.loadPayPeriods();
  }


  onEntityChange() {
    if (this.entity) {
      this.isEntitySelected = true;
      this.isCompanySelected = false;
      this.company = ""; 
    } else {
      this.isEntitySelected = false;
      this.isCompanySelected = false;

    }
  }


  previousCompany: any = null;

  ngDoCheck() {
    
    if (!this.company || this.company === "" || JSON.stringify(this.company) === "{}") {
      if (this.isCompanySelected) {
        console.log("Company cleared → enabling Entity...");
        this.isCompanySelected = false;
        this.isEntitySelected = false;
      }
    }
  }
  handleCompanyEvent(value: any) {
    console.log("CompanyEmit:", value);

    this.company = value;

    if (value && value.companyId) {
      this.isCompanySelected = true;
      this.isEntitySelected = false;
      this.entity = "";
    } else {
      this.isCompanySelected = false;
      this.isEntitySelected = false;
      this.entity = "";
    }
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }
  // onEntityChange(selectedEntityId: any) {
  //   this.selectedEntity = selectedEntityId;
  //   this.isEntitySelected = !!selectedEntityId;

  //   if (this.isEntitySelected) {
  //     this.isCompanySelected = false;
  //     this.selectedCompany = null;
  //   }

  // }


  // handleCompanyEvent(event: any) {
  //   this.selectedCompany = event;
  //   this.isCompanySelected = !!event;
  //   this.selectedCompanyId = event.companyId;
  //   console.log("Selected Company ID:", this.selectedCompanyId);

  //   if (this.isCompanySelected) {
  //     this.isEntitySelected = false;
  //     this.selectedEntity = null;
  //   }
  // }

  loadPayPeriods() {
    this.service.GetPayperiod().subscribe({
      next: (res: any) => {

        this.payPeriodList = res?.Data || [];
        this.payPeriodId = 0;
        this.payperiods = "";
        this.netpayForm.patchValue({
          payPeriod: ''
        });

        console.log("Loaded PayPeriods:", this.payPeriodList);
      },
      error: (err) => {
        console.error("Failed to load PayPeriods", err);
      }
    });
  }

  onPayPeriodChange(event: any) {
    const selectedId = Number(event.target.value);
    const selected = this.payPeriodList.find(
      p => Number(p.pay_Frequency_Detail_Id) === selectedId
    );

    if (selected) {
      this.payPeriodId = selectedId;
      this.payperiods = selected.pay_Period;
      console.log("Selected PayPeriod ID:", this.payPeriodId, "Name:", this.payperiods);
    }
  }
  // exportToExcel(): void {
  //   console.log("Export → Company ID:", this.selectedCompanyId, " PayPeriod ID:", this.payPeriodId);

  //   this.isLoading = true;
  //   if (!this.selectedCompanyId) {
  //     this.showAlertPopup("Please select Company");
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.payPeriodId) {
  //     this.showAlertPopup("Please select PayPeriod");
  //     this.isLoading = false;
  //     return;
  //   }

  //   this.service.ExporttoExcel(this.selectedCompanyId, this.payPeriodId).subscribe({
  //     next: (res) => {
  //       console.log("API Response:", res);
  //       try {
  //         const jsonData = res.Data;
  //         //const jsonData = res.Data.data.Table0;

  //         if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
  //           this.showAlertPopup(res.Data.message);
  //           this.isLoading = false;
  //           return;
  //         }

  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //         XLSX.utils.book_append_sheet(wb, ws, 'Netpaysummaryreport');

  //         const timestamp = new Date().toISOString().split('T')[0];
  //         const fileName = `Netpaysummaryreport${timestamp}.xlsx`;

  //         XLSX.writeFile(wb, fileName);
  //         this.showAlertPopup('Excel file exported successfully!');
  //         this.isLoading = false;

  //       } catch (err) {
  //         console.error('Error exporting to Excel:', err);
  //         this.showAlertPopup('Failed to export data to Excel');
  //         this.isLoading = false;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading data for export', err);
  //       this.showAlertPopup('Failed to load data for export');
  //       this.isLoading = false;
  //     },
  //   });
  // }
  exportToExcel(): void {
    const company = this.company.companyId;

    console.log("Company:", company,
      "Entity:", this.entity,
      "PayPeriod:", this.payPeriodId);
    this.isLoading = true;

    if (!this.payPeriodId) {
      alert("Please select PayPeriod");
      this.isLoading = false;
      return;
    }

    let apiCall;

    if (this.company) {
      apiCall = this.service.ExporttoExcel(
        company,
        this.payperiod
      );
    }
    else {
      apiCall = this.service.ExporttoExcelByEntity(
        this.entity,
        this.payperiod
      );
    }

    apiCall.subscribe({
      next: (res) => {
        console.log("API Response:", res);

        // const jsonData = res.Data;
        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
          alert(res.Data?.message);
          this.isLoading = false;
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Netpaysummaryreport');

        XLSX.writeFile(wb, "Netpaysummary.xlsx");
        this.showAlertPopup("Export Successful!");
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Export Error:", err);
        alert("Failed to export");
        this.isLoading = false;
      }
    });
  }


  loadEntityNames() {
    this.service.GetEntityNames().subscribe({
      next: (res: any) => {
        this.entityList = res?.Data?.data?.Table0 || [];
      },
      error: () => {
        alert("Failed to load entity names");
      }
    });
  }

  submitForm() {
    console.log("Selected Entity ID:", this.selectedEntity);
  }
}
