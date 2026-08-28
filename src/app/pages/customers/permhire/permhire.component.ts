import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
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
import { IPermHireServiceCharge } from '../../../Repository/customer/IPermhireServiceCharge.service';
import { PermhireservicechargetypeService } from '../../../Service/CUSTOMER/permhireservicechargetype.service';
import { finalize } from 'rxjs';
import { json } from 'stream/consumers';
export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-permhire',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent],
  templateUrl: './permhire.component.html',
  styleUrl: './permhire.component.css',
  providers: [
    {
      provide: Pay_Token, useClass: PermhireservicechargetypeService,
    }
  ]
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
  selectedStatus: string = '';
  permHiresearch: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: IPermHireServiceCharge) { }

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
      ID: new FormControl(''),
      COMPANY_ID: new FormControl(''),
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
      approvalStatusView: new FormControl(''),
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
      applicantId: new FormControl(''),
      DEPARTMENT: new FormControl('')

    })
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  closeclick() {
    this.isAddclicked = false;
  }
  onsearch() {

    this.showTable = true;
    this.isLoading = true;
    const payload = {
      companyId: this.selectedCompanyId ?? 0,
      status: this.selectedStatus ?? "",
      mode: "Search",
    }

    this.service.GetPermHireMasterSearch(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.permHiresearch = res.Data?.data?.Table0;
        if (this.permHiresearch && this.permHiresearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.permHiresearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'action', 'slNo', 'clientcode', 'clientname', 'location', 'req_id', 'ref_id', 'cand_id', 'cand_name', 'designation', 'doj', 'vertical', 'vh', 'ctc', 'billablectc', 'branchcode', 'invoiceno', 'invoicestate', 'totalamount', 'approval_status'];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }

      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        alert('Failed to load salary release data');
      },
    });
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

    this.addPermMaster.patchValue({
      ID: row.ID ?? '',
      COMPANY_ID: row.COMPANY_ID ?? '',
      companyCode: row.CLIENT_CODE ?? '',
      VH: row.VH ?? '',
      PAN: row.PAN ?? '',
      Clientname: row.CLIENT_NAME ?? '',
      Ctc: row.CTC ?? '',
      aadhar: row.AADHAR ?? '',
      Clientemployeecode: row.Client_employee_code ?? '',
      billableCtc: row.BILLABLE_CTC ?? '',
      mobileNo: row.MOBILE_NUMBER ?? '',
      reqId: row.REQ_ID ?? '',
      contractType: row.CONTRACT_TYPE ?? '',
      state: row.STATE ?? '',
      refId: row.REF_ID ?? '',
      branchCode: row.BRANCH_CODE ?? '',
      jobCategory: row.JOB_CATEGORY ?? '',
      CandId: row.CAND_ID ?? '',
      invoiceNo: row.INVOICE_NO ?? '',
      jobSubCategory: row.JOB_SUB_CATEGORY ?? '',
      candName: row.CAND_NAME ?? '',
      totalAmount: row.TOT_INVOICE_AMOUNT ?? '',
      placmenttype: row.PLACEMENT_TYPE ?? '',
      designation: row.DESIGNATION ?? '',
      invoiceState: row.INVOICE_STATE ?? '',
      yaerExperience: row.YEAR_EXPERIENCE ?? '',
      doj: row.DOJ ?? '',
      gstNo: row.GST_NO ?? '',
      approveBy: row.Approved_Rejected_ByName ?? '',
      vertical: row.VERTICAL ?? '',
      status: row.STATUS ?? '',
      approveRemarks: row.Approved_Rejected_Remarks ?? '',
      joiningdays: row.JOINING_DAYS ?? '',
      city: row.CITY ?? '',
      approvalStatus: row.Approval_Status ?? '',
      approvalStatusView: row.Approval_Status ?? '',
      gender: row.GENDER ?? '',
      dob: row.DOB ?? '',
      offerApproval: row.Offer_Approval_Raised_by_Recruiter ?? '',
      jobcode: row.JOBCode ?? '',
      consultant: row.Consultant ?? '',
      entityId: row.EntityID ?? '',
      requestedOn: row.Requested_on ?? '',
      recruiterEmployeeId: row.Recruiters_Employee_ID ?? '',
      inputNo: row.Input_Number ?? '',
      isPoApllicable: row.IS_PO_Applicable ?? '',
      updatedDate: row.UPDATED_DATE ?? '',
      organisationHead: row.Organisation_Head ?? '',
      location: row.LOCATION ?? '',
      poNumber: row.PO_NUMBER ?? '',
      costCenter: row.COST_CENTRE ?? '',
      businessUnit: row.BUSINESS_UNIT ?? '',
      HiringManager: row.HIRING_MANAGER ?? '',
      bandGradelevel: row.BAND_GRADE_LEVEL ?? '',
      personalNo: row.PERSONAL_NUMBER ?? '',
      ranumber: row.RCCODE_RANUMBER ?? '',
      applicantId: row.APPLICANT_ID ?? '',
      DEPARTMENT: row.DEPARTMENT ?? ''
    });

    this.addPermMaster.disable();
    this.addPermMaster.get('approvalStatus')?.enable();
    this.addPermMaster.get('approveRemarks')?.enable();
  }

  onUpdate() {
    const formValue = this.addPermMaster.getRawValue();

    const payload = {
      CreatedBy: String(this.userdetail.user_Id),
      Rows: [
        {
          Id: formValue.ID || 0,
          Company_Id: String(formValue.COMPANY_ID) || null,
          LOCATION: String(formValue.location) || null,
          REQ_ID: String(formValue.reqId) || null,
          REF_ID: String(formValue.refId) || null,
          CAND_ID: String(formValue.CandId) || null,
          CAND_NAME: String(formValue.candName) || null,
          DESIGNATION: String(formValue.designation) || null,
          DOJ: String(formValue.doj) || null,
          VERTICAL: String(formValue.vertical) || null,
          VH: String(formValue.VH) || null,
          CTC: String(formValue.Ctc) || null,
          BILLABLE_CTC: String(formValue.billableCtc) || null,
          CONTRACT_TYPE: String(formValue.contractType) || null,
          BRANCH_CODE: String(formValue.branchCode) || null,
          INVOICE_NO: String(formValue.invoiceNo) || null,
          INVOICE_STATE: String(formValue.invoiceState) || null,
          TOT_INVOICE_AMOUNT: String(formValue.totalAmount) || null,
          GST_NO: String(formValue.gstNo) || null,
          STATUS: String(formValue.status) || null,
          CITY: String(formValue.city) || null,
          DOB: String(formValue.dob) || null,
          GENDER: String(formValue.gender) || null,
          PAN: String(formValue.PAN) || null,
          AADHAR: String(formValue.aadhar) || null,
          MOBILE_NUMBER: String(formValue.mobileNo) || null,
          STATE: String(formValue.state) || null,
          JOB_CATEGORY: String(formValue.jobCategory) || null,
          JOB_SUB_CATEGORY: String(formValue.jobSubCategory) || null,
          PLACEMENT_TYPE: String(formValue.placmenttype) || null,
          YEAR_EXPERIENCE: String(formValue.yaerExperience) || null,
          JOINING_DAYS: String(formValue.joiningdays) || null,
          Approved_Rejected_ByName: String(formValue.approveBy) || null,
          Approved_Rejected_Remarks: String(formValue.approveRemarks) || null,
          Approval_Status: String(formValue.approvalStatus) || null,
          JOBCode: String(formValue.jobcode) || null,
          Consultant: String(formValue.consultant) || null,
          Offer_Approval_Raised_by_Recruiter: String(formValue.offerApproval) || null,
          Requested_on: String(formValue.requestedOn) || null,
          Recruiters_Employee_ID: String(formValue.recruiterEmployeeId) || null,
          EntityID: String(formValue.entityId) || null,
          Organisation_Head: String(formValue.organisationHead) || null,
          UPDATED_DATE: String(formValue.updatedDate) || null,
          Input_Number: String(formValue.inputNo) || null,
          IS_PO_Applicable: String(formValue.isPoApllicable) || null,
          PO_NUMBER: String(formValue.poNumber) || null
        }
      ]
    };
    this.isLoading = true;
    this.service.PermHireMasterApproveReject(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        if (response?.Data?.response === 'Failed to Save.') {

          // errors[0] contains JSON string
          const errorJson = response?.Data?.errors?.[0];

          if (errorJson) {
            try {
              const errorData = JSON.parse(errorJson);

              this.downloadFailedRecordsExcel(errorData);

            } catch (error) {
              console.error('Error parsing failed records:', error);
              alert('Failed to save. Unable to generate Excel file.');
            }
          } else {
            alert('Failed to save.');
          }
          return;
        }
        else {
          this.isAddclicked = false;
          this.onsearch();
          alert(response?.Data?.response || 'Saved successfully.');
        }
      },
      error: (error) => {
        console.error('Save failed', error);
      }
    });
  }

  downloadFailedRecordsExcel(data: any[]): void {

    if (!data || data.length === 0) {
      alert('No failed records available for download.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    const workbook: XLSX.WorkBook = {
      Sheets: {
        'Message': worksheet
      },
      SheetNames: ['Message']
    };

    XLSX.writeFile(workbook, 'FermHire_Validation.xlsx');
  }

}
