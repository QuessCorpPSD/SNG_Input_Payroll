import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild, AfterViewInit, InjectionToken } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardTitle } from '@angular/material/card';

import { ESIslabService } from '../../../Service/GlobalMasters/esislab.service';
import { IESIslab } from '../../../Repository/GlobalMasters/IESIslab';
import { AddESIslabComponent } from '../add-esislab/add-esislab.component';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatDialogRef } from '@angular/material/dialog';


export const Esi_TOKEN = new InjectionToken<IESIslab>('Paycode_TOKEN');

@Component({
  selector: 'app-esislab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardTitle
  ],
  templateUrl: './esislab.component.html',
  styleUrl: './esislab.component.css',
  providers: [
    {
      provide: Esi_TOKEN,
      useClass: ESIslabService
    }
  ]
})
export class ESIslabComponent implements AfterViewInit {

  /* ================= TAB 1 : ESI SLAB ================= */

  esiSlabFromDate: string | null = null;
  esiSlabToDate: string | null = null;
  showEsiSlabTable = false;



  esiSlabColumns: string[] = [
    'Action',
    'SNo',
    'Paycode_Code',
    'Description',
    'Effective_Date',
    'From_Value',
    'To_Value',
    'Criteria',
    'Criteria_Type_Name'
  ];
  esiSlabColumnHeaders: { [key: string]: string } = {
    Action: 'Action',
    SNo: 'SI No',
    Paycode_Code: 'Pay Code',
    Description: 'Description',
    Effective_Date: 'Effective Date',
    From_Value: 'From Value',
    To_Value: 'To Value',
    Criteria: 'Criteria',
    Criteria_Type_Name: 'Criteria Type'
  };


  esiSlabData: any[] = [];
  esiSlabDataSource = new MatTableDataSource<any>([]);



  esiBlockColumns: string[] = [
    'Action',
    'Serial_No',
    'Financial_Year_name',
    'Block_Type_Text',
    'Month_Name'
  ];


  esiBlockColumnHeaders: { [key: string]: string } = {
    Action: 'Action',
    Serial_No: 'SI No',
    Financial_Year_name: 'Effective Date',
    Block_Type_Text: 'Block',
    Month_Name: 'Month'
  };

  esiBlockData: any[] = [];
  esiBlockDataSource = new MatTableDataSource<any>([]);
  showEsiBlockTable = false;
  /* ================= TAB 3 : ESI LOCATION ================= */

  esiLocFromDate: string | null = null;
  esiLocToDate: string | null = null;
  showEsiLocationTable = false;

  /* ===== COLUMN ORDER ===== */
  esiLocationColumns: string[] = [
    'Action',
    'SNo',
    'Paycode_Code',
    'Description',
    'State_Name',
    'City_Name',
    'From_Date',
    'To_Date',
    'From_Value',
    'To_Value',
    'Criteria',
    'Criteria_Type_name'
  ];

  esiLocationColumnHeaders: { [key: string]: string } = {
    Action: 'Action',
    SNo: 'S No',
    Paycode_Code: 'Paycode Code',
    Description: 'Description',
    State_Name: 'State Name',
    City_Name: 'City Name',
    From_Date: 'From Date',
    To_Date: 'To Date',
    From_Value: 'From Value',
    To_Value: 'To Value',
    Criteria: 'Criteria',
    Criteria_Type_name: 'Criteria Type name'
  };


  esiLocationData: any[] = [];
  esiLocationDataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorblock') paginatorblock!: MatPaginator;
  @ViewChild('paginatorlocation') paginatorlocation!: MatPaginator;

  fromDate: any;
  toDate: any;
  showTable: boolean = false;
  payCode: any;
  uploadedData: any;
  uploadedDataSource: any;
  blockEffectiveDate: any;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;
  searchText = '';

  constructor(
    @Inject(Esi_TOKEN) private esiService: ESIslabService,
    private dialog: MatDialog,
    private _sessionStorage: SessionStorageService,
    private decry: EncryptionService,
  ) { }
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


