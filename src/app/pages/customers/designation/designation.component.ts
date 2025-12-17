import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { DesignationaddComponent } from '../designationadd/designationadd.component';
import { MatDialog } from '@angular/material/dialog';
import { DesignationService } from '../../../Service/company/designation.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort } from '@angular/material/sort';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IdletimeoutService } from '../../../Service/idletimeout.service';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, CompanyallComponent, AlertpopupComponent],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.css'
})
export class DesignationComponent {
  designationSearch: any;

  constructor(private dialog: MatDialog, private designation: DesignationService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private idleTimeOutService: IdletimeoutService) { }

  DesignationCode!: FormGroup;
  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  userdetail: any;
  @ViewChild(MatSort) sort!: MatSort;


  uploadDisplayedColumns: string[] = [
    'slNo', 'companycode', 'departmentcode', 'departmentname', 'standarddesignation', 'amount', 'skillcategory', 'npdays'];

  uploadedData: any[] = []; // 🧾 No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.setUpCustomFilter();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  // handlePayperiodEvent(payperiod: Payperiodclass) {
  //   this.payPeriod = payperiod;
  // }
  // ngOnInit(): void {
  //   const userdetail = this._sessionStoreage.getItem('UserProfile');
  //   this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
  //   this.payPeriodType = "All";
  // }

  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
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

  onsearch() {
    if (!this.selectedCompanyId) {
      alert("please select Company Code")
      return;
    }
    this.isLoading = true;
    this.showTable = true;

    const companyCode = this.selectedCompanyId;
    this.designation.searchDesignation(companyCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.designationSearch = res.Data;
        if (this.designationSearch && this.designationSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.designationSearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'slNo', 'companycode', 'departmentcode', 'departmentname', 'standarddesignation', 'amount', 'skillcategory', 'npdays'];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading salary release data', err);
      },
    });
  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert("please select Company Code")
      return;
    }
    const formData = new FormData();
    const companyId = this.selectedCompanyId
    formData.append('companyId', this.selectedCompanyId.toString());

    this.isLoading = true;
    this.designation.exportDesignation(companyId).subscribe({
      next: res => {

        const base64String = res?.Data?.file;

        if (base64String && base64String.length > 0) {
          const fileName = res?.Data?.fileName || 'Department';
          this.downloadExcelFromBase64(base64String, fileName, 'xlsx');
        } else {
          alert("No template data available.");
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template:', err);
        alert("Error', 'Failed to download template");
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  downloadExcelFromBase64(base64String: string, fileName: string, fileType: string): void {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${fileName}.${fileType}`;


      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);


      URL.revokeObjectURL(downloadLink.href);
    } catch (error) {
      console.error('Error downloading from base64:', error);
      alert("Error', 'Failed to process download file")
    }
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

    this.designation.importDesignation(formData).subscribe({
      next: (res) => {

        if (!res || !res.Data) {
          alert("Upload request Processed.Server did not return any data")
          this.isLoading = false;
          return;
        }

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.isLoading = false;
          this.showAlertPopup("Row(s) Uploaded Successfully.")
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


  downloadTemplate() {
    const templateData = [
      {
        COMPCODE: "",
        DESIGNATIONNAME: "",
        Standard_Desigantion: '',
        Amount: "",
        Skill_Category: "",
        NpDays: ""
      }
    ];

    const workSheet = XLSX.utils.json_to_sheet(templateData);

    const workbook: XLSX.WorkBook = {
      Sheets: { 'table': workSheet },
      SheetNames: ['table']
    };

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, `Designation${Date.now()}.xlsx`)
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.DesignationCode = new FormGroup({
      companyCode: new FormControl(''),
    })
  }

  AddDesignation() {
    this.dialog.open(DesignationaddComponent, {
      width: '65%',
      height: '50vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

}
