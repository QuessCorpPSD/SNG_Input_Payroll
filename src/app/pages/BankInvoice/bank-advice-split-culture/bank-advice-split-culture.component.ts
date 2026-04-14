import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { BankAdviceSplitCultureService } from '../../../Service/BankInvoice/BankAdviceSplitCulture.Service';
import { IBankAdvoceSplitCulture } from '../../../Repository/BankInvoice/IBankAdviceSplitCulture';
import { finalize, of } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Console } from 'console';
export const Common_TOKEN = new InjectionToken<IBankAdvoceSplitCulture>('Common_TOKEN');

@Component({
  selector: 'bankadvicesplitculture',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule,
    MatPaginatorModule, FormsModule, AlertpopupComponent, CompanyallComponent,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatCheckbox],
  templateUrl: './bank-advice-split-culture.component.html',
  styleUrl: './bank-advice-split-culture.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: BankAdviceSplitCultureService }]
})
export class BankAdviceSplitCultureComponent {
  selectedCompanyId: any;
  selectedCompanyIdPopup: any;
  selectedSplitTypePopup: any;
  selectedCompanyIdEditPopup: any;
  selectedSplitTypeEditPopup: any;
  companySearch: any;
  showTable = false;

  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  userdetail: any;
  CompanyCode: any;
  searchText: any;
  addpopup: boolean = false;
  editPopup: boolean = false;
  selectedRow: any = null;
  selection = new SelectionModel<any>(true, []);
  selectionEdit = new SelectionModel<any>(true, []);
  selectedCompanyDisplay: string = '';
  selectedSplitTypeEdit: any;

  options = [
    { id: 1, displayName: 'Separate' },
    { id: 2, displayName: 'Multiple' }
  ];

  filteredOptions$ = of(this.options); // or your filter logic

  displayFn(option: any): string {
    return option?.displayName || '';
  }
  onOptionSelected(value: any) {
    this.selectedSplitTypePopup = value.id;
  }

  onOptionEditSelected(value: any) {
    this.selectedSplitTypeEdit = value;          // ✅ UI binding
    this.selectedSplitTypeEditPopup = value.id;
  }


  popupDataSource = new MatTableDataSource<any>([]);
  popupEditDataSource = new MatTableDataSource<any>([]);
  popupDisplayedColumns: string[] = [
    'Action',
    'Map_Name'
  ];

