import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IIncrementService } from '../../../Repository/iincrement.service';
import { promotionIncrementService } from '../../../Service/Promotion/increment.service';
export const Increment_TOKEN = new InjectionToken<IIncrementService>('Increment_TOKEN');

@Component({
  selector: 'app-increament-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginator,
    MatCardModule,
    MatPaginator,
    FormsModule,
    CompanyallComponent,
    PayPeriodComponent
  ],
  templateUrl: './increament-add.component.html',
  styleUrl: './increament-add.component.css',
  providers: [
    {
      provide: Increment_TOKEN,
      useClass: promotionIncrementService,
    }
  ]
})
export class IncreamentADDComponent {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: string = '';
  selectedcompanycode: any;
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;
  rowData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  incrementForm!: FormGroup;
  showErrors = false;
  isEditMode: boolean = false;
  selectedRowIndex: number | null = null;

  uploadedData: any[] = [];
  dataSource1 = new MatTableDataSource<any>([]);


  displayedColumns1: string[] = [
    'SNo',
    'Paycode_Code',
    'PayDescription',
    'Old_Amount',
    'Amount',
    'Difference'
  ];

  constructor(
    private dialogRef: MatDialogRef<IncreamentADDComponent>,
    private fb: FormBuilder,
    private _sessionStoreage: SessionStorageService,
    private leave: promotionIncrementService,
    private decry: EncryptionService, @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.rowData = data.rowData, console.log(this.rowData) }

  ngOnInit(): void {
    const today = new Date().toISOString().substring(0, 10);

    // Initialize the form with rowData if exists
    this.rowData = this.rowData || {}; // fallback

    this.incrementForm = this.fb.group({
      companyCode: [this.rowData.Client_Code ?? '', Validators.required],
      companyName: [{ value: this.rowData.Client_Name ?? '', disabled: true }],
      payrollType: [{ value: this.rowData.Payroll_Type ?? '', disabled: true }],
      employeeId: [this.rowData.Employee_code ?? '', Validators.required],
      employeeName: [{ value: this.rowData.Employee_Name ?? '', disabled: true }],
      dateOfJoin: [this.rowData.Date_Of_Joining ?? today, Validators.required],
      payCategory: [{ value: this.rowData.Pay_Category_Name ?? '', disabled: true }],
      newPayCategory: [this.rowData.New_Pay_Category_Name ?? '', Validators.required],
      annualMonthly: [{ value: this.rowData.Is_Annum ?? '', disabled: true }],
      oldCtc: [{ value: this.rowData.Old_CTC ?? '', disabled: true }],
      newCtc: [this.rowData.New_CTC ?? '', Validators.required],
      salaryMonth: [this.rowData.Pay_Period ?? '', Validators.required],
      revisionDate: [this.rowData.Revision_Date ?? today, Validators.required],
      effectiveDate: [this.rowData.Effective_Date ?? today, Validators.required],
      paySeqNo: [{ value: this.rowData.Pay_Sequence_Number ?? '', disabled: true }],
      postCf: [this.rowData.Post_CF ?? false]
    });

    // User details
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.payPeriodType = "All";


    this.loadTableData();
  }


  loadTableData() {

    this.leave.IncrementSearch(this.rowData.Increment_Id).subscribe({
      next: (res: any) => {

        const tableData = res?.Data?.data?.Table0 ?? [];

        if (!tableData.length) {
          console.warn('No increment details found.');
          this.dataSource1.data = [];
          return;
        }


        this.dataSource1.data = tableData.map(item => ({
          Paycode_Code: item.Paycode_Code ?? '',
          Description: item.Description ?? '',
          Old_Amount: item.Old_Amount ?? 0,
          Amount: item.Amount ?? 0,
          Difference: item.Difference ?? 0
        }));

      },
      error: (err) => {
        console.error('Failed to load table data', err);
        this.dataSource1.data = [];
      }
    });
  }


  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
    console.log(this.selectedCompanyCode);
  }

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }


  onSubmit() {
    this.showErrors = true;

    if (this.incrementForm.invalid) {
      return;
    }

    console.log("Increment Form Submitted:", this.incrementForm.getRawValue());
    this.dialogRef.close(this.incrementForm.getRawValue());
  }


  onCancel() {
    this.incrementForm.reset();
    this.showErrors = false;
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }


  addRow() {
    // if (this.incrementForm.invalid) {
    //   this.incrementForm.markAllAsTouched();
    //   alert('Please fill all required fields.');
    //   return;
    // }
    const newRow = {
      Paycode_Code: '',
      'PayDescription': '',
      'Old_Amount': '',
      'Amount': '',
      'Difference': '',
    };

    this.dataSource1.data = [...this.dataSource1.data, newRow];
  }

  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  deleteRow() {

    if (this.selectedRowIndex === null) {
      alert('Please select at least one row to delete.');
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this ESI Slab?"
    );

    if (!confirmDelete) {
      return;
    }


    const data = this.dataSource1.data;
    data.splice(this.selectedRowIndex, 1);

    this.dataSource1.data = [...data];
    this.selectedRowIndex = null;
  }
  SaveData() {
    if (this.incrementForm.invalid) {
      this.incrementForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    const payload = this.incrementForm.getRawValue();
    console.log('Form Data:', payload);

    alert('Data saved successfully!');
    this.onClose();
  }


}
