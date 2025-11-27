import { Component, Inject, ViewChild } from '@angular/core';
import { AddCPFslabDetailsComponent } from '../add-cpfslab-details/add-cpfslab-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CPFslabDetailsService } from '../../../Service/GlobalMasters/cpfslab-details.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cpfslab-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cpfslab-details.component.html',
  styleUrls: ['./cpfslab-details.component.css']
})
export class CPFslabDetailsComponent {
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  Cpfform!: FormGroup;
  categories: any[] = [];
  selectedCategory: any;


  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'PayCodeId',
    'PayCode',
    'Description',
    'CopyType',
    'From_Age',
    'To_Age',
    'From_Value',
    'To_Value',
    'Criteria_Type_Name',
    'Criteria',
    'Formula',
    'EffectiveDate'
  ];
  filterDisplayedColumns: string[] = [
    'filter_Action',
    'filter_SNo',
    'filter_PayCodeId',
    'filter_PayCode',
    'filter_Description',
    'filter_CopyType',
    'filter_From_Age',
    'filter_To_Age',
    'filter_From_Value',
    'filter_To_Value',
    'filter_Criteria_Type_Name',
    'filter_Criteria',
    'filter_Formula',
    'filter_EffectiveDate'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedPaycode: any;
  isLoading: boolean | undefined;

  constructor(
    private cpfService: CPFslabDetailsService,
    private _sessionStorage: SessionStorageService,
    private decry: EncryptionService,
    private dialog: MatDialog,
    private fb: FormBuilder,

  ) { }

  ngOnInit(): void {
    const json = this._sessionStorage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.Cpfform = this.fb.group({
      Category: [''],
      Paycode: ['']
    });

    this.loadCategories();
  }
  onSearchClick(): void {
    this.showTable = true;

    const payload = {
      Category: this.Cpfform.get('Category')?.value || null,
      Paycode: this.Cpfform.get('Paycode')?.value || null
    };

    console.log('Payload:', JSON.stringify(payload));

    this.cpfService.CDFSearch(payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res.Data.data);

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
        console.error('Error fetching CPF slab data:', err);
        alert('Failed to load CPF slab details.');
      }
    });
  }
  exportToExcel(): void {


    const payload = {
      Category: this.Cpfform.get('Category')?.value || null,
      Paycode: this.Cpfform.get('Paycode')?.value || null
    };

    console.log('Payload:', JSON.stringify(payload));

    this.cpfService.CDFSearch(payload).subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CPF');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CPF_Details_${timestamp}.xlsx`;


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


  loadCategories(): void {
    this.isLoading = true;
    this.cpfService.GetCategory().subscribe({
      next: (res: any) => {
        console.log('Categories API Response:', res);

        if (res?.StatusCode === 200 && Array.isArray(res?.Data?.data)) {
          this.categories = res.Data.data;
        } else {
          this.categories = [];
          console.warn('No categories found or unexpected response format.');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('CATEGORY API ERROR:', err);
        this.categories = [];
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  AddPOOpen(): void {
    this.dialog.open(AddCPFslabDetailsComponent, {
      width: '70%',
      height: '71.7vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  view(row: any): void {
    console.log('View clicked for:', row);
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.uploadedDataSource.filterPredicate = (data: any, filter: string) =>
      data[column]?.toString().toLowerCase().includes(filter);

    this.uploadedDataSource.filter = filterValue;
  }
}
