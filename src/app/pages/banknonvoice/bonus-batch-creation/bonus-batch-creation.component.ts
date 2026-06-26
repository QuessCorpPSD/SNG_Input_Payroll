import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
export const Common_TOKEN = new InjectionToken<IBonusBatchGeneration>('Common_TOKEN');

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { IPartialBatchCreation } from '../../../Repository/banknonvoice/IPartialBatchCreation';
import { PartialBatchCreationService } from '../../../Service/banknonvoice/partial-batch-creation.service';
import { IBonusBatchGeneration } from '../../../Repository/banknonvoice/IBonusBatchCreation';
import { BonusBatchGenerationService } from '../../../Service/banknonvoice/bonus-batch-creation.service';


@Component({
  selector: 'app-bonus-batch-creation',
  standalone:true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './bonus-batch-creation.component.html',
  styleUrl: './bonus-batch-creation.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: BonusBatchGenerationService }
  ],
})
export class BonusBatchCreationComponent {

  searchText: string = '';
  isLoading = false;
  userdetail!: any;
  user_Id: any;
  companyList: any[] = [];
  selectedCompanyId: any = 0;
  selectedCompanyCode: any = '';
  companyname: any = '';
  Remarks: string = '';
  uploadData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData);
  dataSource = new MatTableDataSource<any>([]);
  showTable = false;

  selectedRows: any[] = [];

  displayedColumns: string[] = [
    'select',
    'CompanyCode',
    'PayPeriod',
    'BatchId',

  ];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private decry: EncryptionService,
    private service: BonusBatchGenerationService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');

    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.GetNonInvoiceEntity();
  }

  GetNonInvoiceEntity() {
    this.service.GetNonInvoiceEntity().subscribe({
      next: (res: any) => {
        this.companyList = res?.Data?.data?.Table0 ?? [];
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load Business Units');
      }
    });
  }

  isAllSelected() {
    return this.selectedRows.length === this.dataSource.data.length;
  }

  masterToggle(event: any) {
    if (event.checked) {
      this.selectedRows = [...this.dataSource.data];
    } else {
      this.selectedRows = [];
    }
  }

  toggleRow(row: any) {
    if (row.isSelected) {

      const exists = this.selectedRows.find(
        x => x.Salary_Process_Initiate_detail_Id === row.Salary_Process_Initiate_detail_Id
      );

      if (!exists) {
        this.selectedRows.push(row);
      }

    } else {

      this.selectedRows = this.selectedRows.filter(
        x => x.Salary_Process_Initiate_detail_Id !== row.Salary_Process_Initiate_detail_Id
      );
    }
  }

  onSearch() {

    this.isLoading = true;

    if (!this.selectedCompanyId) {

      alert('Please Select Company');

      this.isLoading = false;

      this.showTable = false;

      return;
    }

    this.showTable = true;

    const entityId = this.selectedCompanyId || 0;

    this.service.GetBonusReleaseProcessdata(entityId).subscribe({

      next: (res) => {

        if (res?.Data?.statusCode === '400') {

          alert(res.Data.message);

          this.dataSource.data = [];

          this.isLoading = false;

          return;
        }

        this.uploadData = res?.Data?.data?.Table0 ?? [];

        if (this.uploadData.length === 0) {

          alert('No data found');

          this.dataSource.data = [];

          this.isLoading = false;

          return;
        }

        this.dataSource =
          new MatTableDataSource(this.uploadData);

        this.dataSource.paginator =
          this.paginator;

        this.dataSource.sort =
          this.sort;

        this.displayedColumns = [
          'select',
          'CompanyCode',
          'PayPeriod',
          'BatchId'
        ];

        this.isLoading = false;
      },

      error: (err) => {

        console.error('Error loading data', err);

        alert('Failed to load data');

        this.isLoading = false;
      }

    });
  }

  formatDate(date: any): string {

    if (!date) return '';

    const d = new Date(date);

    const day =
      ('0' + d.getDate()).slice(-2);

    const month =
      ('0' + (d.getMonth() + 1)).slice(-2);

    const year =
      d.getFullYear();

    return `${day}-${month}-${year}`;
  }

  onGenerate() {

    if (this.selectedRows.length === 0) {

      alert('Please select atleast one record');

      return;
    }

    const payload = {

      Company_Id: Number(this.selectedCompanyId),

      CreatedBy: Number(this.userdetail.user_Id),

      Remarks: this.Remarks,

      bonusBatch: this.selectedRows.map((item: any) => ({

        Bank_Advice_Approvals_Id:
          item.Bank_Advice_Approvals_Id,

        NonInvoice_Batchid:
          item.NonInvoice_Batchid,

        Company_Code:
          item.Company_Code,

        Pay_Period:
          item.Pay_Period

      }))
    };

    this.service.Batchgenerate(payload).subscribe({

      next: (res: any) => {

        let msg = "";

        if (res?.Data?.response) {

          try {

            const result =
              JSON.parse(res.Data.response);

            msg =
              result[0]?.Error_Message;

          } catch {

            msg = res.Data.response;
          }
        }

        if (
          msg &&
          msg.toLowerCase().includes("success")
        ) {

          alert(msg);

          this.selectedRows = [];

          this.onSearch();

        } else {

          alert(msg || "Generate Failed");
        }
      },

      error: () => {

        alert("Error while generating batch");
      }
    });
  }

  onReject(row: any) {

    if (!confirm('Are you sure you want to reject this batch?')) {
      return;
    }

    const payload = {

      Bank_Advice_Approvals_Id:
        row.Bank_Advice_Approvals_Id,

      NonInvoice_Batchid:
        row.NonInvoice_Batchid,

      Remarks:
        this.Remarks,

      CreatedBy:
        Number(this.userdetail.user_Id)
    };

    this.service.RejectBatch(payload).subscribe({

      next: (res: any) => {

        let msg = "";

        if (res?.Data?.response) {

          try {

            const result =
              JSON.parse(res.Data.response);

            msg =
              result[0]?.Error_Message;

          } catch {

            msg = res.Data.response;
          }
        }

        if (
          msg &&
          msg.toLowerCase().includes("success")
        ) {

          alert(msg);

          this.onSearch();

        } else {

          alert(msg || "Reject Failed");
        }
      },

      error: () => {

        alert("Error while rejecting batch");
      }
    });
  }


}



