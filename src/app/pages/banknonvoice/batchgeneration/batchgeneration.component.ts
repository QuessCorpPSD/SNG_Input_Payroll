import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { BatchGenerationService } from '../../../Service/banknonvoice/batchgeneration.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-batchgeneration',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, CompanyallComponent, MatCardModule, MatCheckboxModule],
  templateUrl: './batchgeneration.component.html',
  styleUrl: './batchgeneration.component.css'
})
export class BatchgenerationComponent implements OnInit {
  BatchType = '';
  EntityId = 0;
  batchCreationTypes = '0';
  Status = '';

  uploadDisplayedColumns: string[] = [
    'checkbox', 'vendorname', 'groupname', 'WbsCode', 'attendanceBatch', 'groupCount', 'payperiod', 'purpose', 'input', 'action'];

  uploadedDataSource = new MatTableDataSource<any>([]);

  batchtypes: any;
  batchTypeList: any;
  EntityList: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userdetail: any;
  isLoading = false;

  constructor(public service: BatchGenerationService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,) {

  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    console.log(this.userdetail)
    this.loadbatchType(this.userdetail.user_Id);
    this.loadEntityList(this.userdetail.user_Id);
    this.loadBatchCreationType(this.userdetail.user_Id);
  }

  loadbatchType(userid): void {
    this.service.GetBatchTypeList(userid).subscribe({
      next: (res: any) => {
        this.batchtypes = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }

  loadEntityList(userid): void {
    this.service.EntityListbg(userid).subscribe({
      next: (res: any) => {
        this.EntityList = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }

  loadBatchCreationType(userid): void {
    this.service.BatchCreationTypelist(userid).subscribe({
      next: (res: any) => {
        this.batchTypeList = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }

  onSearch(): void {

    if (!this.BatchType) {
      alert('Please select Batch Type.');
      return;
    }

    if (!this.EntityId) {
      alert('Please select Entity.');
      return;
    }

    if (!this.batchCreationTypes) {
      alert('Please select Batch Creation Type.');
      return;
    }

    if (!this.Status) {
      alert('Please select Status.');
      return;
    }

    this.isLoading = true;
    console.log(this.batchCreationTypes)

    this.service.GetSalaryreleaseProcessdata(
      this.BatchType,
      this.EntityId,
      this.batchCreationTypes,
      this.Status,
      this.userdetail.user_Id
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          this.uploadedDataSource.data = tableData;

          if (!tableData.length) {
            alert('No records found.');
          }

        },
        error: (err) => {
          console.error(err);
          this.uploadedDataSource.data = [];
          alert('Something went wrong.');
        }
      });

  }

  onExport(): void {

    if (!this.BatchType) {
      alert('Please select Batch Type.');
      return;
    }

    if (!this.EntityId) {
      alert('Please select Entity.');
      return;
    }

    if (!this.batchCreationTypes) {
      alert('Please select Batch Creation Type.');
      return;
    }

    if (!this.Status) {
      alert('Please select Status.');
      return;
    }

    this.isLoading = true;

    this.service.GetSalaryreleaseProcessExport(
      this.BatchType,
      this.EntityId,
      this.batchCreationTypes,
      this.Status,
      this.userdetail.user_Id
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert('No records found.');
            return;
          }

          this.exportDataToExcel(tableData, 'BatchGeneration_');

        },
        error: (err) => {
          console.error(err);
          alert('Export failed.');
        }
      });

  }

  toggleAllRows(checked: boolean): void {
    this.uploadedDataSource.data.forEach((row: any) => {
      row.selected = checked;
    });
  }

  isAllSelected(): boolean {
    const data = this.uploadedDataSource?.data || [];

    return data.length > 0 && data.every((row: any) => row.selected);
  }

  isSomeSelected(): boolean {
    const data = this.uploadedDataSource?.data || [];

    const selectedCount = data.filter((row: any) => row.selected).length;

    return selectedCount > 0 && selectedCount < data.length;
  }

  onGenerate(): void {

    // Prevent duplicate clicks
    if (this.isLoading) {
      return;
    }

    // Validation
    if (!this.BatchType) {
      alert('Please select Batch Type.');
      return;
    }

    if (!this.EntityId) {
      alert('Please select Entity.');
      return;
    }

    if (!this.batchCreationTypes) {
      alert('Please select Batch Creation Type.');
      return;
    }

    if (!this.Status) {
      alert('Please select Status.');
      return;
    }

    if (!this.uploadedDataSource?.data?.length) {
      alert('No records available to generate batch.');
      return;
    }

    // If generation is based on selected rows
    const selectedRows = this.uploadedDataSource.data.filter((x: any) => x.selected);

    if (!selectedRows.length) {
      alert('Please select at least one record.');
      return;
    }

    console.log(selectedRows);

    const payload = {
      BatchType: this.BatchType,
      Entity_id: this.EntityId,
      batchCreationTypes: this.batchCreationTypes,
      Status: this.Status,
      UserId: this.userdetail.user_Id,

      BatchList: selectedRows
    };

    this.isLoading = true;

    this.service.BatchGenerate(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert(res.Data[0].validation);
        this.onSearch();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
        alert('Something went wrong. Please try again.');
      }
    });
  }

  onReject(row: any): void {
    console.log(row)
    this.isLoading = true;

    const BatchType = this.BatchType;
    const Salary_Process_Initiate_detail_Id = row.Salary_Process_Initiate_detail_Id;
    const UserId = this.userdetail.user_Id;

    this.service.Rejectgroup(
      BatchType,
      Salary_Process_Initiate_detail_Id,
      UserId
    ).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        alert(res?.Data.validation);
        this.onSearch();
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Reject Error:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      alert('Please select a file.');
      return;
    }

    if (!this.BatchType) {
      alert('Please select Batch Type.');
      input.value = '';
      return;
    }

    const file = input.files[0];

    const allowedExtensions = ['xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension || '')) {
      alert('Only Excel files (.xls/.xlsx) are allowed.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('BatchType', this.BatchType);
    formData.append('UserId', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.UploadCollectionStatus(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
        input.value = '';
      }))
      .subscribe({

        next: (res) => {

          if (!res?.Data) {
            alert('Server returned no data.');
            return;
          }

          const response = res.Data.error_Message ?? '';

          if (response.includes('Row(s) Uploaded Successfully.')) {
            alert('Rows Uploaded Successfully.');
            return;
          }

          if (response.includes('Failed to import.')) {

            alert('Failed to Import.');

            const rawErr = res.Data.errors?.[0];

            let errorArray: any[] = [];

            try {

              if (typeof rawErr === 'string') {

                const parsed = JSON.parse(rawErr);

                errorArray = Array.isArray(parsed)
                  ? parsed
                  : [parsed];

              } else {

                errorArray = Array.isArray(rawErr)
                  ? rawErr
                  : rawErr
                    ? [rawErr]
                    : [];

              }

            } catch {

              errorArray = rawErr
                ? [{ Error_Message: String(rawErr) }]
                : [];

            }

            const exportData = errorArray.map((x: any) => ({
              Error_Message: x.Error_Message || x.Validation || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const workbook = {
              Sheets: {
                ErrorMessages: worksheet
              },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, 'ErrorMessages.xlsx');

          }

        },
        error: (err) => {
          console.error(err);
          alert('Upload failed.');
        }

      });
  }

  onDownloadTemplate() {
    var flag = 'NIStatusApprove';
    this.isLoading = true;
    this.service.GetTemplate(this.userdetail.user_Id, flag)
      .subscribe({

        next: (res: any) => {
          this.isLoading = false;
          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert('No template data found.');
            return;
          }
          this.exportDataToExcel(tableData, 'batch_generation_template');
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Unable to download template.');
        }

      });
  }

  exportDataToExcel(data: any[], filename) {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'Users': worksheet }, SheetNames: ['Users'] };

      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      this.saveFile(excelBuffer, filename);
    });
  }

  saveFile(buffer: any, filename: any) {
    import('file-saver').then(FileSaver => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });

      FileSaver.saveAs(blob, `${filename}${new Date().getTime()}.xlsx`);
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

}
