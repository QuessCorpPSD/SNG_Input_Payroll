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
import { HoldGrid } from '../../../Models/SalaryRelease/Hold';
import { IBatchreation } from '../../../Repository/SalaryRequestNew/Ibatchcreation';
import { BatchcreationService } from '../../../Service/SalaryRequestNew/batchcreation.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
export const Pay_TOKEN = new InjectionToken<IBatchreation>('Pay_TOKEN');

@Component({
  selector: 'app-batchcreationprocess',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './batchcreationprocess.component.html',
  styleUrl: './batchcreationprocess.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BatchcreationService,
    }
  ]
})
export class BatchcreationprocessComponent {
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  istablevisible = false;
  dataSource = new MatTableDataSource<any>([]);
  userdetail: any;
  batchcreate: any;
  batchtype: any;
  entitylist: any;
  Batchtype: any;
  entity: any;
  Batchcreate: any;
  remarks: any;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_TOKEN) private service: IBatchreation,) { }
  displayedColumns: string[] = [
    'select',
    'Invoice_No', 'company_code', 'map_name', 'payperiod',
    'Netamount', 'Noofemployees'
  ];



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
    this.Bindbatchcreation();
    this.Bindbatchtype();
    this.Bindentity();
  }

  Bindbatchcreation() {
    this.service.Batchcreationtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchcreate = res.Data }
    });
  }
  Bindbatchtype() {
    this.service.Batchtype(this.userdetail.user_Id).subscribe({
      next: res => { this.batchtype = res.Data }
    });
  }
  Bindentity() {
    this.service.Entitylist(this.userdetail.user_Id).subscribe({
      next: res => { this.entitylist = res.Data }
    });
  }
  search() {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!this.batchcreate) {
      alert("Please Select Batch Create");
      return;
    }
    if (!this.entity) {
      alert("Please Select Entity");
      return;
    }

    this.istablevisible = true;
    this.isLoading = true;

    const batchtype = this.Batchtype;
    const batchcreate = this.Batchcreate;
    const entity = this.entity;
    const userid = this.userdetail.user_Id;
    
    this.service.Search(batchtype, batchcreate, entity, userid).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        const tableData = res.Data.data.Table0;

        if (!tableData.length) {
          alert('No data found');
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource<any>(res.Data.data.Table0);
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

  exportToExcel(): void {
    if (!this.Batchtype) {
      alert("Please Select Batch Type");
      return;
    }
    if (!this.batchcreate) {
      alert("Please Select Batch Create");
      return;
    }
    if (!this.entity) {
      alert("Please Select Entity");
      return;
    }
    const batchtype = this.Batchtype;
    const batchcreate = this.Batchcreate;
    const entity = this.entity;
    const userid = this.userdetail.user_Id;
    this.isLoading = true;
    this.service.Export(batchtype, batchcreate, entity, userid).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, 'GST');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `GST_Details_${timestamp}.xlsx`;
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
