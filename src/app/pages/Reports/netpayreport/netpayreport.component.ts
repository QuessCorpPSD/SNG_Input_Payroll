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
  selectedPP: any;
  payperiodUI: any;
  selectedCC: any;
  selectedCN: any;
  payPeriodTypetoChild?: string;
  payperiodId: any;

  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private service: NetpaysummaryService
  ) { }

  ngOnInit(): void {
    this.payPeriodTypetoChild = "All"

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
    this.selectedCC = value.companyId;
    this.selectedCN = value.companyCode;
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

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.payperiodId = payperiod.payfrequencyid;

    this.payperiodUI.emit(payperiod);
  }

  sheetNames: any = {
    Table0: "Net Pay Summary Report",
    Table1: "Net Pay Summary Details",
    Table2: "Partial Hold Summary Report",
    Table3: "Gratuity Summary Report",
    Table4: "DBT Hold Summary Report",
    Table5: "Deduction Flush Out Report"
  };


  exportToExcel(): void {
    const company = this.company?.companyId;

    this.isLoading = true;
    if (!this.entity && !this.company) {
      alert("Please select Entity or Company");
      this.isLoading = false;
      return;
    }

    if (
      (this.isEntitySelected && !this.payperiod) ||
      (this.isCompanySelected && !this.payperiodId)
    ) {
      alert("Please select PayPeriod");
      this.isLoading = false;
      return;
    }

    let apiCall;

    // ENTITY EXPORT API
    if (!company) {
      const payload = {
        EntityId: this.entity,
        PayPeriod: this.payperiod?.pay_Period
      };
      apiCall = this.service.ExporttoExcelByEntity(payload);
    }

    // COMPANY EXPORT API
    else {
      apiCall = this.service.ExporttoExcel(company, this.payperiodId);
    }

    apiCall.subscribe({
      next: (res) => {
        const data = res?.Data?.data;

        if (!company) {
          const table0 = data?.Table0 || [];

          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(table0);
          XLSX.utils.book_append_sheet(wb, ws, "Net Pay Summary Report");

          XLSX.writeFile(wb, "Netpaysummary.xlsx");
          this.showAlertPopup("Export Successful!");
          this.isLoading = false;
          return;
        }

        const wb = XLSX.utils.book_new();

        Object.keys(this.sheetNames).forEach(key => {
          const tableData = data[key] || [];   // empty if null

          let ws: XLSX.WorkSheet;

          if (tableData.length > 0) {
            ws = XLSX.utils.json_to_sheet(tableData);
          } else {
            ws = XLSX.utils.json_to_sheet([{}]);  // create empty sheet
          }

          XLSX.utils.book_append_sheet(wb, ws, this.sheetNames[key]);
        });

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

  // exportToExcel(): void {
  //   const company = this.company?.companyId;

  //   console.log("Company:", company,
  //     "Entity:", this.entity,
  //     "PayPeriod:", this.payperiodId);

  //   this.isLoading = true;

  //   // VALIDATION
  //   if (
  //     (this.isEntitySelected && !this.payperiod) ||
  //     (this.isCompanySelected && !this.payperiodId)
  //   ) {
  //     alert("Please select PayPeriod");
  //     this.isLoading = false;
  //     return;
  //   }

  //   let apiCall;

  //   // ENTITY EXPORT
  //   if (!company) {
  //     const payload = {
  //       EntityId: this.entity,
  //       PayPeriod: this.payperiod?.pay_Period
  //     };
  //     apiCall = this.service.ExporttoExcelByEntity(payload);
  //   }

  //   // COMPANY EXPORT
  //   else {
  //     apiCall = this.service.ExporttoExcel(
  //       company,
  //       this.payperiodId
  //     );
  //   }

  //   apiCall.subscribe({
  //     next: (res) => {
  //       console.log("API Response:", res);

  //       const data = res?.Data?.data;

  //       if (!data) {
  //         alert(res.Data.message);
  //         this.isLoading = false;
  //         return;
  //       }

  //       const wb = XLSX.utils.book_new();

  //       Object.keys(data).forEach((tableName) => {
  //         const table = data[tableName];

  //         if (Array.isArray(table) && table.length > 0) {
  //           const ws = XLSX.utils.json_to_sheet(table);
  //           XLSX.utils.book_append_sheet(wb, ws, tableName);
  //         }
  //       });

  //       if (wb.SheetNames.length === 0) {
  //         alert("No valid data found");
  //         this.isLoading = false;
  //         return;
  //       }

  //       // EXPORT EXCEL
  //       XLSX.writeFile(wb, "Netpaysummary.xlsx");

  //       this.showAlertPopup("Export Successful!");
  //       this.isLoading = false;
  //     },

  //     error: (err) => {
  //       console.error("Export Error:", err);
  //       alert("Failed to export");
  //       this.isLoading = false;
  //     }
  //   });
  // }



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
