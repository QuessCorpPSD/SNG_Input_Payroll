import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { GSTCreateComponent } from '../gst-create/gst-create.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { GSTEditComponent } from '../gst-edit/gst-edit.component';
import { GSTService } from '../../../Service/GlobalMasters/gst.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import * as XLSX from 'xlsx';
import { IGstRepository } from '../../../Repository/GlobalMasters/IGstRepository';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');


@Component({
  selector: 'app-gst',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatPaginator, CommonModule, MatTooltipModule, FormsModule, AlertpopupComponent],
  templateUrl: './gst.component.html',
  styleUrl: './gst.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GSTService,
    }
  ]
})
export class GSTComponent {
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';
  // Explicit column names must match HTML columnDef values
  uploadDisplayedColumns: string[] = [
    'Action',
    'GST Master Id',
    'Effective Date',
    'GST Number',
    'Company Name',
    'Company Address',
    'Entity'
  ];

  uploadedData: any[] = [];
  userdetail: any;

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(private dialog: MatDialog,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }



  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.onSearchClick();
  }

  onSearchClick(): void {
    this.gstService.Search(this.userdetail.user_Id).subscribe({
      next: (res: any) => {
        console.log('search', res)
        if (res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0 || res?.Data || [];

          if (Array.isArray(data) && data.length > 0) {
            this.uploadedData = data;
            this.uploadedDataSource.data = this.uploadedData;
            this.uploadedDataSource.paginator = this.paginator;

          } else if (res?.Data?.errors) {
            const validationErrors = res.Data.errors;
            const messages: string[] = [];
            Object.keys(validationErrors).forEach(key => {
              messages.push(`${key}: ${validationErrors[key].join(', ')}`);
            });
            alert('Validation Errors:\n' + messages.join('\n'));
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
          } else {
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
            alert('No data found.');
          }
        } else {
          alert('Unexpected API response. Check console.');
          console.warn('Unexpected:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching GST slab data:', err);
      }
    });
  }
  exportToExcel(): void {

    this.gstService.ExporttoExcel(this.userdetail.user_Id).subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'GST');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `GST_Details_${timestamp}.xlsx`;


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

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }
  deleteRow(row: any) {
    if (!confirm("Are you sure you want to delete this GST record?")) return;

    const gstmasterid = row.GstMasterId;
    const userid = this.userdetail.user_Id;

    this.isLoading = true;

    this.gstService.Delete(gstmasterid, userid).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res?.StatusCode == 200 && res?.Data?.response === "Deleted Successfully") {
          alert(res?.Data?.response);

          this.onSearchClick();
        } else {
          alert(res?.Data?.response || "Error deleting record!");
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Server error while deleting");
      }
    });
  }


  AddPOOpen() {
    const dialogRef = this.dialog.open(GSTCreateComponent, {
      width: '70%',
      height: '56vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add') {
        this.onSearchClick();
      }
    });
  }

  view(row: any) {
    console.log('View clicked for:', row);
  }

  editopen(row: any) {
    const dialogRef = this.dialog.open(GSTEditComponent, {
      width: '70%',
      height: '56vh',
      disableClose: true,
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.onSearchClick();
      }
    });
  }


}
