import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { LFWSlabAddComponent } from '../lfwslab-add/lfwslab-add.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ILwf } from '../../../Repository/GlobalMasters/Ilwf';
import { LwfService } from '../../../Service/GlobalMasters/lwf.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';

export const Pay_TOKEN = new InjectionToken<ILwf>('Pay_TOKEN');

@Component({
  selector: 'app-lfwslab',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatPaginator, CommonModule, FormsModule, MatTooltipModule],
  templateUrl: './lfwslab.component.html',
  styleUrl: './lfwslab.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LwfService,
    }
  ]
})
export class LFWSlabComponent {
  State: any;
  userdetail: any;
  data: any;

  isUploadGridVisible = false;
  isLoading = false;
  state: any;
  Edate: any;
  searchText = '';
  constructor(private dialog: MatDialog, @Inject(Pay_TOKEN) private service: ILwf, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'State Name', 'Effective Date', 'From Value', 'To Value', 'Pay Period', 'E Contribution', 'ER Contribution'
  ];

 
  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.BindState();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.State_Name?.toLowerCase().includes(searchText) ||
        data.Effective_Date?.toLowerCase().includes(searchText) ||
        data.From_Value?.toLowerCase().includes(searchText) ||
        data.To_Value?.toString().includes(searchText) ||
        data.Month_Name?.toString().includes(searchText) ||
        data.EmployeeContribution?.toString().includes(searchText) ||
        data.EmployerContribution?.toString().includes(searchText) 
      );
    };
  }
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  BindState() {
    this.service.GetState().subscribe({
      next: res => {
        this.State = res.Data;
        console.log(this.State)
      }
    });
  };

  formatDate(dateStr: string): string {
    const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '));
    return date.toISOString().split('T')[0];
  }



  onsearch() {
    this.isUploadGridVisible = true;
    const payload = {
      "StateID": this.state || '',
      "EffectiveDate": this.Edate || ''
    }
    console.log("State:", this.state);
    console.log("Effective Date:", this.Edate);

    console.log('payload', JSON.stringify(payload))
    this.isLoading = true;


    this.service.Search(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.data = res.Data.data.Table0;
        console.log('data', this.data)
        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action', 'SNo', 'State Name', 'Effective Date', 'From Value', 'To Value', 'Pay Period', 'E Contribution', 'ER Contribution'
          ];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.isLoading = false;
        alert('Failed to load data');
      },
    });

  }
  exportToExcel(): void {
    this.isLoading = true;
    const payload = {
      "StateID": this.state || '',
      "EffectiveDate": this.Edate || ''
    }
    console.log('payload', JSON.stringify(payload))
    this.service.Exporttoexcel(payload).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, 'LWF');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `LWFSlab_${timestamp}.xlsx`;
          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
      },
    });
  }


  deleteRow(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    const payload = {
      mode: 'DELETE',
      CreatedBy: this.userdetail.user_Id.toString(),

      LWFSlab: {
        LWF_Slab_Id: row.LWF_Slab_Id,
        Financial_Year_Id: row.Financial_Year_Id,
        State_Id: row.State_Id,
        Effective_Date: this.formatDate(row.Effective_Date)
      },

      LWFSlabDetails: [
        {
          LWF_Slab_Detail_Id: row.LWF_Slab_Detail_Id,
          From_Value: row.From_Value.toString(),
          To_Value: row.To_Value.toString(),
          Frequency_Id: row.Frequency_Id.toString(),
          Month_Id: row.Month_ID.toString(),
          EmployerContribution: row.EmployerContribution.toString(),
          EmployeeContribution: row.EmployeeContribution.toString()
        }
      ]
    };

    console.log('DELETE PAYLOAD', JSON.stringify(payload));

    this.isLoading = true;

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        const msg = res.Data.response;
        if (msg.includes('success')) {
          alert(msg);
          this.onsearch();
        } else {
          alert(msg);
          this.onsearch();
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('Delete failed', err);
        alert('Failed to delete record');
      }
    });
  }


  AddIPOpen() {
    const dialogRef = this.dialog.open(LFWSlabAddComponent, {
      width: '60%',
      height: '75vh',
      disableClose: true,
      data: {
        mode: 'ADD'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.onsearch();
      }
    });
  }

  editRow(row: any) {
    this.dialog.open(LFWSlabAddComponent, {
      width: '60%',
      height: '75vh',
      disableClose: true,
      data: {
        mode: 'EDIT',
        headerData: row   // selected row data
      }
    });
  }


}
