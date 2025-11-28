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

export const Pay_TOKEN = new InjectionToken<IGstRepository>('Pay_TOKEN');


@Component({
  selector: 'app-gst',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatPaginator, CommonModule, MatTooltipModule, FormsModule],
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
  constructor(private dialog: MatDialog,
    @Inject(Pay_TOKEN) private gstService: IGstRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }

  // Explicit column names must match HTML columnDef values
  uploadDisplayedColumns: string[] = [
    // 'Action',
    'GST Master Id',
    'Effective Date',
    'GST Number',
    'Company Name',
    'Company Address'
  ];

  uploadedData: any[] = [
    // {
    //   'GST Master Id': '116',
    //   'Effective Date': '13-Oct-2023',
    //   'Quess Legal Entity': 'QUESS',
    //   'Gst Type': 'Type 4',
    //   'State Name': 'SIKKIM',
    //   'GST Number': '11AABCI7601M2ZR',
    //   'PAN Number': 'AABCI7601M',
    //   'TAN Number': 'BLRI03217E',
    //   'Company Name': 'QUESS CORP LIMITED',
    //   'Company Address': '3 AND 4TH FLOOR, SUBBA BUILDING SITUATED'
    // },
    // {
    //   'GST Master Id': '115',
    //   'Effective Date': '13-Oct-2023',
    //   'Quess Legal Entity': 'QUESS',
    //   'Gst Type': 'Type 2',
    //   'State Name': 'SIKKIM',
    //   'GST Number': '11AABCI7601M2ZR',
    //   'PAN Number': 'AABCI7601M',
    //   'TAN Number': 'BLRI03217E',
    //   'Company Name': 'QUESS CORP LIMITED',
    //   'Company Address': '3 AND 4TH FLOOR, SUBBA BUILDING SITUATED'
    // }
  ];
  userdetail: any;

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
        
        if (res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0 || res?.Data || [];

          if (Array.isArray(data) && data.length > 0) {
            this.uploadedData = data;
            this.uploadedDataSource.data = this.uploadedData;
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

  AddPOOpen() {
    this.dialog.open(GSTCreateComponent, {
      width: '70%',
      height: '59.4vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any) {
    console.log('View clicked for:', row);
  }

  editopen() {
    this.dialog.open(GSTEditComponent, {
      width: '70%',
      height: '86vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
}
