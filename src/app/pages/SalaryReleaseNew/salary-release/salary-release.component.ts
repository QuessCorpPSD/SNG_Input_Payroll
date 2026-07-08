import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export const Common_TOKEN = new InjectionToken<IReleaseRequest>('Common_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { saveAs } from 'file-saver';
import { IReleaseRequest } from '../../../Repository/SalaryRequestNew/IReleaseRequest';
import { ReleaseRequestService } from '../../../Service/SalaryRequestNew/ReleaseRequest.service';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { ReleaseImportGrid } from '../../../Models/SalaryRelease/ReleaseImportGrid';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SalaryReleaseGrid } from '../../../Models/SalaryRelease/SalaryRelease';
import { SalaryReleaseImportGrid } from '../../../Models/SalaryRelease/SalaryReleaseImport';



@Component({
  selector: 'SalaryRelease',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './salary-release.component.html',
  styleUrl: './salary-release.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ReleaseRequestService }]
})
export class SalaryReleaseComponent implements OnInit {

  dataSource = new MatTableDataSource<SalaryReleaseGrid>([]);
  dataSourceImport = new MatTableDataSource<SalaryReleaseImportGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;

  displayedColumns: string[] = [
    'select', 'Invoice_No', 'SalaryType', 'Employee_Code', 'Employee_Name',
    'Bank_Account_Number', 'Bank_Name', 'IFSC_Code', 'Hold_Salary_Status', 'Net_Pay', 'Ekyc_Status'
  ];

  displayedColumnsImport: string[] = [
    'select', 'Company_Code', 'Employee_Code', 'PayPeriod', 'InvNo', 'SalaryType', 'ProvisionalInvoiceNumber'];

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('importPaginator') importpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('importSort') importsort!: MatSort;



