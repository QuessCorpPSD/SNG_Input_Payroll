import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export const Common_TOKEN = new InjectionToken<IPartialBatchCreation>('Common_TOKEN');

import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { IPartialBatchCreation } from '../../../Repository/banknonvoice/IPartialBatchCreation';
import { PartialBatchCreationService } from '../../../Service/banknonvoice/partial-batch-creation.service';

@Component({
  selector: 'app-partial-batch-creation',
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
  templateUrl: './partial-batch-creation.component.html',
  styleUrl: './partial-batch-creation.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: PartialBatchCreationService }
  ],
})
export class PartialBatchCreationComponent {

  searchText: string = '';
  isLoading = false;
  userdetail!: any;
  user_Id: any;

  companyList: any[] = [];
  selectedCompanyId: any = 0;
  selectedCompanyCode: any = '';
  companyname: any = '';

  uploadData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadData);
  dataSource = new MatTableDataSource<any>([]);
  showTable = false;

  selectedRows: any[] = [];   // ✅ FIXED: missing variable

  displayedColumns: string[] = [
    'select',
    'VendorName',
    'AttendenceBatchId',
    'GroupCount',
    'PayPeriod',
    'Purpose',
    'InputNo'
  ];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private decry: EncryptionService,
    private service: PartialBatchCreationService,
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

  onSearch() {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      alert('Please Select Business Unit');
      this.isLoading = false;
      return;
    }

    this.service.GetSalaryreleaseProcessdata(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        const data = res?.Data?.data?.Table0 ?? [];

        if (data.length === 0) {
          alert('No data found');
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.showTable = true;
        this.selectedRows = []; // reset selection

        this.isLoading = false;
      },

      error: (err) => {
        console.error(err);
        alert('Failed to load data');
        this.isLoading = false;
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

  GenerateBatch() {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      alert('Please select atleast one record');
      return;
    }

    const payload = {
      Created_By: Number(this.userdetail.user_Id),
      Mode: 'Generate',
      partialbatchcreation: this.selectedRows.map((x: any) => ({
        Company_id: Number(this.selectedCompanyId),
        Salary_Process_Initiate_detail_Id: Number(x.Salary_Process_Initiate_detail_Id)
      }))
    };

    this.service.Batchgenerate(payload).subscribe({
      next: (res: any) => {
        const msg = res?.response || res?.Data?.response || '';

        if (msg && msg.toLowerCase().includes('success')) {
          alert(msg);
          this.onSearch();
        } else {
          alert(msg || 'Generate Failed');
        }
      },

      error: (err) => {
        console.error(err);
        alert('Error while Generating');
      }
    });
  }
  exportToExcel(): void {
    this.isLoading = true;

    const companyId = this.selectedCompanyId || 0;

    this.service.ExportToExcel(companyId).subscribe({
      next: (res) => {
        this.isLoading = false;

        const jsonData = res?.Data?.data?.Table0;

        if (!jsonData || jsonData.length === 0) {
          alert('No data available');
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PartialBatchCreation');

        const date = new Date().toISOString().split('T')[0];
        const fileName = `PartialBatchCreation_${date}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },

      error: (err) => {
        this.isLoading = false;
        alert('Export failed');
        console.error(err);
      }
    });
  }
}