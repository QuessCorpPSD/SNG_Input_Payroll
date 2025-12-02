import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { DynamicuploadService } from '../../../Service/tools/dynamicupload.service';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckbox } from "@angular/material/checkbox";
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dynamicupload',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatPaginatorModule, CommonModule, MatCheckbox],
  templateUrl: './dynamicupload.component.html',
  styleUrl: './dynamicupload.component.css'
})
export class DynamicuploadComponent {
  isLoading = false;

  uploadDisplayedColumns: string[] = ['Checkbox', 'Columns'];
  filterDisplayedColumns: string[] = ['FilterCheckbox', 'FilterColumns'];

  uploadedDataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  Uploadtype: any;
  showTable = false;

  mandatoryColumnId = 1; // EMPLOYEE_CODE must be selected
  userdetail: any;

  constructor(
    private dialog: MatDialog,
    private service: DynamicuploadService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.BindUploadtype();
  }

  BindUploadtype() {
    this.service.getuploadtype().subscribe({
      next: res => {
        this.Uploadtype = res.Data.data.Table0;
      }
    });
  }

  selectedUploadTypeId: any;
  selectedUploadTypeName: string = '';

  onUploadTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const selectedOption = (event.target as HTMLSelectElement).selectedOptions[0];

    if (!value) {
      this.showTable = false;
      this.uploadedDataSource.data = [];
      this.selection.clear();
      this.selectedUploadTypeName = '';
      return;
    }

    this.selectedUploadTypeId = value;
    this.selectedUploadTypeName = selectedOption.text;

    this.service.getallcolumns(value).subscribe({
      next: res => {
        this.uploadedDataSource.data = res.Data.data.Table0;

        const mandatoryCol = this.uploadedDataSource.data.find(c => c.Upload_Type_Column_Id === this.mandatoryColumnId);
        if (mandatoryCol) this.selection.select(mandatoryCol);

        this.showTable = true;

        setTimeout(() => {
          this.uploadedDataSource.paginator = this.paginator;
          this.paginator.firstPage();
        }, 0);
      }
    });
  }


  /** Toggle individual row */
  toggleRow(row: any) {
    if (row.Upload_Type_Column_Id === this.mandatoryColumnId) {
      return; // cannot unselect mandatory column
    }
    this.selection.toggle(row);
  }

  /** Select All logic */
  isAllSelected() {
    const filteredData = this.uploadedDataSource.filteredData;
    return filteredData.length > 0 && filteredData.every(row => this.selection.isSelected(row));
  }

  toggleAllRows() {
    const filteredData = this.uploadedDataSource.filteredData;
    if (this.isAllSelected()) {
      filteredData.forEach(row => {
        if (row.Upload_Type_Column_Id !== this.mandatoryColumnId) this.selection.deselect(row);
      });
    } else {
      filteredData.forEach(row => this.selection.select(row));
    }
  }

  /** Filter function */
  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.uploadedDataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.uploadedDataSource.filter = filterValue;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  canDownload() {
    return this.selection.isSelected(
      this.selection.selected.find(c => c.Upload_Type_Column_Id === this.mandatoryColumnId)
    );
  }

  downloadTemplate() {
    const selectedColumns = this.selection.selected;

    if (!selectedColumns.length) {
      alert("Please select at least one column.");
      return;
    }

    const mandatorySelected = selectedColumns.some(c => c.Upload_Type_Column_Id === this.mandatoryColumnId);
    if (!mandatorySelected) {
      alert("Mandatory column EMPLOYEE_CODE must be selected.");
      return;
    }

    const headers = selectedColumns.map(c => c.Upload_Type_Column_Name);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header: headers });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.selectedUploadTypeName);

    const fileName = this.selectedUploadTypeName ? `${this.selectedUploadTypeName}.xlsx` : "Template.xlsx";

    XLSX.writeFile(wb, fileName);
  }
  ImportClick(fileInput: HTMLInputElement): void {
    if (!this.selectedUploadTypeId) {
      alert('Please select Upload type')
    }
    fileInput.click();
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    if (!this.selectedUploadTypeId) {
      alert('Please select Upload type')
    }
    const formData = new FormData();

    formData.append('file', file);
    formData.append('UploadTypeId', this.selectedUploadTypeId);
    formData.append('CreatedBy', this.userdetail.user_Id);
    console.log('UploadTypeId', this.selectedUploadTypeId)
    this.service.Upload(formData).subscribe({
      next: (res) => {
        console.log('📥 API Response:', res);

        if (!res || !res.Data) {
          console.warn('ℹ️ No data returned from server yet.');
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data.response;

        if (response && response.includes("Row(s) Uploaded Successfully.")) {
          alert('✅ Rows uploaded successfully.');
          return;
        }

        const { parsed, msg } = this.tryParseResponse(response);

        const successMsg = 'Data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          alert('✅ Data uploaded successfully.');
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
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
          XLSX.writeFile(workbook, `${this.selectedUploadTypeName}_ErrorMessages.xlsx`);

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

      },
      error: (err) => {
        console.error('❌ Upload failed', err);
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
}
