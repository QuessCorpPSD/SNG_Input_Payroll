import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { finalize } from 'rxjs';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILeaveMaster } from '../../../Repository/Inputaggregator/ILeavemaster';
import { LeavetypemasterService } from '../../../Service/inputaggregator/leavetypemaster.service';
const Pay_TOKEN = new InjectionToken<ILeaveMaster>('Pay_TOKEN');

@Component({
  selector: 'app-leavemaster',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatPaginator, CommonModule, FormsModule],
  templateUrl: './leavemaster.component.html',
  styleUrl: './leavemaster.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LeavetypemasterService,
    }
  ]
})
export class LeavemastersComponent {
  showreportPopup: boolean = false;
  attributeMappings: any;
  showAddPopup = false;
  isshowtable = false;
  leaveType: string = '';
  isActive: number = 1;
  userdetail: any;
  isEditMode: boolean = false;
  selectedId: number | null = null;
  description: any;
  searchText = '';
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(@Inject(Pay_TOKEN) private service: ILeaveMaster, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  openAddPopup() {
    this.showAddPopup = true;
    this.isEditMode = false;
    this.selectedId = null;
    this.leaveType = '';
    this.isActive = 1;
  }
  allLeaveTypes: any[] = [];

  applyFilter() {
    const search = this.searchText?.toLowerCase() || '';

    if (!search) {
      this.leaveTypes = [...this.allLeaveTypes];
    } else {
      this.leaveTypes = this.allLeaveTypes.filter((item: any) =>
        item.leaveName?.toLowerCase().includes(search) ||
        item.descriptions?.toLowerCase().includes(search)
      );
    }

    this.dataSource.data = this.leaveTypes;
  }
  closeAddPopup() {
    this.showAddPopup = false;
  }
  leaveTypes: any[] = [];
  isLoading = false;
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.handleSearch();
    this.applyFilter();

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const filterText = filter.trim().toLowerCase();

      return Object.values(data).some((value: any) =>
        String(value ?? '')
          .toLowerCase()
          .includes(filterText)
      );
    };
  }

  exportToExcel(): void {
    this.isLoading = true;
    this.service.getLeavetypes()
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
            const fileName = `Leavemaster_${timestamp}.xlsx`;
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
  handleSearch(): void {
    this.isshowtable = true;
    this.isLoading = true;
    this.leaveTypes = [];
    this.dataSource.data = [];

    this.service.getLeavetypes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          const tableData = res?.Data?.data?.Table0;
          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.leaveTypes = [];
            this.dataSource.data = [];
            return;
          }

          this.bindLeaveTypes(tableData);
          this.dataSource.paginator = this.paginator;

        },
        error: (err) => {
          console.error(err);
          this.leaveTypes = [];
          this.dataSource.data = [];
        }
      });
  }
  bindLeaveTypes(data: any[]): void {

    this.leaveTypes = data.map(item => ({
      leaveId: item.LEAVE_TYPE_ID,
      leaveName: item.LEAVE_TYPE_NAME,
      isActive: item.ISACTIVE,
      descriptions: item.LEAVE_TYPE_DESCRIPTION
    }));
    this.allLeaveTypes = [...this.leaveTypes];
    this.dataSource.data = this.leaveTypes;
    this.dataSource.paginator = this.paginator;
  }

  deleterow(item: any) {

    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "delete",
      parentDetail: {
        LEAVE_TYPE_ID: item.leaveId,
        LEAVE_TYPE_NAME: item.leaveName,
        ISACTIVE: item.isActive ? true : false,
        LEAVE_TYPE_DESCRIPTION: item.descriptions
      }
    };

    this.service.LeavemasterSave(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          this.isLoading = false;
          const message =
            res?.Data?.data?.Table0?.[0]?.Error_Message;

          alert(message);

          this.handleSearch();
        } else {
          this.isLoading = false;
          alert(res.Data.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert(err);
      }
    });
  }
  saveLeaveType() {

    if (!this.leaveType || this.leaveType.trim() === '') {
      alert('Leave Type is required');
      return;
    }

    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      parentDetail: {
        LEAVE_TYPE_ID: 0,
        LEAVE_TYPE_NAME: this.leaveType,
        ISACTIVE: this.isActive ? true : false,
        LEAVE_TYPE_DESCRIPTION: this.description
      }
    };

    this.service.LeavemasterSave(payload).subscribe({
      next: (res: any) => {
        if (res.StatusCode === 200) {
          this.isLoading = false;
          alert(res?.Data?.data?.Table0?.[0].Error_Message || 'Updated Successfully');
          this.closeAddPopup();
          this.handleSearch();
        } else {
          this.isLoading = false;
          alert(res.Data.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert(err);
      }
    });

  }

  trackByIndex(index: number, item: any) {
    return index;
  }
}
