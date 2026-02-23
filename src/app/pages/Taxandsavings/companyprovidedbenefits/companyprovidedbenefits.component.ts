import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ICompanyProvidedBenefits } from '../../../Repository/TaxAndSavings/Icompanyprovidedbenefits';
import { CompanyprovidedbenefitsService } from '../../../Service/TaxAndSavings/companyprovidedbenefits.service';
export const Pay_TOKEN = new InjectionToken<ICompanyProvidedBenefits>('Pay_TOKEN');

@Component({
  selector: 'app-companyprovidedbenefits',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './companyprovidedbenefits.component.html',
  styleUrl: './companyprovidedbenefits.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CompanyprovidedbenefitsService,
    }
  ]
})
export class CompanyprovidedbenefitsComponent {
  isEditMode: boolean = false;
  cpbform!: FormGroup;
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
    'Perk_Code',
    'Perk_amount'

  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  companyId: any;
  selectedCompanyCode: any;
  ecode: any;
  employeeMain: any;
  isLoading: boolean = false;
  isUploadGridVisible: boolean = false;
  fyear: any;
  cpbdata: any;
  cpbdatas: any;
  userdetail: any;
  perkcodes: any;
  year: any;
  employeeadd: any;
  selectedcompanyId: any;
  CompanyCode: any;

  constructor(private fb: FormBuilder, @Inject(Pay_TOKEN) private service: ICompanyProvidedBenefits,
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(event) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.Bindemployee();
  }
  handleCompanyEvent2(event: any) {
    this.selectedcompanyId = event.companyId;
    this.CompanyCode = event.companyCode;
    this.Bindemployeeadd();
  }

  closeclick() {
    this.isAddclicked = false;
  }
  AddPOOpen() {
    this.isAddclicked = true;
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.cpbform = this.fb.group({
      Company_Code: ['', Validators.required],
      Financial_Year: ['', Validators.required],
      Employee_Code: ['', Validators.required],
      Employee_Name: [''],
      Date: ['', Validators.required],
      Perk_Code: ['', Validators.required],
      Perk_Type: ['', Validators.required],
      Perk_Amount: ['', Validators.required],
    });
    this.cpbform.get('Employee_Name')?.disable();
    this.cpbform.get('Perk_Type')?.disable();

    this.BindPerkcodes();
    this.Bindfyear();
    this.cpbform.get('Perk_Code')?.valueChanges.subscribe(perkId => {
      const selectedPerk = this.perkcodes.find(
        (p: any) => p.Perk_Id == perkId
      );

      if (selectedPerk) {
        this.cpbform.patchValue({
          Perk_Type: selectedPerk.Perk_Name
        });
      } else {
        this.cpbform.patchValue({
          Perk_Type: ''
        });
      }
    });
    this.cpbform.get('Employee_Code')?.valueChanges.subscribe(empId => {

      const selectedEmp = this.employeeadd.find(
        (e: any) => e.Employee_Id == empId
      );

      if (selectedEmp) {
        this.cpbform.patchValue({
          Employee_Name: selectedEmp.Employee_Name
        });
      } else {
        this.cpbform.patchValue({
          Employee_Name: ''
        });
      }
    });

  }
  Bindemployee() {
    this.service.GetEmployee(this.companyId).subscribe({
      next: res => {
        this.employeeMain = res.Data.data.Table0;
      }
    });
  }
  Bindemployeeadd() {
    this.service.GetEmployee(this.selectedcompanyId).subscribe({
      next: res => {
        this.employeeadd = res.Data.data.Table0;
      }
    });
  }


  BindPerkcodes() {
    this.service.GetPerkCodes().subscribe({
      next: res => {
        this.perkcodes = res.Data.data.Table0;
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

        this.cpbdata = res.Data?.data?.Table0 ?? [];
        this.cpbdatas = res.Data.message;


        if (!this.cpbdata || this.cpbdata.length === 0) {
          alert(this.cpbdatas || "No data available.");
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.cpbdata);
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

          XLSX.utils.book_append_sheet(wb, ws, 'Companyprovidedbenefitsdata');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Companyprovidedbenefitsdata_${timestamp}.xlsx`;


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
  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }
  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {


        if (!res || !res.Data) {
          this.isLoading = false;
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data.response;

        if (response && response.toLowercase().includes("success")) {
          this.isLoading = false;
          alert(response);
          return;
        }

        const { parsed, msg } = this.tryParseResponse(response);

        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.toLowercase().includes('success')) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.toLowercase().includes('success'));

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          alert(response);
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          this.isLoading = false;
          alert('Failed to Import');
          const rawErr = res.Data.errors?.[0];
          let errorArray: any[] = [];

          try {
            if (typeof rawErr === 'string') {
              const tryJson = JSON.parse(rawErr);
              errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
            } else if (Array.isArray(rawErr)) {
              errorArray = rawErr;
            } else if (rawErr) {
              errorArray = [rawErr];
            }
          } catch {
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_LOPAdjustment.xlsx');
          this.isLoading = false;
          return;
        }
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {

          if (res?.Message) {
            alert(`ℹ️ ${res.Message}`);
          } else {
            alert('Error while processing response.');
          }
        }
        this.isLoading = false;

      },
      error: (err) => {
        console.error(' Upload failed', err);
        this.isLoading = false;
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
  saveData() {
    if (this.cpbform.invalid) {
      alert('Please fill all required fields');
      return;
    }

    // ✅ IMPORTANT: use getRawValue()
    const formValue = this.cpbform.getRawValue();

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? 'edit' : 'add',
      parentDetail: {
        Company_Provided_Benefit_Id: 0,
        Company_Provided_Benefit_Date: this.formatDate(formValue.Date),
        Employee_Id: formValue.Employee_Code,
        Financial_Year_Id: formValue.Financial_Year,
        Perk_Code_Id: formValue.Perk_Code,
        Perk_Amount: formValue.Perk_Amount,
        Perk_Type: formValue.Perk_Type
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
          if (msg && msg.includes('Success')) {
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

