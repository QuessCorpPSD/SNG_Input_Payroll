import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Payperiodclass } from '../../../Models/Common';
import { CompanyPermissionService } from '../../../Service/Admin/company-permission.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ICompanyPermission } from '../../../Repository/Admin/ICompanyPermission.service';
import { IUserManagement } from '../../../Repository/Admin/IUserManagement.service';
import { UserCreationService } from '../../../Service/Admin/user-creation.service';
import { finalize } from 'rxjs/operators';
export const Pay_Token = new InjectionToken<IUserManagement>('Pay_Token');

@Component({
  selector: 'app-usercreation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule],
  templateUrl: './usercreation.component.html',
  styleUrl: './usercreation.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: UserCreationService,
    }
  ]
})
export class UsercreationComponent {
  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  employee: any;
  BusinessUnit: any;
  companySearch: any;
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  addUserForm!: FormGroup;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  showForm = false;
  editIndex: number | null = null;
  UserName: string = "";
  Role: any;
  roles: any;
  accesstypes: any;
  reportingto: any;
  inactive: any;
  searchText: string = '';
  selectedUserId: any;
  password: any;
  search: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog, @Inject(Pay_Token) private service: UserCreationService,) { }

  uploadDisplayedColumns: string[] = [
    'action', 'slNo', 'name', 'employeeid', 'emailid', 'reportingto', 'roles', 'activeStatus', 'pendingStatus', 'approverRemarks'];

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
    this.bindRoles();
    this.bindreportingto();
    this.bindaccesstype();
    this.addUserForm = new FormGroup({
      Name: new FormControl(""),
      EmpNo: new FormControl(""),
      email: new FormControl(""),
      ReportingTo: new FormControl(""),
      Roles: new FormControl(""),
      AccessType: new FormControl(""),
      IsActive: new FormControl(""),
      IsPending: new FormControl(""),
      ApproverRemarks: new FormControl(""),
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

  addOpen() {
    this.isAddclicked = true;
    this.bindRoles();
    this.isEditMode = false;
    this.editIndex = null;
    this.addUserForm.reset();

  }

  closeclick() {
    this.isAddclicked = false;
  }

  bindRoles() {
    this.service.bindRoles().subscribe({
      next: res => {
        this.roles = res.Data.data.Table0;
      }
    })
  }

  bindreportingto() {
    this.isLoading = true;
    this.service.bindReportingTo().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {
        this.reportingto = res?.Data?.data?.Table0 || [];
      },
    })
  }

  bindaccesstype() {
    this.isLoading = true;
    this.service.bindAccessType().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {
        this.accesstypes = res?.Data?.data?.Table0 || [];
      },
    })
  }

  onsearch() {
    this.showTable = true;
    this.isLoading = true;
    const IsCheck = 1;
    const payload = {
      UserId: 0,
      UserName: String(this.UserName?.trim()) || "",
      RoleId: this.Role ? Number(this.Role) || 0 : 0,
      IsCheck: this.inactive ? 1 : 0 || 1
    };
    this.service.Search(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.search = res.Data.data.Table0;
        console.log(this.search);
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'action', 'slNo', 'name', 'employeeid', 'emailid', 'reportingto', 'roles', 'activeStatus', 'pendingStatus', 'approverRemarks'];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        this.isLoading = false;
        alert('Failed to load salary release data');
      },
    });
  }
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.uploadedDataSource.filter = filterValue;
  }

  selectRow(row: any) {

    this.selectedUserId = row.User_Id;

    console.log("Selected User ID:", this.selectedUserId);
  }

  exportToExcel() {
    this.isLoading = true;

    const payload = {
      UserId: 0,
      UserName: String(this.UserName.trim()) || null,
      RoleId: this.Role ? Number(this.Role) || 0 : 0,
      IsCheck: this.inactive ? 1 : 0
    };

    this.service.Search(payload).subscribe({
      next: res => {
        this.isLoading = false;

        const data = res?.Data?.data?.Table0 || [];

        if (!data || data.length === 0) {
          alert('No data found for export');
          return;
        }

        this.exportDataToExcel(data);
      },
      error: err => {
        this.isLoading = false;
        console.error("Export error:", err);
        alert('Error exporting data');
      }
    });
  }

  exportDataToExcel(data: any[]) {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'Users': worksheet }, SheetNames: ['Users'] };

      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      this.saveFile(excelBuffer);
    });
  }
  saveFile(buffer: any) {
    import('file-saver').then(FileSaver => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });

      FileSaver.saveAs(blob, `User_Report_${new Date().getTime()}.xlsx`);
    });
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

  openEdit(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.editIndex = row['Id'] || null;
    this.selectedUserId = row['User_Id'];
    this.password = row['Password'];
    this.addUserForm.patchValue({
      Name: row['UserName'] || '',
      EmpNo: row['EmployeeID'] || '',
      email: row['Mail_Id'] || '',
      ReportingTo: row['Reporting_ToId'],
      Roles: row['Role_Id'] || '',
      AccessType: row['Access_Type_Id'] || 'Standard',
      IsActive: row['IsActive'] === true ? '1' : '0',
      IsPending: row['Is_Pending'] === true ? '1' : '0',
      ApproverRemarks: row['Approver_Remarks'] || ''
    });
    this.addUserForm.get('Name')?.disable();
    this.addUserForm.get('EmpNo')?.disable();
    this.addUserForm.get('email')?.disable();
    this.addUserForm.get('Roles')?.disable();
  }
  onSave() {
    if (this.addUserForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const form = this.addUserForm.getRawValue();

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? "Edit" : "Add",
      UserDetails: {
        User_Id: this.isEditMode ? this.selectedUserId : 0,
        Name: form.Name || '',
        Password: this.isEditMode ? this.password : '',
        Salt: '',
        Mail_Id: form.email || '',
        Reporting_To: form.ReportingTo ? Number(form.ReportingTo) : '',
        Role_Id: form.Roles ? Number(form.Roles) : '',
        Access_Type_Id: form.AccessType ? Number(form.AccessType) : '',
        EmployeeID: form.EmpNo ? Number(form.EmpNo) : '',
        IsActive: form.IsActive ? Number(form.IsActive) : 0,
      }
    };

    console.log("Payload:", payload);
    console.log("Mode:", JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.message || "";
        const code = res?.Data?.statusCode;

        if ((res?.Data?.statusCode === 200 && msg) || code === "400") {
          alert(msg);
          this.closeclick();
          this.onsearch();

        } else {
          console.warn("⚠️ Success condition FAILED");
          alert("Save failed");
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("API ERROR:", err);
        alert("API Error");
      }
    });
  }

  onDelete(row: any) {

    if (confirm('Are you sure you want to delete this user?')) {
      const payload = {
        createdBy: this.userdetail.user_Id,
        mode: "Delete",
        UserDetails: {
          User_Id: row['User_Id'],
          Name: row['Name'] || '',
          Password: row['Password'] || '',
          Salt: '',
          Mail_Id: row['Mail_Id'] || '',
          Reporting_To: row['Reporting_ToId'] || '',
          Role_Id: row['Role_Id'] || '',
          Access_Type_Id: row['Access_Type_Id'] || '',
          EmployeeID: row['EmployeeID'] || '',
          IsActive: 0,
        }
      };
      this.service.CreateupdateDelete(payload).subscribe({
        next: (res: any) => {
          const msg = res?.Data?.message || "";
          const code = res?.Data?.statusCode;
          if ((res?.Data?.statusCode === 200) || code === "400") {
            alert(msg || "User deleted");
            this.onsearch();
          }
          else {
            console.warn("⚠️ Delete condition FAILED");
            alert("Delete failed");
          }
        },
        error: (err) => {
          console.error("❌ API ERROR:", err);
          alert("API Error");
        }
      });
    }
  }

  unLock() {
    // Check search data available
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      alert("Please search user first.");
      return;
    }

    if (!this.selectedUserId) {
      alert("Please select one user to unlock.");
      return;
    }

    // Find selected row
    const row = this.dataSource.data.find(
      (x: any) => x.User_Id === this.selectedUserId
    );

    if (!row) {
      alert("Selected row not found.");
      return;
    }

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "UnLockUser",
      UserDetails: {
        User_Id: row.User_Id,
        Name: row.Name || '',
        Password: row.Password || '',
        Salt: '',
        Mail_Id: row.Mail_Id || '',
        Reporting_To: row.Reporting_ToId || '',
        Role_Id: row.Role_Id || '',
        Access_Type_Id: row.Access_Type_Id || '',
        EmployeeID: row.EmployeeID || '',
        IsActive: 0,
      }
    };

    console.log("Payload:", payload);
    console.log("Mode:", JSON.stringify(payload));

    this.service.UnLockUser(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.data?.Table0[0]?.Error_Message || "";
        const code = res?.Data?.statusCode;

        if ((res?.Data?.statusCode === 200) || code === "400") {
          alert(msg);
          this.closeclick();
          this.onsearch();
          this.selectedUserId = null;

        } else {
          console.warn("⚠️ Success condition FAILED");
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("API ERROR:", err);
        alert("API Error");
      }
    });
  }

}
