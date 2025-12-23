import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfessionaltaxaddComponent } from '../professionaltaxadd/professionaltaxadd.component';
import { FormsModule } from '@angular/forms';
import { ProfessionaltaxService } from '../../../Service/GlobalMasters/professionaltax.service';
import { IProfessionatax } from '../../../Repository/GlobalMasters/IProfessionatax.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IProfessionatax>('Pay_Token');

@Component({
  selector: 'app-professionaltax',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule],
  templateUrl: './professionaltax.component.html',
  styleUrl: './professionaltax.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ProfessionaltaxService,
    }
  ]
})
export class ProfessionaltaxComponent implements AfterViewInit {
  PTType: any;
  State: any;
  ptSearch: any;
  showTable = false;
  ptType: any;
  state: any;
  EffectiveDate: any;
  searchText: string = "";
  dataSource = new MatTableDataSource<any>();
  userdetail: any;
  isLoading: boolean = false;

  constructor(private dialog: MatDialog, @Inject(Pay_Token) private service: ProfessionaltaxService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService) { }

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'effectivedate', 'statename', 'professionaltaxtype',
    'fromvalue', 'tovalue', 'amount', 'category', 'ptcirclename', 'monthname'
  ];


  uploadedData: any[] = []; // no mock data
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    effectivedate: '', statename: '', professionaltaxtype: '',
    fromvalue: '', tovalue: '', amount: '', category: '',
    ptcirclename: '', monthname: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.bindPtType();
    this.bindState();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.State_Name?.toLowerCase().includes(searchText) ||
        data.PT_Type_Name?.toLowerCase().includes(searchText) ||
        data.Month_Name?.toLowerCase().includes(searchText) ||
        data.From_Value?.toString().includes(searchText) ||
        data.To_Value?.toString().includes(searchText)
      );
    };
  }

  bindPtType() {
    this.service.GetPTType().subscribe({
      next: res => {
        this.ptType = res.Data
      }
    });
  }

  bindState() {
    this.service.GetState().subscribe({
      next: res => {
        this.state = res.Data
      }
    })
  }

  onSearch() {
    this.showTable = true;
    this.isLoading = true;
    const payload = {
      StateID: this.State,
      EffectiveDate: this.EffectiveDate,
      PT_Type: this.PTType

    }

    this.service.Search(payload).subscribe({

      next: (res) => {
        this.ptSearch = res.Data.data.Table0;
        if (this.ptSearch && this.ptSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.ptSearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = ['Action', 'slNo', 'effectivedate', 'statename', 'professionaltaxtype', 'fromvalue', 'tovalue', 'amount', 'category', 'ptcirclename', 'monthname'];
        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        alert('Failed to load salary release data');
        this.isLoading = false;
      },
    });
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }


  exportToExcel(): void {
    this.isLoading = true;
    const payload = {
      StateID: this.State,
      EffectiveDate: this.EffectiveDate,
      PT_Type: this.PTType

    }

    this.service.exportToExcel(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `professionaltax${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        this.isLoading = false;
      },
    });
  }

  deleteProfessionalTax(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isLoading = true;
    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id?.toString(),
      PTSlab: {
        Professional_Tax_Slab_Id: row.Professional_Tax_Slab_Id
      },
      PTSlabDetail: []
    };

    this.service.addPt(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res?.Data.response);
          this.onSearch()
        } else {
          alert(res?.Message || 'Delete failed');
        }
        this.isLoading = false;
      },
      error: err => {
        console.error(err);
        alert('API error during deletion');
        this.isLoading = false;
      }
    });
  }


  AddPTOpen() {
    const dialog = this.dialog.open(ProfessionaltaxaddComponent, {
      width: '90%',
      height: '78vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });

    dialog.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onSearch();
      }
    });
  }


  editPTOpen(row: any) {
    const dialogRef = this.dialog.open(ProfessionaltaxaddComponent, {
      width: '90%',
      height: '78vh',
      disableClose: true,
      data: { mode: 'edit', row: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onSearch();
      }
    });
  }


}
