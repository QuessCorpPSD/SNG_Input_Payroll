import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreviousemploymenttaxdetailsService } from '../../../Service/Taxandsavings/previousemploymenttaxdetails.service';
import { IPreviousEmployment } from '../../../Repository/Taxandsavings/IPreviousEmployment.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IPreviousEmployment>('Pay_Token');

@Component({
  selector: 'app-previousemploymenttaxdetails',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './previousemploymenttaxdetails.component.html',
  styleUrl: './previousemploymenttaxdetails.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: PreviousemploymenttaxdetailsService,
    }
  ]
})
export class PreviousemploymenttaxdetailsComponent {
  isEditMode: boolean = false;
  addpetdform!: FormGroup;
  ceaform!: FormGroup;
  isAddclicked = false;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  displayedColumns: string[] = [
    "delete", "edit", "sno", "companyCode", "employeeCode", "employeeName", "dateOfJoining", "financialYear", "date"
    , "income", "totalTaxPaid", "type"
  ];
  dataSource = new MatTableDataSource<any>([]);
  EmpCode: any;
  showTable = false;
  search: any;
  userdetail: any;
  financialYear: any;
  editingRowId: number | null = null;
  type: any;
  employeeCodes: any;
  CompanyId: any;
  CompanyCode: any;
  empCode: any;

