import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { InvoiceSummaryReportService } from '../../../Service/Reports/invoice-summary-report.service';

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { NetpayreportComponent } from '../netpayreport/netpayreport.component';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-invoice-report',
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
    AlertpopupComponent
  ],
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css']
})
export class InvoiceReportComponent {

  invoiceForm!: FormGroup;
  entityList: any[] = [];
  selectedEntity: any = '';

  selectedCompanyCode: any;
  userdetail: any;
  reportTypes: any[] = [];
  payPeriodList: any[] = [];

  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;

  selectedCompany: any = "";

  isEntitySelected = false;
  isCompanySelected = false;
  disabled = false;
  entity: any;
  company: any;
  payperiod: any;
  startDate: any;
  endDate: any;
  reportType: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private reportTypeService: InvoiceSummaryReportService
  ) { }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
    const today = new Date().toISOString().split('T')[0];
    this.startDate = today;
    this.endDate = today;


    this.invoiceForm = this.fb.group({
      reportType: ['', Validators.required]
    });
    this.loadReportTypes();
    this.loadEntityNames();
  }



  loadReportTypes() {
    this.reportTypeService.GetTaxTypes().subscribe({
      next: (res: any) => {
        this.reportTypes = res?.Data?.data?.Table0 || [];
        console.log("Report Types:", this.reportTypes);
      },
      error: (err) => {
        console.error("Failed to load report types", err);
        alert("Failed to load Report Types");
      }
    });
  }

  onEntityChange() {
    if (this.entity) {
      this.isEntitySelected = true;
      this.isCompanySelected = false;
      this.company = ""; // reset company
    } else {
      this.isEntitySelected = false;
      this.isCompanySelected = false;
    }
  }

  // When Company emits
  handleCompanyEvent(value: any) {
    this.company = value;

    if (this.company) {
      this.isCompanySelected = true;
      this.isEntitySelected = false;
      this.entity = ""; // reset entity
    } else {
      this.isCompanySelected = false;
      this.isEntitySelected = false;
    }
  }

  // exportToExcel(): void {
  //   this.isLoading = true;

  //   const companyId = this.selectedCompanyCode;
  //   const userId = this.userdetail?.user_Id;
  //   const reportType = this.invoiceForm.value.reportType;

  //   const startDate = this.invoiceForm.value.startDate.split('-').reverse().join('-');
  //   const endDate = this.invoiceForm.value.endDate.split('-').reverse().join('-');


  //   if (!companyId) {
  //     this.alert("Validation Error", "Please select Company");
  //     return;
  //   }

  //   if (!reportType) {
  //     this.alert("Validation Error", "Please select Report Type");
  //     return;
  //   }

  //   if (!userId) {
  //     this.alert("Error", "User ID not found!");
  //     return;
  //   }

  //   console.log("Export Params:", {
  //     companyId, startDate, endDate, reportType, userId
  //   });


  //   this.reportTypeService.ExporttoExcel(
  //     companyId,
  //     startDate,
  //     endDate,
  //     reportType,
  //     userId
  //   ).subscribe({
  //     next: (res) => {

  //       const data = res?.Data?.data?.Table0 || [];
  //       if (data.length === 0) {
  //         alert(res.Data.message);
  //         return;
  //       }

  //       const ws = XLSX.utils.json_to_sheet(data);
  //       const wb: XLSX.WorkBook = {
  //         Sheets: { 'InvoiceSummary': ws },
  //         SheetNames: ['InvoiceSummary']
  //       };

  //       const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //       const blob = new Blob([buffer], { type: 'application/octet-stream' });

  //       FileSaver.saveAs(blob, `InvoiceSummary_${Date.now()}.xlsx`);

  //       alert("Excel exported successfully!");
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error("Export failed:", err);
  //       alert("Failed to export data");
  //     }
  //   });
  // }
  exportToExcel(): void {

    this.isLoading = true;

    const companyId = this.company?.companyId
    const entityId = this.entity

    const reportType = this.reportType;
    const startDate = this.startDate?.split('-').reverse().join('-');
    const endDate = this.endDate?.split('-').reverse().join('-');
    const userId = this.userdetail?.user_Id;

    console.log('Company:', this.company);
    console.log('Entity:', this.entity);


    console.log("Export Params:", {
      companyId,
      entityId,
      reportType,
      startDate,
      endDate,
      userId
    });

    if (!companyId && !entityId) {
      this.alert("Please select Company or Entity");
      this.isLoading = false;
      return;
    }

    if (!reportType) {
      this.alert("Please select Report Type");
      this.isLoading = false;
      return;
    }

    if (!startDate || !endDate) {
      this.alert("Please select Start Date and End Date");
      this.isLoading = false;
      return;
    }

    if (!userId) {
      this.alert("User ID not found!");
      this.isLoading = false;
      return;
    }



    let apiCall;

    if (companyId) {
      apiCall = this.reportTypeService.ExporttoExcel(
        companyId,
        startDate,
        endDate,
        reportType,
        userId
      );
    } else {
      apiCall = this.reportTypeService.ExporttoExcelByEntity(
        entityId,
        startDate,
        endDate,
        reportType,
        userId
      );
    }
    apiCall.subscribe({
      next: (res) => {

        const data = res?.Data?.data?.Table0;

        if (!data || data.length === 0) {
          alert(res.Data?.message);
          this.isLoading = false;
          return;
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb: XLSX.WorkBook = {
          Sheets: { 'InvoiceSummary': ws },
          SheetNames: ['InvoiceSummary']
        };

        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(blob, `InvoiceSummary_${Date.now()}.xlsx`);

        this.alert("Success", "Excel exported successfully!");
        this.isLoading = false;
      },

      error: (err) => {
        console.error("Export failed:", err);
        this.alert("Error", "Failed to export data");
        this.isLoading = false;
      }
    });

  }
  alert(msg: string, sub?: string) {
    this.popupMessage = msg;
    this.popupSubMessage = sub || '';
    this.showPopup = true;
    this.isLoading = false;
  }

  closePopup() {
    this.showPopup = false;
  }
  loadEntityNames() {
    this.reportTypeService.GetEntityNames().subscribe({
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

