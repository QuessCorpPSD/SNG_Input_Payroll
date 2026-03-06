import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { ReleaseGrid } from '../../../Models/SalaryRelease/Release';
import { ReleaseImportGrid } from '../../../Models/SalaryRelease/ReleaseImportGrid';
import { DBTHoldGrid } from '../../../Models/SalaryRelease/DBTHold';
import { PartialHoldGrid } from '../../../Models/SalaryRelease/PartialHold';
import { SalaryHoldGrid } from '../../../Models/SalaryRelease/SalaryHold';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyComponent } from "../../../common/company/company.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { IBankInvoiceNEFTCulture } from '../../../Repository/SalaryRequestNew/IBankInvoiceNEFTCulture';
import { BankInvoiceNEFTCultureService } from '../../../Service/SalaryRequestNew/bank-invoice-neftculture.service';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
export const Pay_TOKEN = new InjectionToken<IBankInvoiceNEFTCulture>('Pay_TOKEN');

@Component({
  selector: 'app-bank-invoice-neftculture',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, PayrollinputComponent, MatIconModule, MatCardModule, CompanyComponent, CompanyallComponent],
  templateUrl: './bank-invoice-neftculture.component.html',
  styleUrl: './bank-invoice-neftculture.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BankInvoiceNEFTCultureService,
    }
  ]
})
export class BankInvoiceNEFTCultureComponent {
  companyUI: any;
  payperiodUI: any;
  selectedCompanyId: any;
  payPeriodTypefromParent: string = '';
  isLoading = false;
  searchText: string = '';
  isAddclicked = false;
  dataSourceSalary = new MatTableDataSource<SalaryHoldGrid>([]);
  dataSourcePartial = new MatTableDataSource<PartialHoldGrid>([]);
  dataSourceDBT = new MatTableDataSource<DBTHoldGrid>([]);
  @ViewChild('salaryPaginator') salaryPaginator!: MatPaginator;
  @ViewChild('holdPaginator') holdPaginator!: MatPaginator;
  displayedColumns: string[] = [
    'SNo', 'Company_Code', 'Client_Name', 'Bank_Name',
  ];
  selectedTemplate: string = '';
  dataSource = new MatTableDataSource<ReleaseGrid>([]);
  dataSourceImport = new MatTableDataSource<ReleaseImportGrid>([]);

  selection = new SelectionModel<any>(true, []); // true = multiple selection

  displayedColumns2: string[] = [
    'select', 'Bank_Name'
  ];
  selectedTemplate2: string = '';

  dataSource2 = new MatTableDataSource<any>([]);

  istablevisible = false;
  NEFT!: FormGroup;
  userdetail: any;
  tableData: any;
  paginator: any;
  sort: any;