  constructor(@Inject(Pay_Token) private service: PreviousemploymenttaxdetailsService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) {

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.bindEmployeeCode();
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.bindEmpCode()
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.addpetdform = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      Date: new FormControl('', Validators.required),
      EmployeeCode: new FormControl('', Validators.required),
      EmployeeName: new FormControl({ value: '', disabled: true }),
      FinancialYear: new FormControl('', Validators.required),
      Income: new FormControl("", Validators.required),
      TaxPaid: new FormControl('', Validators.required),
      TotalTaxPaid: new FormControl({ value: '', disabled: true }),
      PFPaid: new FormControl('', Validators.required),
      Surcharge: new FormControl('', Validators.required),
      EducationCess: new FormControl('', Validators.required),
      PTPaid: new FormControl('', Validators.required),
      Type: new FormControl('', Validators.required),
    })
    this.bindFinancialYear();
    this.bindType();
    this.addpetdform.get('EmployeeCode')?.valueChanges.subscribe(empId => {

      const selectedEmp = this.employeeCodes.find(
        (e: any) => e.Employee_Id == empId
      );

      if (selectedEmp) {
        this.addpetdform.patchValue({
          EmployeeName: selectedEmp.Employee_Name
        });
      } else {
        this.addpetdform.patchValue({
          EmployeeName: ''
        });
      }
    });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!))
  }

  bindFinancialYear() {
    this.service.getFinancialYear().subscribe({
      next: res => {
        this.financialYear = res.Data.data.Table0
      }
    });
  }

  bindType() {
    this.service.getType().subscribe({
      next: res => {
        this.type = res.Data.data.Table0
      }
    });
  }

  bindEmployeeCode() {
    const companyId = this.selectedCompanyId;
    this.service.getEmployeeCode(companyId).subscribe({
      next: res => {
        this.employeeCodes = res.Data.data.Table0
      }
    })
  }

  bindEmpCode() {
    const companyId = this.CompanyId || 0;
    console.log("companyId", companyId)
    this.service.getEmployeeCode(companyId).subscribe({
      next: res => {
        this.empCode = res.Data.data.Table0
      }
    })
  }

  formatDateForInput(dateStr: string): string | null {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }


  editPetd(row: any) {
    this.isAddclicked = true;      // open popup
    this.isEditMode = true;
    this.editingRowId = row.Previous_Employment_Id;


    const formattedDate = row.Date
      ? row.Date.split('T')[0]
      : '';
    console.log("row", row)
    this.addpetdform.patchValue({
      CompanyCode: row.Company_Code,
      Date: formattedDate,
      EmployeeCode: row.Employee_Id,
      EmployeeName: row.Employee_Name,   // if available
      FinancialYear: row.Financial_Year_Id,
      Income: row.Income_After_Exemption_10,
      TaxPaid: row.Tax_Paid,
      TotalTaxPaid: row.Total_Tax_Paid,
      PFPaid: row.PF_Paid,
      Surcharge: row.Surcharge,
      EducationCess: row.Education_Cess,
      PTPaid: row.PT_Paid,
      Type: row.Type
    });

    // // Enable disabled fields if required
    // this.addpetdform.get('EmployeeName')?.enable();
    // this.addpetdform.get('TotalTaxPaid')?.enable();
  }


  onSearch() {
    this.showTable = true;
    // this.isLoading = true;
    const companyId = this.CompanyId || 0
    const EmployeeId = this.EmpCode || 0
    console.log("employeeId", EmployeeId)

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
    const companyId = this.CompanyId || 0
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

  resetForm() {
    this.addpetdform.reset();
    this.isAddclicked = false;
    this.isEditMode = false;
    this.editingRowId = null;
  }


  // savePetd() {

  //   if (this.addpetdform.invalid) {
  //     this.addpetdform.markAllAsTouched();
  //     return;
  //   }

  //   // this.isLoading = true;

  //   const form = this.addpetdform.value;

  //   const payload = {
  //     createdBy: this.userdetail.user_Id,
  //     mode: 'Add',
  //     parentDetail: {
  //       Previous_Employment_Id: 0,
  //       Date: form.Date,
  //       Employee_Id: Number(form.EmployeeCode),
  //       Financial_Year_Id: Number(form.FinancialYear),
  //       Income_After_Exemption_10: Number(form.Income),
  //       Tax_Paid: Number(form.TaxPaid),
  //       Surcharge: Number(form.Surcharge),
  //       Education_Cess: Number(form.EducationCess),
  //       Total_Tax_Paid: Number(form.TotalTaxPaid) || 0,
  //       PF_Paid: Number(form.PFPaid),
  //       PT_Paid: Number(form.PTPaid),
  //       Declaration_Type_Id: 0
  //     }
  //   };
  //   console.log(JSON.stringify(payload))

  //   this.service.addPeta(payload).subscribe({
  //     next: res => {
  //       alert(res.Data.message);
  //       // this.dialogRef.close('updated');
  //     },
  //     error: err => {
  //       console.error(err);
  //       // this.isLoading = false;
  //     }
  //   });
  //   // this.isLoading = false;
  // }

  savePetd() {
    if (this.addpetdform.invalid) {
      this.addpetdform.markAllAsTouched();
      return;
    }

    const form = this.addpetdform.value;

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: this.isEditMode ? 'Edit' : 'Add',
      parentDetail: {
        Previous_Employment_Id: this.isEditMode ? this.editingRowId : 0,
        Date: form.Date,
        Employee_Id: Number(form.EmployeeCode),
        Financial_Year_Id: Number(form.FinancialYear),
        Income_After_Exemption_10: Number(form.Income),
        Tax_Paid: Number(form.TaxPaid),
        Surcharge: Number(form.Surcharge),
        Education_Cess: Number(form.EducationCess),
        Total_Tax_Paid: Number(form.TotalTaxPaid) || 0,
        PF_Paid: Number(form.PFPaid),
        PT_Paid: Number(form.PTPaid),
        Declaration_Type_Id: Number(form.Type)
      },
    };
    console.log(JSON.stringify(payload));

    this.service.addPeta(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        this.resetForm();
        this.onSearch(); // reload table
      },
      error: err => console.error(err)
    });
  }

  deletePetd(row: any) {

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

    this.service.addPeta(payload).subscribe({
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

  closeclick() {
    this.isAddclicked = false;
  }

  AddPetdOpen() {
    this.isAddclicked = true;
  }


}
