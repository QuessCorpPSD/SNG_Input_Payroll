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
export const Common_TOKEN = new InjectionToken<IReleaseRequest>('Common_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { IHoldReleaseRequest } from '../../../Repository/SalaryRequest/Iholdreleaserequest';
import { HolemployeesalaryService } from '../../../Service/SalaryRelease/holemployeesalary.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { saveAs } from 'file-saver';
import { IReleaseRequest } from '../../../Repository/SalaryRequestNew/IReleaseRequest';
import { ReleaseRequestService } from '../../../Service/SalaryRequestNew/ReleaseRequest.service';
import { ReleaseGrid } from '../../../Models/SalaryRelease/Release';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { ReleaseImportGrid } from '../../../Models/SalaryRelease/ReleaseImportGrid';
import { SalaryReleaseComponent } from '../salary-release/salary-release.component';
import { MatDialog } from '@angular/material/dialog';
import { PartialReleaseComponent } from '../partial-release/partial-release.component';
import { DBTReleaseComponent } from '../dbtrelease/dbtrelease.component';
import { SalaryReissueComponent } from '../salary-reissue/salary-reissue.component';



@Component({
  selector: 'NetpaySummary',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, PayrollinputComponent],
  templateUrl: './netpay-summary.component.html',
  styleUrl: './netpay-summary.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: ReleaseRequestService }]
})
export class NetpaySummaryComponent implements OnInit {

  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<ReleaseGrid>([]);
  dataSourceImport = new MatTableDataSource<ReleaseImportGrid>([]);
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

  displayedColumns: string[] = [
    'select', 'Invoice_No', 'Employee_Id', 'CurrentStatus', 'Hold',
    'PartialHold', 'DBTHold', 'SalaryRejection', 'TotalNetpay'
  ];

  displayedColumnsImport: string[] = [
    'select', 'InvoiceNumber'];

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('importPaginator') importpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('importSort') importsort!: MatSort;



  TEMPLATE_HEADERS: Record<string, string[]> = {
    Release: [
      'InvoiceNumber'
    ]
  };

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private releaseservice: IReleaseRequest,
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
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }
  searchClick() {
    this.dataSource.data = [];
    this.dataSourceImport.data = [];
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    if (this.companyUI && this.payperiodUI) {

      this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
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

    this.payPeriodTypefromParent = "SalaryRelease";

  }


  selection = new SelectionModel<ReleaseGrid>(true, []);
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

  toggleRow(row: ReleaseGrid) {
    this.selection.toggle(row);
  }

  selectionImport = new SelectionModel<ReleaseImportGrid>(true, []);
  isAnyFilteredRowSelectedImport(): boolean {
    return this.selectionImport.selected.some(sel =>
      this.dataSourceImport.filteredData.some(row => row.InvoiceNumber === sel.InvoiceNumber)
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

  toggleRowImport(row: ReleaseImportGrid) {
    this.selection.clear();
    this.selectionImport.toggle(row);
  }

  BindDashBoard(companyCode: string, payPeriod: string) {
    this.isLoading = true;

    var Company_Id = this.companyUI.companyId;
    var Pay_Period_Id = this.payperiodUI.payfrequencyid;
    var QZoneUserName = "123";


    this.releaseservice.SearchReleaseRequest(Company_Id, Pay_Period_Id, QZoneUserName).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        const tableData = res.Data.data.Table0;

        if (!tableData.length) {
          alert('No data found');
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

        const jsonDataimport = XLSX.utils.sheet_to_json<ReleaseImportGrid>(sheet);
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
      InvoiceList: rows.map(r => ({
        InvoiceNumber: String(r.Invoice_No)
      }))
    };

    this.releaseservice.UploadSalaryReleaseRequest(payload).pipe(
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
          this.downloadValidationExcel(validations, "Release_Request_Validations");
        }
      },
      error: err => console.error(err)
    });
  }

  callImportApi(rows: any) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(this.userdetail.user_Id),
      InvoiceList: rows.map(r => ({
        InvoiceNumber: String(r.InvoiceNumber)
      }))
    };

    this.releaseservice.UploadSalaryReleaseRequest(payload).pipe(
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
          this.downloadValidationExcel(validations, "Release_Request_Validations");
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

    var Flag = 'SalaryRequest';
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

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `ReleaseRequest_Template.xlsx`);
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
    if (!this.companyUI) {
      alert('Please select Company');
      return;
    }
    if (!this.payperiodUI) {
      alert('Please select Payperiod');
      return;
    }

    this.isLoading = true;
    var Company_id = this.companyUI.companyId;
    var Pay_Frequency_Id = this.payperiodUI.payfrequencyid;
    var QZoneUserName = "123"
    this.releaseservice.ExportReleaseRequest(Company_id, Pay_Frequency_Id, QZoneUserName)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      ).subscribe({
        next: res => {

          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
          }
        },
        error: error => console.error('Error:', error)
      })
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
        companyCode: this.companyUI.companyCode,
        payPeriodId: this.payperiodUI.payfrequencyid,
        payPeriod: this.payperiodUI.payPeriod
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
        companyCode: this.companyUI.companyCode,
        payPeriodId: this.payperiodUI.payfrequencyid,
        payPeriod: this.payperiodUI.payPeriod
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
        companyCode: this.companyUI.companyCode,
        payPeriodId: this.payperiodUI.payfrequencyid,
        payPeriod: this.payperiodUI.payPeriod
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
        companyCode: this.companyUI.companyCode,
        payPeriodId: this.payperiodUI.payfrequencyid,
        payPeriod: this.payperiodUI.payPeriod
      },
      disableClose: false
    });
  }

}
