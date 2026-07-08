import { CommonModule } from '@angular/common';
import { Component, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { SalaryreleaseprocessService } from '../../../Service/banknonvoice/salaryreleaseprocess.service';
import { ISalaryReleaseProcess } from '../../../Repository/banknonvoice/ISalaryReleaseProcess';
export const Common_TOKEN = new InjectionToken<ISalaryReleaseProcess>('Common_TOKEN');
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-salaryreleaseprocess',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    MatCardModule],
  templateUrl: './salaryreleaseprocess.component.html',
  styleUrl: './salaryreleaseprocess.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: SalaryreleaseprocessService }
  ],
})
export class SalaryreleaseprocessComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  showSearchGrid: boolean = true;

  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  user_Id: any;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  srpBatchList: any[] = [];
  SelectedBatch: any = "";

  selectedBatchType: string = '';   // correct variable
  selectedBatchId: string = '';

  batchtype: any[] = [];
  batchList: any[] = [];

  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName',
    'BatchId', 'NetPay', 'BankName', 'NeftBankName'
  ];

  batchtypes: any;
  BatchType = '';



  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(private decry: EncryptionService,
    private service: SalaryreleaseprocessService,
    private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  loadbatchType(userid): void {
    this.service.GetBatchTypeList(userid).subscribe({
      next: (res: any) => {
        this.batchtypes = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

    this.loadbatchType(this.userdetail.user_Id);
    this.payPeriodTypefromParent = "All";
  }

  onBatchChange() {
    this.selectedBatchId = '';
    console.log('Selected Batch Id:', this.BatchType);
    this.BindBatchId(this.BatchType)
  }


  BindBatchId(selectedBatchId) {
    this.isLoading = true;
    this.service.GetSRPBatchList(selectedBatchId, this.userdetail.user_Id).subscribe({
      next: (res: any) => {
        this.batchList =
          res?.Data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load Batch Id');
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

  search() {

    if (!this.BatchType) {
      alert('Please Select Batch Type');
      return;
    }

    if (!this.selectedBatchId) {
      alert('Please Select Batch Id');
      return;
    }

    this.isLoading = true;

    this.service.GetSRPBatchData(this.BatchType, this.selectedBatchId, this.userdetail.user_Id)
      .subscribe({

        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 || [];

          if (tableData.length === 0) {
            alert('No data found');
            this.dataSource.data = [];
            this.isLoading = false;
            return;
          }

          this.dataSource = new MatTableDataSource(tableData);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.isLoading = false;
        },

        error: (err) => {

          console.error(err);
          alert('Error while fetching data');

          this.isLoading = false;
        }
      });
  }

  exportToExcel(): void {

    if (!this.selectedBatchId) {
      alert('Please Select Batch Id');
      return;
    }

    this.isLoading = true;

    const payload = {
      batchId: this.selectedBatchId
    };

    this.service.SalaryReleaseExport(payload)
      .subscribe({

        next: (res: any) => {

          this.isLoading = false;

          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || jsonData.length === 0) {
            alert('No data available');
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(
            wb,
            ws,
            'SalaryReleaseProcess'
          );

          const date = new Date().toISOString().split('T')[0];

          const fileName = `SalaryReleaseProcess_${date}.xlsx`;

          XLSX.writeFile(wb, fileName);
        },

        error: (err) => {

          this.isLoading = false;

          console.error(err);

          alert('Export failed');
        }
      });
  }

  onInitiate() {

    if (!this.BatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.selectedBatchId) {
      alert("Please Select Batch Id");
      return;
    }

    const payload = {
      batchType: this.BatchType,
      batchId: this.selectedBatchId,
      userId: this.userdetail.user_Id
    };

    this.isLoading = true;

    this.service.BatchIntitiate(payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const blob = response.body;

        let fileName = this.selectedBatchId + '.rar'; // fallback

        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }

        // 🔥 Download file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        this.selectedBatchId = '';
        this.dataSource.data = [];
        this.BindBatchId(this.BatchType);
        alert('File downloaded successfully!');
      },

      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert('Error while processing');
      }
    });
  }
}
