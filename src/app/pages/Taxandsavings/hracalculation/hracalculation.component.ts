import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatRadioModule } from '@angular/material/radio';
import { IHRAcalculation } from '../../../Repository/TaxAndSavings/HRAcalculations';
import { HRAcalculationsService } from '../../../Service/TaxAndSavings/hracalculations.service';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';




export const HRA_TOKEN = new InjectionToken<IHRAcalculation>('Paycode_TOKEN');

@Component({
  selector: 'app-hracalculation',
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
    FormsModule,
    MatRadioModule,
    PayPeriodComponent
  ],
  templateUrl: './hracalculation.component.html',
  styleUrl: './hracalculation.component.css',
  providers: [
    {
      provide: HRA_TOKEN,
      useClass: HRAcalculationsService
    }
  ]
})
export class HRAcalculationComponent {

  selectedCompanyId!: number;
  selectedCompanyCode: any;
  uploadedData: any[] = [];
  showTable: boolean = true;
  userdetail: any;
  isAddclicked = false;
  HRAForm!: FormGroup;
  isEditMode: boolean = false;
  selectedRowIndex: number | null = null;
  selectedEmployeeId: number = 0;
  selectedFinYearId: number = 0;
  isLoading: boolean = false;
  data: any[] = [];
  UploadedResponse: any;
  employee: any[] = [];
  year: any[] = [];
  employees: any[] = [];
  fyear!: number;
  popupYear: any[] = [];
  popupEmployees: any[] = [];
  popupFYear!: number;
  popupEmployeeId!: number;
  types: any[] = [];
  editData: any;
  EDIT = false;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  payperiods: String = '';
  payPeriodId: number = 0;



