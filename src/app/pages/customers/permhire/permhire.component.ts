import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-permhire',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent],
  templateUrl: './permhire.component.html',
  styleUrl: './permhire.component.css'
})
export class PermhireComponent {
  showTable = false;
  selectedCompanyId!: number;
  payPeriodType!: string;
  userdetail: any;
  EmployeeId: any;
  BusinessUnitNames: any;
  employee: any;
  BusinessUnit: any;
  companySearch: any;
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  addPermMaster!: FormGroup;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  showForm = false;
  editIndex: number | null = null;
  searchText: string = "";
  selectedCompanyCode: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  uploadDisplayedColumns: string[] = [
    'action', 'slNo', 'clientcode', 'clientname', 'location', 'req_id', 'ref_id', 'cand_id', 'cand_name', 'designation', 'doj', 'vertical', 'vh', 'ctc', 'billablectc', 'branchcode', 'invoiceno', 'invoicestate', 'totalamount', 'approval_status'];


  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompanyEvent2(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.addPermMaster = new FormGroup({
      companyCode: new FormControl(''),
      VH: new FormControl(''),
      PAN: new FormControl(''),
      Clientname: new FormControl(''),
      Ctc: new FormControl(''),
      aadhar: new FormControl(''),
      Clientemployeecode: new FormControl(''),
      billableCtc: new FormControl(''),
      mobileNo: new FormControl(''),
      reqId: new FormControl(''),
      contractType: new FormControl(''),
      state: new FormControl(''),
      refId: new FormControl(''),
      branchCode: new FormControl(''),
      jobCategory: new FormControl(''),
      CandId: new FormControl(''),
      invoiceNo: new FormControl(''),
      jobSubCategory: new FormControl(''),
      candName: new FormControl(''),
      totalAmount: new FormControl(''),
      placmenttype: new FormControl(''),
      designation: new FormControl(''),
      invoiceState: new FormControl(''),
      yaerExperience: new FormControl(''),
      doj: new FormControl(''),
      gstNo: new FormControl(''),
      approveBy: new FormControl(''),
      vertical: new FormControl(''),
      status: new FormControl(''),
      approveRemarks: new FormControl(''),
      joiningdays: new FormControl(''),
      city: new FormControl(''),
      approvalStatus: new FormControl(''),
      gender: new FormControl(''),
      dob: new FormControl(''),
      offerApproval: new FormControl(''),
      jobcode: new FormControl(''),
      consultant: new FormControl(''),
      entityId: new FormControl(''),
      requestedOn: new FormControl(''),
      recruiterEmployeeId: new FormControl(''),
      inputNo: new FormControl(''),
      isPoApllicable: new FormControl(''),
      updatedDate: new FormControl(''),
      organisationHead: new FormControl(''),
      location: new FormControl(''),
      poNumber: new FormControl(''),
      costCenter: new FormControl(''),
      businessUnit: new FormControl(''),
      HiringManager: new FormControl(''),
      bandGradelevel: new FormControl(''),
      personalNo: new FormControl(''),
      ranumber: new FormControl(''),
      applicantId: new FormControl('')

    })
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.addPermMaster.reset();
  }

  closeclick() {
    this.isAddclicked = false;
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

    // this.service.search(UserId, BusinessUnitId, CompanyPermissionId).subscribe({

    //   next: (res) => {
    //     this.companySearch = res.Data.data.Table0;
    //     if (this.companySearch && this.companySearch.length > 0) {
    //       this.dataSource = new MatTableDataSource(this.companySearch);
    //       this.dataSource.paginator = this.paginator;
    //       this.uploadDisplayedColumns = [
    //         'action', 'slNo', 'username', 'employeeid', 'companycode', 'companyname', 'businessunitname', 'permissionaccess'];
    //     } else {
    //       this.dataSource.data = [];
    //       alert('No data found');
    //     }
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error loading salary release data', err);
    //     alert('Failed to load salary release data');
    //     this.isLoading = false;
    //   },
    // });
  }


  // exportToExcel(): void {
  //   this.isLoading = true;
  //   const UserId = this.EmployeeId;
  //   const Businessunitnameid = this.BusinessUnitNames;

  //   this.service.exportToExcel(UserId, Businessunitnameid).subscribe({
  //     next: (res) => {
  //       try {

  //         const jsonData = res?.Data?.data?.Table0;

  //         //  Check if Data is not an array or empty
  //         if (!Array.isArray(jsonData) || jsonData.length === 0) {
  //           alert('No data available for the selected company and pay period.');
  //           this.isLoading = false;
  //           return;
  //         }

  //         // Create Excel file
  //         const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  //         const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //         XLSX.utils.book_append_sheet(wb, ws, 'CompanyPermission');

