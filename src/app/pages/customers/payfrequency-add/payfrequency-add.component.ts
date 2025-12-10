import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { BillingpayfrequencyService } from '../../../Service/invoice/billingpayfrequency.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayfrequencyService } from '../../../Service/CUSTOMER/payfrequency.service';
import { IPayfrequencyservice } from '../../../Repository/customer/IPayfrequency';
export const Pay_TOKEN = new InjectionToken<IPayfrequencyservice>('Pay_TOKEN');

@Component({
  selector: 'app-payfrequency-add',
  standalone: true,
  imports: [MatCardModule, MatPaginatorModule, MatTableModule, MatIconModule, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  templateUrl: './payfrequency-add.component.html',
  styleUrl: './payfrequency-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: PayfrequencyService,
    }
  ]
})
export class PayfrequencyAddComponent {
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
    private dialogRef: MatDialogRef<PayfrequencyAddComponent>,
    private dialog: MatDialog, @Inject(Pay_TOKEN) private service:IPayfrequencyservice,
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
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
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
      createdBy: this.userdetail.user_Id,
      mode: "Add",

      parentDetail: {
        Pay_Frequency_Id: 0,
        Group_Id: groupId,
        Company_Id: this.selectedCompanyId,
        Starting_Date: this.formatDate(startdate),
        Ending_Date: this.formatDate(enddate)
      },

      ChildDetail: this.dataSource.data.map((row: any) => ({
        Pay_Frequency_Detail_Id: 0,
        Pay_Frequency_Id: 0,
        Pay_Sequence_Number: (row.Pay_Sequence_Number).toString(),
        Pay_Period: row.Pay_Period,
        Start_At: this.formatDate(row.FirstDay),
        End_At: this.formatDate(row.LastDay),
        Salary_Date: this.formatDate(row.SalaryDate),
        Pay_Period_Days: row.Pay_Period_Days,
        Weekly_Holidays: row.Weekly_Holyday,
        Monthly_Holidays: row.Monthly_Holyday,
        Other_Holidays: 0,
        Working_Days: row.Working_Days
      }))
    };

    console.log("SENDING PAYLOAD:", JSON.stringify(payload));

    this.isLoading = true;

    this.service.Addsave(payload).subscribe({
      next: res => {
        this.isLoading = false;
        alert(res.Data.data.Table0?.[0].Error_Message);
        this.dialogRef.close('add');
      },
      error: err => {
        this.isLoading = false;
        alert("Failed to save!");
        console.error(err);
      }
    });

  }
}

