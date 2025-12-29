import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HoldGrid } from '../../../Models/SalaryRelease/Hold';
import { IOnboardingServices } from '../../../Repository/IOnboardingService';
import { OnboardingStateService } from '../../../onboarding-state.service';
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
import { CommonService } from '../../../Service/CommonService';
export const DASH_TOKEN = new InjectionToken<IOnboardingServices>('DASH_TOKEN');
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
export const Common_TOKEN = new InjectionToken<IHoldRequest>('Common_TOKEN');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { finalize } from 'rxjs';
import { OnboardingServices } from '../../../Service/OnboardingService';
import { ICommonService } from '../../../Repository/ICommonService';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { IHoldReleaseRequest } from '../../../Repository/SalaryRequest/Iholdreleaserequest';
import { HolemployeesalaryService } from '../../../Service/SalaryRelease/holemployeesalary.service';
import { HoldRequestService } from '../../../Service/SalaryRequestNew/HoldRequest.service';
import { IHoldRequest } from '../../../Repository/SalaryRequestNew/IHoldRequest';
import { SalaryHoldGrid } from '../../../Models/SalaryRelease/SalaryHold';
import { PartialHoldGrid } from '../../../Models/SalaryRelease/PartialHold';
import { DBTHoldGrid } from '../../../Models/SalaryRelease/DBTHold';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { saveAs } from 'file-saver';


