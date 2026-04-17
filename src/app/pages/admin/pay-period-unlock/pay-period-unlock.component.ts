import { AfterViewInit, Component, Inject, ViewChild, viewChild, InjectionToken } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { A11yModule } from "@angular/cdk/a11y";
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatCardTitle } from "@angular/material/card";
import { IPayPeriodUnlock } from '../../../Repository/Admin/IPayPeriodUnlock.service';
import { PayPeriodUnlockService } from '../../../Service/Admin/PayPeriodUnlock.service';
import { CommonModule } from '@angular/common';



export const PayPeriodUnlock_TOKEN = new InjectionToken<IPayPeriodUnlock>('PayPeriodUnlock_TOKEN');
@Component({
  selector: 'app-payperiodunlock',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardTitle,
    FormsModule,CommonModule
  ],
  templateUrl: './pay-period-unlock.component.html',
  styleUrl: './pay-period-unlock.component.css',
  providers: [{
    provide: PayPeriodUnlock_TOKEN,
    useClass: PayPeriodUnlockService
  }]
})

export class PayPeriodUnlockComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  payPeriodUnlockSearch: any;
  pagetype: any;

  constructor(@Inject(PayPeriodUnlock_TOKEN) private payperiodunlock: PayPeriodUnlockService, private dialog: MatDialog) { }

  showTable = false;

  uploadDisplayedColumns: string[] = ['Serial_No', 'Company_Code', 'Pay_Period', 'UserName', 'USER_ID',  'CreatedOn'];

  uploadFilteredColumns: string[] = ['Serial_NoFilter', 'Company_CodeFilter', 'Pay_PeriodFilter', 'UserNameFilter', 'USER_IDFilter',  'CreatedOnFilter'];

  uploadedData: any[] = []; //  No mock data, ready for API hookup

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    Serial_No: '', Company_Code: '', Pay_Period: '', UserName: '', USER_ID: '', CreatedOn: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.BindGrid();
  }

  BindGrid() {

    this.showTable = true;

    this.payperiodunlock.Search().subscribe({
      next: (res) => {
        this.payPeriodUnlockSearch = res.Data.data.Table0;
        if (this.payPeriodUnlockSearch && this.payPeriodUnlockSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.payPeriodUnlockSearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['Serial_No', 'Company_Code', 'Pay_Period', 'UserName', 'USER_ID',  'CreatedOn'];
        } else {
          this.dataSource.data = [];
          alert('No data found')
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      },
    });
  }

   ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.setUpCustomFilter();
  }

  setUpCustomFilter() {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.payCode?.toLowerCase().includes(search.payCode) &&
        data.description?.toLowerCase().includes(search.description) &&
        data.payType?.toLowerCase().includes(search.payType) &&
        data.taxable?.toLowerCase().includes(search.taxable) &&
        data.accountNumber?.toLowerCase().includes(search.accountNumber)
      );
    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify({
      payCode: this.filterValues.payCode.trim().toLowerCase(),
      description: this.filterValues.description.trim().toLowerCase(),
      payType: this.filterValues.payType.trim().toLowerCase(),
      taxable: this.filterValues.taxable.trim().toLowerCase(),
      accountNumber: this.filterValues.accountNumber.trim().toLowerCase(),
    });

    if (this.uploadedDataSource.paginator) {
      this.uploadedDataSource.paginator.firstPage();
    }
  }
}
