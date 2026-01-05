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
import { CreditNoteService } from '../../../Service/invoice/creditnote.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CompanyInvoiceFormatRepository } from '../../../Service/invoice/CompanyInvoiceFormatRepository.service';
import { MatCardModule } from "@angular/material/card";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";

@Component({
  selector: 'companyinvoiceformat',
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
    //CompanyComponent,
    MatTooltipModule,
    MatCheckboxModule, MatCardModule, CompanyComponent, GroupnameComponent],
  templateUrl: './companyinvoiceformat.component.html',
  styleUrl: './companyinvoiceformat.component.css'
})
export class CompanyinvoiceformatComponent {

  comapnyId: number = 0;
  groupId: number = 0;

  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  companyUI: any;
  InvoiceTypes: any;
  //invoiceType_Id?: number;
  invoiceType: string = "";
  InvoiceFormat: any;
  invoiceFormatId?: number;
  format_Name: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";
  isAddclicked = false;
  iseditclicked = false;
  siteCode: string = "";
  siteName: string = "";
  companyValue?: number;
  groupValue?: number;
  editData?: any;
  Id?: number;

  displayedColumns: string[] = [
    "edit",
    "Id",
    "Company_Code",
    "Group_Name",
    "Format_Name"
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private companyService: CompanyInvoiceFormatRepository,
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

    this.SearchClick();
  }

