import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InvoiceCultureAddpoComponent } from '../invoice-culture-addpo/invoice-culture-addpo.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyComponent } from '../../../common/company/company.component';
import { InvoiceCultureService } from '../../../Service/invoice-culture.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { finalize } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ChildDetail {
  InvoiceCulture_id: number;
  Company_Id: number;
  Paycode_Id: number;
  Paycode_Code: string;
  HasAccess: boolean;
}

@Component({
  selector: 'app-invoice-culture',
  standalone: true,
  imports: [
    CommonModule,
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
    MatTooltipModule
  ],
  templateUrl: './invoice-culture.component.html',
  styleUrls: ['./invoice-culture.component.css']
})
export class InvoiceCultureComponent implements AfterViewInit {

  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  isTableVisible = false;
  excelFile: File | null = null;
  userdetail: any;
  datatable: any;
  companyUI: any;

  displayedColumns: string[] = [
    "delete",
    "company_Code",
    "company_Name",
    "invoiceCul_Ref_No",
    "invoiceType",
    "map_Name"
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private invoiceService: InvoiceCultureService,
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

  }


  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.companyUI = event.company;
  }

  AddPOOpen() {
    this.dialog.open(InvoiceCultureAddpoComponent, {
      width: '60%',
      height: '80vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  SearchClick() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }

    this.isLoading = true;
    this.isTableVisible = false;

    this.invoiceService.InvoicecultureSearch(this.comapnyId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data;
          this.isTableVisible = true;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

        } else {
          this.dataSource.data = [];
          this.isTableVisible = false;
          alert("No Records Found");
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.isTableVisible = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }
  DownloadTemplate() {

    const templateData = [
      {
        Company_code: "", Service_Charge: "", Map_Name: "", Invoice_Type: ""
        , Invoice_category: "", State: "", Type_of_invoice: ""
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    const wb = {
      Sheets: { 'InvoiceCulture': ws },
      SheetNames: ['InvoiceCulture']
    };

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, `InvoiceCulture_Template.xlsx`);
  }
  FileUpload(fileInput: HTMLInputElement): void {
    this.isLoading = true;
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

    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('userId', this.userdetail.user_Id);

      this.invoiceService.UploadInvoiceCulture(formData).subscribe({
        next: (res) => {
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "InvoiceCulture_Validations");
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

  deleteClick(invoiceCulture_id: number, invoiceType: string) {
    if (confirm("Are you sure you want to delete this?")) {

      const parentDetail = {
        InvoiceCulture_id: invoiceCulture_id,
        Company_Id: 0,
        Company_Code: '',
        Company_Name: '',
        InvoiceCul_Ref_No: "",
        InvoiceType: invoiceType,
        InvoiceType_Id: 0,
        Cost_Center_Mapping_Id: 0,
        Service_Charge_Master_Id: 0,
        Service_Charge_Type_Id: 0,
        Service_Charge_Slab_Item_Id: 0,
        Service_Charge_Slab_Inner_Item_Id: 0,
        Map_Name_Id: 0,
        Map_Name: '',
        Invoice_Category_Id: 0,
        Error_Message: ""
      }

      const childDetail: ChildDetail[] = [];

        childDetail.push({
          InvoiceCulture_id: 0,
          Company_Id: 0,
          Paycode_Id: 0,
          Paycode_Code: "",
          HasAccess: false
        });

      const InvoiceCultureAdd = {
        createdBy: this.userdetail.user_Id,
        mode: 'Delete',
        parentDetail: parentDetail,
        childDetail: childDetail
      }
      this.invoiceService.postInvoiceCulture(InvoiceCultureAdd).subscribe({
        next: (res) => {
          const errormsg = res.Data.data.Table0[0].Error_Message;
          alert(errormsg);
          this.isLoading = true;
          this.SearchClick()
          error: err => {
            console.error('Error fetching data:', err.message);
            this.isLoading = false;
          }
        }
      });
    }
  }

  Export() {
    if (!this.comapnyId) {
      alert('Please select a Company');
      return;
    }

    this.isLoading = true;
    this.invoiceService.ExportToExcel(this.userdetail.user_Id)
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
          }
        },
        error: error => console.error('Error:', error)
      })
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
