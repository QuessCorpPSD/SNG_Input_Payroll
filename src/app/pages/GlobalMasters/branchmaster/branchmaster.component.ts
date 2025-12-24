import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { BranchmasterAddComponent } from '../branchmaster-add/branchmaster-add.component';
import { BranchMasterService } from '../../../Service/GlobalMasters/branch-master.service';
import { IBranchmaster } from '../../../Repository/GlobalMasters/IbranchMaster';

export const BranchMaster_TOKEN =
  new InjectionToken<IBranchmaster>('BranchMaster_TOKEN');

@Component({
  selector: 'app-branchmaster',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginator,
    MatTooltipModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './branchmaster.component.html',
  styleUrl: './branchmaster.component.css',
  providers: [
    {
      provide: BranchMaster_TOKEN,
      useClass: BranchMasterService
    }
  ]
})
export class BranchmasterComponent {
  _sessionStorage: any;
  userdetail: any;
  decry: any;

  constructor(
    @Inject(BranchMaster_TOKEN) private branchService: BranchMasterService,
    private dialog: MatDialog
  ) { }

  /* ================= VARIABLES ================= */

  isUploadGridVisible = false;
  isLoading = false;
  PTstateList: any[] = [];
  selectedStateId: number | null = null;
  branchName: string | null = null;

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'PT State',
    'Branch Name'
  ];

  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    const json = this._sessionStorage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindPTstate();
  }
  onsearch(): void {
    this.isLoading = true;

    const payload = {
      StateId: this.selectedStateId ?? null,
      BranchName: this.branchName?.trim() || null
    };

    console.log('Branch Search Payload:', payload);

    this.branchService.SearchBranchMaster(payload).subscribe({
      next: (res: any) => {
        const tableData = res?.Data?.data?.Table0 ?? [];

        this.uploadedData = tableData;
        this.uploadedDataSource.data = tableData;
        this.uploadedDataSource.paginator = this.paginator;

        this.isUploadGridVisible = true;

        if (tableData.length === 0) {
          alert('No records found');
        }

        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load branch data');
        this.isLoading = false;
      }
    });
  }

  AddBMOpen(): void {
    this.dialog.open(BranchmasterAddComponent, {
      width: '30%',
      height: '48vh',
      disableClose: true
    });
  }
  BindPTstate(): void {
    this.branchService.GetPTstates().subscribe({
      next: (res: any) => {
        this.PTstateList = res?.Data ?? [];
      },
      error: err => {
        console.error('Failed to load PT States', err);
        this.PTstateList = [];
      }
    });
  }


}
