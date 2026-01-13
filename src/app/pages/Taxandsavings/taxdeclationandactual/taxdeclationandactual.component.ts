import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { TaxdeclarationandactualService } from '../../../Service/Taxandsavings/taxdeclarationandactual.service';
import { ITaxdeclarationandactual } from '../../../Repository/Taxandsavings/ITaxdecalarationandactual.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { stringify } from 'querystring';
export const Pay_Token = new InjectionToken<ITaxdeclarationandactual>('Pay_Token');

@Component({
  selector: 'app-taxdeclationandactual',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginator, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './taxdeclationandactual.component.html',
  styleUrl: './taxdeclationandactual.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: TaxdeclarationandactualService,
    }
  ]
})
export class TaxdeclationandactualComponent {
  isEditMode: boolean = false;
  taxForm!: FormGroup;
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
    'Tax_code',
    'Type',
    'amount'

  ];
  dataSource = new MatTableDataSource<any>([]);
  companyId: any;
  selectedCompanyCode: any;
  ecode: any;
  showTable = false;
  selectedCompanyId: any;
  search: any;
  userdetail: any;
  editingRowId: number | null = null;
  financialYear: any;
  taxCode: any;
  employeeCodes: any;
  type: any;
  employeeName: any;
  CompanyId: any;
  CompanyCode: any;
  EmpCode: any;
  empCode: any;

  constructor(private fb: FormBuilder, @Inject(Pay_Token) private service: TaxdeclarationandactualService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.bindEmpCode();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  AddPOOpen() {
    this.isAddclicked = true;
  }

  ngOnInit(): void {

    this.taxForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      Date: ['', Validators.required],
      FinancialYear: ['', Validators.required],
      Type: ['', Validators.required],
      EmployeeCode: ['', Validators.required],
      EmployeeName: new FormControl({ value: '', disabled: true }),
      TaxCode: ['', Validators.required],
      Description: new FormControl({ value: '', disabled: true }),
      Section: new FormControl({ value: '', disabled: true }),
      Formula: new FormControl({ value: '', disabled: true }),
      Amount: ['', Validators.required],
      EligibleAmount: new FormControl({ value: '', disabled: true }),
      CitizenCategory: [''],
      children: new FormControl({ value: '', disabled: true })
    });
    this.initializeForm();
    this.bindFinancialYear();
    this.bindTaxcode();
    this.bindType();
    this.taxForm.get('TaxCode')!.valueChanges.subscribe(taxCode => {
      if (taxCode) {
        this.applyTaxCodeRules(taxCode);
      }
    });
    this.taxForm.get('FinancialYear')?.valueChanges.subscribe(() => {
      this.bindEmployeeCode();
    });

    this.taxForm.get('EmployeeCode')?.valueChanges.subscribe(() => {
      this.tryBindEligibleEmployee();
    });

    this.taxForm.get('TaxCode')?.valueChanges.subscribe(() => {
      this.bindEligibleAmount();
    });

    this.taxForm.get('EmployeeCode')?.valueChanges.subscribe(() => {
      this.taxForm.patchValue({
        Employee_Name: '',
      });
    });

    this.taxForm.get('TaxCode')?.valueChanges.subscribe(() => {
      this.taxForm.patchValue({
        Eligible_Amount: '',
      });
    });
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

  editPetd(row: any) {
    this.isAddclicked = true;
    this.isEditMode = true;
    this.editingRowId = row.Previous_Employment_Id;

    const formattedDate = row.Date
      ? row.Date.split('T')[0]
      : '';

    this.taxForm.patchValue({
      CompanyCode: row.Company_Id,
      Date: formattedDate,
      FinancialYear: row.Financial_Year_Id,
      Type: row.Type,
      EmployeeCode: row.Employee_Id,
      EmployeeName: row.Employee_Name,
      TaxCode: row.Tax_Id,
      Amount: row.Amount,
      EligibleAmount: row.Eligible_Amount,
      CitizenCategory: row.Citizen_Category,
      children: row.No_Of_Children,

    });
    this.applyTaxCodeRules(row.Tax_Code_Id);

  }

  bindFinancialYear() {
    this.service.getFinancialYear().subscribe({
      next: res => {
        this.financialYear = res.Data.data.Table0
      }
    });
  }

  bindTaxcode() {
    this.service.getTaxCode().subscribe({
      next: res => {
        this.taxCode = res.Data.data.Table0
      }
    });
  }

  bindEmpCode() {
    const companyId = this.CompanyId || 0;
    console.log("companyId", companyId)
    this.service.getEmpCode(companyId).subscribe({
      next: res => {
        this.empCode = res.Data.data.Table0
      }
    })
  }

  bindEmployeeCode() {
    const companyId = this.selectedCompanyId
    const financialYearId = this.taxForm.get('FinancialYear')?.value;
    this.service.getEmployeeCode(companyId, financialYearId).subscribe({
      next: res => {
        this.employeeCodes = res.Data.data.Table0
        this.taxForm.patchValue({
          EmployeeCode: '',
          EmployeeName: ''
        });
      }
    })
  }

  bindType() {
    this.service.getType().subscribe({
      next: res => {
        this.type = res.Data.data.Table0
      }
    });
  }

  bindEligibleAmount() {
    const Employee_Id = this.taxForm.get('EmployeeCode')?.value;
    const Financial_Year_Id = this.taxForm.get('FinancialYear')?.value;
    const selectedTaxId = this.taxForm.get('TaxCode')?.value;

    if (!Employee_Id || !Financial_Year_Id || !selectedTaxId) return;

    // Lookup Computation_Rule_Id from selected Tax_Id
    const Computation_Rule_Id = this.taxCode.find(t => t.Tax_Id === selectedTaxId)?.Computation_Rule_Id;

    if (!Computation_Rule_Id) return;

    this.service.getEligibleAmount(Employee_Id, Financial_Year_Id, Computation_Rule_Id).subscribe({
      next: res => {
        console.log('Eligible employee response:', res);

        const data = res.Data?.data?.Table0?.[0];
        if (!data) return;

        // Enable, patch value, then disable again to keep it readonly but update UI
        this.taxForm.get('EligibleAmount')?.enable();
        this.taxForm.patchValue({
          EligibleAmount: data.Eligible_Amount?.trim(),
        });
        this.taxForm.get('EligibleAmount')?.disable();
      }
    });
  }

  tryBindEligibleEmployee() {
    const financialYearId = this.taxForm.get('FinancialYear')?.value;
    const employeeId = this.taxForm.get('EmployeeCode')?.value;

    if (!financialYearId || !employeeId) return;

    this.service.getemployeename(financialYearId, employeeId).subscribe({
      next: res => {
        console.log('Eligible employee response:', res);

        const data = res.Data?.data?.Table0?.[0];
        if (!data) return;

        // Enable, patch value, then disable again to keep it readonly but update UI
        this.taxForm.get('EmployeeName')?.enable();
        this.taxForm.patchValue({
          EmployeeName: data.Employee_Name?.trim(),
        });
        this.taxForm.get('EmployeeName')?.disable();
      }
    });
  }

  applyTaxCodeRules(taxCode: string) {
    const tax = this.taxCode.find(t => t.Tax_Id === taxCode);
    if (!tax) return;

    // Patch readonly values
    this.taxForm.patchValue({
      Description: tax.Description,
      Section: tax.Section,
      Formula: tax.Formula
    });
  }

  initializeForm() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];  // 'yyyy-MM-dd'
    this.taxForm.patchValue({
      Date: formattedDate
    });
  }

  resetForm() {
    this.taxForm.reset();
    this.isAddclicked = false;
    this.isEditMode = false;
    this.editingRowId = null;
  }

  onSearch() {
    this.showTable = true;
    // this.isLoading = true;
    const companyId = this.companyId || 0
    const EmployeeId = this.EmpCode || 0

    this.service.search(companyId, EmployeeId).subscribe({

      next: (res) => {
        this.search = res.Data.data.Table0;
        console.log(this.search)
        if (this.search && this.search.length > 0) {
          this.dataSource = new MatTableDataSource(this.search);
          this.dataSource.paginator = this.paginator;
          this.displayedColumns = [
            "delete", "edit", "sno", "companyCode", "employeeCode", "employeeName", "dateOfJoining", "financialYear", "date"
            , "income", "totalTaxPaid", "type"
          ];
        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        // this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        // this.isLoading = false;
      },
    });
  }

  exportToExcel(): void {
    // this.isLoading = true;
    const companyId = this.companyId || 0
    const EmployeeId = this.EmpCode || 0

    this.service.exportToExcel(companyId, EmployeeId).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the companycode and employeecode.');
            // this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Ltacalculation');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `previousemploymenttaxdetail${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          // this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        // this.isLoading = false;
      },
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    // this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      // this.isLoading = false;
      alert("Please upload only one Excel file.")
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);
    console.log("formdata", formData)

    this.service.importLtaCalculation(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          // this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          // this.isLoading = false;
          // this.showAlertPopup("Row(s) Uploaded Successfully.")
          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          // this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          // this.isLoading = false;
          alert("Failed to Import");
          // errors[0] may be a JSON string, an array, or a plain string/object
          const rawErr = res?.Data?.errors?.[0];
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
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');
          // this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          // this.isLoading = false;
          alert(res.Data[0].Error_Message)
          return;
        }

        // CASE 3: Anything else → fallback
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback)
        } else {
          alert('Error while processing response.')
        }

        // this.isLoading = false;

      },
      error: (err) => {
        // this.isLoading = false;
        alert("Upload Failed")
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

  saveTax() {
    if (this.taxForm.invalid) {
      this.taxForm.markAllAsTouched();
      return;
    }
    const form = this.taxForm.getRawValue();

    const selectedTaxId = form.TaxCode;

    const computationRuleId = this.taxCode.find(
      (t: any) => t.Tax_Id === selectedTaxId
    )?.Computation_Rule_Id;


    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? 'Edit' : 'Add',
      parentDetail: {
        Tax_Declaration_Actual_Id: this.isEditMode ? this.editingRowId : 0,
        SNo: form.slNo,
        Company_Code: this.selectedCompanyCode,
        Company_Id: this.selectedCompanyId,
        Employee_Id: form.EmployeeCode,
        Employee_Code: form.EmployeeCode,
        Employee_Name: form.EmployeeName,
        Financial_Year_Id: form.FinancialYear,
        Financial_Year: form.FinancialYear,
        Tax_Declaration_Actual_Date: form.Date,
        Computation_Rule_Id: computationRuleId,
        Computation_Rule: form.Section,
        Computation_Rule_Category_Name: form.Section,
        Category: form.Section,
        Description: form.Description,
        Eligible_Amount: Number(form.EligibleAmount),
        Declaration_Type_Id: form.Type,
        Citizen_Category: form.CitizenCategory,
        Tax_Code: form.TaxCode,
        No_Of_Children: form.Children,
        Type: form.Type,
        Amount: Number(form.Amount),
        Error_Message: ""
      },
    };

    console.log(JSON.stringify(payload))

    this.service.addTax(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        this.resetForm();
        this.onSearch(); // reload table
      },
      error: err => console.error(err)
    });
  }

  deleteTax(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: 'Delete',
      parentDetail: {
        Previous_Employment_Id: row.Previous_Employment_Id
      }
    };

    this.service.addTax(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        this.onSearch();   // refresh table
      },
      error: err => {
        console.error(err);
        alert('Failed to delete record');
      }
    });
  }



}
