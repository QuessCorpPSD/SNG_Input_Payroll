import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { PayregisteruploadService } from '../../../Service/Process/payregisterupload.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { finalize } from 'rxjs';

@Component({
  selector: 'app-payregisterupload',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CompanyallComponent, PayPeriodComponent, AlertpopupComponent],
  templateUrl: './payregisterupload.component.html',
  styleUrl: './payregisterupload.component.css'
})
export class PayregisteruploadComponent {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  payperiodId: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;


  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private payRegisterUpload: PayregisteruploadService) {

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePoopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert("please select Company Code");
      return;
    }

    if (!this.payperiodId) {
      alert("please select Pay Period");
      return;
    }

    const payload = {
      "Company_id": this.selectedCompanyId?.toString(),
      "Pay_Frequency_Id": this.payperiodId?.toString()
    }

    this.payRegisterUpload.exportPayRegisterUpload(payload).subscribe({
      next: (res) => {
        try {

          const jsonData = res?.Data?.data?.Table0;

          // Check if Data is not an array or empty
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            this.showAlertPopup(res.Data.message)
            return;
          }

          // Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `PayRegisterUpload_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        alert("Failed to load data from server.");
      },
    });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("Please upload only one Excel file.")
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);


    this.payRegisterUpload.importPayRegisterUpload(formData).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: res => {

        const tables = res?.Data?.data;

        if (!tables) {
          alert('Failed');
          return;
        }

        const workbook: XLSX.WorkBook = {
          Sheets: {},
          SheetNames: []
        };

        const sheetNameMap: any = {
          Table0: 'PayRegister',
          Table1: 'Investment',
          Table2: 'HRA',
          Table3: 'LTA',
          Table4: 'IncomeLossOnHouseProperty',
          Table5: 'PreviousEmployment'
        };

        Object.keys(tables).forEach((tableKey) => {
          const tableData = tables[tableKey];

          if (tableData && tableData.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(tableData);

            const sheetName = sheetNameMap[tableKey] || tableKey;

            workbook.Sheets[sheetName] = worksheet;
            workbook.SheetNames.push(sheetName);
          }
        });

        if (workbook.SheetNames.length === 0) {
          alert('Failed.');
          return;
        }

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([buffer], {
          type: 'application/octet-stream'
        });

        FileSaver.saveAs(blob, `PayRegisterUpload_Response.xlsx`);
      },

      error: () => {
        alert('Failed to import');
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

  DownloadTemplate() {

    if (!this.selectedCompanyId) {
      alert("please select Company Code");
      return;
    }

    if (!this.payperiodId) {
      alert("please select Pay Period");
      return;
    }

    const payload = {
      "Company_id": this.selectedCompanyId?.toString(),
      "Pay_Frequency_Id": this.payperiodId?.toString()
    }

    this.payRegisterUpload.downloadTemplate(payload).subscribe({
      next: res => {

        const tables = res?.Data?.data;

        if (!tables) {
          alert('No template data available.');
          return;
        }

        const workbook: XLSX.WorkBook = {
          Sheets: {},
          SheetNames: []
        };

        const sheetNameMap: any = {
          Table0: 'PayRegister',
          Table1: 'Investment',
          Table2: 'HRA',
          Table3: 'LTA',
          Table4: 'IncomeLossOnHouseProperty',
          Table5: 'PreviousEmployment'
        };

        Object.keys(tables).forEach((tableKey) => {
          const tableData = tables[tableKey];

          if (tableData && tableData.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(tableData);

            const sheetName = sheetNameMap[tableKey] || tableKey;

            workbook.Sheets[sheetName] = worksheet;
            workbook.SheetNames.push(sheetName);
          }
        });

        if (workbook.SheetNames.length === 0) {
          alert('No data available to export.');
          return;
        }

        const buffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([buffer], {
          type: 'application/octet-stream'
        });

        FileSaver.saveAs(blob, `PayRegisterUpload_Template.xlsx`);
      },

      error: () => {
        alert('Failed to download template');
      }
    });
  }



  downloadTemplate() {
    const payload = [
      {
        "Company_id": this.selectedCompanyId?.toString(),
        "Pay_Frequency_Id": this.payperiodId?.toString()
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(payload);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'PayRegisterUpload': workSheet },
      SheetNames: ['PayRegisterUpload']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `PayRegisterUpload_${Date.now()}.xlsx`)
  }


}
