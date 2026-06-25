import { Component, EventEmitter, Inject, InjectionToken, Output, ViewChild } from '@angular/core';
import { InputaggregatoronboardingComponent } from '../inputaggregatoronboarding/inputaggregatoronboarding.component';
import { MatCardModule } from '@angular/material/card';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { CompanyComponent } from "../../../common/company/company.component";
import { OnboardingStateService } from '../../../onboarding-state.service';
import { Company, Groupnameclass } from '../../../Models/Common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeavetypemasterService } from '../../../Service/leavetypemaster.service';
import { finalize } from 'rxjs';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ILeaveMaster } from '../../../Repository/ILeavemaster';
import * as XLSX from 'xlsx';
import { CommonModule, NgIf } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { OnboardingComponent } from '../../PayrollInput/onboarding/onboarding.component';

export const Pay_TOKEN = new InjectionToken<ILeaveMaster>('Pay_TOKEN');

@Component({
  selector: 'app-leave-master-mapping',
  standalone: true,
  imports: [CommonModule, InputaggregatoronboardingComponent, MatCardModule, GroupnameComponent, CompanyComponent, MatPaginatorModule, MatIconModule, MatTooltipModule, MatTableModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './leave-master-mapping.component.html',
  styleUrl: './leave-master-mapping.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LeavetypemasterService,
    }
  ]
})
export class LeaveMasterMappingComponent {
  // @Output() companyUI = new EventEmitter<Company>();
  // @Output() sitenameUI = new EventEmitter<Groupnameclass>();

  showreportPopup: boolean = false;
  attributeMappings: any;
  showAddPopup = false;
  attendanceType: any;
  selectedLeaveId: any;
  selectedTreatTypeId: any = '';
  selectedleavepolicy: any = '';
  company: any;
  companies: any[] = [];
  bufferDay = '';
  leaveTypes: any[] = [];
  leaveTreatTypes: any[] = [];
  leaveType: string = '';
  isActive: any = '';
  LEAVETYPES: any[] = [];
  userdetail: any;
  QuessLEAVETYPES: any[] = [];
  selectedCompanyIdmain: any;
  selectedCompanyCodemain: any;
  isshowtable: boolean = false;
  isLoading: boolean = false;
  isEditMode: boolean = false;
  leavemappingid: any;
  companyUI: any;
  siteNameUI: any;
  searchText = '';
  dataSource = new MatTableDataSource<any>([])
  displayedColumns: string[] = ['delete', 'companycode', 'groupname', 'attendancetype', 'leaveType', 'leavetreattype', 'leavepolicy'];