  SearchClick() {

    this.companyService.GetAllCompanyInvoiceFormat(this.userdetail.user_Id).subscribe({
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

  Addclicked(): void {
    this.isAddclicked = true;
  }
  closeclick() {
    this.isAddclicked = false;
    this.iseditclicked = false;
  }


  EditClick(rowData: any) {
    this.iseditclicked = true;
    this.BindInvoiceType();
    this.BindInvoiceFormat();

    this.companyValue = rowData.company_Code;
    this.comapnyId=rowData.companyId;
    this.groupValue = rowData.group_Name;
    this.groupId = rowData.groupDetailId;
    this.Id = rowData.id;
    //this.invoiceType_Id = rowData.invoiceType_Id;
    this.invoiceType = rowData.invoiceType;
    this.invoiceFormatId = rowData.invoiceFormatId;
    this.format_Name = rowData.format_Name;
    //console.log(this.invoiceType_Id);
    //this.editData = { ...rowData };
  }
  InvoicetypeOnclick(event: any) {
    this.BindInvoiceType();
  }

    InvoiceFormatOnclick(event: any) {
    this.BindInvoiceFormat();
  }


  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
    this.BindInvoiceType();
    this.BindInvoiceFormat();

  }
  handleGroupNameEvent(event: any) {
    this.siteCode = event.siteCode;
    this.siteName = event.siteName;
  }
  BindInvoiceType() {
    this.companyService.GetAllInvoiceType().subscribe({
      next: res => {
        console.log(res.Data);
        this.InvoiceTypes = res.Data
      }
    });
  }

  BindInvoiceFormat() {
    this.companyService.GetAllInvoiceFormat().subscribe({
      next: res => {
        console.log(res.Data);
        this.InvoiceFormat = res.Data
      }
    });
  }

  // onInvoiceTypeChange(event: any) {
  //   this.invoiceType_Id = event.target.value;
  //   console.log(this.invoiceType_Id);
  // }

  onInvoiceFormatChange(event: any) {
    this.invoiceFormatId = event.target.value;
    console.log(this.invoiceFormatId);
  }

  SaveClick() {
    if (!this.comapnyId) {
      alert("Company Code Mandatory");
      return;
    }
    if (!this.siteCode) {
      alert("Group Name Mandatory");
      return;
    }
    // if (!this.invoiceType_Id) {
    //   alert("Invoice Type Mandatory");
    //   return;
    // }
    if (!this.invoiceFormatId) {
      alert("Invoice Format Mandatory");
      return;
    }
    const payload = {
      userId: this.userdetail.user_Id,
      mode: 'Add',
      CompanyId: this.comapnyId,
      GroupDetailId: this.siteCode,
      //InvoiceType_Id: 0,
      InvoiceFormatId: this.invoiceFormatId
    }

    this.companyService.CompanyInvoiceFormatAddsave(payload).subscribe({
      next: (res: string) => {
        console.log(res);
        const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
        console.log(cleanMessage);
        if (cleanMessage.includes('Success')) {
          alert('Company Invoice Format Created Successfully');
          this.isAddclicked=false;
          this.SearchClick();
        } else {
          alert(cleanMessage);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }


  EditSaveClick() {
    const payload = {
      userId: this.userdetail.user_Id,
      mode: 'Edit',
      Id: this.Id,
      CompanyId: this.comapnyId,
      GroupDetailId: this.groupId,
      //InvoiceType_Id:0,
      InvoiceFormatId: this.invoiceFormatId || this.editData.invoiceFormatId
    }

    console.log(payload);

    this.companyService.CompanyInvoiceFormatEditsave(payload).subscribe({
      next: (res: string) => {
        console.log(res);
        const cleanMessage = res.replace(/<br\s*\/?>/gi, '\n');
        console.log(cleanMessage);
        if (cleanMessage.includes('Success')) {
          alert('Company Invoice Format Updated Successfully');
          this.iseditclicked=false;
          this.SearchClick();
        } else {
          alert(cleanMessage);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    });
  }

  Cancel() {
    this.isAddclicked = false;
    this.iseditclicked = false;
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
    //   this.isLoading = true;
    //   const target: DataTransfer = <DataTransfer>(event.target);

    //   if (!target.files || target.files.length !== 1) {
    //     console.error('Please upload only one Excel file.');
    //     this.isLoading = false;
    //     return;
    //   }

    //   const file = target.files[0];
    //   this.excelFile = target.files[0];

    //   if (!this.excelFile) {
    //     console.error("⚠️ No file selected.");
    //     this.isLoading = false;
    //     return;
    //   }

    //   const formData = new FormData();
    //   if (this.excelFile) {
    //     formData.append('file', this.excelFile);
    //     formData.append('userId', this.userdetail.user_Id);

    //     this.creditService.UploadCreditNoteCancel(formData).subscribe({
    //       next: (res) => {
    //         console.log(res);
    //         this.datatable = res.Data;
    //         console.table(this.datatable);
    //         if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
    //           this.downloadExcel(this.datatable, "CreditNoteApprove_Validations");
    //           this.isLoading = false;
    //         } else {
    //           alert("No validations returned");
    //           this.isLoading = false;
    //         }
    //       },
    //       error: err => {
    //         console.error('❌ Upload failed', err);
    //         this.isLoading = false;
    //       }
    //     });
    //   }
  }

  // downloadExcel(data: any[], templateId: string): void {
  //   //console.log("export");
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Sheet1': worksheet },
  //     SheetNames: ['Sheet1']
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   const fileName = `${templateId}.xlsx`;
  //   FileSaver.saveAs(blob, fileName);
  // }


  // Export() {
  //   // if (!this.comapnyId) {
  //   //   alert('Please select a Company');
  //   //   return;
  //   // }

  //   // this.isLoading = true;
  //   // this.creditService.ExportToExcel(this.userdetail.user_Id)
  //   //   .pipe(
  //   //     finalize(() => this.isLoading = false)
  //   //   ).subscribe({
  //   //     next: res => {
  //   //       //console.log(res);
  //   //       if (res.StatusCode == 200) {
  //   //         const data = res.Data;
  //   //         var base64 = data.file;
  //   //         this.downloadExcelFromBase64(base64, data.fileName)
  //   //       }
  //   //     },
  //   //     error: error => console.error('Error:', error)
  //   //   })
  // }

  // DownloadInvoice(CreditNoteid: number, CompanyId: number, InvoiceNumber: number, InvoiceID: number) {
  //   this.isLoading = true;
  //   this.creditService.DownloadInvoice(CreditNoteid, CompanyId, InvoiceNumber, InvoiceID).subscribe(response => {
  //     const contentDisposition = response.headers.get('Content-Disposition');
  //     let fileName = InvoiceNumber + '.pdf';

  //     // Extract file name from header
  //     if (contentDisposition) {
  //       const match = contentDisposition.match(/filename="?(.*?)"?$/);
  //       if (match && match.length > 1) {
  //         fileName = match[1];
  //       }
  //     }

  //     const blob = new Blob([response.body!], { type: 'application/pdf' });

  //     // Create link and trigger download
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = fileName;
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     this.isLoading = false;
  //   });
  // }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

}
