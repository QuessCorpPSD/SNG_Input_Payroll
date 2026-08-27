import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { IProfomaImport } from '../../../Repository/invoice/IProfomaImport';
import { ProfomaImportService } from '../../../Service/invoice/profoma-import.service';
export const Pay_Token = new InjectionToken<IProfomaImport>('Pay_Token');

@Component({
  selector: 'app-profoma-import',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent, MatCardModule],
  templateUrl: './profoma-import.component.html',
  styleUrl: './profoma-import.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ProfomaImportService,
    }
  ]
})
export class ProfomaImportComponent {
  userdetail: any;
  constructor(private dialog: MatDialog, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: ProfomaImportService,) { }
  isLoading: boolean = false;


  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
  }


  downloadExcelFromBase64(base64String: string, fileName: string, FileType): void {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}_${FileType}.xlsx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  downloadTemplate() {
    const templateData = [
      {
        Proforma_No: "",
        Employee_Code: "",
        Map_Name: "",
        Group_Name: "",
        Batch_Id: "",
        Action: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Table': workSheet },
      SheetNames: ['Table']
    };

    XLSX.writeFile(workbook, 'ProfomaImport_Template.xlsx');

    // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([buffer], { type: 'application/octet-stream' });

    // FileSaver.saveAs(blob, `ClientAddress_Template.xlsx`)
  }


  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please upload only one Excel file")
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.userdetail.user_Id);

    this.service.importProforma(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && res?.Data?.response?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');
          this.isLoading = false;
          alert("Failed to Import")
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
          XLSX.writeFile(workbook, 'ErrorMessages_ProfomaImport.xlsx');
          this.isLoading = false;
          return;
        }

        // CASE 3: Anything else → show whatever we have
        // CASE: Data is array with Error_Message (e.g. "No rows to Upload")
        if (Array.isArray(res.Data) && res.Data[0]?.Error_Message) {
          alert(res.Data[0].Error_Message)
          this.isLoading = false;
          return;
        }
        else {
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


}
