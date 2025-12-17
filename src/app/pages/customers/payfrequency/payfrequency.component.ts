import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayfrequencyAddComponent } from '../payfrequency-add/payfrequency-add.component';
import { PayfrequencyEditComponent } from '../payfrequency-edit/payfrequency-edit.component';
import * as XLSX from 'xlsx';
import { PayfrequencyService } from '../../../Service/CUSTOMER/payfrequency.service';
import { IPayfrequencyservice } from '../../../Repository/customer/IPayfrequency';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
export const Pay_TOKEN = new InjectionToken<IPayfrequencyservice>('Pay_TOKEN');

@Component({
  selector: 'app-payfrequency',
  standalone: true,
  imports: [MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatPaginator, AlertpopupComponent],
  templateUrl: './payfrequency.component.html',
  styleUrl: './payfrequency.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: PayfrequencyService,
    }
  ]
})
export class PayfrequencyComponent {
  isuploadgridvisible = false;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  uploadDisplayedColumns: string[] = [
    'SNo', 'Companycode', 'Group', 'Startingdate', 'Endingdate',
    'Paysequenceno', 'Payperiod', 'Startat', 'Endat',
    'Salarydate', 'Payperioddays', 'Weeklyholidays',
    'Monthlyholidays', 'otherholidays', 'WorkingHolidays'
  ];

  uploadedData: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  selectedCompanyId: any;
  selectedCompanyCode: any;

  billingpay: any = [];
  billingpays: any;

  constructor(
    private dialog: MatDialog,
    @Inject(Pay_TOKEN) private service: IPayfrequencyservice,
  ) { }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

    this.dataSource = new MatTableDataSource<any>([]);
    this.isuploadgridvisible = false;
  }

  selectedRow: any | null = null;
  onRowClick(row: any) {
    this.selectedRow = row;
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  AddOpen() {
    const dialogRef = this.dialog.open(PayfrequencyAddComponent, {
      width: '80%',
      height: '95vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add') {
        this.onsearch();
      }
    });
  }

  EditOpen() {
    if (!this.selectedRow) {
      alert('Please select a row to edit');
      return;
    }

    const dialogRef = this.dialog.open(PayfrequencyEditComponent, {
      width: '80%',
      height: '95vh',
      disableClose: true,
      data: this.selectedRow
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'edit') {
        this.onsearch();
      }
    });
  }


  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    this.isuploadgridvisible = true;

    const Companyid = this.selectedCompanyId;

    this.dataSource = new MatTableDataSource<any>([]);

    this.service.Search(Companyid).subscribe({
      next: (res) => {
        this.billingpay = res.Data.data.Table0;
        this.billingpays = res.Data.message;

        if (!this.billingpay || this.billingpay.length === 0) {
          alert(this.billingpays);
          this.dataSource = new MatTableDataSource<any>([]);
          return;
        }

        this.dataSource = new MatTableDataSource(this.billingpay);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      }
    });
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    const Companyid = this.selectedCompanyId;

    this.service.Search(Companyid).subscribe({
      next: (res) => {
        try {
          const jsonData = res.Data.data.Table0;
          this.billingpays = res.Data.message;

          if (!jsonData || jsonData.length === 0) {
            alert(this.billingpays);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "payFrequency");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `payFrequency_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }
}


