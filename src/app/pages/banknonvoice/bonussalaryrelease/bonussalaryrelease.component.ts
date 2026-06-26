import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-bonussalaryrelease',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './bonussalaryrelease.component.html',
  styleUrl: './bonussalaryrelease.component.css'
})
export class BonussalaryreleaseComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  entity: any;
  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  selectedBatchType: string = '';
  startDate: string = '';
  endDate: string = '';
  employeeCode: string = '';
  batchtype: any[] = [];
  batchList: any[] = [];
  startDateInput: string = '';
  endDateInput: string = '';
  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";
  payperiodIdmain: any;
  payperiodsmain: any;
  selectedCompanyId: any;


  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName', 'BatchId', 'NetPay', 'BankName', 'NEFTBankName'

  ];
  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
    this.BindPurpose(this.comapnyId);
  }

  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }


  BindPurpose(companyId: number) {

  }

  searchClick() {

    this.istablevisible = true;
  }
  exportToExcel(): void {
    // Validation
    if (!this.selectedBatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }
  }
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!this.selectedBatchType) {
      alert('Please select a Batch Type.');
      this.isLoading = false;
      return;
    }
  }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

}