  constructor(private decry: EncryptionService, private _sessionStoreage: SessionStorageService, private fb: FormBuilder, @Inject(Pay_TOKEN) private service: IBankInvoiceNEFTCulture,) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }

    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };

    this.NEFT = new FormGroup({
      CompanyCode: new FormControl(['']),
      CompanyName: new FormControl([''])
    });

    this.NEFT.get('CompanyName')?.disable();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    console.log(this.selectedCompanyId);
  }


  TemplateChange(): void {

    if (this.selectedTemplate === "") {
      this.selectedTemplate = "";
    }

    this.dataSource.data = [];
    this.dataSourceSalary.data = [];
    this.dataSourcePartial.data = [];
    this.dataSourceDBT.data = [];
  }
  onTemplateChange(): void {

    if (this.selectedTemplate === "") {
      this.selectedTemplate = "";
    }

    this.dataSource.data = [];
    this.dataSourceSalary.data = [];
    this.dataSourcePartial.data = [];
    this.dataSourceDBT.data = [];
  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;
    this.dataSourceImport.filter = filterValue;

  }

  // searchClick() {

  //   if (!this.selectedCompanyId) {
  //     alert("Select Company Code");
  //     return;
  //   }
  //   this.istablevisible = true;
  //   this.dataSource.data = [];
  //   this.dataSourceImport.data = [];


  //   if (this.companyUI) {

  //     // this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
  //   }
  // }



  searchClick() {

    if (!this.selectedCompanyId) {
      alert("Select Company Code");
      return;
    }

    this.istablevisible = true;

    const companyid = this.selectedCompanyId;
    const userid = this.userdetail.user_Id;
    console.log("id", this.userdetail.user_Id)

    this.service.NeftCulturesearch(companyid, userid).subscribe({
      next: (res) => {

        this.tableData = res?.Data?.data?.Table0 || [];
        if (this.tableData && this.tableData.length > 0) {
          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.paginator = this.holdPaginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = [
            'SNo', 'Company_Code', 'Client_Name', 'Bank_Name',
          ];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('error', err);
      },
    });
  }

  exportToExcel() {
    if (!this.selectedCompanyId) {
      alert("Please select a company to export data.");
      return;
    }

    const companyid = this.selectedCompanyId;
    const userid = this.userdetail.user_Id;

    this.isLoading = true;

    this.service.NeftCultureExport(companyid, userid).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        const tableData = res?.Data?.data?.Table0 || [];
        if (!tableData.length) {
          alert("No data available for export.");
          return;
        }

        // Export to Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Increment_Data");
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `Increment_Export_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Error exporting data", err);
        alert("Failed to export data");
      }
    });
  }

  AddPOOpen() {
    this.isAddclicked = true;
  }

  closeclick() {
    this.isAddclicked = false;
    this.NEFT.reset();
    this.dataSource2.data = [];
    this.isAllSelected();
  }

  handleCompanyEvent2(company: any) {

    if (!company) {
      alert("Select Company Code");
      return;
    }

    this.companyUI = company;
    this.selectedCompanyId = company.companyId;

    this.NEFT.patchValue({
      CompanyCode: company.companyCode,
      CompanyName: company.companyName
    });

    this.loadBankCultureData();
  }


  loadBankCultureData() {
    if (!this.selectedCompanyId) {
      alert("Please Select Company");
      return;
    }

    const companyId = this.selectedCompanyId;
    const userId = this.userdetail.user_Id;
    const Mode = "Add";

    if (!companyId) return;

    this.isLoading = true;

    this.service.GetDetails(companyId, Mode, userId).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res && res.StatusCode === 200 && res.Data[0]) {

          // Map API response to table format
          const mappedData = res.Data.map((item: any) => ({

            select: false,
            Bank_Id: Number(item.bank_Id),
            Bank_Name: item.bank_Name,
            bank_Culture_id: item.bank_Culture_id,
            available: item.available
          }));

          this.dataSource2 = new MatTableDataSource(mappedData);
          this.dataSource2.paginator = this.salaryPaginator;
          this.dataSource2.sort = this.sort;
          this.istablevisible = true;
        }
        else {
          alert("No Data Found");
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Search error", err);
        alert("Error while fetching data");
      }
    });
  }
  // Check if all rows are selected
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  // Select/Deselect all rows
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource2.data.forEach(row => this.selection.select(row));
  }


  onSave() {

    if (!this.selectedCompanyId) {
      alert("Select Company Code");
      return;
    }
    const selectedRows = this.selection.selected;
    if (!selectedRows || selectedRows.length === 0) {
      alert("Select at least one Bank");
      return;
    }

    const payload = {
      Mode: "Add",
      UserId: this.userdetail.user_Id,
      Company_Id: this.selectedCompanyId,
      culturedatas: selectedRows.map((bank: any) => ({
        Bank_Id: bank.Bank_Id,
        Bank_Culture_id: bank.bank_Culture_id ?? 0
      }))
    };

    console.log("SAVE PAYLOAD", payload);

    this.service.NeftCultureSave(payload).subscribe({
      next: (res: any) => {

        const msg = res?.Data[0]?.message || res?.Data[0]?.error_Message || "Saved successfully";

        if (msg.toLowerCase().includes("success")) {
          alert(msg);
          this.loadBankCultureData();
          this.isAddclicked = false;
        } else {
          alert(msg);
        }
      },
      error: (err) => {
        console.error("Save error", err);
        alert("Error while processing");
      }
    });
  }





}