  dataSource = new MatTableDataSource<any>([]);
  dataSource1 = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'delete',
    'edit',
    'SNo',
    'CompanyCode',
    'EmployeeCode',
    'EmployeeName',
    'DateOfJoining',
    'FromDate',
    'ToDate',
    'PayPeriod',
    'MonthlyRentalPaid',
    'WorkingLocation',
    'Type',
    'ResidingLocation',
    'Metro',
    'TotalExemption'
  ];

  displayedColumns1: string[] = [
    'SNo',
    'PayPeriod',
    'Fixed Basic + DA',
    'Earned Basic + DA',
    'Fixed HRA',
    'Earned HRA',
    'HRA Recevied',
    'Rent Paid',
    'Rent Paid-10% Basic',
    '40 or 50% Basic',
    'HRA Exemption'
  ];
  searchText: any;
  financialyear: any;
  CompanyId: any;
  CompanyCode: any;

  constructor(
    private fb: FormBuilder,
    private decry: EncryptionService,
    private dialog: MatDialog,
    private _sessionStoreage: SessionStorageService,
    @Inject(HRA_TOKEN) private service: IHRAcalculation,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    const today = new Date().toISOString().substring(0, 10);

    this.HRAForm = this.fb.group({
      Company_Code: ['', Validators.required],
      financialYear: ['', Validators.required],
      Date: [today, Validators.required],
      Employee_Code: ['', Validators.required],
      Employee_Name: [''],
      DateOfJoining: [''],
      FromDate: [''],
      ToDate: [''],
      Work_Location: [''],
      Residing_Location: ['', Validators.required],
      Type: ['', Validators.required],
      MonthlyRentPaid: ['', Validators.required],
      TotalExemption: [''],
      Metro: ['', Validators.required],
    });

    this.HRAForm.get('Employee_Name')?.disable();
    this.HRAForm.get('Work_Location')?.disable();
    this.HRAForm.get('TotalExemption')?.disable();


    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.payPeriodType = "All";

    this.HRAForm.get('financialYear')?.valueChanges.subscribe(() => {
      this.BindPopupEmployee();
    });


    this.HRAForm.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.HRAForm.patchValue({
        Employee_Name: '',
        DateOfJoining: '',
        FromDate: '',
        ToDate: '',
        Work_Location: '',
        Metro: ''
      });
    });

    this.BindPopupFinancialYear();
    this.Bindfyear();
    this.BindTypes();

    this.HRAForm.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.tryBindPopupEmployee();
    });
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();
      return (
        data.CompanyCode?.toLowerCase().includes(searchText) ||
        data.EmployeeCode?.toLowerCase().includes(searchText) ||
        data.EmployeeName?.toLowerCase().includes(searchText) ||
        data.DateOfJoining?.toString().includes(searchText) ||
        data.FromDate?.toString().includes(searchText) ||
        data.ToDate?.toString().includes(searchText) ||
        data.PayPeriod?.toLowerCase().includes(searchText) ||
        data.MonthlyRentalPaid?.toLowerCase().includes(searchText) ||
        data.WorkingLocation?.toLowerCase().includes(searchText) ||
        data.Type?.toLowerCase().includes(searchText) ||
        data.ResidingLocation?.toLowerCase().includes(searchText) ||
        data.Metro?.toLowerCase().includes(searchText) ||
        data.TotalExemption?.toLowerCase().includes(searchText)
      );
    };
    this.HRAForm.get('')
  }

  addRow() {
    if (this.HRAForm.invalid) {
      this.HRAForm.markAllAsTouched();
      alert('Please fill all required fields.');
      return;
    }
    const newRow = {
      PayPeriod: '',
      'Fixed Basic + DA': '',
      'Earned Basic + DA': '',
      'Fixed HRA': '',
      'Earned HRA': '',
      'HRA Recevied': '',
      'Rent Paid': '',
      'Rent Paid-10% Basic': '',
      '40 or 50% Basic': '',
      'HRA Exemption': ''
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
      "Are you sure you want to delete this row?"
    );

    if (!confirmDelete) {
      return;
    }
    const data = this.dataSource1.data;
    data.splice(this.selectedRowIndex, 1);

    this.dataSource1.data = [...data];
    this.selectedRowIndex = null;
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    console.log(this.selectedCompanyId)
  }

  handleCompanyEvent2(company: any) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    console.log(this.CompanyId)
    this.BindPopupEmployee();
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log('pay', this.payPeriodId)
    console.log('payperiods', this.payperiods)
  }

  AddPOOpen() {
    this.isAddclicked = true;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  Bindfyear() {
    this.service.GetFinancialYear().subscribe({
      next: res => {
        this.year = res.Data.data.Table0
        console.log('year', this.year)
      }
    });
  }
  onFinancialYearChange(fyearId: any) {
    this.fyear = fyearId;
    this.tryBindEmployee();
  }


  tryBindEmployee() {
    console.log(this.selectedCompanyId, this.fyear);

    if (this.selectedCompanyId && this.fyear) {
      this.Bindemployee();
    }
  }

  Bindemployee() {
    const comapnyid = this.selectedCompanyId;
    const fyearid = this.fyear;
    console.log(this.selectedCompanyId, this.fyear);

    this.service.GetEmployee(comapnyid, fyearid).subscribe({
      next: res => {
        this.employees = res.Data.data.Table0
        console.log('year', this.employee)
      }
    });
  }
  onsearch() {
    this.isLoading = true;

    const companyId = this.selectedCompanyId || 0;
    const employeeId = 0;
    const finYearId = this.selectedFinYearId || 0;

    this.service.Search(companyId, employeeId, finYearId).subscribe({
      next: (res) => {
        this.dataSource.data = [];


        if (res.Data?.statusCode === '400') {
          alert(res.Data.message);
          this.isLoading = false;
          return;
        }
        this.data = res.Data.data.Table0;
        console.log('data', this.data);

        if (this.data && this.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          alert('No data found for the selected criteria');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.isLoading = false;
        alert('Failed to load data');
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
    const finYearId = this.selectedFinYearId || 0;

    this.isLoading = true;
    this.service.Search(companyId, employeeId, finYearId).subscribe({
      next: (res) => {
        this.isLoading = false;

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
        this.isLoading = false;
        console.error("Error exporting data", err);
        alert("Failed to export data");
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

    this.service.UploadHRA(formData).subscribe({
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

          XLSX.writeFile(workbook, 'HRA_Upload_Errors.xlsx');

          this.isLoading = false;
          alert('Import Failed.');
        }

        else {
          alert(res.Data?.response || 'Upload completed with message');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.isLoading = false;
        alert('Upload failed');
      }
    });
  }
  BindPopupFinancialYear() {
    this.service.GetFinancialYear().subscribe({
      next: res => this.popupYear = res.Data.data.Table0 || []
    });
    this.BindPopupEmployee()
  }

  private formatDateDMYtoYMD(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }


  tryBindPopupEmployee() {
    const companyid = this.CompanyId;
    const fyearid = this.HRAForm.get('financialYear')?.value;
    const employeeID = this.HRAForm.get('Employee_Code')?.value;

    if (!companyid || !fyearid || !employeeID) return;

    this.service.GetEmployee2(companyid, fyearid, employeeID).subscribe({
      next: res => {
        const data = res.Data?.data?.Table0?.[0];
        if (!data) return;

        this.HRAForm.patchValue({
          Employee_Name: data.Employee_Name?.trim(),
          DateOfJoining: this.formatDateDMYtoYMD(data.Date_Of_Joining),
          FromDate: this.formatDateDMYtoYMD(data.From_Date),
          ToDate: this.formatDateDMYtoYMD(data.To_Date),

          Work_Location: data.Work_Location || '',
          Metro: data.Is_Metro_City ? 'Yes' : 'No'
        });
      }
    });
  }
  BindPopupEmployee() {
    const companyid = this.CompanyId;
    const formvalue = this.HRAForm.getRawValue();
    const fyearid = formvalue.financialYear;
    console.log('year', fyearid)
    if (companyid && fyearid) {
      this.service.GetEmployee(companyid, fyearid).subscribe({
        next: res => this.popupEmployees = res.Data.data.Table0 || []
      });
    }
  }

  onEmployeeSelectionChange() {
    const companyId = this.selectedCompanyId;
    const financialYrID = this.HRAForm.value.financialYear;
    const employeeID = this.HRAForm.value.Employee_Code;
    console.log('company', companyId)

    if (companyId && financialYrID && employeeID) {

      this.service.GetEmployee2(companyId, financialYrID, employeeID).subscribe({
        next: (res) => {

          if (res.Data && res.Data.data && res.Data.data.length > 0) {
            const employeeData = res.Data.data[0];


            this.HRAForm.patchValue({
              Employee_Name: employeeData.Employee_Name || '',
              Work_Location: employeeData.Work_Location || '',
              TotalExemption: employeeData.Total_Exemption || ''
            });
          } else {
            console.warn('No employee data found for the selected criteria');
          }
        },
        error: (err) => {
          console.error('Error fetching employee data', err);
          alert('Failed to fetch employee data');
        }
      });
    }
  }

  BindTypes() {
    this.service.GetDeclarationTypes().subscribe({
      next: res => {
        this.types = res.Data.data.Table0;
        console.log('types', this.types);
      },
      error: err => {
        console.error('Error fetching types', err);
      }
    });
  }
  onSaveHRA() {
    if (this.HRAForm.invalid) {
      this.HRAForm.markAllAsTouched();
      return;
    }
    const formattedDate = this.formatDate(this.HRAForm.value.Date);
    const formattedFromDate = this.formatDate(this.HRAForm.value.FromDate);
    const formattedToDate = this.formatDate(this.HRAForm.value.ToDate);

    const payload = {
      mode: 'Add',
      createdBy: this.userdetail.user_Id.toString(),

      parentDetail: {
        HRA_Calculation_Id: 0,
        HRA_Calculation_Date: formattedDate,
        Employee_Id: Number(this.HRAForm.value.Employee_Code),
        From_Date: formattedFromDate,
        To_Date: formattedToDate,
        Monthly_Rent_Paid: Number(this.HRAForm.value.MonthlyRentPaid),
        Declaration_Type_Id: Number(this.HRAForm.value.Type),
        Eligible_Basic: Number(this.HRAForm.value.Eligible_Basic || 0),
        Eligible_HRA: Number(this.HRAForm.value.Eligible_HRA || 0),
        Residing_Location: this.HRAForm.value.Residing_Location,
        Financial_Year_Id: Number(this.HRAForm.value.financialYear),
        IsMetroSelected: this.HRAForm.value.Metro === 'Yes',
        Total_Exemption: Number(this.HRAForm.value.TotalExemption || 0)
      },

      ChildDetail: this.dataSource1.data.map((r: any) => ({
        HRA_Calculation_Detail_Id: 0,
        HRA_Calculation_Id: 0,
        Pay_Frequency_Detail_Id: 0,
        Fixed_Basic: Number(r['Fixed Basic + DA'] || 0),
        Earned_Basic: Number(r['Earned Basic + DA'] || 0),
        Fixed_HRA: Number(r['Fixed HRA'] || 0),
        Earned_HRA: Number(r['Earned HRA'] || 0),
        Monthly_Rent_Paid: Number(r['Rent Paid'] || 0),
        HRA_Received: Number(r['HRA Recevied'] || 0),
        Rent_Paid_Minus_Basic: Number(r['Rent Paid-10% Basic'] || 0),
        Percentage_Of_Basic: Number(r['40 or 50% Basic'] || 0),
        HRA_Exemption: Number(r['HRA Exemption'] || 0)
      }))
    };

    console.log('HRA PAYLOAD', JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        console.log('response', res);
        const msg = res?.Data?.data?.Table0?.[0]?.Error_Message;

        if (msg?.toLowerCase().includes('success')) {
          alert(msg);
          this.dialog.closeAll();
          // this.onsearch();
        } else {
          alert(msg);
        }
      },
      error: () => {
        alert('Error while processing');
      }
    });
  }

  bindEditHRAData(data: any) {
    this.HRAForm.patchValue({
      financialYear: data.Financial_Year_Id,
      Employee_Code: data.Employee_Id,
      Date: data.HRA_Calculation_Date,
      FromDate: data.From_Date,
      ToDate: data.To_Date,
      MonthlyRentPaid: data.Monthly_Rent_Paid,
      Type: data.Declaration_Type_Id,
      Residing_Location: data.Residing_Location,
      Metro: data.IsMetroSelected,
      TotalExemption: data.Total_Exemption
    });

    ['financialYear', 'Employee_Code'].forEach(f => this.HRAForm.get(f)?.disable());


    this.dataSource1.data = [];

    const childRows = data.ChildDetail || [];
    childRows.forEach(row => {
      this.dataSource1.data = [
        ...this.dataSource1.data,
        {
          'PayPeriod': row.PayPeriod || '',
          'Fixed Basic + DA': row.Fixed_Basic,
          'Earned Basic + DA': row.Earned_Basic,
          'Fixed HRA': row.Fixed_HRA,
          'Earned HRA': row.Earned_HRA,
          'HRA Recevied': row.HRA_Received,
          'Rent Paid': row.Monthly_Rent_Paid,
          'Rent Paid-10% Basic': row.Rent_Paid_Minus_Basic,
          '40 or 50% Basic': row.Percentage_Of_Basic,
          'HRA Exemption': row.HRA_Exemption
        }
      ];
    });
  }

  onUpdateHRA() {
    if (this.HRAForm.invalid) {
      this.HRAForm.markAllAsTouched();
      return;
    }

    const payload = {
      mode: 'Edit',
      createdBy: this.userdetail.user_Id.toString(),

      parentDetail: {
        HRA_Calculation_Id: this.editData.HRA_Calculation_Id,
        HRA_Calculation_Date: this.HRAForm.value.Date,
        Employee_Id: Number(this.HRAForm.value.Employee_Code),
        From_Date: this.HRAForm.value.FromDate,
        To_Date: this.HRAForm.value.ToDate,
        Monthly_Rent_Paid: Number(this.HRAForm.value.MonthlyRentPaid),
        Declaration_Type_Id: Number(this.HRAForm.value.Type),
        Eligible_Basic: Number(this.HRAForm.value.Eligible_Basic || 0),
        Eligible_HRA: Number(this.HRAForm.value.Eligible_HRA || 0),
        Residing_Location: this.HRAForm.value.Residing_Location,
        Financial_Year_Id: Number(this.HRAForm.value.financialYear),
        IsMetroSelected: this.HRAForm.value.Metro,
        Total_Exemption: Number(this.HRAForm.value.TotalExemption || 0)
      },

      ChildDetail: this.dataSource1.data.map((r: any) => ({
        HRA_Calculation_Detail_Id: r.HRA_Calculation_Detail_Id || 0,
        HRA_Calculation_Id: this.editData.HRA_Calculation_Id,
        Pay_Frequency_Detail_Id: r.Pay_Frequency_Detail_Id || 0,
        Fixed_Basic: Number(r['Fixed Basic + DA'] || 0),
        Earned_Basic: Number(r['Earned Basic + DA'] || 0),
        Fixed_HRA: Number(r['Fixed HRA'] || 0),
        Earned_HRA: Number(r['Earned HRA'] || 0),
        Monthly_Rent_Paid: Number(r['Rent Paid'] || 0),
        HRA_Received: Number(r['HRA Recevied'] || 0),
        Rent_Paid_Minus_Basic: Number(r['Rent Paid-10% Basic'] || 0),
        Percentage_Of_Basic: Number(r['40 or 50% Basic'] || 0),
        HRA_Exemption: Number(r['HRA Exemption'] || 0)
      }))
    };

    console.log('EDIT HRA PAYLOAD', JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        const msg = res?.Data?.data?.Table0?.[0]?.Error_Message || res.Data.message;
        if (msg.toLowerCase().includes('success')) {
          alert(msg);
          this.dialog.closeAll();
          this.onsearch(); 
        } else {
          alert(msg);
        }
      },
      error: () => alert('Update failed')
    });
  }


}
