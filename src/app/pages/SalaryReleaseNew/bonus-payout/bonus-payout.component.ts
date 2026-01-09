import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HoldGrid } from '../../../Models/SalaryRelease/Hold';
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
export const Common_TOKEN = new InjectionToken<IYearlyPayout>('Common_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { SalaryReleaseComponent } from '../salary-release/salary-release.component';
import { MatDialog } from '@angular/material/dialog';
import { PartialReleaseComponent } from '../partial-release/partial-release.component';
import { DBTReleaseComponent } from '../dbtrelease/dbtrelease.component';
import { SalaryReissueComponent } from '../salary-reissue/salary-reissue.component';
import { IYearlyPayout } from '../../../Repository/SalaryRequestNew/IYearlyPayout';
import { YearlyPayoutService } from '../../../Service/SalaryRequestNew/YearlyPayout.service';
import { BonusPayoutImportGrid } from '../../../Models/SalaryRelease/BonusPayoutImport';
import { BonusPayoutGrid } from '../../../Models/SalaryRelease/BonusPayout';
import { Console } from 'console';


@Component({
  selector: 'bonuspayout',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, PayrollinputComponent],
  templateUrl: './bonus-payout.component.html',
  styleUrl: './bonus-payout.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: YearlyPayoutService }]
})
export class BonusPayoutComponent implements OnInit {

  companyUI: any;
  SelectedfromDate: any;
  SelectedtoDate: any;
  dataSource = new MatTableDataSource<BonusPayoutGrid>([]);
  dataSourceImport = new MatTableDataSource<BonusPayoutImportGrid>([]);
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
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  fromDate: string = '';
  toDate: string = '';

  displayedColumns: string[] = [
    'COMPANY CODE', 'CompanyName', 'EMPLOYEE CODE', 'INVOICE NUMBER',
    'PAY PERIOD', 'Map_Name', 'Amount'
  ];

  displayedColumnsImport: string[] = [
    'select', 'COMPANY CODE', 'EMPLOYEE CODE', 'EMPLOYEE NAME', 'INVOICE NUMBER', 'PAY PERIOD',
     'ESTBNON',    'NBONU', 'HOLD STATUS', 'SALARY STATUS', 'CREDIT NOTE NUMBER'];

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('importPaginator') importpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('importSort') importsort!: MatSort;



  TEMPLATE_HEADERS: Record<string, string[]> = {
    Release: [
      'COMPANY CODE', 'EMPLOYEE CODE', 'EMPLOYEE NAME', 'INVOICE NUMBER', 'PAY PERIOD', 'ESTBNON',
      'NBONU', 'HOLD STATUS', 'SALARY STATUS', 'CREDIT NOTE NUMBER'
    ]
  };

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private yearlypayoutservice: IYearlyPayout,
    private dialog: MatDialog
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  onDateRangeChanged(event: any) {

    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
  }

  searchClick(event: any) {
    this.dataSource.data = [];
    this.dataSourceImport.data = [];
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.fromDate || !this.toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    this.SelectedfromDate = this.formatDateToDDMMYYYY(this.fromDate);
    this.SelectedtoDate = this.formatDateToDDMMYYYY(this.toDate);

    if (this.companyUI) {

      this.BindDashBoard(this.companyUI.companyId, this.SelectedfromDate, this.SelectedtoDate)
    }
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

    this.payPeriodTypefromParent = "All";

  }


