import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { IGratuity } from '../../../Repository/TaxandSavings/IGratuity';
import { GratuityService } from '../../../Service/Taxandsavings/gratuity.service';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Pay_TOKEN = new InjectionToken<IGratuity>('Pay_TOKEN');

@Component({
  selector: 'app-gratuity',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './gratuity.component.html',
  styleUrl: './gratuity.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: GratuityService,
    }
  ]
})
export class GratuityComponent {
  isEditMode: boolean = false;
  gratuityform!: FormGroup;
  isAddclicked: boolean = false;
  displayedColumns: string[] = [
    'delete',
    'edit',
    'Serial_No',
    'Company_Code',
    'Employee_Code',
    'Employee_Name',
    'Financial_Year',
    'Date',
    'No_of_yearsofservice',
    'amount'

  ];

  dataSource = new MatTableDataSource<any>([]);
  basicamount: any;
  companyId: any;
  selectedCompanyCode: any;
  ecode: any;
  selectedcompanyId: any;
  CompanyCode: any;
  employeeMain: any;
  employeeadd: any;
  year: any;
  isLoading: boolean = false;
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isUploadGridVisible: boolean = false;
  gratuitydata: any;
  gratuitydatas: any;
  employeedata: any;
  DAamount: any;
  binddata: any;
  userdetail: any;
  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IGratuity, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }


  handleCompanyEvent(event) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.Bindemployee();
  }
  handleCompanyEvent2(event: any) {
    this.selectedcompanyId = event.companyId;
    this.CompanyCode = event.companyCode;
    this.tryBindEligibleEmployee();
  }

  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;
  }
  getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // month is 0-based
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.gratuityform = this.fb.group({
      Company_Code: ['', Validators.required],
      Financial_Year: ['', Validators.required],
      Employee_Code: ['', Validators.required],
      Employee_Name: [''],
      Date: [this.getTodayDate() ?? '', Validators.required],
      Date_Of_Joining: [''],
      Date_Of_Resignation: [''],
      Years_Of_Service: [''],
      Basic_Pay: [''],
      Dearness_Allowance: [''],
      Amount: [''],
    });
    this.gratuityform.get('Employee_Name')?.disable();
    this.gratuityform.get('Date_Of_Joining')?.disable();
    this.gratuityform.get('Date_Of_Resignation')?.disable();
    this.gratuityform.get('Years_Of_Service')?.disable();
    this.gratuityform.get('Dearness_Allowance')?.disable();
    this.gratuityform.get('Amount')?.disable();
    this.gratuityform.get('Basic_Pay')?.disable();
    this.Bindfyear();
    this.gratuityform.get('Company_Code')?.valueChanges.subscribe(() => {
      this.tryBindEligibleEmployee();
    });
    this.gratuityform.get('Financial_Year')?.valueChanges.subscribe(() => {
      this.tryBindEligibleEmployee();
    });
    this.gratuityform.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.tryBindEmployee();
      this.tryBindBasicAmount();
      this.tryDAAmount();
    });

  }
  Bindemployee() {
    this.service.GetEmployee(this.companyId).subscribe({
      next: res => {
        this.employeeMain = res.Data.data.Table0;
      }
    });
  }
  Bindfyear() {
    this.service.GetFinancialyear().subscribe({
      next: res => {
        this.year = res.Data.data.Table0
        console.log('year', this.year)
      }
    });
  }
  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';

    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }

    if (dateStr.includes('/')) {
      const [dd, mm, yyyy] = dateStr.split('/');
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }

    return '';
  }

  tryBindEligibleEmployee() {
    const financialYearId = this.gratuityform.get('Financial_Year')?.value;

    if (!financialYearId || !this.selectedcompanyId) return;

    this.service.GetEmployeeadd(this.selectedcompanyId, financialYearId).subscribe({
      next: res => {
        console.log('Employee response:', res);
        this.employeedata = res.Data.data.Table0 || [];
      }
    });
  }
  tryBindEmployee() {
    const employeeid = this.gratuityform.get('Employee_Code')?.value;
    if (!employeeid) return;

    this.service.GetEmployeeBind(employeeid).subscribe({
      next: res => {
        console.log('Binddata:', res);

        const binddata = res?.Data?.data?.Table0?.[0];
        if (!binddata) return;

        this.gratuityform.patchValue({
          Employee_Name: binddata.Employee_Name?.trim(),
          Date_Of_Joining: this.formatDateForInput(binddata.Date_Of_Joining),
          Date_Of_Resignation: this.formatDateForInput(binddata.Resignation_Date),
          Years_Of_Service: binddata.Year_Of_Service
        });
        this.calculateGratuityAmount();
      },
      error: () => {
        this.gratuityform.patchValue({
          Employee_Name: '',
          Date_Of_Joining: '',
          Date_Of_Resignation: '',
          Years_Of_Service: ''
        });
        this.calculateGratuityAmount();
      }
    });
  }

  tryBindBasicAmount() {
    const employeeid = this.gratuityform.get('Employee_Code')?.value;

    if (!employeeid) {
      this.gratuityform.patchValue({ Basic_Pay: '' });
      return;
    }

    this.service.GetBasic(employeeid).subscribe({
      next: res => {
        console.log('basic:', res);

        const basicPay = res?.Data?.data?.Table0?.[0] || 0;

        this.gratuityform.patchValue({
          Basic_Pay: basicPay.Amount
        });
        this.calculateGratuityAmount();
      },
      error: () => {
        this.gratuityform.patchValue({
          Basic_Pay: 0
        });
        this.calculateGratuityAmount();
      }
    });

  }

  tryDAAmount() {
    const employeeid = this.gratuityform.get('Employee_Code')?.value;
    if (!employeeid) {
      this.gratuityform.patchValue({ Dearness_Allowance: 0 });
      this.calculateGratuityAmount();
      return;
    }

    this.service.GetDAamount(employeeid).subscribe({
      next: res => {
        console.log('DA:', res);

        if (res?.Data?.statusCode === '400') {
          this.gratuityform.patchValue({
            Dearness_Allowance: 0
          });
          this.calculateGratuityAmount();

          return;
        }

        const daAmount = res?.Data?.data?.Table0?.[0]?.Amount || 0;

        this.gratuityform.patchValue({
          Dearness_Allowance: daAmount
        });
        this.calculateGratuityAmount();

      },
      error: () => {
        this.gratuityform.patchValue({
          Dearness_Allowance: 0
        });
        this.calculateGratuityAmount();

      }
    });
  }
  calculateGratuityAmount() {
    const basic = Number(this.gratuityform.get('Basic_Pay')?.value) || 0;
    const da = Number(this.gratuityform.get('Dearness_Allowance')?.value) || 0;
    const years = Number(this.gratuityform.get('Years_Of_Service')?.value) || 0;

    if (!basic || !years) {
      this.gratuityform.patchValue({ Amount: 0 });
      return;
    }

    const add = basic + da;
    const multi = add * 15 * years;
    const result = (multi / 26).toFixed(2);

    this.gratuityform.patchValue({
      Amount: result
    });
  }



  onsearch() {
    this.isLoading = true;
    if (!this.companyId) {
      this.isLoading = false;
      alert('Please Select Company');
      return;
    }

    if (!this.ecode) {
      this.isLoading = false;
      alert('Please Select Employeecode');
      return;
    }

    this.isUploadGridVisible = true;

    const Company_id = this.companyId;
    const employeeid = this.ecode;

    this.service.Search(Company_id, employeeid).subscribe({
      next: (res) => {

        this.gratuitydata = res.Data?.data?.Table0 ?? [];
        this.gratuitydatas = res.Data.message;


        if (!this.gratuitydata || this.gratuitydata.length === 0) {
          alert(this.gratuitydatas || "No data available.");
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.gratuitydata);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.displayedColumns = [
          'Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code',
        ];
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;

        console.error('Error loading lopadjusts release data', err);
      },
    });
    this.isLoading = false;
  }
  exportToExcel(): void {
    this.isLoading = true;

    if (!this.companyId) {
      this.isLoading = false;
      alert('Please Select Company');
      return;
    }

    if (!this.ecode) {
      this.isLoading = false;
      alert('Please Select Employeecode');
      return;
    }
    const Company_id = this.companyId;
    const employeeid = this.ecode;

    this.service.Search(Company_id, employeeid).subscribe({
      next: (res) => {

        try {
          const jsonData = res?.Data?.data?.Table0;


          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.isLoading = false;
            alert(res.Data.message)
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Gratuitydata');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Gratuitydata_${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);
          this.isLoading = false;


        } catch (err) {
          console.error('Error exporting to Excel:', err);

        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;

        console.error('Error loading data for export', err);
      },
    });
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
  saveData() {
    if (this.gratuityform.invalid) {
      console.log('Form Invalid');
      console.log(this.gratuityform.controls);

      Object.keys(this.gratuityform.controls).forEach(key => {
        const control = this.gratuityform.get(key);
        if (control?.invalid) {
          console.log(`Invalid Control: ${key}`, control.errors);
        }
      });

      this.gratuityform.markAllAsTouched();
      alert('Please fill all required fields');
      return;
    }


    const formValue = this.gratuityform.getRawValue();

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? 'edit' : 'add',
      parentDetail: {
        Gratuity_Id: this.isEditMode ? formValue.Gratuity_Id ?? 0 : 0,
        Gratuity_Date: this.formatDate(formValue.Date),
        Employee_Id: formValue.Employee_Code,
        Financial_Year_Id: formValue.Financial_Year,
        Amount: Number(formValue.Amount) || 0,
        Basic: Number(formValue.Basic_Pay) || 0,
        DA: Number(formValue.Dearness_Allowance) || 0
      }
    };


    console.log('payload', payload);
    console.log('jsonpayload', JSON.stringify(payload));

    this.service.save(payload).subscribe({
      next: (res) => {
        if (res.Data?.statusCode === "400") {
          alert(res.Data.message);
        } else {
          const msg = res.Data?.data?.Table0?.[0]?.Error_Message;
          if (msg && msg.includes('success')) {
            alert(msg);
            this.closeclick();
            this.onsearch();
          }
        }
      },
      error: (err) => {
        console.error('Error saving data', err);
        alert('Error saving data');
      }
    });
  }
}


