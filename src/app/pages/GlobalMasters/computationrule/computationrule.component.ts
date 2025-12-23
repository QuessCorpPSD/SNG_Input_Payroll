import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComputationruleaddComponent } from '../computationruleadd/computationruleadd.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { IcomputationRule } from '../../../Repository/GlobalMasters/IComputationRule.service';
import { ComputationruleService } from '../../../Service/GlobalMasters/computationrule.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IcomputationRule>('Pay_Token');

@Component({
  selector: 'app-computationrule',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule],
  templateUrl: './computationrule.component.html',
  styleUrl: './computationrule.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ComputationruleService,
    }
  ]
})

export class ComputationruleComponent implements AfterViewInit {
  fYear: any
  FinancialYear: any;
  CategoryName: any;
  TaxId: any;
  cRSearch: any;
  dataSource = new MatTableDataSource<any>();
  searchText: string = "";
  isLoading: boolean = false;
  userdetail: any;
  selectedRow: any | null = null;

  constructor(private dialog: MatDialog, @Inject(Pay_Token) private service: ComputationruleService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  showTable = false;

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'financialyear', 'effectivedate', 'taxid', 'description', 'categoryname', 'rule'
  ];


  uploadedData: any[] = [
    // { slNo: 1, financialyear: '2024-25', effectivedate: '01-Apr-2024', taxid: 'TX101', description: 'Tax on Bonus', categoryname: 'Income', rule: 'Applicable' },
    // { slNo: 2, financialyear: '2023-24', effectivedate: '01-Apr-2023', taxid: 'TX102', description: 'PF Deduction', categoryname: 'Statutory', rule: 'Mandatory' },
  ];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '));
    return date.toISOString().split('T')[0];
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.bindFinancialYear();
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Financial_Year_Name?.toLowerCase().includes(searchText) ||
        data.Effective_Date?.toLowerCase().includes(searchText) ||
        data.Tax_Id?.toLowerCase().includes(searchText) ||
        data.Description?.toString().includes(searchText) ||
        data.Category?.toString().includes(searchText) ||
        data.Computation_Rule?.toString().includes(searchText)
      );
    };
  }

  bindFinancialYear() {
    this.service.getFinancialYear().subscribe({
      next: res => {
        this.fYear = res.Data.data.Table0
      }
    });
  }

  onRowClick(row: any) {
    this.selectedRow = row;
  }

  onsearch() {
    this.showTable = true;
    // this.isLoading = true;
    const payload = {
      FinancialYearId: this.FinancialYear,
      Category: this.CategoryName,
      TaxId: this.TaxId
    }

    this.service.Search(payload).subscribe({

      next: (res) => {
        this.dataSource.data = [];
        this.cRSearch = res.Data.data.Table0 || [];
        if (this.cRSearch && this.cRSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.cRSearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = ['Action', 'slNo', 'financialyear', 'effectivedate', 'taxid', 'description', 'categoryname', 'rule'];
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

  exportToExcel(): void {
    this.isLoading = true;
    const payload = {
      FinancialYearId: this.FinancialYear || 0,
      Category: this.CategoryName || "",
      TaxId: this.TaxId || ""
    }

    this.service.exportToExcel(payload).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the cap/noncap type.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `computationrule${timestamp}.xlsx`;

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

  deleteComputationRule(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isLoading = true;

    const payload = {
      mode: 'Delete',
      userId: this.userdetail.user_Id,
      details: {
        Computation_Rule_Id: row.Computation_Rule_Id,
        Tax_Id: row.Tax_Id,
        Category: row.Category || '',
        Description: row.Description || '',
        Error_Message: row.Error_Message || '',
        Financial_Year_Name: row.Financial_Year_Name || '',
        Computation_Rule: row.Computation_Rule
      }
    };

    this.service.addCR(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res?.Data.message);
          this.onsearch();
        } else {
          alert(res?.Message);
        }
        this.isLoading = false;
      },
      error: err => {
        alert('API error during deletion');
        this.isLoading = false;
      }
    });
  };

  AddComputationOpen() {
    const dialog = this.dialog.open(ComputationruleaddComponent, {
      width: '90%',
      height: '48.5vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
    dialog.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onsearch();
      }
    });
  }

  editOpen(row: any) {
    const dialogRef = this.dialog.open(ComputationruleaddComponent, {
      width: '90%',
      height: '48.5vh',
      disableClose: true,
      data: { mode: 'edit', row: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onsearch();
      }
    });
  }

  CopyOpen() {
    if (!this.selectedRow) {
      alert("Please select a row to edit.");
      return;
    }

    this.dialog.open(ComputationruleaddComponent, {
      width: '90%',
      height: '48.5vh',
      disableClose: true,
      data: {
        mode: 'copy',
        row: this.selectedRow
      }
    });
  }

}

