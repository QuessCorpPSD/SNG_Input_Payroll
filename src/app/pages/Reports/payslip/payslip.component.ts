import { CommonModule } from '@angular/common';
import { Component, Inject, TrackByFunction } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { APIResponse } from '../../../Models/apiresponse';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { PayslipService } from '../../../Service/Reports/payslip.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import html2pdf from 'html2pdf.js';

type RawRow = Record<string, any>;

interface ViewRow {
  Employee_Id: number;
  Employee_Code: string;
  Name: string;
  Date_Of_Joining: string;
  Designation_Name: string;
  Gross_salary: string;
  TotalDeduction: string;
  Need_To_Pay: string;
}

@Component({
  selector: 'payslip',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PayPeriodComponent,
    MatPaginatorModule],
  templateUrl: './payslip.component.html',
  styleUrl: './payslip.component.css'
})
export class PayslipComponent {
  companyId: any;
  selectedCompanyCode: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPPid?: string;
  selectedPP?: string;
  isLoading: boolean = false;
  rows: ViewRow[] = [];
  filteredRows: any[] = [];
  searchText: string = '';
  apiResponse: any;
  downloadapiResponse: any;
  pageSize = 10;
  currentPage = 0;
  paginatedData: any[] = [];

  constructor(private payslipService: PayslipService) { }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.Employee_Id;

  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.paginatedData = [];
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPPid = String(payperiod.payfrequencyid);
    this.selectedPP = String(payperiod.payPeriod);
    this.paginatedData = [];
  }

  Searchclick() {
    this.isLoading = true;
    if (!this.companyId) {
      alert('Please select Company Code');
      this.isLoading = false;
      return;
    }

    if (!this.selectedPPid) {
      alert('Please select Payperiod');
      this.isLoading = false;
      return;
    }

    this.payslipService.GetEmployee(
      this.companyId.toString(),
      String(this.selectedPPid)
    ).subscribe({
      next: (res: APIResponse) => {
        this.apiResponse = res.Data;

        const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
        if (!table.length) {
          this.isLoading = false;
          return;
        }
        //  normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            Employee_Id: r['Employee_Id'],
            Employee_Code: r['Employee_Code'],
            Name: r['Name'],
            Date_Of_Joining: r['Date_Of_Joining'],
            Designation_Name: r['Designation_Name'],
            Gross_salary: r['Gross_salary'],
            TotalDeduction: r['TotalDeduction'],
            Need_To_Pay: r['Need_To_Pay']
          };

          return row;
        });

        this.filteredRows = [...this.rows];
        this.setPaginatedData();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("error:", err);
      }
    });
  }
  applyFilter() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }

    const filteredResult = this.rows.filter(r =>
      (r.Name && r.Name.toString().toLowerCase().includes(text)) ||
      (r.Employee_Code && r.Employee_Code.toString().toLowerCase().includes(text))
    );

    this.filteredRows = [...filteredResult];
    this.currentPage = 0;
    this.setPaginatedData();
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredRows.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  Download(employeeId: number,Employee_Code:string) {
    this.isLoading = true;
    this.payslipService.DownloadPayslip(String(employeeId), String(this.selectedPP)).subscribe({
      next: (res: APIResponse) => {
        this.downloadapiResponse = res.Data;

        if (res?.StatusCode === 200 && res?.Data?.response === 'Success' && res?.Data?.base64string) {
          const base64String = res.Data.base64string;

          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });

          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `Payslip_${Employee_Code}_${this.selectedPP}.pdf`;
          link.click();

          window.URL.revokeObjectURL(blobUrl);
        } else {
          alert('No data found!');
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Download error:', err);
      }
    });
  }
}