  ngOnInit(): void {
    const json = this._sessionStorage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.esiSlabDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Paycode_Code?.toLowerCase().includes(searchText) ||
        data.Description?.toLowerCase().includes(searchText) ||
        data.Effective_Date?.toLowerCase().includes(searchText) ||
        data.From_Value?.toString().includes(searchText) ||
        data.To_Value?.toString().includes(searchText) ||
        data.Criteria?.toString().includes(searchText) ||
        data.Criteria_Type_Name?.toString().includes(searchText)
      );
    };
    this.esiBlockDataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Financial_Year_name?.toLowerCase().includes(searchText) ||
        data.Block_Type_Text?.toLowerCase().includes(searchText) ||
        data.Month_Name?.toLowerCase().includes(searchText)

      );
    };
  }
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.esiSlabDataSource.filter = filterValue;
    this.esiBlockDataSource.filter = filterValue;
  }
  ngAfterViewInit(): void {
    this.esiSlabDataSource.paginator = this.paginator;
    this.esiBlockDataSource.paginator = this.paginatorblock;
    this.esiLocationDataSource.paginator = this.paginatorlocation;
  }

  searchEsiSlab() {
    this.isLoading = true;

    if (!this.fromDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    if (!this.toDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }

    if (new Date(this.fromDate) > new Date(this.toDate)) {
      alert('From Date cannot be greater than To Date');
      this.isLoading = false;
      return;
    }

    const payload = {
      FromDate: this.fromDate,
      ToDate: this.toDate
    };

    console.log('ESI Slab Search Payload:', payload);

    this.esiService.SearchESI(payload).subscribe({
      next: (res: any) => {

        const tableData = res?.Data?.data?.Table0 ?? [];

        this.esiSlabData = tableData;
        this.esiSlabDataSource.data = tableData;
        this.showEsiSlabTable = true;
        this.esiSlabDataSource.paginator = this.paginator;

        if (tableData.length === 0) {
          alert('No data found');
        }

        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load ESI slab data');
        this.isLoading = false;
      }
    });
  }

  exportToExcel(): void {
    this.isLoading = true;

    if (!this.fromDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    if (!this.toDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }

    if (new Date(this.fromDate) > new Date(this.toDate)) {
      alert('From Date cannot be greater than To Date');
      this.isLoading = false;
      return;
    }

    const payload = {
      FromDate: this.fromDate,
      ToDate: this.toDate
    };

    console.log('Export Payload:', payload);

    this.esiService.Exporttoexcel(payload).subscribe({
      next: (res: any) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || jsonData.length === 0) {
            alert('No records found');
            this.isLoading = false;
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'ESI_Slab_Report');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `ESI_Slab_Report_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          console.error('Excel generation error', err);
          alert('Failed to generate Excel file');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Export API error', err);
        alert('Failed to export ESI slab data');
        this.isLoading = false;
      }
    });
  }

  openAddEsiSlab(): void {
    this.dialog.open(AddESIslabComponent, {
      width: '72%',
      height: '80vh',
      disableClose: true,
      data: {
        mode: 'ESI_SLAB',
        action: 'Add'
      }
    });
  }
  editEsiSlab(row: any): void {
    const dialogRef = this.dialog.open(AddESIslabComponent, {
      width: '72%',
      height: '80vh',
      disableClose: true,
      data: {
        mode: 'ESI_SLAB',
        action: 'edit',
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.searchEsiSlab();
      }
    });
  }


  searchEsiBlock(): void {
    this.isLoading = true;

    if (!this.blockEffectiveDate) {
      alert('Please select Effective Date');
      this.isLoading = false;
      return;
    }

    this.showEsiBlockTable = true;

    // 🔥 Convert yyyy-MM-dd → dd/MM/yyyy
    const [year, month, day] = this.blockEffectiveDate.split('-');
    const effectiveDate = `${day}/${month}/${year}`;

    console.log('EffectiveDate:', effectiveDate);
    // Example: 01/01/2016

    this.esiService.EsiBlockSearch(effectiveDate).subscribe({
      next: (res: any) => {

        console.log('API Response:', res);

        const tableData = res?.Data?.data?.Table0 ?? [];

        if (Array.isArray(tableData) && tableData.length > 0) {
          this.esiBlockData = tableData;
          this.esiBlockDataSource.data = tableData;
          this.esiBlockDataSource.paginator = this.paginatorblock;
        } else {
          this.esiBlockData = [];
          this.esiBlockDataSource.data = [];
          alert('No data found');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading ESI Block data', err);
        alert('Failed to load ESI Block data');
        this.isLoading = false;
      }
    });
  }



  exportToExcelBlock(): void {
    this.isLoading = true;

    if (!this.blockEffectiveDate) {
      alert('Please select Effective Date');
      this.isLoading = false;
      return;
    }

    //  Convert yyyy-MM-dd → dd/MM/yyyy
    const [year, month, day] = this.blockEffectiveDate.split('-');
    const effectiveDate = `${day}/${month}/${year}`;

    console.log('Export EffectiveDate:', effectiveDate);
    // Example: 01/01/2016

    this.esiService.ExporttoExcel(effectiveDate).subscribe({
      next: (res: any) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data found.');
            this.isLoading = false;
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'ESI_Block');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `esi_block_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load data for export:', err);
        alert('Failed to load data from server.');
        this.isLoading = false;
      }
    });
  }



  openAddEsiBlock(): void {
    this.dialog.open(AddESIslabComponent, {
      width: '50%',
      height: '62vh',
      disableClose: true,
      data: {
        mode: 'ESI_BLOCK',
        action: 'Add'
      }
    });
  }


  openEditEsiBlock(row: any): void {

    const dialogRef = this.dialog.open(AddESIslabComponent, {
      width: '50%',
      height: '64vh',
      disableClose: true,
      data: {
        mode: 'ESI_BLOCK',
        action: 'edit',
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.searchEsiBlock();
      }
    });
  }



  /* ================= ESI LOCATION ================= */

  searchEsiLocation() {
    this.isLoading = true;

    if (!this.esiLocFromDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    if (!this.esiLocToDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }

    if (new Date(this.esiLocFromDate) > new Date(this.esiLocToDate)) {
      alert('From Date cannot be greater than To Date');
      this.isLoading = false;
      return;
    }

    const payload = {
      FromDate: this.esiLocFromDate,
      ToDate: this.esiLocToDate
    };

    console.log('ESI Location Search Payload:', payload);

    this.esiService.searchEsiLocationSlab(payload).subscribe({
      next: (res: any) => {

        const tableData = res?.Data?.data?.Table0 ?? [];
        console.log("search", tableData)
        this.esiLocationData = tableData;
        this.esiLocationDataSource.data = tableData;
        this.showEsiLocationTable = true;
        this.esiLocationDataSource.paginator = this.paginatorlocation;

        if (tableData.length === 0) {
          alert('No data found');
        }

        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load ESI Location data');
        this.isLoading = false;
      }
    });
  }

  exportEsiLocationToExcel(): void {
    this.isLoading = true;

    if (!this.esiLocFromDate) {
      alert('Please select From Date');
      this.isLoading = false;
      return;
    }

    if (!this.esiLocToDate) {
      alert('Please select To Date');
      this.isLoading = false;
      return;
    }

    if (new Date(this.esiLocFromDate) > new Date(this.esiLocToDate)) {
      alert('From Date cannot be greater than To Date');
      this.isLoading = false;
      return;
    }

    const payload = {
      FromDate: this.esiLocFromDate,
      ToDate: this.esiLocToDate
    };

    console.log('ESI Location Export Payload:', payload);

    this.esiService.exportEsiLocationToExcel(payload).subscribe({
      next: (res: any) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          if (!jsonData || jsonData.length === 0) {
            alert('No records found');
            this.isLoading = false;
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'ESI_Location_Report');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `ESI_Location_Report_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;

        } catch (err) {
          console.error('Excel generation error', err);
          alert('Failed to generate Excel file');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Export API error', err);
        alert('Failed to export ESI Location data');
        this.isLoading = false;
      }
    });
  }
  openAddEsiLocation(): void {
    this.dialog.open(AddESIslabComponent, {
      width: '72%',
      height: '81vh',
      disableClose: true,
      data: {
        mode: 'ESI_LOCATION',
        action: 'Add'
      }
    });
  }
  editEsiLocation(row: any): void {
    const dialogRef = this.dialog.open(AddESIslabComponent, {
      width: '72%',
      height: '81vh',
      disableClose: true,
      data: {
        mode: 'ESI_LOCATION',
        action: 'edit',
        row: row
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated' || result === true) {
        this.searchEsiLocation();
      }
    });
  }



  deleteEsiSlab(row: any): void {

    this.isLoading = true;

    if (!row || !row.ESI_Slab_Id) {
      alert('Invalid record selected');
      this.isLoading = false;
      return;
    }

    const confirmDelete = confirm(
      'Are you sure you want to delete this ESI Slab?'
    );

    if (!confirmDelete) {
      this.isLoading = false;
      return;
    }

    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id.toString(),

      ESISlab: {
        ESI_Slab_Id: Number(row.ESI_Slab_Id),
        Paycode_Id: 0,
        Effective_Date: ''
      },

      ESISlabDetail: [
        {
          From_Value: '',
          To_Value: '',
          Criteria: '',
          Criteria_Type_Id: 0,
          ESI_Slab_Detail_Id: 0
        }
      ]
    };

    console.log('DELETE PAYLOAD:', JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiSlab(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {

          const msg = res?.Data?.response;

          if (msg?.toLowerCase().includes('failed')) {
            alert(msg);
            return;
          }

          alert(msg || 'ESI Slab deleted successfully');

          this.searchEsiSlab();

        } else {
          alert(res?.Message || 'Delete failed');
        }
      },
      error: () => {
        this.isLoading = false; // ✅ ADD
        alert('Delete API error');
      }
    });
  }



  deleteEsiBlock(row: any): void {

    this.isLoading = true;

    if (!row || !row.ESI_Block_Id) {
      alert('Please select a row to delete.');
      this.isLoading = false;
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this ESI Block?');
    if (!confirmDelete) {
      this.isLoading = false;
      return;
    }

    const payload = {
      mode: 'Delete',
      CreatedBy: this.userdetail?.user_Id?.toString(),
      main: {
        Effectivedate: row.Effective_date || '',
        ESIBlockId: row.ESI_Block_Id.toString(),

        ESIBlockDetailsResponse: {
          ESIBlockDetails: [
            {
              ESIBlockDetailsId: row.ESIBlockDetailsId?.toString() || '0',
              BlockTypeId: row.Block_Type_Id.toString(),
              FrequencyId: row.Frequency_Id.toString()
            }
          ]
        }
      }
    };

    console.log('ESI BLOCK DELETE PAYLOAD (FIXED):', JSON.stringify(payload, null, 2));
    console.log('ESI BLOCK DELETE PAYLOAD:', JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiblock(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {
          alert(res?.Data?.response);
          this.searchEsiBlock();
        } else {
          alert(res?.Message || 'Delete failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Delete API Error:', err);
        alert('Delete API Error');
      }
    });
  }

  private formatToDDMMYYYY(date: string | null): string | null {
    if (!date) return null;

    // expected input: yyyy-MM-dd
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  deleteEsiLocation(row: any): void {

    this.isLoading = true;

    if (!row || !row.ESI_Location_Slab_Id) {
      alert('Please select a row to delete.');
      this.isLoading = false;
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this ESI Block?');
    if (!confirmDelete) {
      this.isLoading = false;
      return;
    }

    const payload = {
      mode: 'Delete',
      CreatedBy: this.userdetail?.user_Id?.toString(),

      ESILocationSlab: {
        ESI_Location_Slab_Id: Number(row.ESI_Location_Slab_Id) ?? 0,

        From_Date: this.formatToDDMMYYYY(row.From_Date),
        To_Date: this.formatToDDMMYYYY(row.To_Date),

        Paycode_Id: Number(row.Paycode_Id),
        State_ID: Number(row.State_Id),
        City_ID: Number(row.City_Id)
      },

      ESILocationSlabDetails: [{
        From_Value: String(row.From_Value ?? 0),
        To_Value: String(row.To_Value ?? 0),
        Criteria: String(row.Criteria ?? ''),
        Criteria_Type_Id: Number(row.Criteria_Type_Id),
        ESI_Location_Slab_Detail_id: row.ESI_location_Slab_Detail_Id
      }]
    };

    console.log('ESI BLOCK DELETE PAYLOAD:', JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiLocationSlab(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.response);
          this.searchEsiLocation();
        } else {
          alert(res?.Message || 'Delete failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Delete API Error:', err);
        alert('Delete API Error');
      }
    });
  }




}
