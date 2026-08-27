import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { finalize } from 'rxjs/operators';
import { IPermHireServiceCharge } from '../../../Repository/customer/IPermhireServiceCharge.service';
import { PermhireservicechargetypeService } from '../../../Service/CUSTOMER/permhireservicechargetype.service';
export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-permhirejobsubcategory',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent],
  templateUrl: './permhirejobsubcategory.component.html',
  styleUrl: './permhirejobsubcategory.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: PermhireservicechargetypeService,
    }
  ]
})
export class PermhirejobsubcategoryComponent {
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
  jobSubCategoryId: number = 0;
  addJobCategory!: FormGroup;
  jobSubCategory: any
  subCategorySearch: any;
  category: any;
  selectedCompany: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: PermhireservicechargetypeService,) { }

  uploadDisplayedColumns: string[] = [
    'action', 'slNo', 'companycode', 'jobCategory', 'jobSubCategory'];


  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editCompany') editCompany!: CompanyallComponent;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompanyEvent2(company) {
    this.selectedCompany = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }


  // bindJobCategory() {
  //   this.service.getJobCategory().subscribe({
  //     next: res => { this.category = res.Data.data?.Table0 }

  //   });
  // }

  bindJobCategory() {
    this.service.getJobCategory().subscribe({
      next: (res) => {
        this.category = res?.Data?.data?.Table0 || [];
        console.log('Job Categories:', this.category);
      },
      error: (err) => {
        console.error('Error loading job categories:', err);
      }
    });
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.bindJobCategory();

  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // addOpen() {
  //   this.isAddclicked = true;
  //   this.isEditMode = false;
  //   this.jobCategory = null;
  //   this.jobSubCategory = '';
  //   this.bindJobCategory();
  // }
  addOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.selectedCompany = null;
    this.selectedCompanyCode = '';

    this.jobCategory = null;
    this.jobSubCategory = '';
    this.jobSubCategoryId = 0;
  }

  closeclick() {
    this.isAddclicked = false;
  }


  onsearch() {
    if (!this.selectedCompanyId) {
      alert("Please select Company code")
      return
    }
    this.showTable = true;
    this.isLoading = true;


    this.service.searchJobSubCategory(this.selectedCompanyId).subscribe({

      next: (res) => {
        this.subCategorySearch = res.Data.data.Table0;
        if (this.subCategorySearch && this.subCategorySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.subCategorySearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'action', 'slNo', 'companycode', 'jobCategory', 'jobSubCategory'];
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
    if (!this.selectedCompanyId) {
      alert("Please select Company code")
      return
    }
    this.isLoading = true;



    this.service.exportJobSubCategory(this.selectedCompanyId).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CompanyPermission');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `JobSubCategory${timestamp}.xlsx`;

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
    if (!this.selectedCompany) {
      alert('Please select company');
      return;
    }

    if (!this.jobCategory) {
      alert('Please select jobcategory');
      return;
    }

    if (!this.jobSubCategory) {
      alert('Please select company');
      return;
    }

    // const payload = {
    //   flag: this.isEditMode ? "Edit" : "Add",
    //   createdBy: this.userdetail.user_Id?.toString(),

    //   Rows: [{
    //     JOB_SUB_Category_ID: 0,
    //     Company_Id: this.selectedCompany,
    //     JOB_Category_ID: this.jobCategory,
    //     JOB_SUB_Category: this.jobSubCategory
    //   }],
    // };
    const payload = {
      flag: this.isEditMode ? "Edit" : "Add",
      createdBy: this.userdetail.user_Id?.toString(),

      Rows: [{
        JOB_SUB_Category_ID: this.isEditMode
          ? this.jobSubCategoryId
          : 0,

        Company_Id: this.selectedCompany,
        JOB_Category_ID: this.jobCategory,
        JOB_SUB_Category: this.jobSubCategory
      }],
    };

    console.log(JSON.stringify(payload));

    this.isLoading = true;

    this.service.createJobSubCategory(payload).pipe(
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

  // openEdit(row: any) {
  //   this.isAddclicked = true;
  //   this.isEditMode = true;
  //   this.jobCategory = row.JOB_Category_Id;
  //   this.jobSubCategory = row.JOB_SUB_Category
  // }
  openEdit(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;

    // Store company information
    this.selectedCompanyId = row.Company_Id;
    this.selectedCompany = row.Company_Id;
    this.selectedCompanyCode = row.Company_Code;

    // Store job category
    this.jobCategory = row.JOB_Category_Id;

    // Store sub category
    this.jobSubCategory = row.JOB_SUB_Category;

    // Store record ID
    this.jobSubCategoryId = row.JOB_SUB_Category_ID;

    // Wait for companyall component to be created
    setTimeout(() => {
      if (this.editCompany) {

        const company = this.editCompany.companyCode.find(
          (x: any) =>
            x.companyId == this.selectedCompanyId ||
            x.companyCode == this.selectedCompanyCode ||
            x.displayName == this.selectedCompanyCode
        );

        if (company) {
          // IMPORTANT: set the object, not the string
          this.editCompany.myControl.setValue(company);

          console.log('Selected company:', company);
        } else {
          console.log('Company not found in companyall list');
        }
      }
    }, 500);
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
        JOB_SUB_Category_ID: row.JOB_SUB_Category_ID,
        Company_Id: this.selectedCompany,
        JOB_Category_ID: Number(row.JOB_Category_Id),
        JOB_SUB_Category: row.JOB_SUB_Category
      }],
    };

    this.service.createJobSubCategory(payload).pipe(
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
