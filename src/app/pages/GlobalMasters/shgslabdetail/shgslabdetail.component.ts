import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, InjectionToken, ViewChild, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShgslabdetailaddComponent } from '../shgslabdetailadd/shgslabdetailadd.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { ISHGService } from '../../../Repository/GlobalMasters/IShg.service';
import { ShgserviceService } from '../../../Service/GlobalMasters/shgservice.service';
import { MatCardModule } from "@angular/material/card";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

export const SHG_TOKEN = new InjectionToken<ISHGService>('SHG_TOKEN');

@Component({
  selector: 'app-shgslabdetail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatCardModule, AlertpopupComponent],
  templateUrl: './shgslabdetail.component.html',
  styleUrl: './shgslabdetail.component.css',
  providers: [{
    provide: SHG_TOKEN,
    useClass: ShgserviceService
  }]
})
export class ShgslabdetailComponent implements AfterViewInit {
  shgSearch: any;
  Selecteddate: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(@Inject(SHG_TOKEN) private shg: ShgserviceService, private dialog: MatDialog) { }

  showTable = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  uploadDisplayedColumns: string[] = [
    'slNo', 'effectivedate', 'category', 'fromvalue', 'tovalue', 'value'
  ];

  filteredDisplayedColumns: string[] = [
    'slNoFilter', 'effectivedateFilter', 'categoryFilter', 'fromvalueFilter', 'tovalueFilter', 'valueFilter'
  ];

  filterValues = {
    slNo: '',
    effectivedate: '',
    category: '',
    fromvalue: '',
    tovalue: '',
    value: ''
  };

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.setupCustomFilter();
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
  setupCustomFilter() {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.slNo.toString().toLowerCase().includes(search.slNo) &&
        data.effectivedate.toLowerCase().includes(search.effectivedate) &&
        data.category.toLowerCase().includes(search.category) &&
        data.fromvalue.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue.toString().toLowerCase().includes(search.tovalue) &&
        data.value.toLowerCase().includes(search.value)
      );
    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify({
      slNo: this.filterValues.slNo.trim().toLowerCase(),
      effectivedate: this.filterValues.effectivedate.trim().toLowerCase(),
      category: this.filterValues.category.trim().toLowerCase(),
      fromvalue: this.filterValues.fromvalue.trim().toLowerCase(),
      tovalue: this.filterValues.tovalue.trim().toLowerCase(),
      value: this.filterValues.value.trim().toLowerCase(),
    });

    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  onsearch() {
    // if (!this.Selecteddate)
    // {
    //   alert("Please select Effective Date");
    //   return;
    // }
    this.isLoading = true;
    this.showTable = true;

    const date = this.Selecteddate;
    this.shg.SearchShg(date).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.shgSearch = res.Data.data.Table0;
        if (this.shgSearch && this.shgSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.shgSearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'slNo', 'effectivedate', 'category', 'fromvalue', 'tovalue', 'value'
          ];
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {
    const date = this.Selecteddate;
    this.isLoading = true;
    this.shg.SearchShg(date).subscribe({
      next: (res) => {
        this.isLoading = false;
        try {
          const jsonData = res?.Data.data.Table0;
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            return;
          }
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'shgslabData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `shg_slab_detail_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
      },
    });
  }

  AddShgslabdetailOpen() {
    this.dialog.open(ShgslabdetailaddComponent, {
      width: '60%',
      height: '43.5vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
}
