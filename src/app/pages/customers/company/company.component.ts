import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyaddComponent } from '../companyadd/companyadd.component';
import { CompanyserviceService } from '../../../Service/company/companyservice.service';
import { MatSort } from '@angular/material/sort';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import * as XLSX from 'xlsx';
import { CompanyeditComponent } from "../companyedit/companyedit.component";

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, CompanyallComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {
  selectedCompanyId: any;
  companySearch: any;

  constructor(private dialog: MatDialog, private company: CompanyserviceService,) { }

  showTable = false;
  companyForm!: FormGroup;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'vendorCode', 'companyName', 'companyCode', 'inputDate', 'outputDate', 'active', 'segment', 'subSegment', 'businessUnitName', 'businessUnitLocation', 'sapCustomerCode', 'profitCenterCode', 'workingHours'
  ];

  uploadedData: any[] = []; // 🧾 No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', category: '', date: '', fromvalue: '', tovalue: '', criteria: '', criterianame: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.setUpCustomFilter();
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }



  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
  }

  applyFilter() {
    this.uploadedDataSource.filter = JSON.stringify({
      category: this.filterValues.category.trim().toLowerCase(),
      date: this.filterValues.date.trim().toLowerCase(),
      fromvalue: this.filterValues.fromvalue.trim().toLowerCase(),
      tovalue: this.filterValues.tovalue.trim().toLowerCase(),
      criteria: this.filterValues.criteria.trim().toLowerCase(),
      criterianame: this.filterValues.criterianame.trim().toLowerCase(),
    });

    if (this.uploadedDataSource.paginator) {
      this.uploadedDataSource.paginator.firstPage();
    }
  }

  onsearch() {
    this.isLoading = true;
    this.showTable = true;

    const companyCode = this.selectedCompanyId;
    this.company.searchCompany(companyCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log(res.Data?.data);
        this.companySearch = res.Data?.data;
        console.log(this.companySearch);
        if (this.companySearch && this.companySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.companySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'Action', 'slNo', 'vendorCode', 'companyName', 'companyCode', 'inputDate', 'outputDate', 'active', 'segment', 'subSegment', 'businessUnitName', 'businessUnitLocation', 'sapCustomerCode', 'profitCenterCode', 'workingHours'
          ];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });
  }

  exportToExcel(): void {
    this.company.exportCompany().subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;
          console.log(jsonData)

          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup(res.Data.message);
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'company');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Company_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          alert('An error occurred while exporting data.')
        }
      },
      error: (err) => {
        alert('Failed to load data from server.')
      },
    });
  }

  ngOnInit(): void {
    this.companyForm = new FormGroup({
      CompanyCode: new FormControl(''),
      CompanyCodeName: new FormControl(''),
    })
  }

  AddCompanyMasterOpen() {
    this.dialog.open(CompanyaddComponent, {
      width: '95%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  EditCompanyMasterOpen() {
    this.dialog.open(CompanyeditComponent, {
      width: '95%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

}
