import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { BillingpayfrequencyService } from '../../../Service/invoice/billingpayfrequency.service';

@Component({
  selector: 'app-payfrequency-edit',
  standalone: true,
  imports: [MatCardModule, MatPaginatorModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './payfrequency-edit.component.html',
  styleUrl: './payfrequency-edit.component.css'
})
export class PayfrequencyEditComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  BillingpayeditForm!: FormGroup;
  uploadDisplayedColumns: string[] = ['SNo', 'Paysequenceno', 'Payperiod', 'Startat', 'Endat', 'Salarydate', 'Payperioddays', 'Weeklyholidays', 'Monthlyholidays', 'WorkingHolidays'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  selectedCompanyId: any;
  selectedCompanyCode: any;
  selectedRowIndex: number | null = null;
  isLoading = false;
  userdetail: any;
  Grouptype: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  billingpay: any;
  billingpays: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PayfrequencyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private service: BillingpayfrequencyService,
  ) { }


  onClose(): void {
    this.dialogRef.close();
  }

  handleCompanyEvent(company: any): void {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

  }
  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  deleteSelectedRow() {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to delete.");
      return;
    }

    this.uploadedData.splice(this.selectedRowIndex, 1);
    this.uploadedDataSource.data = [...this.uploadedData];
    this.selectedRowIndex = null;
  }
  onWeeklyHolidayChange(event: Event, row: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const numericValue = value.replace(/[^0-9]/g, '');

    row.Weekly_Holidays = numericValue;

    const payPeriodDays = Number(row.Pay_Period_Days) || 0;
    const weeklyHolidays = Number(row.Weekly_Holidays) || 0;
    row.Working_Days = payPeriodDays - weeklyHolidays;
  }



  AddPOOpen(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }


  }


  ngOnInit(): void {
    this.BillingpayeditForm = this.fb.group({
      Companycode: [{ value: '', disabled: true }, Validators.required],
      Group: [{ value: '', disabled: true }],
      GroupId: [''],
      startdate: [{ value: '', disabled: true }, Validators.required],
      Enddate: [{ value: '', disabled: true }, Validators.required]
    });

    if (this.editData) {
      this.selectedCompanyId = this.editData.Company_Id;

      this.BillingpayeditForm.patchValue({
        Companycode: this.editData.Company_Code,
        Group: this.editData.Group,
        GroupId: this.editData.Group_Id,
        startdate: this.editData.Starting_Date,
        Enddate: this.editData.Ending_Date
      });

      this.loadBillingPayTable();
    }
  }
  loadBillingPayTable() {
    this.dataSource = new MatTableDataSource<any>([]);

    const companyId = this.editData.Company_Id;

    this.service.Search(companyId).subscribe({
      next: (res) => {
        this.billingpay = res.Data.data.Table0;

        if (!this.billingpay || this.billingpay.length === 0) {
          alert("No Billing Pay data found");
          return;
        }

        this.dataSource = new MatTableDataSource(this.billingpay);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading data', err);
      }
    });
  }
  onSave() {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      this.isLoading = false;
      alert("Please select company.");
      return;
    }

    if (this.BillingpayeditForm.invalid) {
      this.isLoading = false;
      alert("Please fill Start and End dates.");
      return;
    }

    if (this.dataSource.data.length === 0) {
      this.isLoading = false;
      alert("No rows available to save.");
      return;
    }

    const startdate = this.BillingpayeditForm.get('startdate')?.value;
    const enddate = this.BillingpayeditForm.get('Enddate')?.value;
    const groupId = this.BillingpayeditForm.get('GroupId')?.value;
    const row = this.dataSource.data[0];

    const payload = {
      createdBy: this.userdetail?.User_Id ?? 0,
      mode: "Add",

      parentDetail: {
        Pay_Frequency_Id: row.Pay_Frequency_Id,
        Group_Id: groupId,
        Company_Id: this.selectedCompanyId,
        Starting_Date: startdate,
        Ending_Date: enddate
      },

      ChildDetail: this.dataSource.data.map((row: any) => ({
        Pay_Frequency_Detail_Id: row.Pay_Frequency_Detail_Id,
        Pay_Frequency_Id: row.Pay_Frequency_Id,
        Pay_Sequence_Number: row.Pay_Sequence_Number,
        Pay_Period: row.Pay_Period,
        Start_At: row.Start_At,
        End_At: row.Start_At,
        Salary_Date: row.Salary_Date,
        Pay_Period_Days: row.Pay_Period_Days,
        Weekly_Holidays: row.Weekly_Holidays,
        Monthly_Holidays: row.Monthly_Holidays,
        Other_Holidays: row.Other_Holidays,
        Working_Days: row.Working_Days
      }))
    };

    console.log("SENDING PAYLOAD:", JSON.stringify(payload));


    this.service.Addsave(payload).subscribe({
      next: res => {
        this.isLoading = false;
        alert(res.Data.message);
        this.dialogRef.close(true);
      },
      error: err => {
        this.isLoading = false;
        alert("Failed to save!");
        console.error(err);
      }
    });

  }
}
