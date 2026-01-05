import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { IChildreneducationallowance } from '../../../Repository/TaxandSavings/IChildreneducationallowance.service';
import { ChildreneducationallowanceService } from '../../../Service/Taxandsavings/childreneducationallowance.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Pay_TOKEN = new InjectionToken<IChildreneducationallowance>('Pay_TOKEN');

@Component({
  selector: 'app-childreneducationallowance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './childreneducationallowance.component.html',
  styleUrl: './childreneducationallowance.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ChildreneducationallowanceService,
    }
  ]
})
export class ChildreneducationallowanceComponent {
  isEditMode: boolean = false;
  ceaform!: FormGroup;
  isAddclicked = false;
  fyear: any;
  ecode: any;
  employeeMain: any[] = [];
  employeePopup: any[] = [];
  eligibleTuition: number = 0;
  eligibleHostel: number = 0;
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("paginator1") paginator1!: MatPaginator;
  displayedColumns: string[] = [
    'delete',
    'edit',
    'Serial_No',
    'Company_Code',
    'Employee_Code',
    'Employee_Name',
    'Date_of_Joining',
    'Financial_Year',
    'From_Date',
    'To_Date',
    'Date',
    'Tuition_Eligibility',
    'Hostel_Eligibility'
  ];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns1: string[] = [
    'sno',
    'studentName',
    'schoolName',
    'hostelName',
    'phoneNumber',
    'exemptionAmount'
  ];
  dataSource1 = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;
  companyId: any;
  selectedCompanyCode: any;
  previousChildrenCount: number = 0;
  year: any;
  employee: any;
  isLoading: boolean = false;
  selectedCompanyId: any;
  payperiodId: any;
  isUploadGridVisible: boolean = false;
  ceadata: any;
  ceadatas: any;
  employees: any;
  yearadd: any;
  userdetail: any;

  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IChildreneducationallowance, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(event) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.tryBindEmployee();

  }
  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.split('T')[0]; // YYYY-MM-DD
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
    this.ceaform = this.fb.group({
      Company_Code: ['', Validators.required],
      Financial_Year: ['', Validators.required],
      Employee_Code: ['', Validators.required],
      Employee_Name: ['', Validators.required],
      Date: [this.getTodayDate() ?? '', Validators.required],
      Number_Of_Children: ['', Validators.required],
      Date_Of_Joining: ['', Validators.required],
      From_Date: ['', Validators.required],
      To_Date: ['', Validators.required],
      Hostel: [false],
      Tuition: [false],
      Eligible_Amount: [''],
      Claimed_Amount: ['', [Validators.required, this.claimedAmountValidator.bind(this)]],
    });
    this.ceaform.patchValue({
      Date: this.getTodayDate()
    });

    this.ceaform.get('Financial_Year')?.valueChanges.subscribe(fyId => {
      this.tryBindEmployeeadd(fyId);
    });
    this.ceaform.get('Financial_Year')?.valueChanges.subscribe(() => {
      this.tryBindEligibleEmployee();
    });

    this.ceaform.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.tryBindEligibleEmployee();
    });

    this.ceaform.get('Employee_Code')?.valueChanges.subscribe(() => {
      this.ceaform.patchValue({
        Employee_Name: '',
        From_Date: '',
        To_Date: ''
      });
    });
    this.ceaform.get('Claimed_Amount')?.valueChanges.subscribe(() => {
      this.updateExemptionAmounts();
    });

    this.ceaform.get('Number_Of_Children')?.valueChanges.subscribe(() => {
      this.updateExemptionAmounts();
    });


    this.ceaform.get('Tuition')?.valueChanges.subscribe(() => this.updateEligibleAmount());
    this.ceaform.get('Hostel')?.valueChanges.subscribe(() => this.updateEligibleAmount());

    this.ceaform.get('Employee_Name')?.disable();
    this.ceaform.get('Eligible_Amount')?.disable();
    this.ceaform.get('Date_Of_Joining')?.disable();
    this.ceaform.get('From_Date')?.disable();
    this.ceaform.get('To_Date')?.disable();

    this.Bindfyear();
    this.Bindfyearadd();
  }

  claimedAmountValidator(control: AbstractControl) {
    if (!this.ceaform) return null; // form not initialized yet
    const eligibleAmount = this.ceaform.get('Eligible_Amount')?.value || 0;
    const claimedAmount = control.value || 0;
    return claimedAmount > eligibleAmount ? { exceeded: true } : null;
  }
  updateExemptionAmounts() {
    const numberOfChildren = this.ceaform.get('Number_Of_Children')?.value || 0;
    const claimedAmount = this.ceaform.get('Claimed_Amount')?.value || 0;

    if (numberOfChildren <= 0 || !this.dataSource1.data.length) return;

    const splitAmount = claimedAmount / numberOfChildren;

    // Update each row's exemptionAmount
    this.dataSource1.data.forEach(row => {
      row.exemptionAmount = splitAmount;
    });

    // Refresh the table to reflect changes
    this.dataSource1._updateChangeSubscription();
  }


  onDateOrChildrenChange() {
    const date = this.ceaform.get('Date')?.value;
    const numChildren = this.ceaform.get('Number_Of_Children')?.value;

    if (date && numChildren) {
      this.service.GetEligibleChildren(date, numChildren).subscribe(res => {
        if (res?.Data?.data?.Table0?.length > 0) {
          const data = res.Data.data.Table0[0];

          this.eligibleTuition = data.Tuition_Eligibility ?? 0;
          this.eligibleHostel = data.Hostel_Eligibility ?? 0;

          this.ceaform.patchValue({
            Tuition: false,
            Hostel: false,
            Eligible_Amount: 0
          });
        }
      });
    }
  }
  updateEligibleAmount() {
    let total = 0;
    if (this.ceaform.get('Tuition')?.value) total += this.eligibleTuition;
    if (this.ceaform.get('Hostel')?.value) total += this.eligibleHostel;

    this.ceaform.patchValue({ Eligible_Amount: total }, { emitEvent: false });
    this.ceaform.get('Claimed_Amount')?.updateValueAndValidity();

  }

  tryBindEligibleEmployee() {

    const financialYearId = this.ceaform.get('Financial_Year')?.value;
    const employeeId = this.ceaform.get('Employee_Code')?.value;

    if (!financialYearId || !employeeId) return;

    this.service.GetEligibleemployee(financialYearId, employeeId).subscribe({
      next: res => {
        console.log('Eligible employee response:', res);

        const data = res.Data?.data?.Table0?.[0];
        if (!data) return;

        this.ceaform.patchValue({
          Employee_Name: data.Employee_Name?.trim(),
          Date_Of_Joining: this.formatDateForInput(data.Date_Of_Joining),
          From_Date: this.formatDateForInput(data.From_Date),
          To_Date: this.formatDateForInput(data.To_Date)
        });
      }
    });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
  }
  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;

    this.ceaform.reset();
    this.employeePopup = [];
    this.ceaform.patchValue({
      Date: this.getTodayDate()
    });
  }


  AddOpen() {
    const numberOfChildren = this.ceaform.get('Number_Of_Children')?.value || 0;
    const claimedAmount = this.ceaform.get('Claimed_Amount')?.value || 0;

    if (this.previousChildrenCount !== numberOfChildren) {
      this.previousChildrenCount = numberOfChildren;

      const splitAmount = numberOfChildren > 0 ? claimedAmount / numberOfChildren : 0;

      const newRows = Array.from({ length: numberOfChildren }, () => ({
        studentName: '',
        schoolName: '',
        hostelName: '',
        phoneNumber: '',
        exemptionAmount: splitAmount
      }));

      this.dataSource1.data = newRows;
      this.dataSource1._updateChangeSubscription();
    }
  }


  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  deleteSelectedRow() {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to delete.");
      return;
    }
    this.dataSource1.data.splice(this.selectedRowIndex, 1);
    this.dataSource1.data = [...this.dataSource1.data];
    this.selectedRowIndex = null;
  }


  Bindfyear() {
    this.service.GetFinancialyear().subscribe({
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
    console.log(this.companyId, this.fyear);

    if (this.companyId && this.fyear) {
      this.Bindemployee();
    }
  }

  Bindemployee() {
    this.service.GetEmployee(this.companyId, this.fyear).subscribe({
      next: res => {
        this.employeeMain = res.Data.data.Table0;
      }
    });
  }
  Bindfyearadd() {
    this.service.GetFinancialyear().subscribe({
      next: res => {
        this.yearadd = res.Data.data.Table0;
        console.log('year add', this.yearadd);
      }
    });
  }

  tryBindEmployeeadd(financialYearId: any) {

    const companyId = this.companyId; // from company component
    const fyearId = financialYearId; // from form control

    console.log(companyId, fyearId);

    if (companyId && fyearId) {
      this.service.GetEmployee(companyId, fyearId).subscribe({
        next: res => {
          this.employeePopup = res.Data.data.Table0;
        }
      });
    } else {
      this.employeePopup = [];
    }
  }

  onsearch() {
    this.isLoading = true;
    if (!this.companyId) {
      this.isLoading = false;
      alert('Please Select Company');
      return;
    }

    if (!this.fyear) {
      this.isLoading = false;
      alert('Please Select Financialyear');
      return;
    }
    if (!this.ecode) {
      this.isLoading = false;
      alert('Please Select Employeecode');
      return;
    }

    this.isUploadGridVisible = true;

    const Company_id = this.companyId;
    const financialyearid = this.fyear;
    const employeeid = this.ecode;

    this.service.Search(Company_id, financialyearid, employeeid).subscribe({
      next: (res) => {

        this.ceadata = res.Data?.data?.Table0 ?? [];
        this.ceadatas = res.Data.message;


        if (!this.ceadata || this.ceadata.length === 0) {
          alert(this.ceadatas || "No data available.");
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.ceadata);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.displayedColumns = [
          'delete',
          'edit',
          'Serial_No',
          'Company_Code',
          'Employee_Code',
          'Employee_Name',
          'Date_of_Joining',
          'Financial_Year',
          'From_Date',
          'To_Date',
          'Date',
          'Tuition_Eligibility',
          'Hostel_Eligibility'];
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

    if (!this.fyear) {
      this.isLoading = false;
      alert('Please Select Financialyear');
      return;
    }
    if (!this.ecode) {
      this.isLoading = false;
      alert('Please Select Employeecode');
      return;
    }


    const Company_id = this.companyId;
    const financialyearid = this.fyear;
    const employeeid = this.ecode;

    this.service.Search(Company_id, financialyearid, employeeid).subscribe({
      next: (res) => {

        try {
          const jsonData = res?.Data?.data?.Table0;


          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.isLoading = false;
            alert(res.Data.message)
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Childreneducationaloowancedata');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Childreneducationaloowancedata_${timestamp}.xlsx`;


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
    if (this.ceaform.invalid) {
      alert('please fill all required fields')
      return;
    }

    const parentDetail: any = {
      Children_Education_Allowance_Id: 0,
      Declaration_Date: this.formatDate(this.ceaform.get('Date')?.value),
      Employee_Id: this.ceaform.get('Employee_Code')?.value,
      Financial_Year_Id: this.ceaform.get('Financial_Year')?.value,
      Number_Of_Children: this.ceaform.get('Number_Of_Children')?.value,
      From_Date: this.formatDate(this.ceaform.get('From_Date')?.value),
      To_Date: this.formatDate(this.ceaform.get('To_Date')?.value),
      Claim_Amount: this.ceaform.get('Claimed_Amount')?.value,
      Eligible_Amount: this.ceaform.get('Eligible_Amount')?.value,
      Is_Tuition_Eligible: this.ceaform.get('Tuition')?.value,
      Is_Hostel_Eligible: this.ceaform.get('Hostel')?.value
    };

    const childDetails: any[] = this.dataSource1.data.map((row: any) => ({
      Student_Name: row.studentName,
      School_Name: row.schoolName,
      Hostel_Name: row.hostelName,
      Phone_Number: row.phoneNumber,
      Exemption_Amount: row.exemptionAmount
    }));

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? 'edit' : 'add',
      parentDetail,
      childDetail: childDetails
    };
    console.log('payload', payload);
    console.log('jsonpayload', JSON.stringify(payload))
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
