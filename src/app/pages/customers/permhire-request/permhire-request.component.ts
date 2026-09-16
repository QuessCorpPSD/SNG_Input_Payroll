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
import { StateComponent } from '../../../common/state/state.component';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { CityComponent } from '../../../common/city/city.component';
export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-permhire-request',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatCard, MatCardModule, MatCheckboxModule, CompanyallComponent, StateComponent, MapnameComponent],
  templateUrl: './permhire-request.component.html',
  styleUrl: './permhire-request.component.css',
  providers: [
    {
      provide: Pay_Token, useClass: PermhireservicechargetypeService,
    }
  ]
})
export class PermhireRequestComponent {
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
  selectedMN: any;
  mapnameUI: any;
  selectedCT: any;
  citynameUI: any;
  selectedGroupId!: string;
  jobCategoryList: any[] = [];
  jobSubCategoryList: any[] = [];

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: IPermHireServiceCharge) { }

  uploadDisplayedColumns: string[] = [
    'slNo', 'clientcode', 'clientname', 'location', 'req_id', 'ref_id', 'cand_id', 'cand_name', 'designation', 'doj', 'vertical', 'vh', 'ctc', 'billablectc', 'branchcode', 'invoiceno', 'totalamount', 'approval_status'];
  uploadedData: any[] = []; 

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompanyEvent2(company: any) {
    if (!company) return;

    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

    this.addPermMaster.patchValue({
      COMPANY_ID: company.companyId,
      companyCode: company.companyCode,
      Clientname: company.companyName
    });
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
    this.getJobCategory();
    this.addPermMaster.get('jobCategory')?.valueChanges.subscribe((categoryName: any) => {
      if (categoryName) {
        const selected = this.jobCategoryList.find(x => x.JOB_Category === categoryName);
        if (selected) {
          this.getJobSubCategory(Number(selected.JOB_Category_ID));
        } else {
          this.jobSubCategoryList = [];
          this.addPermMaster.patchValue({ jobSubCategory: '' });
        }
      } else {
        this.jobSubCategoryList = [];
        this.addPermMaster.patchValue({ jobSubCategory: '' });
      }
    });
  }
  getJobCategory() {
    this.service.getJobCategory().subscribe({
      next: (res) => {
        this.jobCategoryList = (res?.Data?.data?.Table0 || [])
          .filter((x: any) => x.JOB_Category_ID !== 0);
      },
      error: (err) => {
        console.error('Error loading Job Category', err);
      }
    });
  }
  getJobSubCategory(jobCategoryId: number) {
    this.service.getJobSubCategory(jobCategoryId).subscribe({
      next: (res) => {
        this.jobSubCategoryList = (res?.Data?.data?.Table0 || [])
          .filter((x: any) => x.JOB_SUB_Category_ID !== 0);
      },
      error: (err) => {
        console.error('Error loading Job Sub Category', err);
        this.jobSubCategoryList = [];
      }
    });
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  closeclick() {
    this.isAddclicked = false;
  }
  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please select company code');
      return;
    }
    this.showTable = true;
    this.isLoading = true;

    this.service.GetPermHireRequestSearch(this.selectedCompanyId).pipe(
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
            'slNo', 'clientcode', 'clientname', 'location', 'req_id', 'ref_id', 'cand_id', 'cand_name', 'designation', 'doj', 'vertical', 'vh', 'ctc', 'billablectc', 'branchcode', 'invoiceno', 'totalamount', 'approval_status'];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }
      },
      error: (err) => {
        console.error('Error loading perm hire request data', err);
        alert('Failed to load perm hire request data');
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
  }
  onSave() {
    const formValue = this.addPermMaster.getRawValue();

    const payload = {
      CreatedBy: String(this.userdetail.user_Id),
      Rows: [
        {
          CLIENT_CODE: formValue.companyCode || null,
          CLIENT_NAME: formValue.Clientname || null,
          MAP_NAME: formValue.location || null,
          REQ_ID: formValue.reqId || null,
          REF_ID: formValue.refId || null,
          CAND_NAME: formValue.candName || null,
          DESIGNATION: formValue.designation || null,
          DOJ: this.formatDateDDMMYYYY(formValue.doj),
          VERTICAL: formValue.vertical || null,
          VH: formValue.VH || null,
          CTC: formValue.Ctc ? String(formValue.Ctc) : null,
          BILLABLE_CTC: formValue.billableCtc ? String(formValue.billableCtc) : null,
          CONTRACT_TYPE: formValue.contractType || null,
          BRANCH_CODE: formValue.branchCode || null,
          INVOICE_NO: formValue.invoiceNo || null,
          TOT_INVOICE_AMOUNT: formValue.totalAmount ? String(formValue.totalAmount) : null,
          GST_NO: formValue.gstNo || null,
          Status: formValue.status || null,
          City: formValue.city || null,
          DOB: this.formatDateDDMMYYYY(formValue.dob),
          Gender: formValue.gender || null,
          MOBILE_NUMBER: formValue.mobileNo || null,
          DEPARTMENT: formValue.DEPARTMENT || null,
          JOB_CATEGORY: formValue.jobCategory || null,
          JOB_SUB_CATEGORY: formValue.jobSubCategory || null,
          PLACEMENT_TYPE: formValue.placmenttype || null,
          YEAR_EXPERIENCE: formValue.yaerExperience ? String(formValue.yaerExperience) : null,
          JOINING_DAYS: formValue.joiningdays ? Number(formValue.joiningdays) : 0,
          JOBCode: formValue.jobcode || null,
          Consultant: formValue.consultant || null,
          Offer_Approval_Raised_by_Recruiter: formValue.offerApproval || null,
          Requested_on: this.formatDateDDMMYYYY(formValue.requestedOn),
          Recruiters_Employee_ID: formValue.recruiterEmployeeId || null,
          EntityID: formValue.entityId || null,
          Organisation_Head: formValue.organisationHead || null,
          UPDATED_DATE: this.formatDateDDMMYYYY(formValue.updatedDate),
          Input_Number: formValue.inputNo ? Number(formValue.inputNo) : 0,
          IS_PO_Applicable: formValue.isPoApllicable === 'YES',
          PO_NUMBER: formValue.poNumber || null
        }
      ]
    };
    this.isLoading = true;
    this.service.PermHireRequest(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        this.isAddclicked = false;
        this.onsearch();
        alert(response?.Data?.response || 'Saved successfully.');
      },
      error: (error) => {
        console.error('Save failed', error);
        alert('Failed to save.');
      }
    });
  }
  private formatDateDDMMYYYY(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      return value;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  openAdd() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.addPermMaster.enable();
    this.addPermMaster.reset();
    this.addPermMaster.patchValue({
      ID: 0
    });
  }

  handleStateEvent(state: any) {
    if (!state) return;

    this.addPermMaster.patchValue({
      state: state.state_Name
    });
  }

  handleMapNameEvent(mapName: any) {
    this.selectedMN = mapName.mapName;
    this.mapnameUI = mapName;

    if (!mapName) return;

    this.addPermMaster.patchValue({
      location: mapName.mapName
    });
  }
}
