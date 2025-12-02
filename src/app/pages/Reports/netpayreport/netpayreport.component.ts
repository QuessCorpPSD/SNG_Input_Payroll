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
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-netpayreport',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,   // ✅ FIX ADDED
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    CompanyallComponent,
    PayPeriodComponent
  ],
  templateUrl: './netpayreport.component.html',
  styleUrl: './netpayreport.component.css'
})
export class NetpayreportComponent {
  netpayForm!: FormGroup;   // ✅ FIX ADDED

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: String = '';
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private service: NetpaysummaryService
  ) { }
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


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
  }

  ngOnInit(): void {

    // 🔥 FIX: Create the form
    this.netpayForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      reportType: ['']
    });

    // Load session data same as before
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }

    this.payPeriodType = "All";
  }
  exportToExcel(): void {
    this.isLoading = true;

    if (!this.selectedCompanyCode) {
      this.showAlertPopup('Validation Error', 'Please select Company');
      this.isLoading = false;
      return;
    }
    if (!this.payPeriodId) {
      this.showAlertPopup('Validation Error', 'Please Select Payperiod');
      this.isLoading = false;
      return;
    }
    console.log(this.selectedCompanyCode);
    console.log(this.payPeriodId);


    this.service.ExporttoExcel(this.selectedCompanyId, this.payPeriodId).subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup('Information', 'No data available to export');
            this.isLoading = false;
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Netpaysummaryreport');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Netpaysummaryreport${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);
          this.showAlertPopup('Success', 'Excel file exported successfully!');
          this.isLoading = false;

        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.showAlertPopup('Error', 'Failed to export data to Excel');
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading data for export', err);
        this.showAlertPopup('Error', 'Failed to load data for export');
      },
    });
  }
}