  selection = new SelectionModel<BonusPayoutGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row['INVOICE NUMBER'] === sel['INVOICE NUMBER'])
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

  toggleRow(row: BonusPayoutGrid) {
    this.selection.toggle(row);
  }

  selectionImport = new SelectionModel<BonusPayoutImportGrid>(true, []);
  isAnyFilteredRowSelectedImport(): boolean {
    return this.selectionImport.selected.some(sel =>
      this.dataSourceImport.filteredData.some(row => row['INVOICE NUMBER'] === sel['INVOICE NUMBER'])
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

  toggleRowImport(row: BonusPayoutImportGrid) {
    this.selection.clear();
    this.selectionImport.toggle(row);
  }

  BindDashBoard(companyCode: string, fromdate: string, toDate: string) {
    this.isLoading = true;

    var Company_Id = this.companyUI.companyId;
    var QZoneUserName = "123";


    this.yearlypayoutservice.BonusDetailsSummary(Company_Id, fromdate, toDate, QZoneUserName).subscribe({
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
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
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

        this.selectionImport.clear();

        const jsonDataimport = XLSX.utils.sheet_to_json<BonusPayoutImportGrid>(sheet);
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

    this.isAnyFilteredRowSelectedImport()


    if (this.selectionImport.hasValue()) {
      this.callImportApi(this.selectionImport.selected);
      return;
    }

  }


  callImportApi(rows: any) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(this.userdetail.user_Id),
      BonusReleaseList: rows.map(r => ({
        InvoiceNumber: String(r['INVOICE NUMBER']),
        EmployeeCode: String(r['EMPLOYEE CODE'])
      }))
    };

    this.yearlypayoutservice.BonusReleaseUpload(payload).pipe(
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
          this.showPopup = true;
          this.popupMessage = validations[0];
          return;
        }

        if (validations.length > 0) {
          this.downloadValidationExcel(validations, "Bonus_Payout_Request_Validations");
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


    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    const fromDate = this.formatDateToDDMMYYYY(this.fromDate);
    const toDate = this.formatDateToDDMMYYYY(this.toDate);

    if (fromDate == '') {
      alert('Please select From date');
      return;
    }

    if (toDate == '') {
      alert('Please select To date');
      return;
    }

    this.isLoading = true;
    var Qzoneusername = '123';

    this.yearlypayoutservice.BonusAccumatedReport(this.companyUI.companyId, fromDate, toDate, Qzoneusername).pipe(
      finalize(() => {
        this.isLoading = false;   // always runs
      })
    ).subscribe({
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

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `BonusPayout_Template.xlsx`);
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
    fileInput.click();
  }

  onExportClick() {
    if (!this.companyUI) {
      alert('Please select Company');
      return;
    }

    const fromDate = this.formatDateToDDMMYYYY(this.fromDate);
    const toDate = this.formatDateToDDMMYYYY(this.toDate);

    if (fromDate == '') {
      alert('Please select From date');
      return;
    }

    if (toDate == '') {
      alert('Please select To date');
      return;
    }

    this.isLoading = true;
    var Company_id = this.companyUI.companyId;
    var QZoneUserName = "123"
    this.yearlypayoutservice.BonusDetailsSummary(Company_id, fromDate, toDate, QZoneUserName)
      .pipe(
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
            Sheets: { 'Bonus Payout': worksheet },
            SheetNames: ['Bonus Payout']
          };

          const excelBuffer: any = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
          });

          const data: Blob = new Blob([excelBuffer], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
          });
          const dateTime = this.getDateTime();

          FileSaver.saveAs(data, `Bonus_Payout_${dateTime}.xlsx`);
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

  openHoldPopup(element: any): void {
    this.dialog.open(SalaryReleaseComponent, {
      width: '1100px',
      maxHeight: '75vh',
      data: {
        invoiceNo: element.Invoice_No,
        companyId: this.companyUI.companyId,
        companyCode: this.companyUI.companyCode

      },
      disableClose: false
    });
  }

  openPartialPopup(element: any): void {
    this.dialog.open(PartialReleaseComponent, {
      width: '1100px',
      maxHeight: '75vh',
      data: {
        invoiceNo: element.Invoice_No,
        companyId: this.companyUI.companyId,
        companyCode: this.companyUI.companyCode
      },
      disableClose: false
    });
  }

  openDBTPopup(element: any): void {
    this.dialog.open(DBTReleaseComponent, {
      width: '1100px',
      maxHeight: '75vh',
      data: {
        invoiceNo: element.Invoice_No,
        companyId: this.companyUI.companyId,
        companyCode: this.companyUI.companyCode
      },
      disableClose: false
    });
  }

  openSalaryReissuePopup(element: any): void {
    this.dialog.open(SalaryReissueComponent, {
      width: '1100px',
      maxHeight: '75vh',
      data: {
        invoiceNo: element.Invoice_No,
        companyId: this.companyUI.companyId,
        companyCode: this.companyUI.companyCode
      },
      disableClose: false
    });
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

  formatDateToDDMMYYYY(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }

}
