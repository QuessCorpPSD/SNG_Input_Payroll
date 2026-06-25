import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize } from 'rxjs';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { Company, Groupnameclass } from '../../../Models/Common';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { ILeaveMaster } from '../../../Repository/ILeavemaster';
import { LeavetypemasterService } from '../../../Service/leavetypemaster.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { InputaggregatoronboardingComponent } from '../inputaggregatoronboarding/inputaggregatoronboarding.component';
import { Pay_TOKEN } from '../leave-master-mapping/leave-master-mapping.component';
import { CompanyComponent } from '../../../common/company/company.component';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { OnboardingComponent } from '../../PayrollInput/onboarding/onboarding.component';

@Component({
  selector: 'app-leave-category',
  standalone: true,
  imports: [CommonModule, InputaggregatoronboardingComponent, MatCardModule, GroupnameComponent, CompanyComponent, MatPaginatorModule, MatIconModule, MatTooltipModule, MatTableModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './leave-category.component.html',
  styleUrl: './leave-category.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LeavetypemasterService,
    }
  ]
})
export class LeaveCategoryComponent {
  showreportPopup: boolean = false;
  attributeMappings: any;
  showAddPopup = false;
  attendanceType: any;
  selectedLeaveId: any;
  selectedTreatTypeId: any;
  selectedleavepolicy: any;
  company: any;
  companies: any[] = [];
  bufferDay = '';
  leaveTypes: any[] = [];
  leaveTreatTypes: any[] = [];
  leaveType: string = '';
  isActive: any = '1';
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
  searchText = '';
  Category_name = '';
  dataSource = new MatTableDataSource<any>([])
  siteNameUI: any;
  displayedColumns: string[] = ['delete', 'Client_Name', 'Group_Name', 'LEAVE_TYPE_NAME', 'LEAVE_NAME'];

  @ViewChild(CompanyallComponent) companyAll!: CompanyallComponent;
  @ViewChild(OnboardingComponent) onboarding!: OnboardingComponent;
  @ViewChild('paginator') paginator!: MatPaginator;
  leavepolicy: any;
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
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    console.log(this.companyUI);


  }

  BindLeavetype() {
    this.service.getLeavetypes().subscribe({
      next: res => {
        this.LEAVETYPES = res.Data.data.Table0;
        console.log(this.LEAVETYPES)
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
    this.service.Searchleavecategory(this.companyUI.companyId, this.siteNameUI.siteCode, 'Export')
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
            const fileName = `LeaveCategoryMapping_${timestamp}.xlsx`;
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

  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.siteNameUI = site;
    console.log('Site', this.siteNameUI);
  }

  handleSearch() {
    if (!this.companyUI) {
      alert("Please Select Company");
      this.leaveTypes = [];
      this.dataSource.data = [];
      return;
    }
    this.isshowtable = true;
    this.isLoading = true;

    this.service.Searchleavecategory(this.companyUI.companyId, this.siteNameUI.siteCode, 'Search')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          const tableData = res?.data?.data?.Table0;
          console.log(tableData);
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
      Company_Code: item.Company_Code,
      Group_Name: item.Group_Name,
      Group_Detail_Id: item.Group_Detail_Id,
      Leave_Category_Master_Name: item.Leave_Category_Master_Name,
      Leave_Category_Master_ID: item.Leave_Category_Master_ID,
      LEAVE_TYPE_NAME: item.LEAVE_TYPE_NAME,
      LEAVE_NAME: item.LEAVE_NAME,
      Leave_Id: item.Leave_Id,
      Leave_Treate_id: item.Leave_Treate_id,
      Company_Id: item.Company_Id,
      IsActive: item.ISACTIVE,
      Client_Name: item.Client_Name
    }));
    this.dataSource.data = this.leaveTypes;
    this.dataSource.paginator = this.paginator;
  }

  deleterow(item: any) {
    console.log(item)
    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      Created_By: this.userdetail.userId,
      Mode: "Delete",
      Leave_Category_Master_ID: item.Leave_Category_Master_ID,
      Company_Id: item.Company_Id,
      Site_Id: this.siteNameUI.siteCode,
      Leave_Treate_id: item.Leave_Treate_id,
      Leave_Id: item.Leave_Id,
      Leave_Category_Master_Name: item.Leave_Category_Master_Name,
      IsActive: item.IsActive ?? '0',
    };

    console.log('Delete Payload:', payload);

    this.service.LeaveCategorySave(payload).subscribe({
      next: (res: any) => {
        if (res?.statuscode == 200) {
          this.isLoading = false;
          const message =
            res?.data?.Table0?.[0]?.Error_Message || res.Data.response ||
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
        alert(err);
      }
    });
  }

  saveLeavequessType() {

    if (!this.companyUI ||
      !this.Category_name ||
      !this.selectedLeaveId ||
      !this.selectedTreatTypeId ||
      !this.isActive) {

      alert("Please fill all required fields");
      return;
    }
    this.isLoading = true;
    const payload = {
      Created_By: this.userdetail.userId,
      Mode: "Add",
      Leave_Category_Master_ID: 0,
      Company_Id: this.companyUI.companyId,
      Site_Id: this.siteNameUI.siteCode,
      Leave_Treate_id: this.selectedTreatTypeId,
      Leave_Id: this.selectedLeaveId,
      Leave_Category_Master_Name: this.Category_name,
      IsActive: this.isActive,
    };

    console.log('Saving Payload:', payload);

    this.service.LeaveCategorySave(payload).subscribe({
      next: (res: any) => {
        if (res.statuscode == 200) {
          this.isLoading = false;
          console.log('save', res)
          alert(res?.data?.Table0?.[0]?.Error_Message || res.Data.response || 'Saved Successfully');
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
