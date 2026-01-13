import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LtacalculationService } from '../../../Service/Taxandsavings/ltacalculation.service';
import { ILtaCalculation } from '../../../Repository/Taxandsavings/Ilta.service';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<ILtaCalculation>('Pay_Token');
export interface ILTA {
  slNo: number;
  actualAmount: number | null;
  eligibleAmount: number | null;
  exemptionAmount: number | null;
  remarks: number | null;
  carryForward: number | null;
}

@Component({
  selector: 'app-ltacalculation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatPaginatorModule, MatTableModule, CompanyallComponent, MatTooltipModule],
  templateUrl: './ltacalculation.component.html',
  styleUrl: './ltacalculation.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: LtacalculationService,
    }
  ]
})
export class LtacalculationComponent {
  addLtaCalculation!: FormGroup;
  isEditMode: boolean = false;
  ceaform!: FormGroup;
  isAddclicked = false;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  uploadData: ILTA[] = [];
  uploadedDataSource = new MatTableDataSource<ILTA>(this.uploadData)
  displayedColumns: string[] = [
    "delete", "edit", "sno", "companyCode", "employeeCode", "employeeName", "financialYear", "ltaBlockPeriod"
    , "declarationType", "travelFromDate", "travelToDate", "travelLocation", "claimDate", "claimAmount", "actualAmount", "eligibleAmount", "exemptionAmount", "remarks", "carryForward"
  ];
  dataSource = new MatTableDataSource<any>([]);
  EmpCode: any;
  showTable = false;
  ltaSearch: any;
  userdetail: any;
  blockPeriod: any;
  selectedRowSlNo: number | null | undefined;
  financialYear: any;
  type: any;
  employeeCodes: any;
  CompanyId: any;
  CompanyCode: any;
  empCode: any;
  isLoading: boolean = false;

  constructor(@Inject(Pay_Token) private service: LtacalculationService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
    this.bindEmployeeCode()
  }

  handleCompany(company) {
    this.CompanyId = company.companyId;
    this.CompanyCode = company.companyCode;
    this.bindEmpCode()
  }

  ngOnInit(): void {

    this.addLtaCalculation = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      EmployeeCode: new FormControl('', Validators.required),
      EmployeeName: new FormControl({ value: '', disabled: true }),
      FinancialYear: new FormControl('', Validators.required),
      BlockPeriod: new FormControl('', Validators.required),
      Type: new FormControl('', Validators.required),
      TravelFromDate: new FormControl('', Validators.required),
      TravelToDate: new FormControl('', Validators.required),
      TravelLocation: new FormControl('', Validators.required),
      ClaimDate: new FormControl('', Validators.required),
      ClaimAmount: new FormControl('', Validators.required)
    })
    this.bindBlockPeriod();
    this.bindFinancialYear();
    this.bindType();
    this.addLtaCalculation.get('EmployeeCode')?.valueChanges.subscribe(empId => {

      const selectedEmp = this.employeeCodes.find(
        (e: any) => e.Employee_Id == empId
      );

      if (selectedEmp) {
        this.addLtaCalculation.patchValue({
          EmployeeName: selectedEmp.Employee_Name
        });
      } else {
        this.addLtaCalculation.patchValue({
          EmployeeName: ''
        });
      }
    });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  }

  bindBlockPeriod() {
    this.service.getBlockPeriod().subscribe({
      next: res => {
        this.blockPeriod = res.Data.data.Table0
      }
    });
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
    const companyId = this.selectedCompanyId || 0;
    console.log("companyId", companyId)
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

  addNewRow() {

    if (this.addLtaCalculation.invalid) {
      this.addLtaCalculation.markAllAsTouched();
      alert('Please fill all required fields');
      return;
    }

    this.uploadData.push({
      slNo: this.uploadData.length + 1,
      actualAmount: null,
      eligibleAmount: null,
      exemptionAmount: null,
      remarks: null,
      carryForward: null
    });

    this.uploadedDataSource.data = [...this.uploadData];
  }

  deleteSelectedRow() {
    if (!this.selectedRowSlNo) {
      alert('Please select a row before deleting');
      return;
    }

    this.uploadData = this.uploadData.filter(row => row.slNo !== this.selectedRowSlNo);

    // Re-index slNo after deletion
    this.uploadData.forEach((row, index) => row.slNo = index + 1);

    this.uploadedDataSource.data = [...this.uploadData];

    // Reset selection
    this.selectedRowSlNo = null;
  }


  onSearch() {
    this.showTable = true;
    this.isLoading = true;
    const companyId = this.CompanyId || 0
    const EmployeeId = this.EmpCode || 0

    this.service.search(companyId, EmployeeId).subscribe({

      next: (res) => {
        this.ltaSearch = res.Data.data.Table0;
        if (this.ltaSearch && this.ltaSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.ltaSearch);
          this.dataSource.paginator = this.paginator;
          this.displayedColumns = [
            "delete", "edit", "sno", "companyCode", "employeeCode", "employeeName", "financialYear", "ltaBlockPeriod"
            , "declarationType", "travelFromDate", "travelToDate", "travelLocation", "claimDate", "claimAmount", "actualAmount", "eligibleAmount", "exemptionAmount", "remarks", "carryForward"
          ];
        } else {
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        alert('Failed to load data');
        this.isLoading = false;
      },
    });
    this.isLoading = false;
  }

  exportToExcel(): void {
    this.isLoading = true;
    const companyId = this.CompanyId || 0
    const EmployeeId = this.EmpCode || 0

    this.service.exportToExcel(companyId, EmployeeId).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;

          //  Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the companycode and employeecode.');
            this.isLoading = false;
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Ltacalculation');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `Ltacalculation${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading = false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        this.isLoading = false;
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
      this.isLoading = false;
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
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
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
          this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          this.isLoading = false;
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
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          this.isLoading = false;
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

        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;
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

  saveLta() {

    if (this.addLtaCalculation.invalid) {
      this.addLtaCalculation.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    this.isLoading = true;

    const form = this.addLtaCalculation.value;

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      parentDetail: {
        LTA_Declaration_Id: 0,
        Employee_Id: form.EmployeeCode,
        Claim_Date: form.ClaimDate,
        Claim_Amount: form.ClaimAmount,
        Financial_Year_Id: form.FinancialYear,
        LTA_Block_Period_Id: 0,
        Declaration_Type_Id: 0,
        Travel_From_Date: form.TravelFromDate,
        Travel_To_Date: form.TravelToDate,
        Travel_Location: form.TravelLocation
      },
      childDetail: this.uploadData.map(row => ({
        LTA_Declaration_Detail_Id: 0,
        LTA_Declaration_Id: 0,
        Actual_Amount: row.actualAmount,
        Eligible_Amount: row.eligibleAmount,
        Exemption_Amount: row.exemptionAmount,
        Remarks: row.remarks,
        Carry_Forward: row.carryForward
      }))
    };
    console.log(JSON.stringify(payload))
    this.service.addLta(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        // this.dialogRef.close('updated');
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
    this.isLoading = false;

  }


  deleteLta(row: any) {

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Delete",
      parentDetail: {
        LTA_Declaration_Id: row.LTA_Declaration_Id,

      },
      childDetail: []
    };

    this.service.addLta(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        // this.dialogRef.close('updated');
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }


  closeclick() {
    this.isAddclicked = false;
  }

  AddLtaOpen() {
    this.isAddclicked = true;
  }

}
