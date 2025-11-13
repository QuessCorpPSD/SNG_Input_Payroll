import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository'; import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { GstInvoiceGrid } from '../../../Models/GSTInvoiceGrid';


export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');

@Component({
  selector: 'gstinvoice',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gstinvoice.component.html',
  styleUrl: './gstinvoice.component.css',
  providers: [{
    provide: Invoice_TOKEN,
    useClass: InvoiceRepository
  }]
})

export class GstinvoiceComponent {

  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<GstInvoiceGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedTemplate: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;

  displayedColumns: string[] = [
'invoice_Number'
,'company_Code'
,'map_Name'
,'city_Name'
,'pay_Period'
,'invoiceType'
,'invoice_Date'
,'particulars'
,'amount'
,'iGST_Percentage'
,'iGST_Amount'
,'service_Charge'
,'service_Charge_Amount'
,'sourcing_Fee'
,'sourcing_Fee_Amount'
,'no_Of_Employees'
,'net_Amount'
,'input_No'
,'employee_PF'
,'employer_PF'
,'dO_Number'
,'status'
,'group_Name'
,'crn_Number'
  ];

  TemplateOptions = [
    { value: 'reject', Text: 'Reject' },
    { value: 'cancel', Text: 'Cancel' },
    { value: 'clear', Text: 'Clear' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService) {
  }

  selection = new SelectionModel<GstInvoiceGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id)
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: GstInvoiceGrid) => this.selection.select(row));
  }

  toggleRow(row: GstInvoiceGrid) {
    this.selection.toggle(row);
  }

  templateDataMap: { [key: string]: any[] } = {
    reject: [
      { 'Invoice Number': '', 'Discrepancy By': '', 'Discrepancy': '' },
    ],
    cancel: [
      { 'Invoice Number': '', 'Remarks': '', 'New Invoice Number': '' },
    ]
  };

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.BindDashBoard(this.userdetail.user_Id);
  }

  BindDashBoard(userId: number) {
    this._invoiceService.GetGSTInvoice(userId).subscribe({
      next: res => {
        console.log(res);
        // if (!res.Data || res.Data.length === 0) {
        //   alert("No data available to display.");
        //   this.isLoading = false;
        //   return;
        // }
        //console.log(res.Data);
        this.dataSource = new MatTableDataSource<any>(res.Data);
        //console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  onTemplateChange(): void {

    if (this.selectedTemplate === "clear") {
      this.selectedTemplate = "";
    }
    if (this.selectedTemplate === "reject" || this.selectedTemplate === "cancel") {
      const dataToExport = this.templateDataMap[this.selectedTemplate];
      if (!dataToExport) {
        console.warn('No data.');
        return;
      }
      this.downloadExcel(dataToExport, "Template_" + this.selectedTemplate);
    }
    else {
      alert("Template type not valid!");
    }
  }

  onRejectClick(fileInput: HTMLInputElement): void {
    this.isLoading = true;
    fileInput.click();
  }

  onFileChange(event: any): void {
    this.selectedImport = 'Reject';
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }


  onCancelClick(fileInput2: HTMLInputElement): void {
    this.isLoading = true;
    fileInput2.click();
  }

  onFileChange2(event: any): void {
    this.selectedImport = 'Cancel';
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }

  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }
    const formData = new FormData();
    if (this.excelFile) {
      if (this.selectedImport == 'Reject') {
        formData.append('file', this.excelFile);
        formData.append('companyCode', this.companyUI.companyCode);
        formData.append('companyId', this.companyUI.companyId);
        formData.append('userId', this.userdetail.userId);
        // formData.append('payPeriod', this.payperiodUI.payPeriod);
        // formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

        this._invoiceService.UploadReject(formData).subscribe({
          next: res => {
            this.datatable = res.Data;
            console.table(this.datatable);
            if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
              this.downloadExcel(this.datatable, "Reject_Validations");
              //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod);
              this.isLoading = false;
            } else {
              alert("No validations returned");
              this.isLoading = false;
            }
          },
          error: err => {
            console.error('❌ Upload failed', err);
            this.isLoading = false;
          }
        });
      }
      else if (this.selectedImport = 'Cancel') {
        formData.append('file', this.excelFile);
        formData.append('companyCode', this.companyUI.companyCode);
        formData.append('companyId', this.companyUI.companyId);
        formData.append('userId', this.userdetail.userId);
        // formData.append('payPeriod', this.payperiodUI.payPeriod);
        // formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

        this._invoiceService.UploadReject(formData).subscribe({
          next: res => {
            this.datatable = res.Data;
            console.table(this.datatable);
            if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
              this.downloadExcel(this.datatable, "Reject_Validations");
              //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod);
              this.isLoading = false;
            } else {
              alert("No validations returned");
              this.isLoading = false;
            }
          },
          error: err => {
            console.error('❌ Upload failed', err);
            this.isLoading = false;
          }
        });
      }
      else {
        alert("Invalid Import Type!");
        this.isLoading = false;
      }
    }
  }

  onFileDownload() {
  }
  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }
  applyFilter() {

  }
  RejectClick() {

  }
  Downloadpdf() {

  }
}


