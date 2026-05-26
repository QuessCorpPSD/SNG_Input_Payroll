import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ICompanyPermission } from '../../../Repository/Admin/ICompanyPermission.service';
import { CompanyPermissionService } from '../../../Service/Admin/company-permission.service';
import * as XLSX from 'xlsx';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from "@angular/material/checkbox";
import * as FileSaver from 'file-saver';
export const Pay_Token = new InjectionToken<ICompanyPermission>('Pay_Token');

@Component({
  selector: 'app-companypermission',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule],
  templateUrl: './companypermission.component.html',
  styleUrl: './companypermission.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: CompanyPermissionService,
    }
  ]
})
export class CompanypermissionComponent {

  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  EmployeeId: any;
  BusinessUnitNames: any;
  employee: any;
  BusinessUnit: any;
  companySearch: any;
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  addMenuForm!: FormGroup;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  uploadedDataSourceadd = new MatTableDataSource<any>([]);
  zone: any;
  uploadedDataadd: any[] = [];
  showForm = false;
  editIndex: number | null = null;
  searchText: string = "";

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog, @Inject(Pay_Token) private service: CompanyPermissionService,) { }

  uploadDisplayedColumns: string[] = [
    'action', 'slNo', 'username', 'employeeid', 'companycode', 'companyname', 'businessunitname', 'permissionaccess'];

  companyDisplayedColumns: string[] = [
    'select',
    'companyCode',
    'clientName',
    'zoneName'
  ];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
    this.bindEmployeeId();
    this.addMenuForm = new FormGroup({
      EmployeeId: new FormControl("", Validators.required),
      BusinessUnitName: new FormControl(""),
      ZoneName: new FormControl(""),
    });
    this.addMenuForm.get('BusinessUnitName')?.valueChanges.subscribe(val => {
      if (val) {
        this.onSearchClickadd();
      }
    });
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return Object.values(data).some((value: any) =>
        String(value ?? '')
          .toLowerCase()
          .includes(filterText)
      );
    };
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.editIndex = null;
    this.addMenuForm.reset();
    this.uploadedDataSourceadd.data = [];
    this.addMenuForm.get('EmployeeId')?.enable();
    this.addMenuForm.get('BusinessUnitName')?.enable();
  }

  closeclick() {
    this.isAddclicked = false;
  }

  bindEmployeeId() {
    this.service.bindEmployeeId().subscribe({
      next: res => {
        this.employee = res.Data.data.Table0;
        this.BusinessUnit = res.Data.data.Table1;
        this.zone = res.Data.data.Table2;
      }
    })
  }

  onsearch() {
    if (!this.EmployeeId) {
      alert('Please select Employee Id');
      return;
    }
    this.showTable = true;
    this.isLoading = true;

    const UserId = this.EmployeeId;
    const BusinessUnitId = this.BusinessUnitNames;
    const CompanyPermissionId = 0;

    this.service.search(UserId, BusinessUnitId, CompanyPermissionId).subscribe({

      next: (res) => {
        this.companySearch = res.Data.data.Table0;
        if (this.companySearch && this.companySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.companySearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'action', 'slNo', 'username', 'employeeid', 'companycode', 'companyname', 'businessunitname', 'permissionaccess'];
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

  onSearchClickadd() {

    if (!this.addMenuForm.get('BusinessUnitName')?.value) {
      alert('Please select Business Unit');
      return;
    }

    this.isLoading = true;

    const payload = {
      Businessunitnameid: this.addMenuForm.get('BusinessUnitName')?.value,
      Zone: 0
    };

    console.time('API Call');

    this.service.viewCompanyDetails(payload).subscribe({
      next: res => {
        console.timeEnd('API Call');

        this.isLoading = false;

        this.uploadedDataadd = res?.Data?.data?.Table0 || [];

        // 🔥 recreate datasource (important)
        this.uploadedDataSourceadd = new MatTableDataSource(this.uploadedDataadd);

        if (this.uploadedDataadd.length === 0) {
          alert('No data found');
        }
      },
      error: err => {
        this.isLoading = false;
        console.error("Error fetching data:", err);
        alert('Error fetching data');
      }
    });
  }

  exportToExcel(): void {
    this.isLoading = true;
    const UserId = this.EmployeeId;
    const Businessunitnameid = this.BusinessUnitNames;

    this.service.exportToExcel(UserId, Businessunitnameid).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CompanyPermission');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CompanyPermission_${timestamp}.xlsx`;

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

  isAllSelected(): boolean {
    const data = this.uploadedDataSourceadd.data || [];
    return data.length > 0 && data.every((row: any) => row.selected);
  }

  isSomeSelected(): boolean {
    const data = this.uploadedDataSourceadd.data || [];
    return data.some((row: any) => row.selected) && !this.isAllSelected();
  }
  toggleAll(event: any) {
    const isChecked = event.checked;
    this.uploadedDataSourceadd.data.forEach((row: any) => {
      row.selected = isChecked;
    });
  }
  onRowCheck(row: any, event: any) {
    row.selected = event.checked;
  }
  trackByFn(index: number, item: any) {
    return item.COMPANY_CODE;
  }

  exportToExcelsave(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Result': worksheet },
      SheetNames: ['Result']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    FileSaver.saveAs(blob, 'CompanyPermission_Result.xlsx');
  }
  onSave() {
    if (this.addMenuForm.invalid) {
      this.addMenuForm.markAllAsTouched();
      return;
    }

    const f = this.addMenuForm.value;

    const data = this.uploadedDataSourceadd.data || [];

    data.forEach((row: any) => {
      row.selected = !!row.selected;
    });

    const selectedCompanies = data.filter((row: any) => row.selected);

    if (selectedCompanies.length === 0) {
      alert("Please select at least one company");
      return;
    }

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? "Edit" : "Add",

      CompanyPermissionModel: {
        User_Id: Number(f.EmployeeId),
        Business_Unit_Name_id: Number(f.BusinessUnitName),
        Company_Permission_Id: 0
      },

      CompanyPermissionDetails: selectedCompanies.map((row: any) => ({
        Company_Permission_Details_Id: this.isEditMode ? row.COMPANY_PERMISSION_DETAILS_ID || 0 : 0,
        Company_Permission_Id: this.isEditMode ? row.COMPANY_PERMISSION_ID || 0 : 0,
        Is_Permission: true,
        Company_Id: row.COMPANY_ID || 0,
        Company_Code: row.COMPANY_CODE
      }))
    };

    console.log("📦 Payload:", JSON.stringify(payload));

    this.isLoading = true;

    this.service.addCompanyPermission(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const tableData = res?.Data?.data?.Table0 || [];

        const globalError = res?.Data?.message &&
          res?.Data?.statusCode === "400";

        if (globalError) {

          this.exportToExcelsave([
            {
              Error_Message: res.Data.message
            }
          ]);

          return;
        }

        if (tableData.length > 0) {

          const successCheck = (row: any) =>
            (row.Error_Message || '')
              .toLowerCase()
              .includes('success');

          const successRows = tableData.filter(successCheck);
          const errorRows = tableData.filter((r: any) => !successCheck(r));

          this.exportToExcelsave(tableData);

          if (errorRows.length === 0) {

            if (this.isEditMode) {
              alert("Company Permission Updated Successfully");
            } else {
              alert("Company Permission Created Successfully");
            }

          }

        } else {
          alert("No data returned");
        }

        this.closeclick();
      },
      error: (err) => {
        this.isLoading = false;
        console.error("❌ API ERROR:", err);
        alert("API Error");
      }
    });
  }

  openEdit(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.editIndex = this.uploadedDataSourceadd.data.indexOf(row);

    console.log("✏️ Edit Row:", row);
    this.addMenuForm.get('EmployeeId')?.disable();
    this.addMenuForm.get('BusinessUnitName')?.disable();

    this.addMenuForm.patchValue({
      EmployeeId: row.User_Id,
      BusinessUnitName: row.BUSINESS_UNIT_NAME_ID,
      zone: row.Zone_Id || null
    });

    this.loadEditCompanies(row);
  }

  loadEditCompanies(row: any) {
    const userid = row.User_Id || 0;

    const payload = {
      Userid: userid,
      Businessunitnameid: row.BUSINESS_UNIT_NAME_ID || 0,
      CompanyPermissionId: row.Company_Permission_Id || 0
    };
    this.service.EditDetails(payload).subscribe((res: any) => {

      const apiData = res?.Data?.data?.Table0 || [];

      console.log("📦 Edit API Data:", apiData);

      const selectedIds = apiData

        .map((x: any) => x.COMPANY_ID);
      let tableData = this.uploadedDataSourceadd.data || [];

      tableData.forEach((item: any) => {
        item.selected = selectedIds.includes(item.COMPANY_ID);
      });

      tableData = tableData.sort((a: any, b: any) => {
        return (b.selected ? 1 : 0) - (a.selected ? 1 : 0);
      });


      this.uploadedDataSourceadd.data = [...tableData];
    });
  }

  // loadEditCompanies(row: any) {

  //   const userid = row.User_Id || 0;

  //   const payload = {
  //     Userid: userid,
  //     Businessunitnameid: row.BUSINESS_UNIT_NAME_ID || 0,
  //     CompanyPermissionId: row.Company_Permission_Id || 0
  //   };

  //   this.service.EditDetails(payload).subscribe((res: any) => {

  //     const apiData = res?.Data?.data?.Table0 || [];

  //     console.log("Edit API Data:", apiData);

  //     const selectedIds = apiData.map((x: any) => x.COMPANY_ID);

  //     const updatedData = (this.uploadedDataSourceadd.data || []).map((item: any) => {

  //       return {
  //         ...item,
  //         selected: selectedIds.includes(item.COMPANY_ID)
  //       };
  //     });

  //     // Selected rows first
  //     updatedData.sort((a: any, b: any) => {
  //       return Number(b.selected) - Number(a.selected);
  //     });

  //     // IMPORTANT
  //     this.uploadedDataSourceadd.data = [...updatedData];
  //   });
  // }

  onDelete(row: any) {

    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    this.isLoading = true;

    const payload = {
      createdBy: 3,
      mode: "Delete",

      CompanyPermissionModel: {
        User_Id: row.User_Id,
        Business_Unit_Name_id: row.BUSINESS_UNIT_NAME_ID,
        Company_Permission_Id: row.COMPANY_PERMISSION_ID
      },

      CompanyPermissionDetails: [
        {
          Company_Permission_Details_Id: row.COMPANY_PERMISSION_DETAILS_ID || 0,
          Company_Permission_Id: row.COMPANY_PERMISSION_ID || 0,
          Is_Permission: false,
          Company_Id: row.COMPANY_ID,
          Company_Code: row.COMPANY_CODE
        }
      ]
    };

    this.service.addCompanyPermission(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        const tableData = res?.Data?.data?.Table0 || [];

        const successCheck = (r: any) =>
          (r.Error_Message || '').toLowerCase().includes('success');

        const errorRows = tableData.filter((r: any) => !successCheck(r));

        this.exportToExcelsave(tableData);
        if (errorRows.length === 0) {
          alert("Company Permission Deleted Successfully");
        }

        this.onsearch();

      },

      error: (err) => {
        this.isLoading = false;
        console.error(err);
        alert("Delete Failed");
      }
    });
  }


}
