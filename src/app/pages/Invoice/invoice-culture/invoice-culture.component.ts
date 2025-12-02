import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InvoiceCultureAddpoComponent } from '../invoice-culture-addpo/invoice-culture-addpo.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyComponent } from '../../../common/company/company.component';
import { InvoiceCultureService } from '../../../Service/invoice-culture.service';

@Component({
  selector: 'app-invoice-culture',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    CompanyComponent
  ],
  templateUrl: './invoice-culture.component.html',
  styleUrls: ['./invoice-culture.component.css']
})
export class InvoiceCultureComponent implements AfterViewInit {

  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  isLoading: boolean = false;
  isTableVisible = false;

  displayedColumns: string[] = [

    "company_Code",
    "company_Name",
    "invoiceCul_Ref_No",
    "invoiceType",
    "map_Name"
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private invoiceService: InvoiceCultureService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  AddPOOpen() {
    this.dialog.open(InvoiceCultureAddpoComponent, {
      width: '60%',
      height: '80vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  SearchClick() {

    if (!this.comapnyId) {
      alert('Please select a valid Company');
      return;
    }

    this.isLoading = true;
    this.isTableVisible = false; 

    this.invoiceService.InvoicecultureSearch(this.comapnyId).subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data) && res.Data.length > 0) {
          this.dataSource.data = res.Data;
          this.isTableVisible = true;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });

        } else {
          this.dataSource.data = [];
          this.isTableVisible = false;
          alert("No Records Found");
        }
      },

      error: (err) => {
        this.isLoading = false;
        this.isTableVisible = false; 
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }


}
