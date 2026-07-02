import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { IBankNonInvoiceNEFTCulture } from '../../../Repository/banknonvoice/Ibankneftculture';
import { BankneftcultureService } from '../../../Service/banknonvoice/bankneftculture.service';
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { Company, CompanyGSTInvoice } from '../../../Models/Common';
import { CompanygstinvoiceComponent } from '../../../common/companygstinvoice/companygstinvoice.component';
const Pay_TOKEN = new InjectionToken<IBankNonInvoiceNEFTCulture>('Pay_TOKEN');

@Component({
  selector: 'app-bankneftculture',
  standalone:true,
  imports: [CompanyallComponent, MatIcon, MatPaginator, MatTableModule, MatTooltipModule, CommonModule, FormsModule, MatCheckboxModule, CompanygstinvoiceComponent],
  templateUrl: './bankneftculture.component.html',
  styleUrl: './bankneftculture.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BankneftcultureService,
    }
  ]
})
export class BankneftcultureComponent {
  selectedCompanyId: any;
  selectedCompanyCode: any;
  showTable = false;
  isAddclicked = false;
  selection = new SelectionModel<any>(true, []);
  @ViewChild('companyRef') companyRef: any;
  uploadDisplayedColumns: string[] = [
    'Action',
    'SNo',
    'Company Code',
    'Company Name',
    'Bank Name',
  ];
  displayedColumns: string[] = ['Select', 'BankName'];
  isaddtable = false;
  uploadedDataSource = new MatTableDataSource<any>();
  DataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginator0') paginator0!: MatPaginator;
  @ViewChild(MatSort) sort0!: MatSort;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;
  uploadedData: any;
  isLoading: boolean = false;
  selectedaddCompanyId: any;
  selectedaddCompanyCode: any;
  userdetail: any;
  isEditMode: boolean = false;
  editBankCultureId: any;
  showCompanyComponent: boolean = false;
searchText: any;

