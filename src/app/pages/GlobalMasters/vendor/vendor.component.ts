import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddVendorComponent } from '../add-vendor/add-vendor.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { VendorMasterService } from '../../../Service/GlobalMaster/vendor-master.service';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AlertpopupComponent
  ],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.css'
})
export class VendorComponent {

  VendorName: string = "";
  showTable: boolean = false;

  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;

  dataSource = new MatTableDataSource<any>();

  uploadDisplayedColumns: string[] = [
    'Action',
    'SI No',
    'Vendor Code',
    'Vendor Name'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  vendor: any;

  constructor(
    private dialog: MatDialog,
    private vendorService: VendorMasterService
  ) { }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSearchClick() {
    this.isLoading = true;
    this.showTable = true;

    this.vendorService.VendorSearch().subscribe({
      next: (res) => {
        this.isLoading = false;

        this.vendor = res.Data.data.Table0;

        let table = this.vendor;

        if (this.VendorName.trim() !== "") {
          const keyword = this.VendorName.toLowerCase();
          table = table.filter((x: any) =>
            (x.Client_Name || "").toLowerCase().includes(keyword)
          );
        }

        if (table && table.length > 0) {
          this.dataSource = new MatTableDataSource(table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.data = [];
          this.showAlertPopup('Information', 'No data found for the selected criteria');
        }
      },

      error: () => {
        this.isLoading = false;
        this.showAlertPopup('Error', 'Failed to load vendor data');
      },
    });
  }

  exportToExcel(): void {
    const data = this.dataSource.data;

    if (!data || data.length === 0) {
      this.showAlertPopup("No data available to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Vendor Master');
    XLSX.writeFile(wb, `VendorMaster_${new Date().toISOString().split("T")[0]}.xlsx`);

    this.showAlertPopup("Excel downloaded successfully");
  }

  AddPOOpen() {
    this.dialog.open(AddVendorComponent, {
      width: '35%',
      height: '39vh',
      disableClose: true
    });
  }
}
