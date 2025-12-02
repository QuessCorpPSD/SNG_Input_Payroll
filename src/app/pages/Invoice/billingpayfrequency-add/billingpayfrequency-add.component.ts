import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from "@angular/material/card";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BillingpayfrequencyService } from '../../../Service/invoice/billingpayfrequency.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-billingpayfrequency-add',
  standalone: true,
  imports: [MatCardModule, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './billingpayfrequency-add.component.html',
  styleUrl: './billingpayfrequency-add.component.css'
})
export class BillingpayfrequencyAddComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  BillingpayaddForm!: FormGroup;
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
    private dialogRef: MatDialogRef<BillingpayfrequencyAddComponent>,
    private dialog: MatDialog, private service: BillingpayfrequencyService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  handleCompanyEvent(company: any): void {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.BindGrouptype();

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

  AddPOOpen(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    if (this.BillingpayaddForm.invalid) {
      alert('Please select Start Date and End Date.');
      return;
    }

    const startdate = this.BillingpayaddForm.get('startdate')?.value;
    const enddate = this.BillingpayaddForm.get('Enddate')?.value;


    console.log('Start:', startdate, 'End:', enddate);

    this.dataSource = new MatTableDataSource<any>([]);

    this.service.GetAdddata(startdate, enddate).subscribe({
      next: (res) => {
        this.billingpay = res.Data.data.Table0;
        this.billingpays = res.Data.message;

        if (!this.billingpay || this.billingpay.length === 0) {
          alert(this.billingpays);
          this.dataSource = new MatTableDataSource<any>([]);
          return;
        }

        this.dataSource = new MatTableDataSource<any>(this.billingpay);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      }
    });
  }


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BillingpayaddForm = this.fb.group({
      startdate: ['', Validators.required],
      Enddate: ['', Validators.required],
      Group:['']
    })
  }

  BindGrouptype() {
    const companyid = this.selectedCompanyId;
    this.service.Getgrouptype(companyid).subscribe({
      next: res => {
        this.Grouptype = res.Data.data.Table0;
      }
    });
  }
  onSave() {

    if (!this.selectedCompanyId) {
      alert("Please select company.");
      return;
    }

    if (this.BillingpayaddForm.invalid) {
      alert("Please fill Start and End dates.");
      return;
    }

    if (this.dataSource.data.length === 0) {
      alert("No rows available to save.");
      return;
    }

    const startdate = this.BillingpayaddForm.get('startdate')?.value;
    const enddate = this.BillingpayaddForm.get('Enddate')?.value;
    const groupId = this.BillingpayaddForm.get('Group')?.value;

    const payload = {
      createdBy: this.userdetail?.User_Id ?? 0,
      mode: "Add",

      parentDetail: {
        Pay_Frequency_Id: 0,
        Group_Id: groupId,
        Company_Id: this.selectedCompanyId,
        Starting_Date: startdate,
        Ending_Date: enddate
      },

      ChildDetail: this.dataSource.data.map((row: any) => ({
        Pay_Frequency_Detail_Id: 0,
        Pay_Frequency_Id: 0,
        Pay_Sequence_Number: row.Pay_Sequence_Number,
        Pay_Period: row.Pay_Period,
        Start_At: row.FirstDay,
        End_At: row.LastDay,
        Salary_Date: row.SalaryDate,
        Pay_Period_Days: row.Pay_Period_Days,
        Weekly_Holidays: row.Weekly_Holyday,
        Monthly_Holidays: row.Monthly_Holyday,
        Other_Holidays: 0,
        Working_Days: row.Working_Days
      }))
    };

    console.log(payload);

    this.isLoading = true;

    this.service.Addsave(payload).subscribe({
      next: res => {
        this.isLoading = false;
        alert(res?.Data?.message);
      },
      error: err => {
        this.isLoading = false;
        alert("Failed to save!");
        console.error(err);
      }
    });

  }

}
