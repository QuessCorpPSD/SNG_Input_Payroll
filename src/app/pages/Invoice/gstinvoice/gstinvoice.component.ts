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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');

@Component({
  selector: 'gstinvoice',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatNativeDateModule],
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
    'select'
    , 'pdfdownload'
    , 'invoice_Number'
    //, 'sap_Invoice_Number'
    //, 'sap_Account_Number'
    , 'invoice_Date'
    , 'company_Code'
    , 'pay_Period'
    , 'map_Name'
    , 'group_Name'
    , 'invoiceType'
    , 'net_Amount'
    , 'status'
    //, 'sap_Cancel_Document'
    //, 'sap_Credit_Note_Document'
    , 'crn_Number'
  ];

  filterDisplayedColumns: string[] = [
    'filterselect'
    , 'filterpdfdownload'
    , 'filterinvoice_Number'
    //, 'filtersap_Invoice_Number'
    //, 'filtersap_Account_Number'
    , 'filterinvoice_Date'
    , 'filtercompany_Code'
    , 'filterpay_Period'
    , 'filtermap_Name'
    , 'filtergroup_Name'
    , 'filterinvoiceType'
    , 'filternet_Amount'
    , 'filterstatus'
    //, 'filtersap_Cancel_Document'
    //, 'filtersap_Credit_Note_Document'
    , 'filtercrn_Number'
  ]
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
      this.dataSource.filteredData.some(row => row.invoice_Id === sel.invoice_Id
      )
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
    }
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
  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.dataSource.filter = filterValue;
  }
  BindDashBoard(userId: number) {
    this._invoiceService.GetGSTInvoice(userId).subscribe({
      next: res => {
        console.log(res);
        this.dataSource = new MatTableDataSource<any>(res.Data);
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

  TemplateClick(): void {
      const dataToExport = [
      { 'Invoice Number': '', 'Remarks': '', 'New Invoice Number': '' },
    ]
      this.downloadExcel(dataToExport, "Template_" + this.selectedTemplate);
  }

  onCancelClick(fileInput2: HTMLInputElement): void {
    this.isLoading = true;
    fileInput2.click();
  }

  onFileChange2(event: any): void {
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
        formData.append('file', this.excelFile);
        formData.append('companyCode', this.companyUI.companyCode);
        formData.append('companyId', this.companyUI.companyId);
        formData.append('userId', this.userdetail.user_Id);
        // formData.append('payPeriod', this.payperiodUI.payPeriod);
        // formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

        this._invoiceService.UploadCancel(formData).subscribe({
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
        console.error('No Data');
            this.isLoading = false;
    }
  }

  onFileDownload() {
  }
  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }
  DownloadInvoice(invoiceId: number, invoice_Number: string) {
    this.isLoading = true;
    this._invoiceService.DownloadInvoice(invoiceId).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = invoice_Number + '.pdf';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }
  BulkDownload() {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedInvoiceIds = filteredSelected.map(item => item.invoice_Id);
    if (!selectedInvoiceIds.length) {
      alert("No invoices selected");
      return;
    }
    const BulkInvoices = {
      invoiceIds: selectedInvoiceIds
    }
    this._invoiceService.BulkDownloadInvoice(BulkInvoices).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'invoices.zip';

      // Extract file name from header
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.*?)"?$/);
        if (match && match.length > 1) {
          fileName = match[1];
        }
      }

      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // Create link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isLoading = false;
    });
  }

  applyDateFilter(event: any, column: string) {const filterValue = event.target.value.trim().toLowerCase();

  this.dataSource.filterPredicate = (data: any, filter: string) => {
    if (!filter) return true;

    const rowDate = new Date(data[column]);
    if (isNaN(rowDate.getTime())) return false;

    // Convert row date → dd MMM yyyy
    const formattedRowDate = rowDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(',', '').toLowerCase();  

    return formattedRowDate.includes(filter);
  };

  this.dataSource.filter = filterValue;
  };

}


