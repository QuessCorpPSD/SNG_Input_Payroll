import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit, InjectionToken, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { IncomeLoss } from '../../../Repository/TaxAndSavings/IncomeLoss';
import { IncomeLossService } from '../../../Service/TaxAndSavings/income-loss.service';
import { MatDialog } from '@angular/material/dialog';
export const Income_TOKEN = new InjectionToken<IncomeLossService>('Paycode_TOKEN');


@Component({
  selector: 'app-income-loss-on-house-property',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    CompanyallComponent,
    FormsModule
  ],
  templateUrl: './income-loss-on-house-property.component.html',
  styleUrl: './income-loss-on-house-property.component.css',
  providers: [
    {
      provide: Income_TOKEN,
      useClass: IncomeLossService
    }

  ]
})
export class IncomeLossOnHousePropertyComponent implements OnInit, AfterViewInit {
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  userdetail: any;
  isAddclicked = false;
  incomeForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  data: any[] = [];
  UploadedResponse: any;
  typeList: any[] = [];
  financialYearList: any[] = [];
  employees: any[] = [];
  fyear!: number;
  popupYear: any[] = [];
  popupEmployees: any[] = [];
  popupFYear!: number;
  popupEmployeeId!: number;
  selectedRow: any = null;
  selectedEmployeeCode: any;




  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'CompanyCode',
    'EmployeeId',
    'EmployeeName',
    'FinancialYear',
    'Type',
    'Date',
    'EligibleLetOutExemption',
    'EligibleHouseExemption'
  ];
  searchText: any;
  CompanyId: any;
  CompanyCode: any;
  empCode: any;

  constructor(
    private fb: FormBuilder,
    private decry: EncryptionService,
    private dialog: MatDialog,
    private _sessionStoreage: SessionStorageService,
    @Inject(Income_TOKEN) private service: IncomeLossService,
  ) { }


  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  ngOnInit(): void {
    const today = new Date().toISOString().substring(0, 10);

    this.incomeForm = this.fb.group({
      Company_Code: [null, Validators.required],
      Employee_Code: ['', Validators.required],
      Employee_Name: [''],
      financialYear: ['', Validators.required],
      type: ['', Validators.required],
      Date: [today, Validators.required],
      Income_House_Property: [''],
      Municipal_Tax_Paid: [''],
      Net_Income_House_Property: [''],
      Insurance_Charge_Paid: [''],
      Net_Annual_Value: [''],
      No_Of_Let_Out_Property: [''],
      Repair_Collection_30: [''],
      Let_Out_Eligible_Interest: [''],
      Eligible_Let_Out_Exemption: [''],
      No_Of_Property: [''],
      Interest_on_Housing_Loan: [''],
      Let_Out_Effective_Date: [today],
      Self_Occupied_Effective_Date: [today],
      Eligible_Interest_Housing_Loan: [''],
      Addition_Exemption: [''],
      Eligible_Housing_Exemption: ['']
    });

    this.incomeForm.get('Employee_Name')?.disable();
    this.incomeForm.get('Net_Income_House_Property')?.disable();
    this.incomeForm.get('Net_Annual_Value')?.disable();
    this.incomeForm.get('Repair_Collection_30')?.disable();
    this.incomeForm.get('Eligible_Let_Out_Exemption')?.disable();
    this.incomeForm.get('Eligible_Interest_Housing_Loan')?.disable();
    this.incomeForm.get('Eligible_Housing_Exemption')?.disable();


    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.BindType();
    this.BindPopupFinancialYear();


    this.incomeForm.get('financialYear')?.valueChanges.subscribe(() => {
      this.loadEmployeesForAdd();
    });


    this.incomeForm.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.tryBindPopupEmployee();
    });
  }

  // ngOnInit(): void {
  //   const today = new Date().toISOString().substring(0, 10);


  //   this.incomeForm = this.fb.group({
  //     Company_Code: [null, Validators.required],
  //     Employee_Code: ['', Validators.required],
  //     Employee_Name: ['', Validators.required],
  //     financialYear: ['', Validators.required],
  //     type: ['', Validators.required],
  //     Date: [today, Validators.required],
  //     Income_House_Property: [''],
  //     Municipal_Tax_Paid: [''],
  //     Net_Income_House_Property: [''],
  //     Insurance_Charge_Paid: [''],
  //     Net_Annual_Value: [''],
  //     No_Of_Let_Out_Property: [''],
  //     Repair_Collection_30: [''],
  //     Let_Out_Eligible_Interest: [''],
  //     Eligible_Let_Out_Exemption: [''],
  //     No_Of_Property: [''],
  //     Interest_on_Housing_Loan: [''],
  //     Let_Out_Effective_Date: [today],
  //     Self_Occupied_Effective_Date: [today],
  //     Eligible_Interest_Housing_Loan: [''],
  //     Addition_Exemption: [''],
  //     Eligible_Housing_Exemption: ['']
  //   });

  //   // Disable fields that should not be editable
  //   this.incomeForm.get('Employee_Name')?.disable();
  //   this.incomeForm.get('Net_Income_House_Property')?.disable();
  //   this.incomeForm.get('Net_Annual_Value')?.disable();
  //   this.incomeForm.get('Repair_Collection_30')?.disable();
  //   this.incomeForm.get('Eligible_Let_Out_Exemption')?.disable();
  //   this.incomeForm.get('Eligible_Interest_Housing_Loan')?.disable();
  //   this.incomeForm.get('Eligible_Housing_Exemption')?.disable();


  //   const json = this._sessionStoreage.getItem('UserProfile');
  //   if (json) {
  //     this.userdetail = JSON.parse(this.decry.decrypt(json));
  //   } else {
  //     console.warn('UserProfile not found in the session Storage');
  //   }
  //   this.dataSource.filterPredicate = (data: any, filter: string) => {
  //     const searchText = filter.toLowerCase();

  //     return (
  //       data.Financial_Year_Name?.toLowerCase().includes(searchText) ||
  //       data.Effective_Date?.toLowerCase().includes(searchText) ||
  //       data.Tax_Id?.toLowerCase().includes(searchText) ||
  //       data.Description?.toString().includes(searchText) ||
  //       data.Category?.toString().includes(searchText) ||
  //       data.Computation_Rule?.toString().includes(searchText)
  //     );
  //   };
  //   this.BindType();
  //   this.BindPopupFinancialYear()

  //   this.incomeForm.get('financialYear')?.valueChanges.subscribe(() => {
  //     this.loadEmployeesForAdd();
  //   });
  //   this.incomeForm.get('Employee_Code')?.valueChanges.subscribe(() => {
  //     this.tryBindPopupEmployee();
  //   });
  //   if (this.isEditMode = true) {
  //     this.incomeForm.get('Employee_Code')?.valueChanges.subscribe(() => {
  //       this.tryBindPopupEmployee();
  //     });

  //   } else {
  //     this.incomeForm.get('Employee_Code')?.valueChanges.subscribe(() => {
  //       this.tryBindPopupEmployee();
  //     });

  //   }


  // }
  calculateHouseProperty() {

    const income =
      Number(this.incomeForm.get('Income_House_Property')?.value) || 0;

    const municipalTax =
      Number(this.incomeForm.get('Municipal_Tax_Paid')?.value) || 0;

    const insuranceCharge =
      Number(this.incomeForm.get('Insurance_Charge_Paid')?.value) || 0;

    const letOutInterestRaw =
      this.incomeForm.get('Let_Out_Eligible_Interest')?.value;

    const letOutInterest = Number(letOutInterestRaw) || 0;

    const housingLoanInterest =
      Number(this.incomeForm.get('Interest_on_Housing_Loan')?.value) || 0;

    const additionExemption =
      Number(this.incomeForm.get('Addition_Exemption')?.value) || 0;

    const netAnnualValue = income - municipalTax - insuranceCharge;

    const repairCollection = (netAnnualValue * 30) / 100;


    const netIncome = netAnnualValue - repairCollection;

    const patchObj: any = {
      Net_Annual_Value: netAnnualValue,
      Repair_Collection_30: repairCollection,
      Net_Income_House_Property: netIncome,
      Eligible_Interest_Housing_Loan: housingLoanInterest
    };


    if (letOutInterestRaw !== null && letOutInterestRaw !== '') {

      const eligibleLetOutExemption = -(netIncome - letOutInterest);
      patchObj.Eligible_Let_Out_Exemption = eligibleLetOutExemption;

      let housingExemption =
        housingLoanInterest - Math.abs(eligibleLetOutExemption) + additionExemption;

      housingExemption = Math.max(housingExemption, 0);
      housingExemption = Math.min(housingExemption, 200000);

      patchObj.Eligible_Housing_Exemption = housingExemption;

    }

    else {

      let housingExemption =
        housingLoanInterest + additionExemption;

      housingExemption = Math.max(housingExemption, 0);
      housingExemption = Math.min(housingExemption, 200000);

      patchObj.Eligible_Housing_Exemption = housingExemption;
    }

    this.incomeForm.patchValue(patchObj);
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.bindEmpCode();
  }

  bindEmpCode() {
    const companyId = this.selectedCompanyId;
    this.service.getEmpCode(companyId).subscribe({
      next: res => {
        this.empCode = res.Data.data.Table0;
        console.log('employee', this.empCode);
      },
      error: err => console.error(err)
    });

  }

  handleCompanyEvent2(company: any) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.loadEmployeesForAdd();
  }

  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.incomeForm.reset();
  }

  closeclick() {
    this.isAddclicked = false;
  }



  onsearch() {
    this.isLoading = true;

    const companyId = this.selectedCompanyId || 0;
    const employeeId = 0;

    this.service.Search(companyId, employeeId).subscribe({
      next: (res) => {
        this.dataSource.data = [];

        if (res.Data?.statusCode === '400') {
          alert(res.Data.message);
          return;
        }

        this.data = res.Data.data.Table0;

        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          alert('No data found for the selected criteria');
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  exportToExcel() {
    if (!this.selectedCompanyId) {
      alert("Please select a company to export data.");
      return;
    }

    const companyId = this.selectedCompanyId || 0;
    const employeeId = 0;

    this.isLoading = true;

    this.service.Search(companyId, employeeId).subscribe({
      next: (res) => {
        if (res.Data?.statusCode === '400' || !res.Data.data.Table0.length) {
          alert(res.Data?.message || "No data available for export.");
          return;
        }

        const dataToExport = res.Data.data.Table0;
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "HRA_Data");

        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `HRA_Export_${timestamp}.xlsx`;
        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        console.error("Error exporting data", err);
        alert("Failed to export data");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event) {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload one file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('action', 'Income');

    this.service.UploadIncome(formData).subscribe({
      next: (res) => {
        this.UploadedResponse = res;


        if (res.StatusCode === 200 && res.Data?.response?.includes('Successfully')) {
          this.isLoading = false;
          alert(res.Data.response);
        }

        else if (res.StatusCode === 200 && res.Data?.response === 'Failed to import.') {
          const errorArray = JSON.parse(res.Data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message:
              item.Error_Message ||
              item.ERROR_MESSAGE ||
              item.Message ||
              item.message ||
              ''
          }));

          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'Income_Upload_Errors.xlsx');

          this.isLoading = false;
          alert('Import Failed.');
        }

        else {
          alert(res.Data?.response);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error(' Upload failed', err);
        this.isLoading = false;
        alert('Upload failed');
      }
    });
  }
  BindType() {
    this.service.GetTypes().subscribe({
      next: res => {
        this.typeList = res.Data.data.Table0;
        console.log('Type List:', this.typeList);
      },
      error: err => {
        console.error('Error fetching type data', err);
      }
    });
  }

  BindPopupFinancialYear() {
    this.service.GetFinancialYear().subscribe({
      next: res => this.popupYear = res.Data.data.Table0 || []
    });
    this.BindPopupEmployee();
  }

  tryBindPopupEmployee() {
    const companyid =
      this.CompanyId || this.selectedRow?.Company_ID;

    const fyearid =
      this.incomeForm.get('financialYear')?.value ||
      this.selectedRow?.Financial_Year_Id;

    const employeeID = this.incomeForm.get('Employee_Code')?.value;

    if (!companyid || !fyearid || !employeeID) return;

    this.service.GetEmployee2(companyid, fyearid, employeeID).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0?.[0];
        if (!data) return;

        this.incomeForm.patchValue({
          Employee_Name: data.Employee_Name?.trim()
        });
      },
      error: err => console.error('Employee name bind error', err)
    });
  }



  BindPopupEmployee() {
    if (!this.isEditMode) return;

    const companyId = this.selectedRow?.Company_ID;
    const fyearId = this.selectedRow?.Financial_Year_Id;

    if (!companyId || !fyearId) return;
    this.popupEmployees = [];
    this.incomeForm.patchValue({ Employee_Code: null });

    this.service.GetEmployee(companyId, fyearId).subscribe({
      next: res => {
        this.popupEmployees = res?.Data?.data?.Table0;
        this.incomeForm.patchValue({
          Employee_Code: this.selectedRow.Employee_Id
        });
      },
      error: err => console.error('Edit employee bind error', err)
    });
    this.tryBindPopupEmployee();
  }

  loadEmployeesForAdd() {
    if (this.isEditMode) return;

    const companyId = this.CompanyId;
    const fyearId = this.incomeForm.get('financialYear')?.value;

    if (!companyId || !fyearId) return;

    this.service.GetEmployee(companyId, fyearId).subscribe({
      next: res => {
        this.popupEmployees = res?.Data?.data?.Table0 || [];
      },
      error: err => console.error('Add employee load error', err)
    });
  }

  resetForm() {
    this.incomeForm.reset();
    this.isAddclicked = false;
    this.isEditMode = false;
  }

  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;

  }

  SaveData() {
    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }

    const formValue = this.incomeForm.getRawValue();

    const payload = {
      mode: this.isEditMode ? 'Edit' : 'Add',
      createdBy: this.userdetail.user_Id,

      parentDetail: {
        Income_Loss_On_House_Property_Id:
          this.isEditMode ? this.selectedRow.Income_Loss_On_House_Property_Id : 0,

        Declaration_Date: this.formatDate(formValue.Date),
        Employee_Id: formValue.Employee_Code,
        Financial_Year_Id: formValue.financialYear,
        Tax_Code: formValue.Tax_Code || '',

        Income_On_House_Property: Number(formValue.Income_House_Property || 0),
        Municipal_Tax_Paid: Number(formValue.Municipal_Tax_Paid || 0),
        Insurance_Charge_Paid: Number(formValue.Insurance_Charge_Paid || 0),

        Number_Letout_Property: Number(formValue.No_Of_Let_Out_Property || 0),
        Letout_Eligible_Interest: Number(formValue.Let_Out_Eligible_Interest || 0),
        Letout_Effective_Date: this.formatDate(formValue.Let_Out_Effective_Date),

        Number_Of_SelfOccupied_Property: Number(formValue.No_Of_Property || 0),
        Interest_On_Housing_Loan: Number(formValue.Eligible_Interest_Housing_Loan || 0),
        SelfOccupied_Effective_Date: this.formatDate(formValue.Self_Occupied_Effective_Date),

        Eligible_Interest_On_Housing_Loan: Number(formValue.Eligible_Interest_Housing_Loan || 0),
        Additional_Exemption: Number(formValue.Addition_Exemption || 0),

        Declaration_Type_Id: Number(formValue.type),

        Eligible_Housing_Loan: 0,
        Eligible_Housing_Exemption: Number(formValue.Eligible_Housing_Exemption || 0),
        Repair_Collection_30_Percent: Number(formValue.Repair_Collection_30 || 0),

        Net_Annual_Value: Number(formValue.Net_Annual_Value || 0),
        Eligible_Let_Out_Exemption: Number(formValue.Eligible_Let_Out_Exemption || 0),
        Net_income_on_House_property: Number(formValue.Net_Income_House_Property || 0)
      }
    };

    this.service.Create(payload).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);

        const statusCode = res?.Data?.statusCode ?? res?.statusCode;
        const msg = res.Data.data.Table0[0].Error_Message


        if (Number(statusCode) === 200 || Number(statusCode) === 1) {
          alert(msg);
          this.resetForm()
          this.onsearch();

        } else {
          alert(msg);
        }
      },
      error: (err) => {
        console.error('SAVE ERROR:', err);
        alert('Error while saving data');
      }
    });
  }


  EditClick(row: any) {
    if (!row) {
      alert('Invalid record');
      return;
    }

    this.isAddclicked = true;
    this.isEditMode = true;
    this.selectedRow = row;
    console.log("row", row);

    this.incomeForm.patchValue({
      Company_Code: row.Company_Code,
      Employee_Code: row.Employee_Id,
      Employee_Name: row.Employee_Name.trim(),
      financialYear: row.Financial_Year_Id,
      type: row.Declaration_Type_Id,
      Date: row.Declaration_Date,
      Income_House_Property: row.Income_On_House_Property,
      Municipal_Tax_Paid: row.Municipal_Tax_Paid,
      Insurance_Charge_Paid: row.Insurance_Charge_Paid,
      No_Of_Let_Out_Property: row.Number_Letout_property,
      Let_Out_Eligible_Interest: row.LetOut_Eligible_Interest,
      Let_Out_Effective_Date: row.LetOut_Effective_Date,
      No_Of_Property: row.Number_Of_SelfOccupied_Property,
      Interest_on_Housing_Loan: row.Interest_On_Housing_Loan,
      Self_Occupied_Effective_Date: row.SelfOccupied_Effective_Date,
      Eligible_Interest_Housing_Loan: row.Eligible_Interest_On_Housing_Loan,
      Addition_Exemption: row.Additional_Exemption,
      Eligible_Housing_Exemption: row.Eligible_Housing_Exemption,
      Repair_Collection_30: row.Repair_Collection_30_Percent,
      Net_Annual_Value: row.Net_Annual_Value,
      Eligible_Let_Out_Exemption: row.Eligible_Let_Out_Exemption,
      Net_Income_House_Property: row.Net_income_on_House_property
    });
    this.BindPopupEmployee();
    this.calculateHouseProperty();
  }

  onDeleteRow(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }
    const formValue = this.incomeForm.getRawValue();
    const payload = {
      mode: 'Delete',
      createdBy: this.userdetail.user_Id,
      parentDetail: {
        Income_Loss_On_House_Property_Id: row?.Income_Loss_On_House_Property_Id,
        Declaration_Date: this.formatDate(formValue.Date),
        Employee_Id: Number(formValue.Employee_Code),
        Financial_Year_Id: Number(formValue.financialYear),
        Tax_Code: formValue.Tax_Code || '',
        Income_On_House_Property: Number(formValue.Income_House_Property || 0),
        Municipal_Tax_Paid: Number(formValue.Municipal_Tax_Paid || 0),
        Insurance_Charge_Paid: Number(formValue.Insurance_Charge_Paid || 0),
        Number_Letout_Property: Number(formValue.No_Of_Let_Out_Property || 0),
        Letout_Eligible_Interest: Number(formValue.Let_Out_Eligible_Interest || 0),
        Letout_Effective_Date: formValue.Let_Out_Effective_Date ? this.formatDate(formValue.Let_Out_Effective_Date) : null,
        Number_Of_SelfOccupied_Property: Number(formValue.No_Of_Property || 0),
        Interest_On_Housing_Loan: Number(formValue.Eligible_Interest_Housing_Loan || 0),
        SelfOccupied_Effective_Date: formValue.Self_Occupied_Effective_Date ? this.formatDate(formValue.Self_Occupied_Effective_Date) : null,
        Eligible_Interest_On_Housing_Loan: Number(formValue.Eligible_Interest_Housing_Loan || 0),
        Additional_Exemption: Number(formValue.Addition_Exemption || 0),
        Declaration_Type_Id: Number(formValue.type),
        Eligible_Housing_Loan: 0,
        Eligible_Housing_Exemption: Number(formValue.Eligible_Housing_Exemption || 0),
        Repair_Collection_30_Percent: Number(formValue.Repair_Collection_30 || 0),
        Net_Annual_Value: Number(formValue.Net_Annual_Value || 0),
        Eligible_Let_Out_Exemption: Number(formValue.Eligible_Let_Out_Exemption || 0),
        Net_income_on_House_property: Number(formValue.Net_Income_House_Property || 0),
      }
    };

    console.log('DELETE PAYLOAD', JSON.stringify(payload));

    this.service.Create(payload).subscribe({
      next: (res: any) => {
        console.log('API RESPONSE:', res);


        const statusCode = res?.Data?.statusCode ?? res?.statusCode;
        const msg = res.Data.data.Table0[0].Error_Message

        if (Number(statusCode) === 200 || Number(statusCode) === 1) {
          alert(msg);
          // this.resetForm();
          this.onsearch();
        } else {
          alert(msg);
        }
      },
      error: (err) => {
        console.error('Delete Failed', err);
        alert('Error while deleting data');
      }
    });
  }
}








