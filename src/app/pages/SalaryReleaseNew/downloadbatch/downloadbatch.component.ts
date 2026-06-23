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
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { IBatchreation } from '../../../Repository/SalaryRequestNew/Ibatchcreation';
import { BatchcreationService } from '../../../Service/SalaryRequestNew/batchcreation.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
export const Pay_TOKEN = new InjectionToken<IBatchreation>('Pay_TOKEN');

@Component({
  selector: 'app-downloadbatch',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './downloadbatch.component.html',
  styleUrl: './downloadbatch.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BatchcreationService,
    }
  ]
})
export class DownloadbatchComponent {
  BatchDate: any;
  BatchId: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  userdetail: any;
  batchtype: any;
  dataSource = new MatTableDataSource<any>([]);
  Batchtype: string = '';
  batchid: any;

  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_TOKEN) private service: IBatchreation,) { }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;

  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.Bindbatchtype();

  }

  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchtype = res.Data }
    });
    // this.BindbatchId();
  }
  loadBatchId() {
    if (!this.batchid || this.batchid.length === 0) {
      this.BindbatchId();
    }
  }

  BindbatchId() {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!this.BatchDate) {
      alert("Please Select BatchDate");
      return;
    }
    this.service.BatchId(this.Batchtype, this.BatchDate, this.userdetail.user_Id).subscribe({
      next: res => { this.batchid = res.Data }
    });
  }

  Downloadbatch(): void {
    if (!this.BatchId) {
      alert("Please Select BatchID");
      return;
    }
    this.isLoading = true;
    this.service.Downloadbatchfile(this.BatchId).subscribe({
      next: (res) => {
        this.isLoading = false;
        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No Data Found')
            this.isLoading = false;
            return;

          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Download Batch');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `DownloadbatchFile_${timestamp}.xlsx`;
          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }



}