@Component({
  selector: 'Holdrequest',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    PayrollinputComponent, AlertpopupComponent],
  templateUrl: './hold-request.component.html',
  styleUrl: './hold-request.component.css',
  providers: [{
    provide: DASH_TOKEN, useClass: OnboardingServices
  }, { provide: COMM_TOKEN, useClass: CommonService },
  { provide: Common_TOKEN, useClass: HoldRequestService }]
})
export class HoldRequestComponent implements OnInit {

  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<HoldGrid>([]);
  dataSourceSalary = new MatTableDataSource<SalaryHoldGrid>([]);
  dataSourcePartial = new MatTableDataSource<PartialHoldGrid>([]);
  dataSourceDBT = new MatTableDataSource<DBTHoldGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedTemplate: string = '';
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
    'select',
    'Invoice_No', 'SalaryType', 'Employee_Code', 'Employee_Name',
    'Bank_Name', 'Bank_Account_Number', 'IFSC_Code', 'HoldSelection', 'HoldStatus',
    'Partial_Hold_Amount', 'DBT_Hold_Amount', 'Net_Pay', 'Remarks'
  ];

  displayedColumnsSalary: string[] = [
    'select', 'Company_Code', 'PayPeriod', 'Employee_Code', 'InvNo', 'Hold_Status',
    'Reason', 'SalaryType'];

  displayedColumnsPartial: string[] = [
    'select', 'InvoiceNumber', 'EmployeeCode', 'HoldAmount', 'SalaryType', 'HoldReason'];

  displayedColumnsDBT: string[] = [
    'select', 'InvoiceNumber', 'EmployeeCode', 'HoldAmount', 'SalaryType', 'HoldReason'];

  TemplateOptions = [
    { value: 'SalaryHold', Text: 'Salary Hold' },
    { value: 'PartiallyHold', Text: 'Partially Hold' },
    { value: 'DBTHold', Text: 'DBT Hold' }
  ];

  ImportOptions = [
    { value: 'Importoffer', Text: 'Filter OfferId' },
    { value: 'ValidateOfferId', Text: 'Validate OfferId' },
    { value: 'RollbackOfferId', Text: 'Rollback OfferId' },
    { value: 'ImportNewJoinee', Text: 'New Joinee' },
    { value: 'clear', Text: 'Clear' }
  ];

  // @ViewChild(MatPaginator) holdpaginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  // @ViewChild(MatPaginator) partialpaginator!: MatPaginator;
  // @ViewChild(MatSort) partialsort!: MatSort;
  // @ViewChild(MatPaginator) salarypaginator!: MatPaginator;
  // @ViewChild(MatSort) salarysort!: MatSort;
  // @ViewChild(MatPaginator) dbtpaginator!: MatPaginator;
  // @ViewChild(MatSort) dbtsort!: MatSort;

  @ViewChild('holdPaginator') holdpaginator!: MatPaginator;
  @ViewChild('partialPaginator') partialpaginator!: MatPaginator;
  @ViewChild('salaryPaginator') salarypaginator!: MatPaginator;
  @ViewChild('dbtPaginator') dbtpaginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('partialSort') partialsort!: MatSort;
  @ViewChild('salarySort') salarysort!: MatSort;
  @ViewChild('dbtSort') dbtsort!: MatSort;

  TEMPLATE_HEADERS: Record<string, string[]> = {
    SalaryHold: [
      'Company_Code',
      'PayPeriod',
      'Employee_Code',
      'InvNo',
      'Hold_Status',
      'Reason',
      'SalaryType'
    ],

    PartiallyHold: [
      'InvoiceNumber',
      'EmployeeCode',
      'HoldAmount',
      'SalaryType',
      'HoldReason'
    ],

    DBTHold: [
      'InvoiceNumber',
      'EmployeeCode',
      'HoldAmount',
      'SalaryType',
      'HoldReason'
    ]
  };


  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices,
    @Inject(COMM_TOKEN) private commonService: ICommonService,
    public stateService: OnboardingStateService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private holdservice: IHoldRequest
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
    this.selectedTemplate = "";
    this.dataSource.data = [];
    this.dataSourceSalary.data = [];
    this.dataSourcePartial.data = [];
    this.dataSourceDBT.data = [];
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

    this.payPeriodTypefromParent = "All";

  }


  selection = new SelectionModel<HoldGrid>(true, []);
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

  toggleRow(row: HoldGrid) {
    this.selection.toggle(row);
    this.selectionPartial.clear();
    this.selectionDBT.clear();
    this.selectionSalary.clear();
  }

  selectionSalary = new SelectionModel<SalaryHoldGrid>(true, []);
  isAnyFilteredRowSelectedSalary(): boolean {
    return this.selectionSalary.selected.some(sel =>
      this.dataSourceSalary.filteredData.some(row => row.InvNo === sel.InvNo)
    );
  }
  isAllSelectedSalary() {
    const numSelected = this.selectionSalary.selected.length;
    const numRows = this.dataSourceSalary?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelectedSalary() {
    const numSelected = this.selectionSalary.selected.length;
    const numRows = this.dataSourceSalary.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRowsSalary() {
    this.isAllSelectedSalary() ?
      this.selectionSalary.clear() :
      this.dataSourceSalary.data.forEach((row: any) => this.selectionSalary.select(row));
  }

  toggleRowSalary(row: SalaryHoldGrid) {
    this.selection.clear();
    this.selectionPartial.clear();
    this.selectionDBT.clear();
    this.selectionSalary.toggle(row);
  }

  selectionPartial = new SelectionModel<PartialHoldGrid>(true, []);
  isAnyFilteredRowSelectedPartial(): boolean {
    return this.selectionPartial.selected.some(sel =>
      this.dataSourcePartial.filteredData.some(row => row.InvoiceNumber === sel.InvoiceNumber)
    );
  }
  isAllSelectedPartial() {
    const numSelected = this.selectionPartial.selected.length;
    const numRows = this.dataSourcePartial?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelectedPartial() {
    const numSelected = this.selectionPartial.selected.length;
    const numRows = this.dataSourcePartial.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRowsPartial() {
    this.isAllSelectedPartial() ?
      this.selectionPartial.clear() :
      this.dataSourcePartial.data.forEach((row: any) => this.selectionPartial.select(row));
  }

  toggleRowPartial(row: PartialHoldGrid) {
    this.selection.clear();
    this.selectionDBT.clear();
    this.selectionSalary.clear();
    this.selectionPartial.toggle(row);
  }

  selectionDBT = new SelectionModel<DBTHoldGrid>(true, []);
  isAnyFilteredRowSelectedDBT(): boolean {
    return this.selectionDBT.selected.some(sel =>
      this.dataSourceDBT.filteredData.some(row => row.InvoiceNumber === sel.InvoiceNumber)
    );
  }
  isAllSelectedDBT() {
    const numSelected = this.selectionDBT.selected.length;
    const numRows = this.dataSourceDBT?.data?.length;
    return numSelected === numRows;
  }

  isPartialSelectedDBT() {
    const numSelected = this.selectionDBT.selected.length;
    const numRows = this.dataSourceDBT.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  toggleAllRowsDBT() {
    this.isAllSelectedDBT() ?
      this.selectionDBT.clear() :
      this.dataSourceDBT.data.forEach((row: any) => this.selectionDBT.select(row));
  }

  toggleRowDBT(row: DBTHoldGrid) {
    this.selectionDBT.toggle(row);
    this.selection.clear();
    this.selectionPartial.clear();
    this.selectionSalary.clear();
  }



  BindDashBoard(companyCode: string, payPeriod: string) {
    this.isLoading = true;

    const payload = {
      "Company_Id": this.companyUI.companyId,
      "Pay_Period_Id": this.payperiodUI.payfrequencyid,
      "QZoneUserName": "123"
    }

    this.holdservice.SearchInvoiceHoldList(payload).subscribe({
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

  onTemplateChange(): void {

    if (this.selectedTemplate === "") {
      this.selectedTemplate = "";
    }

    this.dataSource.data = [];
    this.dataSourceSalary.data = [];
    this.dataSourcePartial.data = [];
    this.dataSourceDBT.data = [];
  }


  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
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


  // downloadExcel(data: any[], templateId: string): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Sheet1': worksheet },
  //     SheetNames: ['Sheet1']
  //   };

  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  //   const fileName = `${templateId}.xlsx`;
  //   FileSaver.saveAs(blob, fileName);
  // }

  templateDataMap: { [key: string]: any[] } = {
    OfferId: [
      { HARBOUR_ID: '' },
    ],
    ValidateOfferId: [
      { OfferID: '' },
    ],
    RollbackOfferId: [
      { OfferID: '' },
    ]

  };



  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();

    this.dataSource.filter = filterValue;
    this.dataSourceSalary.filter = filterValue;
    this.dataSourcePartial.filter = filterValue;
    this.dataSourceDBT.filter = filterValue;
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

        switch (this.selectedTemplate) {
          case 'SalaryHold':
            expectedHeaders = this.TEMPLATE_HEADERS['SalaryHold'];
            break;

          case 'PartiallyHold':
            expectedHeaders = this.TEMPLATE_HEADERS['PartiallyHold'];
            break;

          case 'DBTHold':
            expectedHeaders = this.TEMPLATE_HEADERS['DBTHold'];
            break;

          default:
            alert('Please select a valid template');
            return;
        }

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

        if (this.selectedTemplate === 'SalaryHold') {
          const jsonData = XLSX.utils.sheet_to_json<SalaryHoldGrid>(sheet);
          this.dataSourceSalary.data = jsonData;
          this.dataSourceSalary.paginator = this.salarypaginator;
          this.dataSourceSalary.sort = this.salarysort;
        }
        else if (this.selectedTemplate === 'PartiallyHold') {
          const jsonData = XLSX.utils.sheet_to_json<PartialHoldGrid>(sheet);
          this.dataSourcePartial.data = jsonData;
          this.dataSourcePartial.paginator = this.partialpaginator;
          this.dataSourcePartial.sort = this.partialsort;
        }
        else if (this.selectedTemplate === 'DBTHold') {
          const jsonData = XLSX.utils.sheet_to_json<DBTHoldGrid>(sheet);
          this.dataSourceDBT.data = jsonData;
          this.dataSourceDBT.paginator = this.dbtpaginator;
          this.dataSourceDBT.sort = this.dbtsort;
        }

      } catch (err) {
        console.error('Error reading Excel file:', err);
        alert('Invalid Excel file');
      }
    };

    reader.readAsBinaryString(this.excelFile);
  }



  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }

    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('companyCode', this.companyUI.companyCode);
      formData.append('companyId', this.companyUI.companyId);
      formData.append('userId', this.userdetail.user_Id);
      // formData.append('payPeriod', this.payperiodUI.payPeriod);
      // formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

      this.onboardService.PostNewJoineeData(formData).subscribe({
        next: res => {
          this.datatable = res.Data;
          console.table(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "NewJoinee_Validations");
            this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod);
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }



  moveClick(): void {

    this.isAnyFilteredRowSelected() ||
      this.isAnyFilteredRowSelectedSalary() ||
      this.isAnyFilteredRowSelectedPartial() ||
      this.isAnyFilteredRowSelectedDBT()

    if (this.selection.hasValue()) {
      const isValid = this.validateMainTableSelection();

      if (!isValid) {
        return;
      }
      this.callAllSalaryApi(this.selection.selected);
      return;
    }

    if (this.selectionSalary.hasValue()) {
      this.callSalaryApi(this.selectionSalary.selected);
      return;
    }

    if (this.selectionPartial.hasValue()) {
      this.callPartialApi(this.selectionPartial.selected);
      return;
    }

    if (this.selectionDBT.hasValue()) {
      this.callDBTApi(this.selectionDBT.selected);
      return;
    }
  }

  validateMainTableSelection(): boolean {

    const selectedRows = this.selection.selected;

    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i];

      const rowIndex = this.dataSource.data.indexOf(row);
      const holdType = this.holdSelections[rowIndex];

      if (!holdType) {
        alert(`Row ${rowIndex + 1}: Hold Selection cannot be blank`);
        return false;
      }

      if (holdType === 'SalaryHold' && !row.Hold_Salary_Status) {
        alert(`Row ${rowIndex + 1}: Hold Status is required`);
        return false;
      }

      if (holdType === 'PartialHold' && !row.Partial_Hold_Amount) {
        alert(`Row ${rowIndex + 1}: Partial Hold Amount is required`);
        return false;
      }

      if (holdType === 'DBTHold' && !row.DBT_Hold_Amount) {
        alert(`Row ${rowIndex + 1}: DBT Hold Amount is required`);
        return false;
      }

      // 5️⃣ Remarks
      if (!row.Remarks || row.Remarks.trim() === '') {
        alert(`Row ${rowIndex + 1}: Remarks cannot be blank`);
        return false;
      }
    }

    return true;
  }


  callAllSalaryApi(rows: any) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(123),
      HoldListData: rows.map((r, index) => {
        const holdType = this.holdSelections[index].replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
  .replace(/([a-z])([A-Z])/g, '$1 $2');

        let holdAmount: any = ""; 
        let holdStatus: string = ""; // take same text


        if (holdType === 'Partial Hold') {
          holdAmount = r.Partial_Hold_Amount;
        }

        if (holdType === 'DBT Hold') {
          holdAmount = r.DBT_Hold_Amount;
        }

        if (holdType === 'Salary Hold') {
          holdStatus = r.Hold_Salary_Status;
        }

        return {
          Company_Code: String(this.companyUI.companyCode),
          Pay_Period: String(this.payperiodUI.payPeriod),
          Employee_Code: String(r.Employee_Code),
          Invoice_no: String(r.Invoice_No),
          Flag: String(holdType),
          Hold_Status: String(holdStatus),
          Hold_Amount: String(holdAmount),
          Reason: String(r.Remarks),
          SalaryType: String(r.SalaryType)
        };
      })
    };


    this.holdservice.SingleHoldRequest(payload).subscribe({
      next: res => {
        this.downloadHoldResponseExcel(res);

        this.selectionSalary.clear();
        this.isLoading = false;
      },
      error: err => {
        console.error('Error', err);
        this.isLoading = false;
      }
    });
  }

  downloadHoldResponseExcel(apiResponse: any) {
    const data = apiResponse?.Data?.data;
    if (!data) {
      alert('No data available to download');
      return;
    }

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // ---- Table 0 : Salary Hold Request ----
    if (data.Table0?.length) {
      const ws0 = XLSX.utils.json_to_sheet(data.Table0);
      XLSX.utils.book_append_sheet(workbook, ws0, 'Salary Hold Request');
    }

    // ---- Table 1 : Partial Hold Request ----
    if (data.Table1?.length) {
      const ws1 = XLSX.utils.json_to_sheet(data.Table1);
      XLSX.utils.book_append_sheet(workbook, ws1, 'Partial Hold Request');
    }

    // ---- Table 2 : DBT Hold Request ----
    if (data.Table2?.length) {
      const ws2 = XLSX.utils.json_to_sheet(data.Table2);
      XLSX.utils.book_append_sheet(workbook, ws2, 'DBT Hold Request');
    }

    // Export file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'Hold_Request_Response.xlsx');
  }


  callSalaryApi(rows: any[]) {
    this.isLoading = true;
    const payload = {
      QZoneUserName: String(123),
      requestdata: rows.map(r => ({
        Company_Code: r.Company_Code,
        PayPeriod: r.PayPeriod,
        Employee_Code: String(r.Employee_Code),
        InvNo: r.InvNo,
        Hold_Status: r.Hold_Status,
        Reason: r.Reason,
        SalaryType: r.SalaryType
      }))
    };

    this.holdservice.HoldRequestUpload(payload).subscribe({
      next: res => {
        this.isLoading = false;
        this.selectionSalary.clear();

        const validations: string[] =
          res?.Data?.map((x: any) => x.validation) || [];

        const isSuccess = validations.some(v =>
          v.toLowerCase().includes('uploaded successfully')
        );

        if (isSuccess) {
          this.showPopup = true;
          this.popupMessage = validations[0];
          return;
        }

        if (validations.length > 0) {
          this.downloadValidationExcel(validations, "Hold_Request_Validations");
        }
      },
      error: err => {
        console.error('Error', err);
        this.isLoading = false;
      }
    });
  }

  callPartialApi(rows: any[]) {

    const payload = {
      QZoneUserName: String(123),
      PartialHoldList: rows.map(r => ({
        InvoiceNumber: String(r.InvoiceNumber),
        EmployeeCode: String(r.EmployeeCode),
        HoldAmount: String(r.HoldAmount),
        SalaryType: String(r.SalaryType),
        HoldReason: String(r.HoldReason)
      }))
    };


    this.holdservice.PartialHoldRequest(payload).subscribe({
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
          this.downloadValidationExcel(validations, "Partial_Hold_Request_Validations");
        }
      },
      error: err => console.error(err)
    });
  }


  callDBTApi(rows: any[]) {
    const payload = {
      QZoneUserName: String(123),
      DBTHoldList: rows.map(r => ({
        InvoiceNumber: String(r.InvoiceNumber),
        EmployeeCode: String(r.EmployeeCode),
        HoldAmount: String(r.HoldAmount),
        SalaryType: String(r.SalaryType),
        HoldReason: String(r.HoldReason)
      }))
    };

    this.holdservice.DBTHoldRequest(payload).subscribe({
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
          this.downloadValidationExcel(validations, "DBT_Hold_Request_Validations");
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
    if (this.selectedTemplate === "") {
      alert('Please select Hold Type');
      return;
    }

    var Flag = '';
    var Qzoneusername = '123';

    if (this.selectedTemplate === "SalaryHold") {
      Flag = "HoldRequest";
    }

    if (this.selectedTemplate === "PartiallyHold") {
      Flag = "Partial Hold Salary";
    }

    if (this.selectedTemplate === "DBTHold") {
      Flag = "DBT Hold Salary";
    }

    this.holdservice.DownloadTemplate(Flag, Qzoneusername, this.userdetail.user_Id).subscribe({
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
        FileSaver.saveAs(blob, `${Flag}_Template.xlsx`);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error downloading template', err);
        this.isLoading = false;
      }
    });

  }

  onImportClick(fileInput: HTMLInputElement): void {
    if (this.selectedTemplate === "") {
      alert('Please select Hold Type');
      return;
    }
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    fileInput.value = '';
    this.dataSource.data = [];
    this.dataSourceSalary.data = [];
    this.dataSourcePartial.data = [];
    this.dataSourceDBT.data = [];
    fileInput.click();
  }

  onExportClick() {
    const sheets: { [sheetName: string]: any[] } = {};

    if (this.dataSource?.data?.length > 0) {
      sheets['Hold'] = this.dataSource.data;
    }

    if (this.dataSourceSalary?.data?.length > 0) {
      sheets['Salary Hold'] = this.dataSourceSalary.data;
    }

    if (this.dataSourcePartial?.data?.length > 0) {
      sheets['Partial Hold'] = this.dataSourcePartial.data;
    }

    if (this.dataSourceDBT?.data?.length > 0) {
      sheets['DBT Hold'] = this.dataSourceDBT.data;
    }

    if (Object.keys(sheets).length === 0) {
      alert('No data available to export');
      return;
    }

    const workbook: XLSX.WorkBook = {
      Sheets: {},
      SheetNames: []
    };

    Object.keys(sheets).forEach(sheetName => {
      const worksheet = XLSX.utils.json_to_sheet(sheets[sheetName]);
      workbook.Sheets[sheetName] = worksheet;
      workbook.SheetNames.push(sheetName);
    });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Hold_Request_Export.xlsx');
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
      this.isAnyFilteredRowSelectedSalary() ||
      this.isAnyFilteredRowSelectedPartial() ||
      this.isAnyFilteredRowSelectedDBT()
    );
  }

  hasAnyTableData(): boolean {
    return (
      this.dataSource.data.length > 0 ||
      this.dataSourceSalary.data.length > 0 ||
      this.dataSourcePartial.data.length > 0 ||
      this.dataSourceDBT.data.length > 0
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

}
