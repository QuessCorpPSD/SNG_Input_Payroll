import { Component, Inject, InjectionToken, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');

@Component({
  selector: 'app-employee-salarydetails',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatCardModule, MatPaginatorModule, CommonModule, FormsModule, ReactiveFormsModule, MatSortModule],
  templateUrl: './employee-salarydetails.component.html',
  styleUrl: './employee-salarydetails.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeeSalarydetailsComponent {
  @Input() salaryData: any;  // Input property to receive data
  employeesalary!: FormGroup;

  displayedColumns: string[] = [
    'sno',
    'Paycode',
    'Description',
    'Amount',
    'AmountperAnnum'
  ];

  dataSource = new MatTableDataSource<any>([]); // For table data

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  submitted: any;
  rowData: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeSalarydetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Pay_TOKEN) private service: IEmployeeservice,
  ) {
    console.log("Received Salary Data:", data);

    this.rowData = data.rowData;
  }


  ngOnInit(): void {
    this.initializeForm();
    this.loadSalaryDetails();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initializeForm() {
    this.employeesalary = this.fb.group({
      companycode: ['', Validators.required],
      payrolltype: ['', Validators.required],
      empcode: ['', Validators.required],
      Empname: ['', Validators.required],
      paycategory: [''],
      totalctc: [''],
      Effectivedate: ['', Validators.required],
      DOJ: ['', Validators.required],
      appliedon: [''],
      per: ['', Validators.required]
    });
  }
  formatDate(date: string): string {
    return date.split('T')[0];
  }

  loadSalaryDetails() {
    this.service.SalarySearch(this.rowData.Employee_Id).subscribe((res: any) => {
      let salaryData = res.Data.data.Table0;

      if (!salaryData || salaryData.length === 0) return;

      let first = salaryData[0];


      this.employeesalary.patchValue({
        empcode: first.Employee_Code ?? '',
        Effectivedate: this.formatDate(first.Effective_Date)?.substring(0, 10) ?? '',
        appliedon:  this.formatDate(first.Applied_On)?.substring(0, 10) ?? '',
      });

      this.dataSource.data = salaryData;
    });
  }




  onClose(): void {
    this.dialogRef.close();
  }
}