  //         const timestamp = new Date().toISOString().split('T')[0];
  //         const fileName = `CompanyPermission_${timestamp}.xlsx`;

  //         XLSX.writeFile(wb, fileName);
  //         this.isLoading = false;
  //       } catch (err) {
  //         console.error('Error exporting to Excel:', err);
  //         alert('An error occurred while exporting data.');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading data for export', err);
  //       alert('Failed to load data from server.');
  //       this.isLoading = false;
  //     },
  //   });
  // }

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

  // onSave() {
  //   if (this.addPermMaster.invalid) {
  //     this.addPermMaster.markAllAsTouched();
  //     return;
  //   }

  //   const f = this.addPermMaster.value;

  //   const data = this.uploadedDataSourceadd.data || [];
  //   console.log("data", data)

  //   data.forEach((row: any) => {
  //     row.selected = !!row.selected;
  //   });

  //   const selectedCompanies = data.filter((row: any) => row.selected);

  //   if (selectedCompanies.length === 0) {
  //     alert("Please select at least one company");
  //     return;
  //   }

  //   console.log(selectedCompanies)


  //   var Company_Permission_Id = this.getCompanyPermissionId(selectedCompanies);

  //   var datas = selectedCompanies.map((row: any) => ({
  //     Company_Permission_Details_Id: this.isEditMode ? row.COMPANY_PERMISSION_DETAILS_ID ?? 0 : 0,
  //     Company_Permission_Id: this.isEditMode ? row.COMPANY_PERMISSION_ID ?? Company_Permission_Id : 0,
  //     Is_Permission: true,
  //     Company_Id: row.COMPANY_ID || 0,
  //     Company_Code: row.COMPANY_CODE,
  //   }))

  //   console.log(datas)

  //   const payload = {
  //     createdBy: this.userdetail.user_Id,
  //     mode: this.isEditMode ? "Edit" : "Add",

  //     CompanyPermissionModel: {
  //       User_Id: Number(f.EmployeeId),
  //       Business_Unit_Name_id: Number(f.BusinessUnitName),
  //       Company_Permission_Id: 0
  //     },
  //     CompanyPermissionDetails: datas
  //   };
  //   console.log(JSON.stringify(payload))

  //   this.isLoading = true;

  //   this.service.addCompanyPermission(payload).subscribe({
  //     next: (res: any) => {
  //       this.isLoading = false;

  //       const tableData = res?.Data?.data?.Table0 || [];

  //       const globalError = res?.Data?.message &&
  //         res?.Data?.statusCode === "400";

  //       if (globalError) {

  //         this.exportToExcelsave([
  //           {
  //             Error_Message: res.Data.message
  //           }
  //         ]);

  //         return;
  //       }

  //       if (tableData.length > 0) {

  //         const successCheck = (row: any) =>
  //           (row.Error_Message || '')
  //             .toLowerCase()
  //             .includes('success');

  //         const successRows = tableData.filter(successCheck);
  //         const errorRows = tableData.filter((r: any) => !successCheck(r));

  //         this.exportToExcelsave(tableData);
  //         this.onsearch();

  //         if (errorRows.length === 0) {

  //           if (this.isEditMode) {
  //             alert("Company Permission Updated Successfully");
  //           } else {
  //             alert("Company Permission Created Successfully");
  //           }

  //         }

  //       } else {
  //         alert("No data returned");
  //       }

  //       this.closeclick();
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.error("❌ API ERROR:", err);
  //       alert("API Error");
  //     }
  //   });
  // }

  openEdit(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;

    // this.addPermMaster.get('EmployeeId')?.disable();
    // this.addPermMaster.get('BusinessUnitName')?.disable();

    // this.addPermMaster.patchValue({
    //   EmployeeId: row.User_Id,
    //   BusinessUnitName: row.BUSINESS_UNIT_NAME_ID,
    //   zone: row.Zone_Id || null
    // });
  }


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

    // this.service.addCompanyPermission(payload).subscribe({
    //   next: (res: any) => {

    //     this.isLoading = false;

    //     const tableData = res?.Data?.data?.Table0 || [];

    //     const successCheck = (r: any) =>
    //       (r.Error_Message || '').toLowerCase().includes('success');

    //     const errorRows = tableData.filter((r: any) => !successCheck(r));

    //     this.exportToExcelsave(tableData);
    //     if (errorRows.length === 0) {
    //       alert("Company Permission Deleted Successfully");
    //     }

    //     this.onsearch();

    //   },

    //   error: (err) => {
    //     this.isLoading = false;
    //     console.error(err);
    //     alert("Delete Failed");
    //   }
    // });
  }



}
