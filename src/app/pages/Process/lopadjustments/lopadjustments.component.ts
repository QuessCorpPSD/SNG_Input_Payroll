import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { LOPAdjustmentsAddComponent } from '../lopadjustments-add/lopadjustments-add.component';
import { MatDialog } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { SalaryadvancerequestService } from '../../../Service/salaryadvancemodule/salaryadvancerequest.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LopAdjustmentsService } from '../../../Service/Process/lop-adjustments.service';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-lopadjustments',
  standalone: true,
  imports: [MatPaginator, MatTableModule, MatIconModule, CompanyallComponent, PayPeriodComponent, CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './lopadjustments.component.html',
  styleUrl: './lopadjustments.component.css'
})
export class LOPAdjustmentsComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  selectedCompanyCode: any;
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  uploadDisplayedColumns: string[] = [
    'Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code',
  ];


  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild('paginator') paginator!: MatPaginator;
  lopadjusts: any;
  lopadjust: any;


  constructor(private dialog: MatDialog, private decry: EncryptionService, private service: LopAdjustmentsService,
    private _sessionStoreage: SessionStorageService) { }
  isUploadGridVisible = false;
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  // Method to close popup
  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.payPeriodType = "All";

  }



  AddPOOpen() {
    this.dialog.open(LOPAdjustmentsAddComponent, {
      width: '83%',
      height: '81vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  onsearch() {
    this.isLoading = true;
    if (!this.selectedCompanyId) {
      this.isLoading = false;
      alert('Please Select Company');
      return;
    }

    if (!this.payperiodId) {
      this.isLoading = false;
      alert('Please Select Payperiod');
      return;
    }

    this.isUploadGridVisible = true;

    const payload = {
      Company_id: this.selectedCompanyId?.toString() ?? '',
      Pay_Frequency_Id: this.payperiodId?.toString() ?? ''
    };


    this.service.Search(payload).subscribe({
      next: (res) => {

        this.lopadjusts = res.Data?.data?.Table0 ?? [];
        this.lopadjust = res.Data.message;


        if (!this.lopadjusts || this.lopadjusts.length === 0) {
          alert(this.lopadjust || "No data available.");
          this.dataSource.data = [];
          this.isLoading = false;
          return;
        }

        this.dataSource = new MatTableDataSource(this.lopadjusts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.uploadDisplayedColumns = [
          'Action', 'SNo', 'CompanyCode', 'Pay Period', 'Employee Code',
        ];
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;

        console.error('Error loading lopadjusts release data', err);
      },
    });
    this.isLoading = false;
  }


  exportToExcel(): void {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      this.isLoading = false;
      alert('Please Select Company')
      return;
    }

    if (!this.payperiodId) {
      this.isLoading = false;
      alert('Please Select Payperiod');
      return;
    }
    const payload = {
      Company_id: this.selectedCompanyId?.toString() ?? '',
      Pay_Frequency_Id: this.payperiodId?.toString() ?? ''
    };
    this.service.Export(payload).subscribe({
      next: (res) => {

        try {
          const jsonData = res?.Data?.data?.Table0;


          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            this.isLoading = false;
            alert(res.Data.message)
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'lopadjustmentdata');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `lopadjustment${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);
          this.isLoading = false;


        } catch (err) {
          console.error('Error exporting to Excel:', err);

        }
        this.isLoading = false;

      },
      error: (err) => {
        this.isLoading = false;

        console.error('Error loading data for export', err);
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
      console.error('Please upload only one Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);


    this.service.Upload(formData).subscribe({
      next: (res) => {


        if (!res || !res.Data) {
          this.isLoading = false;
          alert('Upload request processed. Server did not return any data.');
          return;
        }

        const response = res.Data.response;

        if (response && response.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;

          this.showAlertPopup('Rows uploaded successfully.');
          return;
        }

        const { parsed, msg } = this.tryParseResponse(response);

        const successMsg = 'Data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;

          this.showAlertPopup('Data uploaded successfully.');
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          this.isLoading = false;
          alert('Failed to Import');
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
          XLSX.writeFile(workbook, 'ErrorMessages_LOPAdjustment.xlsx');
          this.isLoading = false;
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
        this.isLoading = false;

      },
      error: (err) => {
        console.error(' Upload failed', err);
        this.isLoading = false;
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

  DownloadTemplate() {
    this.isLoading = true;
    const templateData = [
      {
        COMPCODE: "",
        PAYPERIOD: "",
        EMPCODE: "",
        LOPLOPRPAYPERIOD: "",
        LOP: "",
        LOPR: ""
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'lopadjustment': worksheet },
      SheetNames: ['lopadjustment']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `lopadjustment_Template_${Date.now()}.xlsx`);
    this.isLoading = false;
  }
  deleteClick(row: any) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    const id = row.LOP_Adjustment_Id;
    const userid = this.userdetail.user_Id;

    this.isLoading = true;

    this.service.Delete(id, userid).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const msg = res?.Data?.data?.Table0?.Error_Message;
        if (res?.StatusCode === 200 && msg.toLowercase().includes('success')) {
          alert(msg);

          this.onsearch();
        } else {
          alert(msg);
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Server error while deleting");
      }
    });
  }




}