  TEMPLATE_HEADERS: Record<string, string[]> = {
    Release: [
      'Company_Code', 'Employee_Code', 'PayPeriod', 'InvNo', 'SalaryType', 'ProvisionalInvoiceNumber'
    ]
  };

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private releaseservice: IReleaseRequest,
    @Inject(MAT_DIALOG_DATA) public data: {
      invoiceNo: any;
      companyId: any;
      companyCode: any;
      payPeriodId: number;
      payPeriod: number;
    }
  ) { }

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

    this.BindDashBoard();

  }


  selection = new SelectionModel<SalaryReleaseGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.Invoice_No === sel.Invoice_No)
    );
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
  }

  toggleRow(row: SalaryReleaseGrid) {
    this.selection.toggle(row);
  }

  selectionImport = new SelectionModel<SalaryReleaseImportGrid>(true, []);
  isAnyFilteredRowSelectedImport(): boolean {
    return this.selectionImport.selected.some(sel =>
      this.dataSourceImport.filteredData.some(row => row.InvNo === sel.InvNo)
    );
  }
  isAllSelectedImport() {
    const numSelected = this.selectionImport.selected.length;
    const numRows = this.dataSourceImport?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelectedImport() {
    const numSelected = this.selectionImport.selected.length;
    const numRows = this.dataSourceImport.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRowsImport() {
    this.isAllSelectedImport() ?
      this.selectionImport.clear() :
      this.dataSourceImport.data.forEach((row: any) => this.selectionImport.select(row));
  }

  toggleRowImport(row: SalaryReleaseImportGrid) {
    this.selection.clear();
    this.selectionImport.toggle(row);
  }

  BindDashBoard() {
    this.isLoading = true;

    var Company_Id = this.data.companyId;
    var Pay_Period_Id = this.data.payPeriodId;
    var Flag = "HoldList";
    var InvoiceNo = this.data.invoiceNo;
    var QZoneUserName = this.userdetail.user_Id;


    this.releaseservice.SearchAllReleaseRequest(Company_Id, Pay_Period_Id, Flag,
      InvoiceNo, QZoneUserName).subscribe({
        next: res => {
          if (!res.Data || res.Data.length === 0) {
            alert("No data available to display.");
            this.isLoading = false;
            return;
          }

          this.dataSource = new MatTableDataSource<any>(res.Data.data.Table0);
          this.dataSource.paginator = this.holdpaginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching data:', err.message);
          this.isLoading = false;
        }
      });
  }


  downloadExcel(data: any[], templateId: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
     const fileName = `${templateId}.xlsx`;
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
  }




  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;
    this.dataSourceImport.filter = filterValue;

  }


  onFileChange(event: any): void {

    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length !== 1) {
      alert('Please upload only one Excel file.');
      return;
    }

    this.excelFile = target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let expectedHeaders: string[] = [];

        expectedHeaders = this.TEMPLATE_HEADERS['Release'];

        // HEADER VALIDATION
        const isValid = this.validateHeaders(sheet, expectedHeaders);
        if (!isValid) {
          target.value = '';   // reset file input
          return;
        }


        const jsonData = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        if (!this.hasAtLeastOneValidRow(jsonData)) {
          alert('The uploaded Excel file contains no data rows.');
          event.target.value = '';
          return;
        }

        const jsonDataimport = XLSX.utils.sheet_to_json<SalaryReleaseImportGrid>(sheet);
        this.dataSourceImport.data = jsonDataimport;
        this.dataSourceImport.paginator = this.importpaginator;
        this.dataSourceImport.sort = this.importsort;

      } catch (err) {
        console.error('Error reading Excel file:', err);
        alert('Invalid Excel file');
      }
    };

    reader.readAsBinaryString(this.excelFile);
  }



  moveClick(): void {

    this.isAnyFilteredRowSelected() ||
      this.isAnyFilteredRowSelectedImport()

    if (this.selection.hasValue()) {
      this.callAllSalaryApi(this.selection.selected);
      return;
    }

    if (this.selectionImport.hasValue()) {
      this.callImportApi(this.selectionImport.selected);
      return;
    }

  }

  callAllSalaryApi(rows: any) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(this.userdetail.user_Id),
      HoldReleaseList: rows.map(r => ({
        Company_Code: String(this.data.companyCode),
        Employee_Code: String(r.Employee_Code),
        PayPeriod: String(this.data.payPeriod),
        InvNo: String(r.Invoice_No),
        SalaryType: String(r.SalaryType),
        ProvisionalInvoiceNumber: ""
      }))
    };

    this.releaseservice.HoldReleaseRequest(payload).pipe(
      finalize(() => {
        this.isLoading = false;   // always runs
      })
    ).subscribe({
      next: res => {
        const validations: string[] =
          res?.Data?.map((x: any) => x.error_Message) || [];

        const isSuccess = validations.some(v =>
          v.toLowerCase().includes('uploaded successfully')
        );

        if (isSuccess) {
          this.selection.clear();
          this.dataSource.data = [];
          this.showPopup = true;
          this.popupMessage = validations[0];
          return;
        }

        if (validations.length > 0) {
          this.downloadValidationExcel(validations, "Salary_Release_Request_Validations");
        }
      },
      error: err => console.error(err)
    });
  }

  callImportApi(rows: any) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(this.userdetail.user_Id),
      HoldReleaseList: rows.map(r => ({
        Company_Code: String(r.Company_Code),
        Employee_Code: String(r.Employee_Code),
        PayPeriod: String(r.PayPeriod),
        InvNo: String(r.InvNo),
        SalaryType: String(r.SalaryType),
        ProvisionalInvoiceNumber: String(r.ProvisionalInvoiceNumber)
      }))
    };

    this.releaseservice.HoldReleaseRequest(payload).pipe(
      finalize(() => {
        this.isLoading = false;   // always runs
      })
    ).subscribe({
      next: res => {
        const validations: string[] =
          res?.Data?.map((x: any) => x.error_Message) || [];

        const isSuccess = validations.some(v =>
          v.toLowerCase().includes('uploaded successfully')
        );

        if (isSuccess) {
          this.selectionImport.clear();
          this.dataSourceImport.data = [];
          this.showPopup = true;
          this.popupMessage = validations[0];
          return;
        }

        if (validations.length > 0) {
          this.downloadValidationExcel(validations, "Salry_Release_Request_Validations");
        }
      },
      error: err => console.error(err)
    });
  }

  downloadValidationExcel(validations: string[], FileName: any) {

    const excelData = validations.map((msg, index) => ({
      Sl_No: index + 1,
      Validation_Message: msg
    }));

    this.exportToExcel(excelData, FileName);
  }

  exportToExcel(data: any[], fileName: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }



  onTemplateClick() {

    var Flag = 'HoldReleaseRequest';
    var Qzoneusername = '123';

    this.releaseservice.DownloadTemplate(Flag, Qzoneusername).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'Table': worksheet },
          SheetNames: ['Table']
        };

        // const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const blob = new Blob([buffer], { type: 'application/octet-stream' });
        // FileSaver.saveAs(blob, `Salary_ReleaseRequest_Template.xlsx`);
        XLSX.writeFile(workbook, `Salary_ReleaseRequest_Template.xlsx`);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        this.isLoading = false;
      }
    });

  }

  onImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.dataSource.data = [];
    this.dataSourceImport.data = [];
    this.selection.clear();
    this.selectionImport.clear();
    fileInput.click();
  }

  onExportClick() {

    this.isLoading = true;

    var Company_Id = this.data.companyId;
    var Pay_Period_Id = this.data.payPeriodId;
    var Flag = "HoldList";
    var InvoiceNo = this.data.invoiceNo;
    var QZoneUserName = this.userdetail.user_Id;

    this.releaseservice.SearchAllReleaseRequest(Company_Id, Pay_Period_Id, Flag,
      InvoiceNo, QZoneUserName).pipe(
        finalize(() => {
          this.isLoading = false;   // always runs
        })
      ).subscribe({
        next: res => {
          const tableData = res?.Data?.data?.Table0 || [];

          if (tableData.length === 0) {
            alert('No data available to export');
            return;
          }

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

          const workbook: XLSX.WorkBook = {
            Sheets: { 'Salary Release': worksheet },
            SheetNames: ['Salary Release']
          };

          // const excelBuffer: any = XLSX.write(workbook, {
          //   bookType: 'xlsx',
          //   type: 'array'
          // });

          // const data: Blob = new Blob([excelBuffer], {
          //   type:
          //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          // });
           const dateTime = this.getDateTime();

          // FileSaver.saveAs(data, `Salary_Release_${dateTime}.xlsx`);
          XLSX.writeFile(workbook, `Salary_Release_${dateTime}.xlsx`);
        },
        error: err => {
          console.error('Error fetching data:', err.message);
          this.isLoading = false;
        }
      });
  }

  onDecimalInput(event: any) {
    let value = event.target.value;

    // Remove anything that's not a digit or dot
    value = value.replace(/[^0-9.]/g, '');

    // Keep only the first dot
    const firstDotIndex = value.indexOf('.');
    if (firstDotIndex !== -1) {
      const beforeDot = value.slice(0, firstDotIndex);
      const afterDot = value.slice(firstDotIndex + 1).replace(/\./g, ''); // remove all other dots
      value = beforeDot + '.' + afterDot;
    }

    // Split into integer and decimal parts
    const parts = value.split('.');

    // Limit integer part to 3 digits
    if (parts[0].length > 15) {
      parts[0] = parts[0].substring(0, 15);
    }

    // Limit decimal part to 2 digits
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
    }

    // Join back and set value
    event.target.value = parts.join('.');
  }

  isAnyRowSelected(): boolean {
    return (
      this.isAnyFilteredRowSelected() ||
      this.isAnyFilteredRowSelectedImport()
    );
  }



  validateHeaders(
    sheet: XLSX.WorkSheet,
    expectedHeaders: string[]
  ): boolean {
    const range = XLSX.utils.decode_range(sheet['!ref']!);
    const headerRow = range.s.r; // first row
    const actualHeaders: string[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: C });
      const cell = sheet[cellAddress];
      actualHeaders.push(cell?.v?.toString().trim());
    }
    const missingHeaders = expectedHeaders.filter(
      h => !actualHeaders.includes(h)
    );
    if (missingHeaders.length > 0) {
      alert('Headers are not matched');
      return false;
    }
    return true;
  }

  hasAtLeastOneValidRow(rows: any[]): boolean {
    return rows.some(row =>
      Object.values(row).some(
        value => value !== null && value !== undefined && value.toString().trim() !== ''
      )
    );
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  getDateTime(): string {
    const now = new Date();

    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${yyyy}${MM}${dd}_${HH}${mm}${ss}`;
  }

}
