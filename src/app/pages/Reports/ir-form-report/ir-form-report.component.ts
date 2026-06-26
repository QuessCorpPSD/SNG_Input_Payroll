import { CommonModule } from '@angular/common';
import { Component, Inject, TrackByFunction } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { APIResponse } from '../../../Models/apiresponse';
import { PayslipService } from '../../../Service/Reports/payslip.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { IreportService } from '../../../Repository/Reports/Ireportservice';
import { IRFormService } from '../../../Service/Reports/IR-form.service';
import { PdfService } from '../../../Service/pdf.service';

type RawRow = Record<string, any>;

interface ViewRow {
  Employee_Id: number;
  Name: string;
  Date_Of_Joining: string;
  Designation_Name: string;
}


@Component({
  selector: 'app-ir-form-report',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule],
  templateUrl: './ir-form-report.component.html',
  styleUrl: './ir-form-report.component.css'
})
export class IRFormReportComponent {
  companyId: any;
  selectedCompanyCode: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPPid?: string;
  selectedPP?: string;
  isLoading: boolean = false;
  rows: ViewRow[] = [];
  getYear: any[] = [];
  filteredRows: any[] = [];
  searchText: string = '';
  apiResponse: any;
  downloadapiResponse: any;
  pageSize = 10;
  currentPage = 0;
  paginatedData: any[] = [];
  formName: any;
  showTable = false;
  Year: any;
  previousFormName: string = '';
  months: { name: string, value: string }[] = [
    { name: 'January', value: 'January' },
    { name: 'February', value: 'February' },
    { name: 'March', value: 'March' },
    { name: 'April', value: 'April' },
    { name: 'May', value: 'May' },
    { name: 'June', value: 'June' },
    { name: 'July', value: 'July' },
    { name: 'August', value: 'August' },
    { name: 'September', value: 'September' },
    { name: 'October', value: 'October' },
    { name: 'November', value: 'November' },
    { name: 'December', value: 'December' }
  ];
  Month: string = '';

  constructor(private irservice: IRFormService, public pdfservice: PdfService) { }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.Employee_Id;

  ngOnInit(): void {
    this.BindYear();
    this.payPeriodTypefromParentall = "All";
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.paginatedData = [];
  }

  BindYear() {
    this.irservice.bindYear().subscribe({
      next: res => {
        this.getYear = res.Data.data.Table0;
      }
    });
  };


  Searchclick() {
    this.isLoading = true;
    if (!this.companyId) {
      alert('Please select Company Code');
      this.isLoading = false;
      return;
    }
    this.showTable = true;

    // if (!this.selectedPPid) {
    //   alert('Please select Payperiod');
    //   this.isLoading = false;
    //   return;
    // }

    // this.rows = [
    //   {
    //     Employee_Id: 131,
    //     Employee_Code: 'EMP001',
    //     Name: 'Ravi Kumar',
    //     Date_Of_Joining: '2023-01-10',
    //     Designation_Name: 'Software Engineer',
    //   },
    //   {
    //     Employee_Id: 132,
    //     Employee_Code: 'EMP002',
    //     Name: 'Anita Sharma',
    //     Date_Of_Joining: '2022-07-15',
    //     Designation_Name: 'HR Manager',
    //   },
    //   {
    //     Employee_Id: 133,
    //     Employee_Code: 'EMP003',
    //     Name: 'Vikram Singh',
    //     Date_Of_Joining: '2021-03-20',
    //     Designation_Name: 'Team Lead',
    //   },
    // ];

    // this.filteredRows = [...this.rows];
    // this.setPaginatedData();
    // this.isLoading = false;
    // return;

    this.irservice.GetEmployee(
      this.companyId.toString()
    ).subscribe({
      next: (res: APIResponse) => {
        this.apiResponse = res.Data;

        const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
        if (!table.length) {
          this.isLoading = false;
          return;
        }
        //  normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            Employee_Id: r['Employee_Id'],
            Name: r['First_Name'],
            Date_Of_Joining: r['Date_Of_Joining'],
            Designation_Name: r['Designation_Name'],
          };
          return row;
        });

        this.filteredRows = [...this.rows];
        this.setPaginatedData();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error("error:", err);
      }
    });
  }

  applyFilter() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }

    const filteredResult = this.rows.filter(r =>
      (r.Name && r.Name.toString().toLowerCase().includes(text))
    );

    this.filteredRows = [...filteredResult];
    this.currentPage = 0;
    this.setPaginatedData();
  }

  setPaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredRows.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedData();
  }

  onFormNameChange() {

    if (this.previousFormName &&
      this.previousFormName !== this.formName) {

      this.Month = '';
      this.Year = '';
    }

    this.previousFormName = this.formName;
  }

  // onFormNameChange() {

  //   if (this.formName === 'IR8A') {
  //     // Hide month and clear previous values
  //     this.Month = '';
  //   }

  //   if (this.formName === 'IR21') {
  //     // Optional: clear year when switching forms
  //     // this.Year = '';
  //   }

  //   if (!this.formName) {
  //     this.Month = '';
  //     this.Year = '';
  //   }
  // }

  Download(employeeId: number) {

    // Form validation
    if (!this.formName) {
      alert('Please select Form Name');
      return;
    }

    // IR21 requires Month and Year
    if (this.formName === 'IR21') {

      if (!this.Month) {
        alert('Please select Month');
        return;
      }

      if (!this.Year) {
        alert('Please select Year');
        return;
      }
    }

    // IR8A requires only Year
    if (this.formName === 'IR8A') {

      if (!this.Year) {
        alert('Please select Year');
        return;
      }
    }

    this.isLoading = true;

    if (this.formName === 'IR8A') {

      this.irservice.generate8APdf(
        String(employeeId),
        String(this.Year)
      ).then((res: any) => {

        this.isLoading = false;

        if (res) {
          alert(`${this.formName} file downloaded successfully`);
        }

      }).catch((err) => {
        this.isLoading = false;
        console.error(err);
        // alert('Failed to download IR8A file');
      });

    }
    else if (this.formName === 'IR21') {

      this.irservice.generatePdf(
        String(employeeId),
        String(this.Month),
        String(this.Year)
      ).then((res: any) => {

        this.isLoading = false;

        if (res) {
          alert(`${this.formName} file downloaded successfully`);
        }

      }).catch((err) => {
        this.isLoading = false;
        console.error(err);
        // alert('Failed to download IR21 file');
      });
    }
  }
  // Download(employeeId: number, type) {
  //   this.isLoading = true;
  //   if (type == 'IR8A') {
  //     this.irservice.generate8APdf(String(employeeId)).then((res: any) => {
  //       if (res) {
  //         alert(type + ' file downloaded successfully')
  //         this.isLoading = false;
  //       } else {
  //         this.isLoading = false;
  //       }
  //     });
  //   } else {
  //     this.irservice.generatePdf(String(employeeId)).then((res) => {
  //       if (res) {
  //         alert(type + ' file downloaded successfully')
  //         this.isLoading = false;
  //       } else {
  //         this.isLoading = false;
  //       }
  //     });
  //   }

  // }



}
