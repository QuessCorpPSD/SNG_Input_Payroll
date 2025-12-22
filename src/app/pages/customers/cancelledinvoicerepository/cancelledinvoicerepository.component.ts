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
    MatCheckboxModule, MatCardModule],
  templateUrl: './cancelledinvoicerepository.component.html',
  styleUrl: './cancelledinvoicerepository.component.css'
})
export class CancelledinvoicerepositoryComponent {

  selectedCompanyId: number = 0;
  payPeriodType: string = "All";
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
  selectedFileName: string = "";
  remarksText: string = "";
  showTable = false;

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
    private cancelService: CancelInvoiceRepository,
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
    this.showTable = true;
    this.SearchClick(this.selectedCompanyId, this.PayPeriodUI.payfrequencyid);
  }

  SearchClick(companyId: number, payperiodId: number) {
    this.cancelService.Search(companyId, payperiodId).subscribe({
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


  EditClick(rowData: any) {
    this.iseditclicked = true;
    this.editData = rowData;
    console.log(JSON.stringify(this.editData));
  }

  closeclick() {
    this.iseditclicked = false;
  }

  onFileChange(event: any, remarks: string): void {
    this.File = event.target.files[0];

    if (!this.File) {
      return;
    }
    this.selectedFileName = this.File.name;
    this.remarksText = remarks;
    console.log('File selected:', this.selectedFileName);
    console.log('Remarks:', this.remarksText);
  }

  EditSaveClick() {
    const payload = {
      Serial_No: this.editData.serial_No,
      Id: this.editData.id,
      Company_Id: this.editData.company_Id,
      Payperiod_Id: this.editData.payperiod_Id,
      Invoice_Id: this.editData.invoice_Id,
      Invoice_Number: this.editData.invoice_Number,
      Document_Name: this.selectedFileName,
      Remark: this.remarksText
    }
    const formData = new FormData();
    if (this.File) {
      formData.append('file', this.File);
      formData.append('cancelDocument', JSON.stringify(payload).toString());
      formData.append('userId', this.userdetail.user_Id);

      this.cancelService.UploadDocument(formData).subscribe({
        next: res => {
          console.log(res);
          const headerResult = res.Data[0].Error_Message.toString();
          console.log(headerResult);

          if (headerResult.includes('Successfully')) {
            alert(headerResult);
            this.iseditclicked = false;
            this.SearchClick(0, 0);

          }
          else {
            if (headerResult) {
              alert(headerResult);
              this.isLoading = false;
            }
            else {
              alert('Error in Check Template');
              this.isLoading = false;
              return;
            }
          }
        }
      });
    }
    else {
      alert('No File choosen');
      this.isLoading = false;
      return;
    }
  }

  Cancel() {
    this.remarksText = ''
    this.selectedFileName = ''
    this.iseditclicked = false;
  }

}
