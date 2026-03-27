import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
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
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { finalize } from 'rxjs';
import { IBillingpayfrequency } from '../../../Repository/invoice/IBillingpayfrequency';
export const Pay_TOKEN = new InjectionToken<IBillingpayfrequency>('Pay_TOKEN');

@Component({
  selector: 'app-payfrequency-copy',
  standalone: true,
  imports: [MatCardModule, MatPaginatorModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent,
    CompanyallComponent],
  templateUrl: './billingpayfrequency-copy.component.html',
  styleUrl: './billingpayfrequency-copy.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BillingpayfrequencyService,
    }
  ]
})
export class BillingpayfrequencyCopyComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  BillingpaycopyForm!: FormGroup;
  uploadDisplayedColumns: string[] = ['SNo', 'Paysequenceno', 'Payperiod', 'Startat', 'Endat', 'Salarydate', 'Payperioddays', 'Weeklyholidays', 'Monthlyholidays', 'WorkingHolidays'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  selectedCompanyId: any;
  selectedGroupId: number | null = null;
  selectedCompanyCode: any;
  selectedRowIndex: number | null = null;
  userdetail: any;
  Grouptype: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  billingpay: any;
  billingpays: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  isDatechanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BillingpayfrequencyCopyComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    @Inject(Pay_TOKEN) private service: IBillingpayfrequency,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }


  onClose(): void {
    this.dialogRef.close();
  }

  handleCompanyEvent(company: any): void {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.BindGrouptype();
  }

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
    let value = input.value;

    let numericValue = value.replace(/[^0-9]/g, '');

    const payPeriodDays = Number(row.Pay_Period_Days) || 0;

    let weeklyHolidays = Number(numericValue) || 0;

    if (weeklyHolidays > payPeriodDays) {
      weeklyHolidays = payPeriodDays;
    }

    row.Weekly_Holidays = weeklyHolidays;
    input.value = weeklyHolidays.toString();

    row.Working_Days = payPeriodDays - weeklyHolidays;
  }



  AddPOOpen(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    const groupId = this.BillingpaycopyForm.get('group')?.value;
    if (groupId === null || groupId === undefined) {
      alert("Please select Group.");
      return;
    }

    if (this.BillingpaycopyForm.invalid) {
      alert('Please select Start Date and End Date.');
      return;
    }

    const startdate = this.BillingpaycopyForm.get('startdate')?.value;
    const enddate = this.BillingpaycopyForm.get('Enddate')?.value;
    this.dataSource = new MatTableDataSource<any>([]);

    this.isLoading = true;

    this.service.GetAdddata(startdate, enddate).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
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
    this.BillingpaycopyForm = this.fb.group({
      // Companycode: [{ value: '', disabled: true }, Validators.required],
      // Group: [{ value: '', disabled: true }],
      // GroupId: [''],
      startdate: [{ value: '', disabled: false }, Validators.required],
      Enddate: [{ value: '', disabled: false }, Validators.required],
      group: [null, Validators.required]
    });

    if (this.editData) {

      this.BillingpaycopyForm.patchValue({
        // Companycode: this.editData.Company_Code,
        // Group: this.editData.Group,
        // GroupId: this.editData.Group_Id,
        startdate: this.formatDate(this.editData.Starting_Date),
        Enddate: this.formatDate(this.editData.Ending_Date)
      });

      this.loadBillingPayTable();
    }
    this.BillingpaycopyForm.get('startdate')?.valueChanges.subscribe(() => {
      this.onDateChange();
    });

    this.BillingpaycopyForm.get('Enddate')?.valueChanges.subscribe(() => {
      this.onDateChange();
    });
  }

  BindGrouptype() {
    const companyid = this.selectedCompanyId;
    this.service.Getgrouptype(companyid).subscribe({
      next: res => {
        this.Grouptype = res.Data.data.Table0;
      }
    });
  }

  loadBillingPayTable() {
    this.dataSource = new MatTableDataSource<any>([]);

    const companyId = this.editData.Company_Id;
    const startdate = this.BillingpaycopyForm.get('startdate')?.value;
    const enddate = this.BillingpaycopyForm.get('Enddate')?.value;

    this.isLoading = true;
    this.service.CopySearch(companyId, startdate, enddate).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
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
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
  }
  onSave() {

    if (!this.selectedCompanyId) {
      alert("Please select company.");
      return;
    }

    const groupId = this.BillingpaycopyForm.get('group')?.value;
    if (groupId === null || groupId === undefined) {
      alert("Please select Group.");
      return;
    }

    if (this.BillingpaycopyForm.invalid) {
      alert("Please fill Start and End dates.");
      return;
    }

    if (this.dataSource.data.length === 0) {
      alert("No rows available to save.");
      return;
    }

    const startdate = this.BillingpaycopyForm.get('startdate')?.value;
    const enddate = this.BillingpaycopyForm.get('Enddate')?.value;
    const row = this.dataSource.data[0];

    const payload = {
      createdBy: this.userdetail?.user_Id,
      mode: "Copy",

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
        Start_At: this.formatDate(row.Start_At ?? row.FirstDay),
        End_At: this.formatDate(row.End_At ?? row.LastDay),
        Salary_Date: this.formatDate(row.Salary_Date ?? row.SalaryDate),
        Pay_Period_Days: row.Pay_Period_Days,
        Weekly_Holidays: row.Weekly_Holidays ?? row.Weekly_Holyday,
        Monthly_Holidays: row.Monthly_Holidays ?? row.Monthly_Holyday,
        Other_Holidays: row.Other_Holidays,
        Working_Days: row.Working_Days
      }))
    };

    this.isLoading = true;
    this.service.Addsave(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {
        const sucessmsg = res.Data?.message;
        if (sucessmsg.includes("Success")) {
          alert(sucessmsg);
          this.dialogRef.close('edit');
        } else {
          alert(res.Data.message);
        }
      },
      error: err => {
        alert("Failed to save!");
        console.error(err);
      }
    });
  }

  onDateChange() {
    this.isDatechanged = true;
    this.dataSource = new MatTableDataSource<any>([]);
  }

}

