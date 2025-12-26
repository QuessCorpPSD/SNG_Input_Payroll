import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OnboardingGrid } from '../../../Models/OnboardingGrid';
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


@Component({
  selector: 'Holdrequest',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, PayrollinputComponent],
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

  dataSource = new MatTableDataSource<OnboardingGrid>([]);
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

  displayedColumns: string[] = [
    'select',
    'Invoice_No', 'SalaryType', 'Employee_Code', 'Employee_Name',
    'Bank_Name', 'Bank_Account_Number', 'IFSC_Code', 'HoldSelection', 'HoldStatus',
    'Partial_Hold_Amount', 'DBT_Hold_Amount', 'Net_Pay', 'Remarks'
  ];

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices,
    @Inject(COMM_TOKEN) private commonService: ICommonService,
    public stateService: OnboardingStateService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(Common_TOKEN) private holdservice: HoldRequestService,
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
    //console.log(this.payperiodUI);
  }
  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      this.payperiodUI = {
        payPeriod: 'All Records',
        payfrequencyid: 0,
        paySequenceNo: '0'
      };
    }

    if (this.companyUI && this.payperiodUI) {

      this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
    }
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParent = "All";

  }

  selection = new SelectionModel<OnboardingGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.offerId === sel.offerId)
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

  toggleRow(row: OnboardingGrid) {
    this.selection.toggle(row);
  }


  BindDashBoard(companyCode: string, payPeriod: string) {
    this.isLoading = true;
    const payload = {
      "Company_Id": String(companyCode),
      "Pay_Period_Id": String(payPeriod),
      "QZoneUserName": "123"
    };

    var res = {
      "statuscode": 200,
      "message": "",
      "data": {
        "statuscode": 200,
        "message": "",
        "data": {
          "Table0": [
            {
              "Invoice_No": "TE707048",
              "SalaryType": "Regular",
              "Employee_Code": "2002296977",
              "Employee_Name": "KODURI RAMAKRISHNA",
              "Bank_Account_Number": ":41089009108",
              "Bank_Name": "STATE BANK OF INDIA",
              "IFSC_Code": "SBIN0007165",
              "Company_Code": "PSL00123",
              "Pay_Period": "August 2024",
              "Hold_Salary_Status": null,
              "Partial_Hold_Amount": null,
              "DBT_Hold_Amount": null,
              "Net_Pay": 1100.0000
            },
            {
              "Invoice_No": "AN702940",
              "SalaryType": "Regular",
              "Employee_Code": "2002297008",
              "Employee_Name": "SAYYAD IMARAN BASHA",
              "Bank_Account_Number": ":924010046346139",
              "Bank_Name": "AXIS BANK",
              "IFSC_Code": "UTIB0001836",
              "Company_Code": "PSL00123",
              "Pay_Period": "August 2024",
              "Hold_Salary_Status": null,
              "Partial_Hold_Amount": null,
              "DBT_Hold_Amount": null,
              "Net_Pay": 700.0000
            }
          ]
        },
        "error": null
      },
      "error": null
    };

    this.dataSource = new MatTableDataSource<any>(res.data.data.Table0);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;


    // this.onboardService.GetOnboardingData(companyCode, payPeriod).subscribe({
    //   next: res => {
    //     if (!res.Data || res.Data.length === 0) {
    //       alert("No data available to display.");
    //       this.isLoading = false;
    //       return;
    //     }
    //     //console.log(res.data);
    //     this.dataSource = new MatTableDataSource<any>(res.Data.data.Table0);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.isLoading = false;
    //   },
    //   error: err => {
    //     console.error('Error fetching data:', err.message);
    //     this.isLoading = false;
    //   }
    // });
  }

  onTemplateChange(): void {

    if (this.selectedTemplate === "") {
      this.selectedTemplate = "";
    }
    if (this.selectedTemplate === "OfferId" || this.selectedTemplate === "ValidateOfferId" || this.selectedTemplate === "RollbackOfferId") {
      const dataToExport = this.templateDataMap[this.selectedTemplate];
      if (!dataToExport) {
        console.warn('No data.');
        return;
      }
      this.downloadExcel(dataToExport, "Template_" + this.selectedTemplate);
    }

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
    //console.log("export");
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
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }


  onImportChange(fileInput: HTMLInputElement): void {
    //console.log(this.selectedImport);
    if (this.selectedImport === "clear") {
      this.selectedImport = "";
      return;
    }
    if (this.selectedImport === "ImportNewJoinee") {
      if (!this.companyUI) {
        alert("Please select Company Code");
        return;
      }
    }
    fileInput.click();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const file = target.files[0];
    this.excelFile = target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;

      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (this.selectedTemplate === "Importoffer") {
          this.excelData = jsonData.map((row: any) => row.HARBOUR_ID?.toString().trim());
          this.applyExcelFilter();

        } else if (this.selectedImport === "RollbackOfferId") {
          this.excelData = jsonData.map((row: any) => row.OfferID?.toString().trim());
          this.validateOffer = JSON.stringify(this.excelData);
          //console.log(this.validateOffer);
          this.onboardService.PostRollbackOfferId(this.validateOffer, this.userdetail.user_Id).subscribe({
            next: res => {
              this.datatable = res.Data;
              if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
                this.downloadExcel(this.datatable, "Rollback_Validations");
                this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod);
              }
              else {
                alert("No validations returned");
              }
            },
            error: err => {
              console.error('Error fetching data:', err.message);
            }
          });
        }

      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }



  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }
    //console.log("pass1");
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

  applyExcelFilter(): void {
    this.dataSource.filterPredicate = (data: OnboardingGrid, filter: string) => {
      const ids = JSON.parse(filter);
      //console.log(ids);
      return ids.includes(data.offerId?.toString().trim());
    };

    this.dataSource.filter = JSON.stringify(this.excelData);
    //console.log(JSON.stringify(this.excelData));
  }


  moveClick(): void {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedOfferIds = filteredSelected.map(item => item.offerId);
    this.offerIdJson = JSON.stringify(selectedOfferIds);
    if (this.offerIdJson.length > 0) {
      this.onboardService.MovetoQpay(this.offerIdJson, this.companyUI.companyId, this.payperiodUI.payPeriod, this.payperiodUI.payfrequencyid, this.userdetail.user_Id).subscribe({
        next: res => {
          //console.log(res);
          this.datatable = res.Data;
          //console.log(this.datatable);
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "MovetoQpay_Validations");
            this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod);
            this.isLoading = false;
          }
          else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('Error fetching data:', err.message);
          this.isLoading = false;
        }
      });
    }
    else {
      alert("Please select atleast one Offer Id");
      this.isLoading = false;
      return;
    }


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
    fileInput.click();
  }

  onExportClick() {

  }
}
