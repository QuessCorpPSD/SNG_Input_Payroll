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
import { threadId } from 'worker_threads';
import { DeductionPayoutGrid } from '../../../Models/SalaryRelease/DeductionPayout';
import { DeductionPayoutImportGrid } from '../../../Models/SalaryRelease/DeductionPayoutImport';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'deductionpayout',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, PayrollinputComponent, MatIconModule],
  templateUrl: './deduction-payout.component.html',
  styleUrl: './deduction-payout.component.css',
  providers: [
    { provide: Common_TOKEN, useClass: YearlyPayoutService }]
})
export class DeductionPayoutComponent implements OnInit {

  companyUI: any;
  payperiodUI: any;
  SelectedfromDate: any;
  SelectedtoDate: any;
  dataSource = new MatTableDataSource<DeductionPayoutGrid>([]);
  dataSourceImport = new MatTableDataSource<DeductionPayoutImportGrid>([]);
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
  rowFileMap = new Map<string, File>();

  displayedColumns: string[] = [
    'Serial_No', 'Company_Code', 'Employee_code', 'Pay_Period', 'Pay_code',
    'Invoice_Number', 'Amount'
  ];

  displayedColumnsImport: string[] = [
    'select', 'CompanyCode', 'Employeecode', 'PayPeriod', 'PayCode', 'InvoiceNumber', 'Amount', 'file'];

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('importPaginator') importpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('importSort') importsort!: MatSort;



  TEMPLATE_HEADERS: Record<string, string[]> = {
    Release: [
      'CompanyCode',
      'Employeecode',
      'PayPeriod',
      'PayCode',
      'InvoiceNumber',
      'Amount'
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


    if (this.companyUI) {

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

    this.payPeriodTypefromParent = "All";

  }


  selection = new SelectionModel<DeductionPayoutGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.Invoice_Number === sel.Invoice_Number)
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

  toggleRow(row: DeductionPayoutGrid) {
    this.selection.toggle(row);
  }

  selectionImport = new SelectionModel<DeductionPayoutImportGrid>(true, []);
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
    if (this.isAllSelectedImport()) {
      // unselect all → clear all files
      this.selectionImport.clear();
      this.rowFileMap.clear();

      this.dataSourceImport.data.forEach(row => {
        row.uploadedFileName = '';
      });
    } else {
      this.dataSourceImport.data.forEach(row =>
        this.selectionImport.select(row)
      );
    }

    this.dataSourceImport.data = [...this.dataSourceImport.data];
  }



  toggleRowImport(row: any) {
    this.selectionImport.toggle(row);

    const key = row.Employeecode;

    if (!this.selectionImport.isSelected(row)) {
      this.rowFileMap.delete(key);
      row.uploadedFileName = '';
    }

    this.dataSourceImport.data = [...this.dataSourceImport.data];
  }


  BindDashBoard(companyCode: string, payperiod: string) {
    this.isLoading = true;

    var Company_Id = this.companyUI.companyId;
    var PayPeriod_Id = this.payperiodUI.payfrequencyid;
    var QZoneUserName = "123";


    this.yearlypayoutservice.DeductionFlasuOutSearch(Company_Id, PayPeriod_Id, QZoneUserName).subscribe({
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
        this.rowFileMap.clear();

        const jsonDataimport = XLSX.utils.sheet_to_json<DeductionPayoutImportGrid>(sheet);
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
      const missingFile = this.selectionImport.selected.some(row =>
        !this.rowFileMap.has(row.Employeecode)
      );

      if (missingFile) {
        alert('Please upload file for all selected rows');
        return;
      }

      this.callImportApi(this.selectionImport.selected);
      return;
    }

  }

  
  callImportApi(rows: any) {
    this.isLoading = true;

    if (this.selectionImport.isEmpty()) {
      alert('Please select at least one row');
      return;
    }

    const formData = new FormData();
    formData.append('QZoneUserName', '123');

    this.selectionImport.selected.forEach((row, index) => {

      formData.append(
        `DeductionReleaseList[${index}].CompanyCode`,
        row.CompanyCode
      );

      formData.append(
        `DeductionReleaseList[${index}].Employeecode`,
        row.Employeecode
      );

      formData.append(
        `DeductionReleaseList[${index}].PayPeriod`,
        row.PayPeriod
      );

      formData.append(
        `DeductionReleaseList[${index}].PayCode`,
        row.PayCode
      );

      formData.append(
        `DeductionReleaseList[${index}].InvoiceNumber`,
        row.InvoiceNumber
      );

      formData.append(
        `DeductionReleaseList[${index}].Amount`,
        row.Amount
      );

      // 🔹 File
      const file = this.rowFileMap.get(row.Employeecode);
      if (file) {
        formData.append(
          `DeductionReleaseList[${index}].Attachment`,
          file,
          file.name
        );
      }
    });


    this.yearlypayoutservice.DeductionFlasuOutUpload(formData).pipe(
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
          this.downloadValidationExcel(validations, "Deduction_Payout_Request_Validations");
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

    var Flag = 'DeductionFlushOut';
    var Qzoneusername = '123';

    this.yearlypayoutservice.DownloadTemplate(Flag, Qzoneusername).subscribe({
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
        FileSaver.saveAs(blob, `DeductionPayout_Template.xlsx`);
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

  onImportCommonClick(fileInputCommon: HTMLInputElement): void {
    fileInputCommon.value = '';
    fileInputCommon.click();
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
    var Company_Id = this.companyUI.companyId;
    var PayPeriod_Id = this.payperiodUI.payfrequencyid;
    var QZoneUserName = "123"
    this.yearlypayoutservice.DeductionFlasuOutSearch(Company_Id, PayPeriod_Id, QZoneUserName)
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
            Sheets: { 'Deduction Payout': worksheet },
            SheetNames: ['Deduction Payout']
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

          FileSaver.saveAs(data, `Deduction_Payout_${dateTime}.xlsx`);
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

  onFileSelectedCommon(event: any) {
    const file: File = event.target.files[0];

    if (!file || this.selectionImport.isEmpty()) {
      event.target.value = '';
      return;
    }

    this.selectionImport.selected.forEach(row => {
      const key = row.Employeecode;

      if (!this.rowFileMap.has(key)) {
        this.rowFileMap.set(key, file);
        row.uploadedFileName = file.name;
      }
    });

    this.dataSourceImport.data = [...this.dataSourceImport.data];

    event.target.value = '';
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
