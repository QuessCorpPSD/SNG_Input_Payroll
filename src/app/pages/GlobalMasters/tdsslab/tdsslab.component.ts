import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { TDSslabAddComponent } from '../tdsslab-add/tdsslab-add.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ITds } from '../../../Repository/GlobalMasters/Itds';
import { TdsService } from '../../../Service/GlobalMasters/tds.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
export const Pay_TOKEN = new InjectionToken<ITds>('Pay_TOKEN');

@Component({
  selector: 'app-tdsslab',
  standalone: true,
  imports: [MatPaginator, MatTableModule, MatIconModule, MatTooltipModule, CommonModule, FormsModule],
  templateUrl: './tdsslab.component.html',
  styleUrl: './tdsslab.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: TdsService,
    }
  ]
})
export class TDSslabComponent {
  year: any;
  userdetail: any;
  categ: any;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  data: any;
  financialyear: any;
  category: any;
  searchText: string = '';
  constructor(private dialog: MatDialog, @Inject(Pay_TOKEN) private service: ITds, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }
  isUploadGridVisible = false;

  uploadDisplayedColumns: string[] = ['Action', 'SNo', 'Financial Year', 'Category', 'Age From', 'Age To', 'Income From', 'Income To', 'Amount', 'Tax Percentage'];
  filterDisplayedColumns: string[] = ['FilterAction', 'FilterSNo', 'FilterFinancial Year', 'FilterCategory', 'FilterAge From', 'FilterAge To', 'FilterIncome From', 'FilterIncome To', 'FilterAmount', 'FilterTax Percentage'];


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
    this.BindFinancialyear();
    this.BindCategory();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Financial_Year_Name?.toLowerCase().includes(searchText) ||
        data.TDS_Category?.toLowerCase().includes(searchText) ||
        data.From_Age?.toLowerCase().includes(searchText) ||
        data.To_Age?.toString().includes(searchText) ||
        data.Income_From?.toString().includes(searchText) ||
        data.Income_To?.toString().includes(searchText) ||
        data.Amount?.toString().includes(searchText) ||
        data.Tax_Percentage?.toString().includes(searchText)

      );
    };
  }
  BindFinancialyear() {
    this.service.GetFinancialYear().subscribe({
      next: res => {
        this.year = res.Data.data.Table0;
        console.log(this.year)
      }
    });
  };
  BindCategory() {
    this.service.GetCategory().subscribe({
      next: res => {
        this.categ = res.Data.data;
        console.log(this.categ)
      }
    });
  };
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }


  onsearch() {
    this.isUploadGridVisible = true;
    this.isLoading = true;
    const financialyearid = this.financialyear || 0;
    const category = this.category || 0;
    const tdsslabid = 0;

    this.service.Search(financialyearid, category, tdsslabid).subscribe({
      next: (res) => {
        this.dataSource.data = [];
        this.data = res.Data.data.Table0;
        console.log('data', this.data);

        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.uploadDisplayedColumns = [
            'Action', 'SNo', 'Financial Year', 'Category', 'Age From', 'Age To',
            'Income From', 'Income To', 'Amount', 'Tax Percentage'
          ];
        } else {
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
    const financialyearid = this.financialyear || 0;
    const category = this.category || "''";
    this.service.Exporttoexcel(financialyearid, category).subscribe({
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

          XLSX.utils.book_append_sheet(wb, ws, 'Tds');
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `TdsSlab_${timestamp}.xlsx`;
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
  onDeleteRow(row: any) {
    if (!confirm('Are you sure you want to delete this TDS slab?')) {
      return;
    }

    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id.toString(),
      parentDetail: {
        TDS_Slab_Id: row.TDS_Slab_Id,
        Financial_Year_Id: row.Financial_Year_Id,
        TDS_Category: row.TDS_Category,
        From_Age: row.From_Age,
        To_Age: row.To_Age
      },
      ChildDetail: [
        {
          TDS_Slab_Id: row.TDS_Slab_Id,
          TDS_Slab_Detail_Id: row.TDS_Slab_Detail_Id,
          Income_From: row.Income_From,
          Income_To: row.Income_To,
          Amount: row.Amount,
          Tax_Percentage: row.Tax_Percentage
        }
      ]
    };

    console.log('DELETE PAYLOAD', JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        const msg = res?.Data?.data?.Table0[0]?.Error_Message || res.Data.message;
        if (msg.toLowerCase().includes('success')) {
          alert(msg);
          this.onsearch();
          // if (this.data.length === 1) {
          //   this.dataSource.data = [];

          //   this.onsearch();

          // }
        } else {
          alert(msg);
          this.onsearch();
        }
      },
      error: () => {
        alert('Delete failed');
      }
    });
  }

  AddIMOpen() {
    const dialogRef = this.dialog.open(TDSslabAddComponent, {
      width: '60%',
      height: '57vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onsearch();
    });
  }

  editopen(row: any, allRows: any[]) {
    const dialogRef = this.dialog.open(TDSslabAddComponent, {
      width: '65%',
      height: '78vh',
      disableClose: true,
      data: {
        editData: row,
        allSlabs: allRows
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onsearch();
    });
  }




}
