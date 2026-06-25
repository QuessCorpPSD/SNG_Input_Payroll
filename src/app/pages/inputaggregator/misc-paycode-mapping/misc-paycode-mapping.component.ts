import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Output, ViewChild } from '@angular/core';
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
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { InputaggregatoronboardingComponent } from '../inputaggregatoronboarding/inputaggregatoronboarding.component';
import { LeavetypemasterService } from '../../../Service/leavetypemaster.service';
import * as XLSX from 'xlsx';
import { MatSort } from '@angular/material/sort';
import { CompanyComponent } from '../../../common/company/company.component';

export const Pay_TOKEN = new InjectionToken<ILeaveMaster>('Pay_TOKEN');

@Component({
  selector: 'app-misc-paycode-mapping',
  standalone: true,
  imports: [CommonModule, InputaggregatoronboardingComponent, MatCardModule, GroupnameComponent, CompanyComponent, MatPaginatorModule, MatIconModule, MatTooltipModule, MatTableModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './misc-paycode-mapping.component.html',
  styleUrl: './misc-paycode-mapping.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LeavetypemasterService,
    }
  ]
})
export class MiscPaycodeMappingComponent {
  companyUI: any;
  showAddPopup: boolean = false;
  isActive: any;
  isLoading: any;
  searchText: any;
  dataSource = new MatTableDataSource<any>([])
  displayedColumns: string[] = ['delete', 'companycode', 'groupname', 'feecode', 'paycode'];
  paycode: any;
  selectedfeecode: any;
  userdetail: any;
  selectedpaycode: any;
  paycodedata: any;
  isshowtable = false;
  siteNameUI: any;
  isEditMode = false
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject(Pay_TOKEN) private service: ILeaveMaster, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  feeCodeList: any[] = [];

  openAddPopup() {
    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }

    this.BindPaycode();
    this.loadFeeCodes();
    this.showAddPopup = true;
    this.selectedfeecode = '';
    this.selectedpaycode = '';
    this.isActive = 1;

  }

  loadFeeCodes() {
    const companyid = this.companyUI.companyId;
    const siteid = this.siteNameUI.siteCode;

    this.service.Getfeecode(companyid, siteid).subscribe({
      next: res => {
        this.feeCodeList = res?.Data?.data?.Table0 || [];
        console.log('feeCodeList', this.feeCodeList);
      }
    });
  };

  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

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

  BindPaycode() {
    const companyid = this.companyUI.companyId
    this.service.Getpaycode(companyid).subscribe({
      next: res => {
        this.paycode = res.Data.data.Table0;
      }
    });
  };
  handleCompanyEvent(company: any) {
    this.companyUI = company;

  }
  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.siteNameUI = site;
    console.log('Site', this.siteNameUI);
  }
  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    // Reset to first page if paginator exists
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  // handleSearch() {
  //   if (!this.companyUI) {
  //     alert("Please Select Company");
  //     this.paycodedata = [];
  //     this.dataSource.data = [];
  //     return;
  //   }
  //   this.isshowtable = true;
  //   this.isLoading = true;

  //   this.service.Miscsearch(this.companyUI.companyId,).subscribe({
  //     next: (res) => {
  //       this.isLoading = false;
  //       console.log('API Response:', res.data);
  //       this.paycodedata = res.data.data.Table0;
  //       if (!this.paycodedata) {
  //         alert("res.data.message");
  //         this.paycodedata = []
  //         this.dataSource.data = [];
  //         this.isLoading = false;
  //         return;
  //       }

  //       if (this.paycodedata && this.paycodedata.length > 0) {
  //         this.dataSource.data = this.paycodedata;

  //         this.displayedColumns = ['delete', 'companycode', 'feecode', 'paycodeid', 'paycode'];
  //         this.isLoading = false;

  //       } else {
  //         this.dataSource.data = [];
  //         alert('No data found for the selected criteria');
  //         this.isLoading = false;

  //       }
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.error('Error loading salary release data', err);
  //     },
  //   });
  // }
  exportToExcel(): void {
    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }
    this.isLoading = true;
    this.service.Miscsearch(this.companyUI.companyId, this.siteNameUI.siteCode, 'Export')
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
            const fileName = `MiscPayCodeMapping_${timestamp}.xlsx`;
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
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;
    this.isshowtable = true;

    this.service.Miscsearch(this.companyUI.companyId, this.siteNameUI.siteCode, 'Search').subscribe({

      next: (res) => {

        this.isLoading = false;

        this.paycodedata = res?.Data?.data?.Table0 || [];

        this.dataSource.data = this.paycodedata;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  save() {

    if (!this.companyUI ||
      !this.selectedfeecode ||
      !this.selectedfeecode ||
      !this.isActive) {

      alert("Please fill all required fields");
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.userId,
      mode: "Add",
      parentDetail: {
        Company_Id: this.companyUI.companyId,
        SiteId: this.siteNameUI.siteCode,
        FeeCode: this.selectedfeecode,
        Pay_Code: this.selectedpaycode.Paycode_Description,
        Pay_Code_Id: this.selectedpaycode.Paycode_Id,
      }
    };


    this.service.MiscpaycodeSave(payload).subscribe({
      next: (res: any) => {
        if (res.statuscode === 200) {
          this.isLoading = false;
          alert(res?.Data?.data?.Table0?.[0]?.Error_Message || res.Data.message || 'Saved Successfully');
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
  deleterow(item: any) {

    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.userId,
      mode: "delete",
      parentDetail: {
        Company_Id: item.Company_Id,
        FeeCode: item.FeeCode,
        Pay_Code: item.Pay_Code,
        Pay_Code_Id: item.Pay_Code_Id
      }
    };


    this.service.MiscpaycodeSave(payload).subscribe({
      next: (res: any) => {
        if (res?.statuscode === 200) {
          this.isLoading = false;
          const message =
            res?.Data?.data?.Table0?.[0]?.Error_Message
            ;

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

}