  @ViewChild(CompanyallComponent) companyAll!: CompanyallComponent;
  @ViewChild(OnboardingComponent) onboarding!: OnboardingComponent;
  @ViewChild('paginator') paginator!: MatPaginator;
  leavepolicy: any[] = [];
  selectedGroup: any;
  constructor(@Inject(Pay_TOKEN) private service: ILeaveMaster, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }
  openAddPopup() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.showAddPopup = true;
    this.isEditMode = false;
    this.company = '';
    this.attendanceType = '';
    this.selectedLeaveId = '';
    this.selectedTreatTypeId = '';
  }

  edit(mapping) {
    this.showAddPopup = true;
    this.isEditMode = true;
    this.company = mapping.companycode;
    this.attendanceType = mapping.attendancetypeid;
    this.selectedLeaveId = mapping.leaveTypeid;
    this.selectedTreatTypeId = mapping.leavetreattypeid;
    this.leavemappingid = mapping.leavetypemappingid;
    this.isActive = mapping.isactive ? 1 : 0
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }



  trackByIndex(index: number, item: any) {
    return index;
  }


  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindLeavetype();
    this.BindquessLeavetype();
    this.BindLeavePolicy();
    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const filterText = filter.trim().toLowerCase();

      return Object.values(data).some((value: any) =>
        String(value ?? '')
          .toLowerCase()
          .includes(filterText)
      );
    };
    if (!this.siteNameUI) {
      this.siteNameUI = {
        siteCode: '0',
        siteName: 'All'
      };
    }
  }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedGroup = null;
  }

  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    console.log("Site Enter");
    this.siteNameUI = site;

    console.log('Site', this.siteNameUI);
  }

  BindLeavetype() {
    this.service.getLeavetypes().subscribe({
      next: res => {
        this.LEAVETYPES = res.Data.data.Table0;
      }
    });
  };

  BindquessLeavetype() {
    this.service.getquessmaster().subscribe({
      next: res => {
        this.QuessLEAVETYPES = res.Data.data.Table0;
      }
    });
  };


  BindLeavePolicy() {
    this.service.GetLeavePolicy().subscribe({
      next: res => {
        this.leavepolicy = res.Data.data.Table0;
      }
    });
  };


  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    // Reset to first page if paginator exists
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }
    this.isLoading = true;
    this.service.Searchleavetypemapping(this.companyUI.companyId, this.siteNameUI.siteCode, 'Export')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
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
            const fileName = `Leavemaster_mapping_${timestamp}.xlsx`;
            XLSX.writeFile(wb, fileName);
          } catch (err) {
            console.error('Error exporting to Excel:', err);
            this.isLoading = false;
          }
        },
        error: (err: any) => {
          console.error('Error loading data for export', err);
          this.isLoading = false;
        },
      });
  }

  handleSearch() {
    if (!this.companyUI) {
      alert("Please Select Company");
      this.leaveTypes = [];
      this.dataSource.data = []
      return;
    }

    this.isshowtable = true;
    this.isLoading = true;
    console.log("sitecode", this.siteNameUI.siteCode)
    console.log("company", this.companyUI.companyId)
    this.service.Searchleavetypemapping(this.companyUI.companyId, this.siteNameUI.siteCode, 'Search')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          const tableData = res?.data?.data?.Table0;
          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.leaveTypes = [];
            this.dataSource.data = [];
            return;
          }

          this.bindLeaveTypesMaping(tableData);
        },
        error: (err) => {
          console.error(err);
          this.leaveTypes = [];
          this.dataSource.data = [];
        }
      });
  }

  bindLeaveTypesMaping(data: any[]): void {

    this.leaveTypes = data.map(item => ({
      companycode: item.company_code,
      groupname: item.Group_Name,
      groupdetailid: item.Group_Detail_Id,
      attendancetype: item.ATTENDANCE_TYPE_NAME,
      leaveType: item.LEAVE_TYPE_NAME,
      leavetreattype: item.LEAVE_NAME,
      leaveTypeid: item.LEAVE_TYPE_ID,
      leavetreattypeid: item.LEAVE_TREAT_ID,
      attendancetypeid: item.ATTENDANCE_TYPE,
      leavetypemappingid: item.LEAVE_MAPPING_DETAIL_ID,
      companyid: item.Company_Id,
      isactive: item.ISACTIVE,
      leavePolicy: item.LEAVE_POLICY,
      leavepolicyid: item.LEAVE_POLICY_ID,
      Buffer_date: item.Buffer_date
    }));
    this.dataSource.data = this.leaveTypes;
    this.dataSource.paginator = this.paginator;
  }

  deleterow(item: any) {

    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.userId,
      mode: "delete",
      parentDetail: {
        LEAVE_MAPPING_DETAIL_ID: item.leavetypemappingid,
        COMPANY_ID: item.companyid,
        LEAVE_TYPE_ID: item.leaveTypeid,
        LEAVE_TREAT_ID: item.leavetreattypeid,
        ISACTIVE: item.isactive ? true : false,
        ATTENDANCE_TYPE: item.attendancetypeid,
        LEAVE_POLICY_ID: item.leavepolicyid ?? 0,
        BUFFER_DATE: item.Buffer_date ?? ''
      }
    };


    this.service.LeavemastermappingSave(payload).subscribe({
      next: (res: any) => {
        if (res?.statuscode === 200) {
          this.isLoading = false;
          const message =
            res?.Data?.data?.Table0?.[0]?.Error_Message ||
            'Deleted Successfully';

          alert(message);

          this.handleSearch();
        } else {
          this.isLoading = false;
          alert("Delete Failed due to internal server error");
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  saveLeavequessType() {

    if (!this.companyUI ||
      !this.attendanceType ||
      !this.selectedLeaveId
      || !this.selectedleavepolicy ||
      !this.selectedTreatTypeId ||
      !this.isActive) {

      alert("Please fill all required fields");
      return;
    }
    this.isLoading = true;

    const payload = {
      createdBy: this.userdetail.userId,
      mode: "Add",
      parentDetail: {
        LEAVE_MAPPING_DETAIL_ID: 0,
        COMPANY_ID: this.companyUI.companyId,
        SITEID: this.siteNameUI.siteCode,
        LEAVE_TYPE_ID: this.selectedLeaveId,
        LEAVE_TREAT_ID: this.selectedTreatTypeId,
        ISACTIVE: this.isActive ? true : false,
        ATTENDANCE_TYPE: this.attendanceType,
        LEAVE_POLICY_ID: this.selectedleavepolicy,
        BUFFER_DATE: this.bufferDay || null
      }
    };


    this.service.LeavemastermappingSave(payload).subscribe({
      next: (res: any) => {
        if (res.statuscode === 200) {
          this.isLoading = false;
          alert(res?.data?.data?.Table0?.[0]?.Error_Message || res.Data.message || 'Saved Successfully');
          this.closeAddPopup();
          this.handleSearch();
        } else {
          this.isLoading = false;
          alert("Save Failed due to internal server error");
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert(err);
      }
    });


  }



}
