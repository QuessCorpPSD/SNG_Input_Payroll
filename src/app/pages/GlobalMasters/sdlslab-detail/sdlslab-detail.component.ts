import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ADDSDLslabDetailComponent } from '../addsdlslab-detail/addsdlslab-detail.component';
import * as XLSX from 'xlsx';
import { SDLslabDetailsService } from '../../../Service/GlobalMasters/sdlslab-details.service';

@Component({
  selector: 'app-sdlslab-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule
  ],
  templateUrl: './sdlslab-detail.component.html',
  styleUrl: './sdlslab-detail.component.css'
})
export class SDLslabDetailComponent {
  uploadedData: any[] = [];
  SDLForm!: FormGroup; // ✅ FormGroup
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();

  uploadDisplayedColumns: String[] = [
    'Action',
    'SNo',
    'PayCode',
    'Description',
    'From_Value',
    'To_Value',
    'Criteria',
    'Criteria_Type_Name',
    'Min_Value',
    'Max_Value'
  ];

  filterDisplayedColumns: String[] = [
    'filter_Action',
    'filter_SNo',
    'filter_PayCode',
    'filter_Description',
    'filter_From_Value',
    'filter_To_Value',
    'filter_Criteria',
    'filter_Criteria_Type_Name',
    'filter_Min_Value',
    'filter_Max_Value'
  ];




  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sdlService: SDLslabDetailsService
  ) { }

  ngOnInit(): void {

    // Load table immediately
    this.onSearchClick();
  }


  onSearchClick(): void {
    this.sdlService.SDLSearch().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);

        if (res?.StatusCode === 200 && res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0;
          if (Array.isArray(data) && data.length > 0) {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.uploadDisplayedColumns = [
              'Action',
              'SNo',
              'PayCode',
              'Description',
              'From_Value',
              'To_Value',
              'Criteria',
              'Criteria_Type_Name',
              'Min_Value',
              'Max_Value'
            ];
          }

        } else {
          console.warn('Unexpected API Response:', res);
          alert('Unexpected API response, check console.');
        }

      },
      error: (err) => {
        console.error('Error fetching SDL slab data:', err);
        alert('Failed to load SDL slab details.');
      }
    });
  }

  exportToExcel(): void {


    this.sdlService.SDLSearch().subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'SDL');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `sdl_slab_${timestamp}.xlsx`;


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

  AddPOOpen(): void {
    this.dialog.open(ADDSDLslabDetailComponent, {
      width: '55%',
      height: '84.5vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any): void {
    console.log('View clicked for:', row);
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data[column]?.toString().toLowerCase().includes(filter);

    this.dataSource.filter = filterValue;
  }
}