  constructor(private dialog: MatDialog,
    @Inject(Common_TOKEN) private bankservice: IBankAdvoceSplitCulture,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }

  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'Company_Code', 'Client_Name', 'Map_Name', 'Culture_Type_Text'
  ];

  uploadedData: any[] = []; // s No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', category: '', date: '', fromvalue: '', tovalue: '', criteria: '', criterianame: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editPaginator') editPaginator!: MatPaginator;
  @ViewChild('addPaginator') addPaginator!: MatPaginator;

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.addpopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
    this.popupDataSource = new MatTableDataSource<any>([]);
  }

  closeEditPopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
    this.editPopup = false;
    this.popupEditDataSource = new MatTableDataSource<any>([]);
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

  }

  onsearch() {

    if (!this.selectedCompanyId) {
      alert('Please select Company');
      return;
    }

    this.isLoading = true;
    this.showTable = true;

    const payload = {
      "Company_Id": this.selectedCompanyId,
      "Mode": "Search"
    }
    this.bankservice.search(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.companySearch = res.Data?.data?.Table0;

        if (this.companySearch && this.companySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.companySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.uploadDisplayedColumns = [
            'Action',
            'SNo',
            'Company_Code',
            'Client_Name',
            'Map_Name',
            'Culture_Type_Text'
          ];
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      },
    });
  }


  AddCompanyMasterOpen() {
    this.addpopup = true;
  }

  EditCompanyMasterOpen(row: any) {
    this.selectedRow = row;
    this.editPopup = true;
    this.isLoading = true;
    this.selectedCompanyDisplay = this.selectedRow.Company_Code + ' ' + this.selectedRow.Client_Name;
    const payload = {
      "Company_Id": this.selectedRow.Company_Id,
      "Bank_Culture_Id": this.selectedRow.Bank_Culture_Id,
      "Mode": "Edit"
    }
    this.bankservice.search(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {

        const data = res?.Data?.data?.Table0 || [];

        this.setSplitType();

        this.popupEditDataSource.data = data;

        // Attach paginator
        setTimeout(() => {
          this.popupEditDataSource.paginator = this.editPaginator;
        });

        // Pre-select based on available = true
        this.selectionEdit.clear();

        data.forEach((row: any) => {
          if (row.available) {
            this.selectionEdit.select(row);
          }
        });

      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      },
    });
  }

  TemplateClick() {

    const templateData = [
      {
        Company_Code: "",
        Split_Type: "",
        Map_Name: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Bank_Advice_Split_Culture_Template.xlsx`);
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.bankservice.UploadBankInvoiceSplit(formData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({

      next: (res) => {

        if (!res || !res.Data) {
          this.showAlertPopup('Upload request processed. Server did not return any data.');
          return;
        }


        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.showAlertPopup('RowS Uploaded Successfully')
          return;
        }
        else if (res?.Data?.response?.includes("Failed to import.")) {
          alert('Failed to Import');
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
            Error_Message: item?.Error_Message || item?.Error_Message
              || item?.Error_Message || item?.Validation || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_BankAdviceSplitCulture.xlsx');
          return;
        }

      },
      error: (err) => {
        console.error(' Upload failed', err);
        alert('Upload failed due to a network or server error.');
      }
    });
  }

  closePopup() {
    this.addpopup = false;
  }

  handleCompanyEventPopup(company) {
    this.selectedCompanyIdPopup = company.companyId;
    this.isLoading = true;
    this.bankservice.GetMapName(this.selectedCompanyIdPopup).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.popupDataSource = res.Data?.data?.Table0;

        setTimeout(() => {
          this.popupDataSource.paginator = this.addPaginator;
        });
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
      },
    });

  }

  onSave() {
    if (!this.selectedCompanyId) {
      alert('Please select company');
      return;
    }

    if (!this.selectedSplitTypePopup) {
      alert('Please select split type');
      return;
    }

    const selectedRows = this.selection.selected;

    if (!selectedRows || selectedRows.length === 0) {
      alert('Please select at least one record');
      return;
    }

    if (this.selectedSplitTypePopup === 1 && selectedRows.length > 1) {
      alert('Multiple selection not possible for split type (Separate)');
      return;
    }

    this.isLoading = true;
    const payload = {
      Company_id: this.selectedCompanyId,
      Vendor_id: 0,
      Culture_Type: this.selectedSplitTypePopup || 0,
      CreatedBy: this.userdetail.user_Id,
      Mode: 'Add',
      Bank_Culture_id: 0, // IMPORTANT for Add
      BankCultureDetailsResponse: {
        BankCulture: selectedRows.map((row: any, index: number) => ({
          available: true,
          Bank_Culture_Detail_id: 0,
          Bank_Culture_id: 0,
          Company_Id: 0,
          Map_Name_Id: row.Map_Name_Id,
          Map_Name: row.Map_Name,
          CreatedBy: 0,
          Culture_Type: 0,
          Group_Detail_Id: 0,
          SNo: 0,
          Vendor_Id: 0
        }))
      }
    };

    this.bankservice.Save(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res?.Data?.response?.includes.toLowerCase("successfully.")) {
          this.showAlertPopup(res?.Data?.response);
          this.onsearch();
          return;
        }
        else if (res?.Data?.response?.includes("Failed to import.")) {
          alert('Failed to Import');
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
            Error_Message: item?.Error_Message || item?.Error_Message
              || item?.Error_Message || item?.Validation || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_BankAdviceSplitCulture.xlsx');
          return;
        }
        else
        {
          alert(res?.Data?.response);
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }

  onUpdate() {
    const data = this.popupEditDataSource.data;
    const selectedRows = this.selectionEdit.selected;

    if (this.selectedSplitTypeEditPopup === 1 && selectedRows.length > 1) {
      alert('Multiple selection not possible for split type (Separate)');
      return;
    }
    this.isLoading = true;

    const payload = {
      Company_id: this.selectedCompanyId,
      Vendor_id: 0,
      Culture_Type: this.selectedSplitTypeEditPopup,
      CreatedBy: this.userdetail.user_Id,
      Mode: 'Edit',
      Bank_Culture_id: data[0]?.Bank_Culture_id || 0,
      BankCultureDetailsResponse: {
        BankCulture: selectedRows.map((row: any) => ({
          available: true,
          Bank_Culture_Detail_id: row.Bank_Culture_Detail_id,
          Bank_Culture_id: 0,
          Company_Id: 0,
          Map_Name_Id: row.Map_Name_Id,
          Map_Name: row.Map_Name,
          CreatedBy: 0,
          Culture_Type: 0,
          Group_Detail_Id: 0,
          SNo: 0,
          Vendor_Id: 0
        }))
      }
    };
    
    this.bankservice.Save(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res?.Data?.response?.includes.toLowerCase("successfully.")) {
          this.showAlertPopup(res?.Data?.response);
          this.onsearch();
          return;
        }
        else if (res?.Data?.response?.includes("Failed to import.")) {
          alert('Failed to Import');
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
            Error_Message: item?.Error_Message || item?.Error_Message
              || item?.Error_Message || item?.Validation || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_BankAdviceSplitCulture.xlsx');
          return;
        }
        else
        {
          alert(res?.Data?.response);
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });

  }

  setSplitType() {
    const cultureType = this.selectedRow?.Culture_Type;
    this.selectedSplitTypeEdit = this.options.find(
      x => x.id === cultureType
    );
    this.selectedSplitTypeEditPopup = cultureType;
  }

  confirmDelete(row: any) {
    const confirmDelete = confirm('Are you sure you want to delete this record?');

    if (confirmDelete) {
      this.deleteSplitCulture(row);
    }
  }

  deleteSplitCulture(row: any) {
    this.isLoading = true;

    const payload = {
      Company_id: row.Company_Id,
      Vendor_id: 0,
      Culture_Type: row.Culture_Type || 0,
      CreatedBy: this.userdetail.user_Id,
      Mode: 'Delete',
      Bank_Culture_id: row.Bank_Culture_Id || 0,
      Bank_Culture_Detail_id: row.Bank_Culture_Detail_id || 0
    };

    this.bankservice.Save(payload).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        if (res?.Data?.response?.includes.toLowerCase("successfully.")) {
          this.showAlertPopup(res?.Data?.response);
          this.onsearch();
          return;
        }
        else if (res?.Data?.response?.includes("Failed to import.")) {
          alert('Failed to Import');
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
            Error_Message: item?.Error_Message || item?.Error_Message
              || item?.Error_Message || item?.Validation || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_BankAdviceSplitCulture.xlsx');
          return;
        }
        else
        {
          alert(res?.Data?.response);
        }
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }

}

