import { Component, Inject, InjectionToken, TrackByFunction } from '@angular/core';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { IOnboardingServices } from '../../../Repository/IOnboardingService';
import { OnboardingServices } from '../../../Service/OnboardingService';
import { Payperiodclass } from '../../../Models/Common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CommonModule } from '@angular/common';
import { iperfomainvoiceservice } from '../../../Repository/iperfomainvoice.service';
import { perfomainvoiceservice } from '../../../Service/perfomainvoice.service';
import * as XLSX from 'xlsx';
import { json } from 'stream/consumers';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
const perfomainvoiceser = InjectionToken<iperfomainvoiceservice>;
type RawRow = Record<string, any>;

interface ViewRow {
  Input_No: string;
  Map_Name_Id: number;
  Map_name: string;
  Employee_Head_Count: string;
  NetPay: string;
  InvoiceCulture_Id: number;
  Invoice_Category_Id: number;
  Invoice_Category: string;
  selected: boolean;
}

@Component({
  selector: 'perfomainvoice',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, AlertpopupComponent, PayrollinputComponent],
  templateUrl: './perfomainvoice.component.html',
  styleUrl: './perfomainvoice.component.css',
  providers: [
    { provide: perfomainvoiceser, useClass: perfomainvoiceservice }]
})

export class PerfomainvoiceComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  payPeriodTypefromParentall: string = '';
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  searchText: string = '';
  MergeRemarks: string = '';
  isLoading = false;
  apiResponse: any;
  rows: ViewRow[] = [];
  filteredRows: any[] = [];
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  selectedMapName: string | null = null;
  selectedInvoiceCategory: string | null = null;
  excelFile: File | null = null;
  UploadedResponse: any;
  assignments: number[] = [];
  ismerge = false;


  constructor(
    public stateService: OnboardingStateService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(perfomainvoiceser) private perfomainvoiceSer: iperfomainvoiceservice
  ) { }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.Input_No;

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParentall = "All";
    this.filteredRows = [...this.rows];
  }

  handleCompanyEvent(company: any) {

    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    if (this.companyUI && this.payperiodUI) {
      this.isLoading = true;
      this.GetPerformaInvoice(this.companyUI.companyId, this.payperiodUI.payPeriod, this.companyUI.invoice_Billing_Type)
    }
  }

  GetPerformaInvoice(ComapnayId: string, payPeriod: string, invoiceBillingType: number) {
    this.perfomainvoiceSer.GetPerformaInvoice(ComapnayId, payPeriod, invoiceBillingType, this.userdetail.user_Id).subscribe({
      next: res => {
        console.log(res.Data);
        if (!res?.Data?.Table0 || res.Data.Table0.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.apiResponse = res.Data;

        const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
        if (!table.length) return;
        //  normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            Input_No: r['Input_No'],
            Map_Name_Id: r['Map_Name_Id'],
            Map_name: r['Map_name'],
            Employee_Head_Count: r['Employee_Head_Count'],
            NetPay: r['NetPay'],
            InvoiceCulture_Id: r['InvoiceCulture_Id'],
            Invoice_Category_Id: r['Invoice_Category_Id'],
            Invoice_Category: r['Invoice_Category'],
            selected: false
          };

          return row;
        });

        this.filteredRows = [...this.rows];
        this.isLoading = false;

      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }

    this.filteredRows = this.rows.filter(r =>
      (r.Input_No && r.Input_No.toString().toLowerCase().includes(text)) ||
      (r.Map_name && r.Map_name.toLowerCase().includes(text))
    );
  }

  get selectedRowsCount(): number {
    return this.rows.filter(r => r.selected).length;
  }

  onCheckboxChange(row: any, event: any): void {

    // if (event.checked) {
    //   // First selection: set the reference values
    //   if (!this.selectedMapName && !this.selectedInvoiceCategory) {
    //     this.selectedMapName = row.Map_name;
    //     this.selectedInvoiceCategory = row.Invoice_Category;
    //   } else {
    //     // Validate against first selected values
    //     if (
    //       row.Map_name !== this.selectedMapName ||
    //       row.Invoice_Category !== this.selectedInvoiceCategory
    //     ) {
    //       // Reset checkbox if not matching
    //       row.selected = false;
    //       event.source.checked = false;

    //       // Show popup
    //       alert("Map Name and Invoice Category must be same for all selected rows!");
    //     }
    //   }
    // } else {
    //   // If unchecked, reset reference if no rows left
    //   const stillSelected = this.rows?.filter(r => r.selected);
    //   if (!stillSelected?.length) {
    //     this.selectedMapName = null;
    //     this.selectedInvoiceCategory = null;
    //   }
    // }

  }

  downloadExcel() {
    const data: any[][] = [
      ["EmployeeCode"]];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "PerformaInvoiceSplit_Template.xlsx");
  }

  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }
    fileInput.click();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    //Check Column Headers
    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('CompanyId', this.companyUI.companyId);
      formData.append('payperiod', this.payperiodUI.payPeriod);
      formData.append('CreatedBy', this.userdetail.userId);
      this.perfomainvoiceSer.PerformaInvoiceSplit(formData).subscribe({
        next: res => {
          this.UploadedResponse = res;

          if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Import Successfully Done.') {
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Import Successfully Done.';
          }
          else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

            const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
            const exportData = errorArray.map((item: any) => ({
              Error_Message: item.Error_Message || item.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { 'ErrorMessages': worksheet },
              SheetNames: ['ErrorMessages']
            };

            // Export the file
            XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
            this.isLoading = false;
            this.showPopup = true;
            this.popupMessage = 'Import Failed.';

          }
          else {
            if (this.UploadedResponse.data.response != '') {
              alert(this.UploadedResponse.data.response);
              this.isLoading = false;
            }
            else {
              alert('Error while processing response.');
              this.isLoading = false;
            }

          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
        }
      });

    }
    else {
      alert("No File");
      this.isLoading = false;
    }
  }

  Mergeclick() {
    this.assignments = this.filteredRows
      .filter(r => r.selected)
      .map(r => r.Input_No);
    this.ismerge = true;
  }
  MergeSubmit() {
    const assignmentsString = this.assignments.join(",");
    const requestPayload = {
      CompanyId: String(this.companyUI.companyId),
      PayPeriodId: String(this.payperiodUI.payfrequencyid),
      MergeLot: assignmentsString,
      CreatedBy: this.userdetail.userId,
      Remarks: this.MergeRemarks
    }

    this.perfomainvoiceSer.PerformaInvoiceMerge(requestPayload).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Import Successfully Done.') {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Import Successfully Done.';
        }
        else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            ERORR: item.ERORR || item.ERORR || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Merged';

        }
        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }

        }
      },
      error: err => {
        console.error('❌ Upload failed', err);
      }
    });

  }

  InvoiceInitiateClick() {

    const selectedRow = this.filteredRows.find(r => r.selected);

    if (!selectedRow) {
      alert("Please select a row");
      return;
    }

    const requestPayload = {
      CompanyId: String(this.companyUI.companyId),
      PayPeriodId: String(this.payperiodUI.payfrequencyid),
      LotNumbers: String(selectedRow.Input_No),
      Employee_Head_Count: String(selectedRow.Employee_Head_Count),
      Map_Name_Id: String(selectedRow.Map_Name_Id),
      Map_Name: String(selectedRow.Map_name),
      NetPay: String(selectedRow.NetPay),
      Invoice_Category_Id: String(selectedRow.Invoice_Category_Id),
      Invoice_Category: String(selectedRow.Invoice_Category),
      CreatedBy: this.userdetail.userId
    };

    this.perfomainvoiceSer.PerformaInvoiceInitiate(requestPayload).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Invoice Initiated Successfully') {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Invoice Initiated Successfully';
        }
        else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            ERORR: item.ERORR || item.ERORR || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed';

        }
        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }

        }
      },
      error: err => {
        console.error('❌ Upload failed', err);
      }
    });
  }


}