  constructor(@Inject(Pay_TOKEN) private service: IBankNonInvoiceNEFTCulture, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private stateservice: OnboardingStateService) { }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }
  handleCompanyaddEvent(company) {
    this.selectedaddCompanyId = company.companyId;
    this.selectedaddCompanyCode = company.companyId;
    if (this.isEditMode) return;
    this.getbankname();

  }
  isAllSelected() {

    const numSelected = this.selection.selected.length;

    const numRows = this.DataSource.data.length;

    return numSelected === numRows;

  }
  applyFilters(){
    const filterValue = this.searchText?.trim().toLowerCase();
    this.DataSource.filter = filterValue;
  
  }

  masterToggle() {

    if (this.isAllSelected()) {

      this.selection.clear();

      return;
    }

    this.DataSource.data.forEach((row: any) =>
      this.selection.select(row)
    );

  }



  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

      this.DataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Bank_Name?.toLowerCase().includes(searchText)
 
      );
    };
  }
  search() {
    if (!this.selectedCompanyId) {
      alert("Please select company");
      return;
    }
    this.showTable = true;
    this.isLoading = true;

    const companyid = this.selectedCompanyId;
    const bankcultureid = 0;
    const mode = "search";

    this.service.search(companyid, bankcultureid, mode).subscribe({

      next: (res) => {

        this.isLoading = false;

        const data = res?.Data?.data?.Table0;

        if (data.length === 0) {
          alert(res.Data.message);
          return;
        }

        this.uploadedDataSource = new MatTableDataSource(data);

        this.uploadedDataSource.paginator = this.paginator;

        this.uploadedDataSource.sort = this.sort;

        this.uploadDisplayedColumns = [
          'Action',
          'SNo',
          'Company Code',
          'Company Name',
          'Bank Name'
        ];
      },

      error: (err) => {

        this.isLoading = false;

        console.error('Error loading data', err);

      }

    });

  }

  exportToExcel(): void {
    const companyid = this.selectedCompanyId || 0;
    const bankcultureid = 0;
    const mode = "search";

    this.service.search(companyid, bankcultureid, mode).subscribe({
      next: (res) => {
        try {
          const jsonData = res?.Data?.data?.Table0;
          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert(res.Data.message);
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'company');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `BankNEFTculture_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          alert('An error occurred while exporting data.')
        }
      },
      error: (err) => {
        alert('Failed to load data from server.')
      },
    });
  }

  getbankname() {

    this.isLoading = true;
    this.isaddtable = true;
    const companyid = this.selectedaddCompanyId ?? 0;
    const mode = "add";

    this.service.Getbankname(companyid, mode).subscribe({

      next: (res) => {

        this.isLoading = false;

        const data = res?.Data?.data?.Table0;

        if (data.length === 0) {
          alert(res.Data.message);
          return;
        }

        this.DataSource = new MatTableDataSource(data);

        this.DataSource.paginator = this.paginator0;

        this.DataSource.sort = this.sort0;

        this.displayedColumns = ['Select', 'BankName'];
      },

      error: (err) => {

        this.isLoading = false;

        console.error('Error loading data', err);

      }

    });

  }


  AddPOOpen() {
    this.isAddclicked = true;
    this.isEditMode = false;

    this.selectedCompany = {
      companyId: 0,
      companyCode:  '',
      companyName:  '',
      displayName:  ''
    };
    this.stateservice.setCompanyGST(this.selectedCompany);

    this.getbankname();
  }
  selectedCompany: CompanyGSTInvoice | null = null;
  EditData(row: any) {

    this.isEditMode = true;

    this.isAddclicked = true;

    this.editBankCultureId = row.Bank_Culture_Id;

    // Set selected company for popup
    this.selectedCompany = {
      companyId: row.Company_Id,
      companyCode: row.Company_Code || '',
      companyName: row.Client_Name || '',
      displayName: row.Client_Name || ''
    };

    // Also keep selectedAddCompanyId for API payloads
    this.selectedaddCompanyId = row.Company_Id;
    this.selectedaddCompanyCode = row.Company_Code;

    this.stateservice.setCompanyGST(this.selectedCompany);


    this.getEditBanks();

  }

  closeclick() {
    this.isAddclicked = false;
  }
  SaveData() {

    const selectedRows = this.selection.selected;

    if (selectedRows.length === 0) {

      alert("Please select at least one bank");

      return;
    }

    const payload = {
      Mode: "Add",
      UserId: this.userdetail.user_Id,
      Company_Id: this.selectedaddCompanyId,
      culturedatas: selectedRows.map((row: any) => {
        return {
          Bank_Id: row.Bank_Id,
          Bank_Culture_id: 0
        };

      })

    };

    console.log(payload);
    console.log('json', JSON.stringify(payload));


    this.service.Create(payload).subscribe({

      next: (res) => {
        alert(res.Data[0].error_Message);
        this.selection.clear();
        this.closeclick();
      },
      error: (err) => {
        console.error(err);
      }
    });

  }


  updateData() {

    const selectedRows = this.selection.selected;

    if (selectedRows.length === 0) {

      alert("Please select at least one bank");

      return;
    }

    const payload = {
      Mode: "edit",
      UserId: this.userdetail.user_Id,
      Company_Id: this.selectedaddCompanyId,
      culturedatas: selectedRows.map((row: any) => {
        return {
          Bank_Id: row.Bank_Id,
          Bank_Culture_id: 0
        };

      })

    };

    console.log(payload);
    console.log('json', JSON.stringify(payload));


    this.service.Create(payload).subscribe({

      next: (res) => {
        alert(res.Data[0].error_Message);
        this.selection.clear();
        this.closeclick();
      },
      error: (err) => {
        console.error(err);
      }
    });

  }
  deleteRow(row: any) {

    if (!confirm("Are you sure you want to delete this record?")) {
      return;
    }

    const payload = {
      Mode: "Delete",
      UserId: this.userdetail.user_Id,
      Company_Id: row.Company_Id,
      culturedatas: [
        {
          Bank_Id: row.Bank_Id,
          Bank_Culture_id: row.Bank_Culture_Id
        }
      ]
    };

    console.log(payload);

    this.service.Create(payload).subscribe({

      next: (res) => {
        alert(res?.Data?.[0]?.error_Message);
        this.search();
      },

      error: (err) => {
        console.error(err);
      }

    });

  }


  getEditBanks() {

    this.isLoading = true;
    const companyid = this.selectedaddCompanyId;


    const mode = "Edit";

    this.service.Getbankname(companyid, mode).subscribe({

      next: (res: any) => {

        this.isLoading = false;

        const data = res?.Data?.data?.Table0 || [];
        this.DataSource = new MatTableDataSource(data);

        this.DataSource.paginator = this.paginator1;

        this.DataSource.sort = this.sort1;

        data.forEach((row: any) => {

          if (row.available === true || row.available === 1) {

            this.selection.select(row);

          }

        });

      },

      error: (err) => {

        this.isLoading = false;

        console.error(err);

      }

    });

  }
}
