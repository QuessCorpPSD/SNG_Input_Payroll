import { Component, ViewChild } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatHeaderCell, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatCardModule } from "@angular/material/card";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { Payperiodclass } from '../../../Models/Common';
import { CancelInvoiceRepository } from '../../../Service/customersserv/CancelInvoiceRepository.service';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";

@Component({
  selector: 'cancelledinvoicerepository',
  standalone: true,
  imports: [CommonModule,
    CompanyComponent,
    PayPeriodComponent,
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
    MatCheckboxModule, MatCardModule, CompanyallComponent],
  templateUrl: './cancelledinvoicerepository.component.html',
  styleUrl: './cancelledinvoicerepository.component.css'
})
export class CancelledinvoicerepositoryComponent {

  selectedCompanyId: number=0;
  payPeriodType: string = "ALL";
  selectedCompanyCode: string = "";
  PayPeriodUI: any;
  isLoading: boolean = false;
  userdetail: any;
  iseditclicked = false;
  editData?: any;
  form!: FormGroup;
  Editform!: FormGroup;
  searchText: string = "";
  File: File | null = null;


  handleCompanyEvent(event: any) {
    this.selectedCompanyId = event.companyId;
    console.log(this.selectedCompanyId);
    this.selectedCompanyCode = event.companyCode;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.PayPeriodUI = payperiod;
  }

  displayedColumns: string[] = [
    "edit",
    "Serial_No",
    "Invoice_Number",
    "Document_Name",
    "Uploaded_Date",
    "Document_Remarks"
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cancelService:CancelInvoiceRepository ,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.SearchClick(0, 0);
  }
  
  Search() {
  this.SearchClick(this.selectedCompanyId, this.PayPeriodUI.payfrequencyid);
  }

  SearchClick(companyId: number, payperiodId: number) {

    this.cancelService.Search(companyId, payperiodId).subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data.data.Table0) && res.Data.data.Table0.length > 0) {
          this.dataSource.data = res.Data.data.Table0;

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


  EditClick(rowData: any) {
  }

  closeclick() {
    this.iseditclicked = false;
  }

  onUploadClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: any, remarks: string): void {
    this.isLoading = true;
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    this.File = target.files[0];
    console.log('File before upload:', this.File.name, this.File.size);
    //Check Column Headers
    const formData = new FormData();
    if (this.File) {
      formData.append('file', this.File);
      formData.append('userId', this.userdetail.userId);
      formData.append('companyId', remarks);
      // formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
      // formData.append('inputType', this.inputType);
      // formData.append('lotNo', this.lotNo);

      //   this.onboardService.EmployeeTemplateImport(formData)
      //     .pipe(
      //       finalize(() => this.isLoading = true)
      //     ).subscribe({
      //       next: res => {
      //         console.log(res.data.message);

      //         if (res.statuscode == 200 && res.data.message == "1") {
      //           console.log("revised");
      //           const formDataRI = new FormData();
      //           if (this.companyUI) {
      //             formDataRI.append('companyId', this.companyUI.companyId);
      //             formDataRI.append('payPeriodId', this.payperiodUI.payfrequencyid);
      //             formDataRI.append('mapNameId', this.mapnameUI.mapNameId);
      //             formDataRI.append('inputType', this.inputType);
      //             formDataRI.append('lotNo', this.lotNo);

      //             this.onboardService.GetRevisedTemplate(formDataRI)
      //               .pipe(
      //                 finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      //               ).subscribe({
      //                 next: res => {
      //                   console.log(res);
      //                   if (res.statuscode == 200) {
      //                     const data = res.data;
      //                     var base64 = data.file;
      //                     //console.log(data.FileName);
      //                     //this.downloadExcelFromBase64(base64, data.fileName)
      //                   }
      //                 },
      //                 error: error => console.error('Error:', error)
      //               })
      //           }
      //           this.isLoading = false;
      //           return;
      //         }
      //         else {
      //           const data = res.data;
      //           var base64 = data.file;
      //           //console.log(data.FileName);
      //           this.isLoading = false;
      //           //this.downloadExcelFromBase64(base64, data.fileName)
      //         }
      //       },
      //       error: error => console.error('Error:', error)
      //     })
      // }
      //   else {
      //     alert("No File");
      //     this.isLoading = false;
    }
  }

  EditSaveClick() {

  }

  Cancel() {
    this.iseditclicked = false;
  }

}
