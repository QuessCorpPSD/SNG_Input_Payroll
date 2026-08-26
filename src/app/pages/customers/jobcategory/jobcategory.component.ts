import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs/operators';
import { IPermHireServiceCharge } from '../../../Repository/customer/IPermhireServiceCharge.service';
import { PermhireservicechargetypeService } from '../../../Service/CUSTOMER/permhireservicechargetype.service';
export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-jobcategory',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent],
  templateUrl: './jobcategory.component.html',
  styleUrl: './jobcategory.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: PermhireservicechargetypeService,
    }
  ]
})
export class JobcategoryComponent {
  showTable = false;
  selectedCompanyId!: number;
  userdetail: any;
  jobCategory: any;
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  showForm = false;
  editIndex: number | null = null;
  searchText: string = "";
  selectedCompanyCode: any;
  jobSearch: any;
  jobCategoryId: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: PermhireservicechargetypeService,) { }

  uploadDisplayedColumns: string[] = [
    'action', 'slNo', 'jobCategory'];


  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
  }

  closeclick() {
    this.isAddclicked = false;
  }


  onsearch() {
    this.showTable = true;
    this.isLoading = true;
    const payload = {
      flag: "Search",
      JOB_Category: this.jobCategory
    }

    this.service.searchJobCategory(payload).subscribe({

      next: (res) => {
        this.jobSearch = res.Data.data.Table0;
        if (this.jobSearch && this.jobSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.jobSearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'action', 'slNo', 'jobCategory'];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        alert('Failed to load salary release data');
        this.isLoading = false;
      },
    });
  }


  exportToExcel(): void {
    this.isLoading = true;
    const payload = {
      flag: "Export",
      JOB_Category: this.jobCategory
    }

    this.service.searchJobCategory(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected Job Category.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CompanyPermission');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `JobCategory${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        this.isLoading = false;
      },
    });
  }

  exportToExcelsave(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Result': worksheet },
      SheetNames: ['Result']
    };
    XLSX.writeFile(workbook, 'CompanyPermission_Result.xlsx')
    // const excelBuffer: any = XLSX.write(workbook, {
    //   bookType: 'xlsx',
    //   type: 'array'
    // });

    // const blob: Blob = new Blob([excelBuffer], {
    //   type: 'application/octet-stream'
    // });

    // FileSaver.saveAs(blob, 'CompanyPermission_Result.xlsx');
  }

  onSave() {
    if (!this.jobCategory) {
      alert("Please select Service Type");
      return;
    }

    const payload = {
      flag: this.isEditMode ? "Edit" : "Add",
      createdBy: this.userdetail.user_Id?.toString(),

      Rows: [{
        JOB_Category_ID: this.isEditMode ? this.jobCategoryId : 0,
        JOB_Category: this.jobCategory,
      }]
    };

    console.log(JSON.stringify(payload));

    this.isLoading = true;

    this.service.createJobCategory(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {
        const msg = res?.Data?.response

        if (res.StatusCode === 200) {
          alert(msg);
          this.closeclick(); // close popup after success
          this.onsearch();
          return;
        }

        if (res.StatusCode === 400) {
          alert(res.Message);
          return;
        }

        alert(msg);
      },

      error: err => {
        console.error(err);
      }
    });
  }


  openEdit(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.jobCategory = row.JOB_Category
    this.jobCategoryId = row.JOB_Category_Id
  }



  onDelete(row: any) {

    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    this.isLoading = true;

    const payload = {
      flag: "Delete",
      createdBy: this.userdetail.user_Id?.toString(),
      Rows: [{
        JOB_Category_ID: row.JOB_Category_Id,
        JOB_Category: row.JOB_Category,
      }],
    };

    this.service.createJobCategory(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {
        const msg = res?.Data?.response;
        if (res?.StatusCode === 200) {
          alert(msg);
          this.onsearch();
          return;
        }

        if (res?.StatusCode === 400) {
          alert(res?.Message || msg);
          return;
        }

        alert(msg);
      },

      error: (err) => {
        console.error("Error deleting record:", err);
        alert("Failed to delete record.");
      }
    });
  }


}
