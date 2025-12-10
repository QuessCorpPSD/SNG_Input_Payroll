import { Component, ViewChild } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatHeaderCell, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvoiceCultureService } from '../../../Service/invoice-culture.service';
import { CreditNoteService } from '../../../Service/invoice/creditnote.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { ThisReceiver } from '@angular/compiler';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'creditnoteupdate',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    CompanyComponent,
    MatTooltipModule,
    MatCheckboxModule],
  templateUrl: './creditnoteupdate.component.html',
  styleUrl: './creditnoteupdate.component.css'
})
export class CreditnoteupdateComponent {

  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  companyUI: any;
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";



  displayedColumns: string[] = [
    "select",
    "pdfdownload",
    "Company_Code",
    "Company_name",
    "CreditNote_No",
    "Actual_Amount",
    "Adjusted_amount",
    "Credit_Note_Amount",
    "Actual_Credit_Note_Amount",
    "GstAmount",
    "Credit_Note_Status",
    "Credit_Note_Type",
    "Sap_Reference_Number",
    "Ref_Id",
    "Invoice_Number",
    "SAC_Code"
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private creditService: CreditNoteService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.PayPeriodUI = {
      payPeriod: "",
      paySequenceNo: "",
      payfrequencyid: 0
    }
  }

  selection = new SelectionModel<any>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.creditNote_Id === sel.creditNote_Id
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

  toggleRow(row: any) {
    this.selection.toggle(row);
  }


  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
    this.BindPurpose(this.comapnyId);
  }

  handlePayperiodEvent(payperiod: any) {
    this.PayPeriodUI = payperiod;
    console.log(this.PayPeriodUI);
  }

  BindPurpose(companyId: number) {
    this.creditService.GetCreditNotePurpose(companyId).subscribe({
      next: res => {
        console.log(res.Data);
        this.CreditNotePurpose = res.Data
      }
    });
  }

  onPurposeChange(event: any) {
    this.Credit_Note_Type = event.target.value;
    console.log('type', this.Credit_Note_Type);
    if (this.Credit_Note_Type == "Excess Collections") {
      this.isPayPeriod = false;
      this.isRefId = true;
    }
    else {
      this.isPayPeriod = true;
      this.isRefId = false;
    }

  }

  onStartChange(event: any) {
    const inputDate = event.target.value;
    const [year, month, day] = inputDate.split("-");
    this.StartDate = `${day}/${month}/${year}`;
  }
  onEndChange(event: any) {
    const inputDateend = event.target.value;
    const [year, month, day] = inputDateend.split("-");
    this.EndDate = `${day}/${month}/${year}`;
  }

  SearchClick() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }
    this.isLoading = true;
    const payload = {
      companyId: this.comapnyId,
      fromdate: this.StartDate,
      todate: this.EndDate
    }
    this.creditService.CreditNoteUpdateSearch(payload).subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          this.isLoading = false;

        } else {
          this.dataSource.data = [];
          this.isLoading = false;
          alert("No Records Found");

        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }

  DownloadTemplate() {

    const templateData = [
      {
        CreditNote_Nos: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'Sheet1': ws },
      SheetNames: ['Sheet1']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `CreditNoteCancel_Template.xlsx`);
  }

  FileUpload(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: any): void {
    this.isLoading = true;
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];

    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);

      this.creditService.UploadCreditNoteCancel(formData).subscribe({
        next: (res) => {
          console.log(res);
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "CreditNoteApprove_Validations");
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

  deleteClick() {
    // if (confirm("Are you sure you want to delete this?")) {

    //   const parentDetail = {
    //     InvoiceCulture_id: invoiceCulture_id,
    //     Company_Id: 0,
    //     Company_Code: '',
    //     Company_Name: '',
    //     InvoiceCul_Ref_No: "",
    //     InvoiceType: invoiceType,
    //     InvoiceType_Id: 0,
    //     Cost_Center_Mapping_Id: 0,
    //     Service_Charge_Master_Id: 0,
    //     Service_Charge_Type_Id: 0,
    //     Service_Charge_Slab_Item_Id: 0,
    //     Service_Charge_Slab_Inner_Item_Id: 0,
    //     Map_Name_Id: 0,
    //     Map_Name: '',
    //     Invoice_Category_Id: 0,
    //     Error_Message: ""
    //   }

    //   // const childDetail: ChildDetail[] = [];

    //   // childDetail.push({
    //   //   InvoiceCulture_id: 0,
    //   //   Company_Id: 0,
    //   //   Paycode_Id: 0,
    //   //   Paycode_Code: "",
    //   //   HasAccess: false
    //   // });

    //   const InvoiceCultureAdd = {
    //     createdBy: this.userdetail.user_Id,
    //     mode: 'Delete',
    //     parentDetail: parentDetail,
    //   //childDetail: childDetail
    //   }
    //   console.log(InvoiceCultureAdd);
    //   this.creditService.postInvoiceCulture(InvoiceCultureAdd).subscribe({
    //     next: (res) => {
    //       console.log(res);
    //       const errormsg = res.Data.data.Table0[0].Error_Message;
    //       alert(errormsg);
    //       this.isLoading = true;
    //       this.SearchClick()
    //       error: err => {
    //         console.error('Error fetching data:', err.message);
    //         this.isLoading = false;
    //       }
    //     }
    //   });
    // }
  }

  Export() {
    // if (!this.comapnyId) {
    //   alert('Please select a Company');
    //   return;
    // }

    // this.isLoading = true;
    // this.creditService.ExportToExcel(this.userdetail.user_Id)
    //   .pipe(
    //     finalize(() => this.isLoading = false)
    //   ).subscribe({
    //     next: res => {
    //       //console.log(res);
    //       if (res.StatusCode == 200) {
    //         const data = res.Data;
    //         var base64 = data.file;
    //         this.downloadExcelFromBase64(base64, data.fileName)
    //       }
    //     },
    //     error: error => console.error('Error:', error)
    //   })
  }

  DownloadInvoice(CreditNoteid: number, CompanyId: number, InvoiceNumber: number, InvoiceID: number) {
    this.isLoading = true;
    this.creditService.DownloadInvoice(CreditNoteid, CompanyId, InvoiceNumber, InvoiceID).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = InvoiceNumber + '.pdf';

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

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

}
