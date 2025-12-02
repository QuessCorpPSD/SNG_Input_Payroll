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
    CompanyallComponent
  ],
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css']
})
export class InvoiceReportComponent implements OnInit {

  invoiceForm!: FormGroup;

  selectedCompanyCode: any;
  userdetail: any;
  reportTypes: any[] = [];

  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;


  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private reportTypeService: InvoiceSummaryReportService
  ) { }

  // -----------------------------------------
  // Load User + Form + Dropdown
  // -----------------------------------------
  ngOnInit(): void {

    // Load user profile from session
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      try {
        this.userdetail = JSON.parse(this.decry.decrypt(json));
      } catch {
        console.warn('Invalid user profile format');
        this.userdetail = {};
      }
    } else {
      console.warn('UserProfile not found in session storage');
      this.userdetail = {};
    }

    // Initialize form
    const today = new Date().toISOString().split('T')[0];

    this.invoiceForm = this.fb.group({
      startDate: [today, Validators.required],
      endDate: [today, Validators.required],
      reportType: ['', Validators.required]
    });

    // Load dropdown list
    this.loadReportTypes();
  }

  // -----------------------------------------
  // Load Report Types
  // -----------------------------------------
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

  // -----------------------------------------
  // Handle Company
  // -----------------------------------------
  handleCompanyEvent(company: any) {
    this.selectedCompanyCode = company.companyId;
    console.log("Selected Company:", this.selectedCompanyCode);
  }

  // -----------------------------------------
  // Export Excel
  // -----------------------------------------
  exportToExcel(): void {
    this.isLoading = true;

    const companyId = this.selectedCompanyCode;
    const userId = this.userdetail?.user_Id;
    const reportType = this.invoiceForm.value.reportType;

    const startDate = this.invoiceForm.value.startDate.split('-').reverse().join('-');
    const endDate = this.invoiceForm.value.endDate.split('-').reverse().join('-');

    // VALIDATIONS
    if (!companyId) {
      this.alert("Validation Error", "Please select Company");
      return;
    }

    if (!reportType) {
      this.alert("Validation Error", "Please select Report Type");
      return;
    }

    if (!userId) {
      this.alert("Error", "User ID not found!");
      return;
    }

    console.log("Export Params:", {
      companyId, startDate, endDate, reportType, userId
    });

    // API call
    this.reportTypeService.ExporttoExcel(
      companyId,
      startDate,
      endDate,
      reportType,
      userId
    ).subscribe({
      next: (res) => {

        const data = res?.Data?.data?.Table0 || [];
        if (data.length === 0) {
          this.alert("Info", "No data available to export");
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
      }
    });
  }

  // -----------------------------------------
  // Popup Utility
  // -----------------------------------------
  alert(msg: string, sub?: string) {
    this.popupMessage = msg;
    this.popupSubMessage = sub || '';
    this.showPopup = true;
    this.isLoading = false;
  }

  closePopup() {
    this.showPopup = false;
  }

}
