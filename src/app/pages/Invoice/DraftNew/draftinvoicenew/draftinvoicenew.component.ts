import { Component, Inject, InjectionToken, OnChanges, SimpleChanges, TemplateRef, TrackByFunction, ViewChild } from '@angular/core';
import { OnboardingStateService } from '../../../../onboarding-state.service';
import { IOnboardingServices } from '../../../../Repository/IOnboardingService';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { OnboardingServices } from '../../../../Service/OnboardingService';
import { Payperiodclass } from '../../../../Models/Common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingComponent } from '../../../PayrollInput/onboarding/onboarding.component';
import { AlertpopupComponent } from '../../../../common/alertpopup/alertpopup.component';
import { CommonModule } from '@angular/common';
export const DASH_TOKEN = new InjectionToken<IOnboardingServices>('DASH_TOKEN');
import * as XLSX from 'xlsx';
import { json } from 'stream/consumers';
import { Router } from '@angular/router';
import { IDraftNewRepository } from '../../../../Repository/invoice/IDraftNewRepository';
import { DraftNewRepository } from '../../../../Service/invoice/DraftNewRepository';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from "@angular/material/tooltip";
import { AttributeComponent } from '../attribute/attribute.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; import { finalize } from 'rxjs';
import { PayrollinputComponent } from "../../../PayrollInput/payrollinput.component";

// export const Invoice_TOKEN = new InjectionToken<IInvoiceService>('Invoice_TOKEN');
const invoiceservice = InjectionToken<IDraftNewRepository>;
type RawRow = Record<string, any>;

interface ViewRow {
  Input_No: string;
  Map_Name_Id: number;
  Map_name: string;
  LotNo: string;
  Employee_Head_Count: string;
  NetPay: string;
  Subtotal: string;
  Net_CTC: string;
  Service_Charge_Master: string;
  Invoice_Category_Id: number;
  Invoice_Category: string;
  InvoiceType_Id: number;
  selected: boolean;
  Data_From: string;
  Section_billing: string;
}
export interface Invoice {
  Billing: string;
  MapName: string;
  NetPay: number;
  selected: boolean;
}

export interface Draft {
  DraftRequest: string;
  Invoices: Invoice[];
}
export interface Invoice {
  Billing: string;
  MapName: string;
  NetPay: number;
  selected: boolean;
}

interface SplitParam {
  LotNo: number;
  Map_Name_Id: number;
  Invoice_Category_Id: number;
}

interface PushParam {
  CompanyId: number;
  PayPeriodId: number;
  LotNumbers: string;
  Input_No: string;
  Employee_Head_Count: string;
  Map_Name_Id: number;
  Map_Name: string;
  NetPay: number;
  Invoice_Category_Id: number;
  Invoice_Category: string;
  InvoiceType_Id: number;
  Service_Charge_Master: string;
}

@Component({
  selector: 'app-draftinvoicenew',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatButtonToggleModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, MatCardModule, AttributeComponent, AlertpopupComponent, MatRadioModule, MatIconModule, PayrollinputComponent],
  templateUrl: './draftinvoicenew.component.html',
  styleUrl: './draftinvoicenew.component.css',
  providers: [
    { provide: DASH_TOKEN, useClass: OnboardingServices },
    { provide: invoiceservice, useClass: DraftNewRepository }]
})


export class DraftinvoicenewComponent {

  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any = '';
  payPeriodTypefromParentall: string = '';
  userdetail!: any;
  searchText: string = '';
  MergeRemarks: string = '';
  isLoading = false;
  apiResponse: any;
  rows: ViewRow[] = [];
  filteredRows: any[] = [];
  showPopup = false;
  popupMessage = '';
  Company_Code?: string;
  pay_period?: string;
  popupSubMessage = '';
  selectedMapName: string | null = null;
  selectedInvoiceCategory: string | null = null;
  selectedInputNo: string | null = null;
  selectedDataFrom: string | null = null;
  excelFile: File | null = null;
  UploadedResponse: any;
  SplitParams: SplitParam[] = [];
  PushParams: PushParam[] = [];
  assignments: number[] = [];
  assignmentsmapid: number[] = [];
  assignmentsInput: number[] = [];
  assignmentsDataFrom: string[] = [];
  assignmentsInvoiceCategory: string[] = [];
  ismerge = false;
  isattributes = false;
  isInvoiceInnitiation = false;
  showpsd: boolean = false;
  isbackdated: boolean = false;
  backdated: string = 'Current Date';
  selectedAction: string = '';
  remarks = 'N';
  availableItems: any[] = [];
  selectedItems: any[] = [];
  currentSelectItems: any[] = [];
  attributes = [
    { name: 'Narration', selected: false },
    { name: 'PO_Number', selected: false },
    { name: 'GL_Code', selected: false },
    { name: 'Cost_Centre', selected: false },
    { name: 'Client_SPOC_Name', selected: false },
    { name: 'Work_Order_Number', selected: false }
  ];
  listBoxForm: FormGroup;
  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(invoiceservice) private invoiceService: IDraftNewRepository
    , private router: Router, public fb: FormBuilder
  ) {
    this.listBoxForm = this.fb.group({
      availableSearchInput: [''],
      selectedSearchInput: [''],
    });
  }
  TemplateOptions = [
    { value: 'MapChange', Text: 'MapName Change' },
    { value: 'Split', Text: 'Split' },
    { value: 'Merge', Text: 'Merge' },
    { value: 'Skip', Text: 'Skip' },
    { value: 'Clear', Text: 'Clear' }

  ];
  selectedTemplate: string = '';

  onTemplateChange() {

    switch (this.selectedTemplate) {
      case 'Split':
        this.SplitClick();
        break;
      case 'Merge':
        this.Mergeclick();
        break;
      case 'Skip':
        this.SkipClick();
        break;
      case 'MapChange':
        this.downloadMapExcel()
        break;
      case 'Clear':
        this.selectedTemplate="";
        break;
    }
    this.selectedTemplate = '';
  }


  draftData = [
    {
      DraftRequest: '1',
      Invoices: [
        {
          selected: false, Billing: '', CompanyId: '', PayPeriodId: '', LotNumbers: '', Input_No: '',
          Employee_Head_Count: '', Map_Name_Id: '', Map_Name: '', NetPay: '', Invoice_Category_Id: '',
          Invoice_Category: '', InvoiceType_Id: '', Service_Charge_Master: '', DraftType: ''
        }
      ]
    },
    {
      DraftRequest: '2',
      Invoices: [
        {
          selected: false, Billing: '', CompanyId: '', PayPeriodId: '', LotNumbers: '', Input_No: '',
          Employee_Head_Count: '', Map_Name_Id: '', Map_Name: '', NetPay: '', Invoice_Category_Id: '',
          Invoice_Category: '', InvoiceType_Id: '', Service_Charge_Master: '', DraftType: ''
        }
      ]
    }
  ];
  toggle() {
    if (this.isbackdated) {
      this.backdated = 'Current Date'
    }
    else {
      this.backdated = 'BackDated'
    }
    this.isbackdated = !this.isbackdated;
  }

  toggleAll(draft: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    draft.Invoices.forEach((inv: any) => inv.selected = checked);
  }



  onItemsMoved(event): void {
    this.currentSelectItems = event.selected;
  }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.Input_No;

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      const request = {
        "id": 0,
        "AttributeName": "A",
        "ActionType": "S",
        "IsActive": false,
        "CreatedBy": 3,
        "DateTime": new Date()
      }
      this.invoiceService.GetAllAttribute(request).subscribe({
        next: res => {
          this.availableItems = res.Data;

        }, error: err => { console.log(err) }
      })
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParentall = "All";
    this.filteredRows = [...this.rows];
  }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.Company_Code = company.company_Code;
    if (this.companyUI.isProforma === true) {
      this.router.navigate(['/layout/pinavigation/provisionalinvoice']);
    }
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    this.pay_period = payperiod.payPeriod
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  // searchClick() {
  //   if (!this.companyUI) {
  //     alert("Select Company Code");
  //     return;
  //   }
  //   if (!this.payperiodUI) {
  //     alert("Select Pay Period");
  //     return;
  //   }

  //   if (this.companyUI && this.payperiodUI) {
  //     this.GetPerformaInvoice(this.companyUI.companyId, this.payperiodUI.payPeriod,
  //       this.userdetail.userId

  //     )
  //     this.invoiceService.InvoiceBackDated(this.companyUI.companyId, 0).subscribe({
  //       next: res => {
  //         const data = res.Data;

  //         if (data.backDated == 'Y' && data.statusCode == 200) {
  //           this.isbackdated = true;
  //           // this.backdated=data.monthDate
  //         }
  //         else {
  //           this.isbackdated = false;
  //           //this.InvoiceInitiateClick()
  //         }
  //       },
  //       error: err => { console.log(err); }
  //     })
  //   }
  // }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    this.selectedTemplate = '';
    if (this.companyUI && this.payperiodUI) {
      this.GetPerformaInvoice(this.companyUI.companyId, this.payperiodUI.payPeriod,
        this.userdetail.userId
      )
      this.GetDraftInformation(this.companyUI.companyId, this.payperiodUI.payfrequencyid,
        this.userdetail.userId

      )
      // this.invoiceService.InvoiceBackDated(this.companyUI.companyId, 0).subscribe({
      //   next: res => {
      //     const data = res.Data;

      //     if (data.backDated == 'Y' && data.statusCode == 200) {
      //       this.isbackdated = true;
      //       // this.backdated=data.monthDate
      //     }
      //     else {
      //       this.isbackdated = false;
      //       //this.InvoiceInitiateClick()
      //     }
      //   },
      //   error: err => { console.log(err); }
      // })
    }
  }

  GetDraftInformation(ComapnayId: string, payPeriod: string, userId: string) {
    this.isLoading = true;
    this.invoiceService.GetDraftInformation(ComapnayId, payPeriod, userId).subscribe({
      next: res => {
        const result = res.Data;
        console.log('Draft', result);
        this.draftData = result.map(draft => ({
          DraftRequest: draft.draftType.toString(),
          Invoices: draft.invoiceInitiateRequests.map(inv => ({
            selected: false,
            Billing: inv.section_billing ?? '',
            CompanyId: inv.companyId ?? '',
            PayPeriodId: inv.payPeriodId ?? '',
            LotNumbers: inv.lotNumbers ?? '',
            Input_No: inv.input_No ?? '',
            Employee_Head_Count: inv.employee_Head_Count ?? '',
            Map_Name_Id: inv.map_Name_Id ?? '',
            Map_Name: inv.map_Name ?? '',
            NetPay: Number(inv.netPay) || 0,
            Invoice_Category_Id: inv.invoice_Category_Id ?? '',
            Invoice_Category: inv.invoice_Category ?? '',
            InvoiceType_Id: inv.invoiceType_Id ?? '',
            Service_Charge_Master: inv.service_Charge_Master ?? '',
            DraftType: inv.draftType ?? ''
          }))
        }));
        //console.log(this.draftData);
      }
    });
  }

  GetPerformaInvoice(ComapnayId: string, payPeriod: string, userId: string) {
    this.isLoading = true;
    this.invoiceService.GetPerformaInvoice(ComapnayId, payPeriod, userId).subscribe({
      next: res => {
        console.log(res);
        if (!res?.Data?.data?.Table0?.length) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        this.apiResponse = res.Data;

        const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
        if (!table.length) {
          this.filteredRows = [];
          this.isLoading = false;
          return;
        }
        //  normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            Input_No: r['Input_No'],
            Map_Name_Id: r['Map_Name_Id'],
            Map_name: r['Map_name'],
            LotNo: r['LotNo'],
            Employee_Head_Count: r['Employee_Head_Count'],
            NetPay: r['NetPay'],
            Subtotal:r['Subtotal'],
            Net_CTC: r['Net_CTC'],
            Service_Charge_Master: r['Service_Charge_Master'],
            Invoice_Category_Id: r['Invoice_Category_Id'],
            Invoice_Category: r['Invoice_Category'],
            InvoiceType_Id: r['InvoiceType_Id'],
            selected: false,
            Data_From: r['Data_From'],
            Section_billing: r['Section_billing']
          };

          return row;
        });

        this.filteredRows = [...this.rows];
        this.isLoading = false;

      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  applyFilter(search: string='') {
    this.searchText=search;
    const text = (this.searchText || '').toLowerCase().trim();
    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }
    console.log(text);
    this.filteredRows = this.rows.filter(r =>
      (r.LotNo && r.LotNo.toString().includes(text)) ||
      (r.Map_name && r.Map_name.toLowerCase().includes(text)) ||
      (r.Section_billing && r.Section_billing.toLowerCase().includes(text)) ||
      (r.Invoice_Category && r.Invoice_Category.toLowerCase().includes(text))
    );
  }

  get selectedRowsCount(): number {
    return this.rows.filter(r => r.selected).length;
  }

  downloadExcel() {
    const data: any[][] = [
      ["EmployeeCode", ["LotNo"]]];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "PerformaInvoiceSplit_Template.xlsx");
  }

  downloadMapExcel() {
    const data: any[][] = [
      ["EMPLOYEE_CODE", "MAP_NAME", "ACTION"]];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Table");

    XLSX.writeFile(wb, "MapNameChangesTemplate.xlsx");
  }

  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }
    fileInput.value = '';
    fileInput.click();

  }

  onFileChange(event: any): void {
    this.isLoading = true;
    const target: DataTransfer = <DataTransfer>(event.target);

    if (!target.files || target.files.length !== 1) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }


    const file = target.files[0];
    this.excelFile = target.files[0];

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (!data.length) {
        alert("Uploaded file is empty.");
        return;
      }

      // Extract header row
      const headers = data[0].map((h: string) => h?.trim().toUpperCase());
      console.log(headers);
      // Define expected header sets

      const importheader = this.availableItems.map(x => x.value);


      const baseHeaders = ["LotNo", "Employee_Code"];
      const mapHeaders = ["EMPLOYEE_CODE", "MAP_NAME", "ACTION"];
      const splitHeaders = ["COMPANY_CODE", "PAY_PERIOD", "EMPLOYEE_CODE", "LOTNO", "MAP_NAME", "MAPNAME_GROUPING"];
      const attributeHeaders = ["LOTNO", "EMPLOYEE_CODE"];
      // const finalHeaders =importheader;// [...baseHeaders, ...importheader];

      const attributeAllowedExtras = importheader;




      // Detect which type of file it is
      if (this.arraysMatch(headers, mapHeaders)) {

        const formData = new FormData();
        if (this.excelFile) {
          formData.append('file', this.excelFile);
          formData.append('CompanyId', this.companyUI.companyId);
          formData.append('payperiod', this.payperiodUI.payPeriod);
          formData.append('CreatedBy', this.userdetail.userId);
          formData.append('payperiodId', this.payperiodUI.payfrequencyid);
          this.invoiceService.UpdateMapName(formData).subscribe({
            next: res => {
              this.UploadedResponse = res;

              if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes('Row(s) Uploaded Successfully.')) {
                this.isLoading = false;
                this.showPopup = true;
                this.popupMessage = this.UploadedResponse.data.response;
                this.selectedMapName = '';
                this.selectedInvoiceCategory = '';
                this.selectedInputNo = '';
                this.selectedDataFrom = '';
                this.searchClick();
              }
              else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

                const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
                const exportData = errorArray.map((item: any) => ({
                  Error_Message: item.Error_Message || item.Error_Message || ''
                    || item.Message || item.MESSAGE || item.message
                }));

                const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
                const workbook: XLSX.WorkBook = {
                  Sheets: { 'ErrorMessages': worksheet },
                  SheetNames: ['ErrorMessages']
                };

                // Export the file
                XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
                this.isLoading = false;
                this.showPopup = true;
                this.popupMessage = 'Import Failed.';

              }
              else {
                if (this.UploadedResponse.data.response != '') {
                  alert(this.UploadedResponse.data.response);
                  this.isLoading = false;
                }
                else {
                  alert('Error while processing response.');
                  this.isLoading = false;
                }

              }
            },
            error: err => {
              console.error('❌ Upload failed', err);
              this.isLoading = false;
            }
          });

        }
        else {
          alert("No File");
          this.isLoading = false;
        }


      }
      else if (this.arraysMatch(headers, splitHeaders)) {

        const formData = new FormData();
        if (this.excelFile) {
          formData.append('file', this.excelFile);
          formData.append('CompanyId', this.companyUI.companyId);
          formData.append('payperiod', this.payperiodUI.payPeriod);
          formData.append('CreatedBy', this.userdetail.userId);
          formData.append('payperiodId', this.payperiodUI.payfrequencyid);
          this.invoiceService.PerformaInvoiceSplit(formData).subscribe({
            next: res => {
              this.UploadedResponse = res;

              if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes('Row(s) Uploaded Successfully.')) {
                this.isLoading = false;
                this.showPopup = true;
                this.popupMessage = this.UploadedResponse.data.response;
                this.selectedMapName = '';
                this.selectedInvoiceCategory = '';
                this.selectedInputNo = '';
                this.selectedDataFrom = '';
                this.searchClick();
              }
              else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

                const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
                const exportData = errorArray.map((item: any) => ({
                  Error_Message: item.Error_Message || item.Error_Message || ''
                    || item.Message || item.MESSAGE || item.message
                }));

                const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
                const workbook: XLSX.WorkBook = {
                  Sheets: { 'ErrorMessages': worksheet },
                  SheetNames: ['ErrorMessages']
                };

                // Export the file
                XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
                this.isLoading = false;
                this.showPopup = true;
                this.popupMessage = 'Import Failed.';

              }
              else {
                if (this.UploadedResponse.data.response != '') {
                  alert(this.UploadedResponse.data.response);
                  this.isLoading = false;
                }
                else {
                  alert('Error while processing response.');
                  this.isLoading = false;
                }

              }
            },
            error: err => {
              console.error('❌ Upload failed', err);
              this.isLoading = false;
            }
          });
        }
        else {
          alert("No File");
          this.isLoading = false;
        }
      }
      else if (this.hasRequiredColumnsAttributes(headers, attributeHeaders)) {

        const attri = attributeAllowedExtras.map(h => h.toUpperCase());
        const allowed: string[] = [...attributeHeaders, ...attri];


        const invalidColumns: string[] = headers.filter(col => !allowed.includes(col.toUpperCase()));

        if (invalidColumns.length == 0) {

          const formData = new FormData();
          if (this.excelFile) {
            formData.append('file', this.excelFile);
            formData.append('CompanyId', this.companyUI.companyId);
            formData.append('payperiodId', this.payperiodUI.payfrequencyid);
            formData.append('CreatedBy', this.userdetail.userId);
            this.invoiceService.UploadAttributes(formData).subscribe({
              next: res => {
                this.UploadedResponse = res;

                if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes('Row(s) Uploaded Successfully.')) {
                  this.isLoading = false;
                  this.showPopup = true;
                  this.popupMessage = this.UploadedResponse.data.response;
                  this.selectedMapName = '';
                  this.selectedInvoiceCategory = '';
                  this.selectedInputNo = '';
                  this.selectedDataFrom = '';
                  this.searchClick();
                }
                else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

                  const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
                  const exportData = errorArray.map((item: any) => ({
                    Error_Message: item.Error_Message || item.Error_Message || ''
                      || item.Message || item.MESSAGE || item.message
                  }));

                  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
                  const workbook: XLSX.WorkBook = {
                    Sheets: { 'ErrorMessages': worksheet },
                    SheetNames: ['ErrorMessages']
                  };

                  // Export the file
                  XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
                  this.isLoading = false;
                  this.showPopup = true;
                  this.popupMessage = 'Import Failed.';

                }
                else {
                  if (this.UploadedResponse.data.response != '') {
                    alert(this.UploadedResponse.data.response);
                    this.isLoading = false;
                  }
                  else {
                    alert('Error while processing response.');
                    this.isLoading = false;
                  }

                }
              },
              error: err => {
                console.error('❌ Upload failed', err);
                this.isLoading = false;
              }
            });
          }
          else {
            alert("No File");
            this.isLoading = false;
          }

        }
        else {
          alert("Invalid file headers. Please upload a valid template.");
          this.isLoading = false;
        }

      }
      else {
        alert("Invalid file headers. Please upload a valid template.");
        this.isLoading = false;
      }
    };

    reader.readAsBinaryString(file);

  }

  arraysMatch(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  hasRequiredColumnsAttributes(headers: string[], required: string[]): boolean {
    const upperHeaders = headers.map(h => h.toUpperCase());
    const upperRequired = required.map(r => r.toUpperCase());
    return upperRequired.every(col => upperHeaders.includes(col));

  }

  Mergeclick() {
    const selectedRows = this.filteredRows.filter(r => r.selected);
    if (selectedRows.length <= 1) {
      alert("Select atleast two rows to Merge");
      return;
    }
    this.assignments = [
      ...new Set(
        this.filteredRows
          .filter(r => r.selected)
          .map(r => r.LotNo)
      )
    ];

    this.ismerge = true;
  }




  MergeSubmit() {
    const selectedRow = this.filteredRows.filter(r => r.selected);

    if (!selectedRow) {
      alert("Please select a row");
      return;
    }

    let productList: MergeRequest[] = [];

    (selectedRow).forEach(element => {
      const requt = new MergeRequest(
        String(this.companyUI.companyId),
        String(this.payperiodUI.payfrequencyid),
        String(element.Map_Name_Id),
        String(element.LotNo),
        String(element.Input_No),
        String(element.Invoice_Category_Id),
        String(this.userdetail.userId),
        String(this.MergeRemarks),
        String(element.Data_From)

      );
      productList.push(requt);
    });

    this.invoiceService.PerformaInvoiceMergeNew(productList).subscribe({
      next: res => {
        this.UploadedResponse = res;

        if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes("Merged successfully with lot number")) {
          this.isLoading = false;
          this.showPopup = true;

          this.popupMessage = this.UploadedResponse.data.response;
          this.selectedMapName = '';
          this.selectedInvoiceCategory = '';
          this.MergeRemarks = '';
          this.ismerge = false;
          this.assignments = [];
          this.assignmentsmapid = [];
          this.assignmentsInput = [];
          this.MergeRemarks = '';
          this.searchClick();
        }
        else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'No Macthing Mapname and Culture is available for Merge') {
          this.MergeRemarks = '';
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'No Macthing Mapname and Culture is available for Merge';

        }
        else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            ERORR: item.ERORR || item.ERORR || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']
          };

          // Export the file
          XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Merge.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed';
          this.MergeRemarks = '';

        }
        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
            this.isLoading = false;
            this.MergeRemarks = '';
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
            this.MergeRemarks = '';
          }

        }
      },
      error: err => {
        this.MergeRemarks = '';
        this.isLoading = false;
        console.error('❌ Upload failed', err);
      }
    });

  }
  CloseBackdate() {
    this.isbackdated = false;
    this.remarks = "N";
  }
  getLastMonthLastDate(): Date {
    const now = new Date();

    // Move to first day of this month
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Subtract 1 day → gives last month’s last date
    const lastMonthLastDate = new Date(firstDayOfThisMonth);
    lastMonthLastDate.setDate(0);

    return lastMonthLastDate;
  }
  onRemarksChange(event: any) {

    if (event.value == "Y") {
      this.backdated = String(this.getLastMonthLastDate());
    }
    else {
      this.backdated = '';
    }
  }
  InvoiceInitiateRequest() {
    this.invoiceService.InvoiceBackDated(this.companyUI.companyId, 0).subscribe({
      next: res => {
        const data = res.Data;

        if (data.backDated == 'Y' && data.statusCode == 200) {
          this.isbackdated = true;
          // this.backdated=data.monthDate
        }
        else {
          this.isbackdated = false;
          this.InvoiceInitiateClick()
        }
      },
      error: err => { console.log(err); }
    })
  }


  // InvoiceInitiateClick() {
  //   this.isLoading = true;
  //   const selectedRow = this.filteredRows.filter(r => r.selected);

  //   if (!selectedRow) {
  //     alert("Please select a row");
  //     return;
  //   }


  //   let productList: InvoiceInitiateRequest[] = [];

  //   (selectedRow).forEach(element => {
  //     console.log(element);
  //     const requt = new InvoiceInitiateRequest(
  //       String(this.companyUI.companyId),
  //       String(this.payperiodUI.payfrequencyid),
  //       String(element.LotNo),
  //       String(element.Input_No),
  //       String(element.Employee_Head_Count),
  //       String(element.Map_Name_Id),
  //       String(element.Map_name),
  //       String(element.NetPay),
  //       String(element.Invoice_Category_Id),
  //       String(element.Invoice_Category),
  //       String(element.InvoiceType_Id),
  //       String(element.Service_Charge_Master),
  //       String(this.userdetail.userId)
  //     );
  //     productList.push(requt);
  //   });

  //   if (this.remarks == '') {
  //     this.remarks = 'N'
  //   }

  //   const request = {
  //     "DraftInvoiceInitiateRequest": productList,
  //     "CreatedBy": this.userdetail.userId,
  //     "ActionType": "InvoiceRequest",
  //     "InvoiceDateType": this.remarks
  //   }

  //   this.invoiceService.PerformaInvoiceInitiate(request).subscribe({
  //     next: res => {
  //       this.UploadedResponse = res;
  //       this.remarks = '';
  //       if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Invoice Initiated Successfully') {
  //         this.isLoading = false;
  //         this.showPopup = true;
  //         this.searchClick();
  //         this.selectedMapName = '';
  //         this.selectedInvoiceCategory = '';
  //         this.selectedDataFrom = '';
  //         this.selectedInputNo = '';
  //         this.isbackdated = false;
  //         this.popupMessage = 'Invoice Request Submitted';

  //       }
  //       else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

  //         const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
  //         const exportData = errorArray.map((item: any) => ({
  //           Error_Message: item.Error_Message || item.ERROR_MESSAGE || ''
  //         }))

  //         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //         const workbook: XLSX.WorkBook = {
  //           Sheets: { 'ErrorMessages': worksheet },
  //           SheetNames: ['ErrorMessages']

  //         };

  //         // Export the file
  //         XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
  //         this.isLoading = false;
  //         this.showPopup = true;
  //         this.popupMessage = 'Failed';

  //       }
  //       else {
  //         if (this.UploadedResponse.data.response != '') {
  //           alert(this.UploadedResponse.data.response);
  //           this.isLoading = false;
  //         }
  //         else {
  //           alert('Error while processing response.');
  //           this.isLoading = false;
  //         }

  //       }
  //     },
  //     error: err => {
  //       console.error('❌ Upload failed', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  InvoiceInitiateClick() {
    const selectedRow = this.filteredRows.filter(r => r.selected);

    if (selectedRow.length > 0) {
      alert("Invoice Initiation cannot be done from Listed Bill. Please select records only from Draft Request 1.");
      this.filteredRows.forEach(row => {
        row.selected = false;
      });
      return;
    }
    const draftRequests: string[] = this.draftData
      .filter(draft => draft.Invoices.some(inv => inv.selected))
      .map(draft => draft.DraftRequest);
    console.log(draftRequests);
    if (draftRequests.length === 0) {
      alert('Select rows from Draft Request 1 for Initiation.');
      this.draftData.forEach(draft => {
        draft.Invoices.forEach(inv => {
          inv.selected = false;
        });
      });
      return;
    }

    if (draftRequests.length > 1) {
      alert('Cannot select records from Multiple Drafts');
      this.draftData.forEach(draft => {
        draft.Invoices.forEach(inv => {
          inv.selected = false;
        });
      });
      return;
    }

    if (draftRequests.includes('2')) {
      alert('Draft Invoice Initiation can be done only from Draft Request 1');
      this.draftData.forEach(draft => {
        draft.Invoices.forEach(inv => {
          inv.selected = false;
        });
      });
      return;
    }
    this.isLoading = true;
    const InvoiceDetails = this.draftData.flatMap(draft =>
      draft.Invoices
        .filter(inv => inv.selected)
        .map(inv => ({
          CompanyId: inv.CompanyId,
          PayPeriodId: inv.PayPeriodId,
          LotNumbers: inv.LotNumbers,
          Input_No: inv.Input_No,
          Employee_Head_Count: inv.Employee_Head_Count,
          Map_Name_Id: inv.Map_Name_Id,
          Map_Name: inv.Map_Name,
          NetPay: inv.NetPay.toString(),
          Invoice_Category_Id: inv.Invoice_Category_Id,
          Invoice_Category: inv.Invoice_Category,
          InvoiceType_Id: inv.InvoiceType_Id,
          CreatedBy: this.userdetail.userId,
          Service_Charge_Master: inv.Service_Charge_Master,
          Section_billing: '',
          DraftType: draft.DraftRequest
        }))
    );
    console.log('InvoiceDetails', InvoiceDetails);

    if (this.remarks == '') {
      this.remarks = 'N'
    }
    const request = {
      "DraftInvoiceInitiateRequest": InvoiceDetails,
      "CreatedBy": this.userdetail.userId,
      "ActionType": "InvoiceRequest",
      "InvoiceDateType": this.remarks
    }
    console.log('request', request);
    this.invoiceService.PerformaInvoiceInitiate(request).subscribe({
      next: res => {
        this.UploadedResponse = res;
        this.remarks = '';
        if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Invoice Initiated Successfully') {
          this.isLoading = false;
          this.showPopup = true;
          this.searchClick();
          this.selectedMapName = '';
          this.selectedInvoiceCategory = '';
          this.selectedDataFrom = '';
          this.selectedInputNo = '';
          this.isbackdated = false;
          this.popupMessage = 'Invoice Request Submitted';

        }
        else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

          const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message || item.ERROR_MESSAGE || ''
          }))

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { 'ErrorMessages': worksheet },
            SheetNames: ['ErrorMessages']

          };

          // Export the file
          XLSX.writeFile(workbook, 'DraftInvoice_Validations.xlsx');
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed';

        }
        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }

        }
      },
      error: err => {
        console.error('❌ Upload failed', err);
        this.isLoading = false;
      }
    });
  }

  Attributeclick() {
    if (this.companyUI == undefined || this.companyUI == null) {
      alert('Please select Company');
      return;
    }

    if (this.payperiodUI == undefined || this.payperiodUI == null) {
      alert('Please select Pay Period');
      return;
    }

    const request = {
      "id": 0,
      "AttributeName": "A",
      "ActionType": "S",
      "IsActive": false,
      "CreatedBy": 3,
      "DateTime": new Date()
    }
    this.invoiceService.GetAllAttribute(request).subscribe({
      next: res => {
        this.availableItems = res.Data;

      }, error: err => { console.log(err) }
    })
    this.isattributes = true;
    this.showpsd = true;

  }

  AttributesTemplateclick() {
    const selectedAttributes = this.attributes
      .filter(attr => attr.selected)
      .map(attr => attr.name);

    if (selectedAttributes.length == 0) {
      alert('Please select atleast one Attributes');
      return;
    }

    const baseHeaders = ["LotNo", "Employee_Code"];
    const finalHeaders = [...baseHeaders, ...selectedAttributes];
    const data: any[][] = [finalHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "Attributes_Template.xlsx");

  }

  PushToDraft() {
    //this.isLoading = true;
    this.PushParams = Array.from(
      new Set(
        this.filteredRows
          .filter(r => r.selected)
          .map(r =>
            JSON.stringify({
              CompanyId: this.companyUI.companyId,
              PayPeriodId: this.payperiodUI.payfrequencyid,
              LotNumbers: r.LotNo,
              Input_No: r.Input_No,
              Employee_Head_Count: r.Employee_Head_Count.toString(),
              Map_Name_Id: r.Map_Name_Id,
              Map_Name: r.Map_name,
              NetPay: r.NetPay,
              Invoice_Category_Id: r.Invoice_Category_Id,
              Invoice_Category: r.Invoice_Category,
              InvoiceType_Id: r.InvoiceType_Id,
              Service_Charge_Master: r.Service_Charge_Master
            })
          )
      )
    ).map(item => JSON.parse(item));

    const payload = {
      company_id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      DraftTypeId: 1,
      details: this.PushParams,
      CreatedBy: this.userdetail.userId,
      Action: "Push"
    }
    console.log(payload);

    this.invoiceService.PostPushData(payload).subscribe({
      next: res => {
        if (!res.Data) {
          alert("No Data Returned");
          return;
        }
        const result = res.Data;
        console.log(result);
        this.draftData = result.map(draft => ({
          DraftRequest: draft.draftType.toString(),
          Invoices: draft.invoiceInitiateRequests.map(inv => ({
            Billing: inv.section_billing,
            Map_Name: inv.map_Name,
            NetPay: Number(inv.netPay),
            selected: false
          }))
        }));
        console.log('draftData', this.draftData);
        this.searchClick();
        this.isLoading = false;
      },
      error: err => {
        console.error(err.message);
        alert("Push failed.");
        this.isLoading = false;
      }
    });
  }

  PushToDraft2() {
    //this.isLoading = true;
    const invoice = this.draftData[0];
    const draftRequests: string[] = this.draftData
      .filter(draft => draft.Invoices.some(inv => inv.selected))
      .map(draft => draft.DraftRequest);
    console.log(draftRequests);

    if (draftRequests.length > 1) {
      alert('Cannot select records from Multiple Drafts');
      this.draftData.forEach(draft => {
        draft.Invoices.forEach(inv => {
          inv.selected = false;
        });
      });
      return;
    }

    const selected = invoice.Invoices.filter(x => x.selected == true);
    console.log(selected);

    const payload = {
      company_id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      DraftTypeId: 2,
      details: selected,
      CreatedBy: this.userdetail.userId,
      Action: "Push"
    }
    console.log(payload);

    this.invoiceService.PostPushData(payload).subscribe({
      next: res => {
        if (!res.Data) {
          alert("No Data Returned");
          return;
        }
        const result = res.Data;
        console.log(result);
        this.draftData = result.map(draft => ({
          DraftRequest: draft.draftType.toString(),
          Invoices: draft.invoiceInitiateRequests.map(inv => ({
            Billing: inv.section_billing,
            Map_Name: inv.map_Name,
            NetPay: Number(inv.netPay),
            selected: false
          }))
        }));
        console.log(this.draftData);
        this.searchClick();
        this.isLoading = false;
      },
      error: err => {
        console.error(err.message);
        alert("Push failed.");
        this.isLoading = false;
      }
    });
  }


  Revoke() {
    //this.isLoading = true;
    const selectedRow = this.filteredRows.filter(r => r.selected);

    if (selectedRow.length > 0) {
      alert("Revoke cannot be done for Listed Bill. Please select records only from Draft Request 1 or 2.");
      this.filteredRows.forEach(row => {
        row.selected = false;
      });
      return;
    }
    const selectedInvoices = this.draftData
      .flatMap(draft => draft.Invoices)
      .filter(inv => inv.selected === true);
    const draftType = selectedInvoices?.[0]?.DraftType;
    const draftRequests: string[] = this.draftData
      .filter(draft => draft.Invoices.some(inv => inv.selected))
      .map(draft => draft.DraftRequest);
    console.log(draftRequests);
    if (draftRequests.length > 1) {
      alert('Cannot select records from Multiple Drafts');
      this.draftData.forEach(draft => {
        draft.Invoices.forEach(inv => {
          inv.selected = false;
        });
      });
      return;
    }

    const payload = {
      company_id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      DraftTypeId: draftType,
      details: selectedInvoices,
      CreatedBy: this.userdetail.userId,
      Action: "Revoke"
    }
    console.log(payload);

    this.invoiceService.PostPushData(payload).subscribe({
      next: res => {
        if (!res.Data) {
          alert("No Data Returned");
          return;
        }
        const result = res.Data;
        console.log(result);
        this.draftData = result.map(draft => ({
          DraftRequest: draft.draftType.toString(),
          Invoices: draft.invoiceInitiateRequests.map(inv => ({
            Billing: inv.section_billing,
            Map_Name: inv.map_Name,
            NetPay: Number(inv.netPay),
            selected: false
          }))
        }));
        console.log(this.draftData);
        this.searchClick();
        this.isLoading = false;
      },
      error: err => {
        console.error(err.message);
        alert("Push failed.");
        this.isLoading = false;
      }
    });
  }


  SplitClick() {
    const selectedRows = this.filteredRows.filter(r => r.selected);
    if (selectedRows.length === 0) {
      alert("Select atleast one row to Split");
      return;
    }
    this.isLoading = true;
    this.SplitParams = Array.from(
      new Set(
        this.filteredRows
          .filter(r => r.selected)
          .map(r =>
            JSON.stringify({
              LotNo: r.LotNo,
              Map_Name_Id: r.Map_Name_Id,
              Invoice_Category_Id: r.Invoice_Category_Id
            })
          )
      )
    ).map(item => JSON.parse(item));

    const payload = {
      company_id: this.companyUI.companyId,
      Pay_Period_Id: this.payperiodUI.payfrequencyid,
      LotNo: this.SplitParams.map(r => r.LotNo).join(','),
      Map_Name_Id: this.SplitParams.map(a => a.Map_Name_Id).join(','),
      Invoice_Category_Id: this.SplitParams.map(a => a.Invoice_Category_Id).join(',')
    }
    console.log(payload);

    this.invoiceService.GetSplitTemplate(payload)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      )
      .subscribe({
        next: res => {
          console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            this.downloadExcelFromBase64(data.file, data.fileName);
          } else {
            alert("Something went wrong while generating the Template.");
          }
        },
        error: error => {
          console.error('Error:', error);
          alert("Server error occurred.");
        }
      });
  }

  SkipClick() {
    const selectedRow = this.filteredRows.filter(r => r.selected);
    if (selectedRow.length === 0) {
      alert("Please select a row");
      return;
    }
    this.isLoading = true;

    let productList: InvoiceInitiateRequest[] = [];

    (selectedRow).forEach(element => {
      console.log(element);
      const requt = new InvoiceInitiateRequest(
        String(this.companyUI.companyId),
        String(this.payperiodUI.payfrequencyid),
        String(element.LotNo),
        String(element.Input_No),
        String(element.Employee_Head_Count),
        String(element.Map_Name_Id),
        String(element.Map_name),
        String(element.NetPay),
        String(element.Invoice_Category_Id),
        String(element.Invoice_Category),
        String(element.InvoiceType_Id),
        String(element.Service_Charge_Master),
        String(this.userdetail.userId)
      );
      productList.push(requt);
    });

    const request = {
      "DraftInvoiceInitiateRequest": productList,
      "CreatedBy": this.userdetail.userId,
      "ActionType": "Skip"
    }

    this.invoiceService.PerformaInvoiceSkip(request).subscribe({
      next: res => {
        const errorString = res.Data.errors[0];
        const parsed = JSON.parse(errorString);
        const errorMessage = parsed[0].Error_Message;
        this.remarks = '';
        this.UploadedResponse = res;

        if (errorMessage === 'Invoice Skipped Successfully') {
          this.isLoading = false;
          this.showPopup = true;
          this.searchClick();
          this.selectedMapName = '';
          this.selectedInvoiceCategory = '';
          this.selectedDataFrom = '';
          this.selectedInputNo = '';
          this.isbackdated = false;
          this.popupMessage = 'Invoice Skipped';
        }
        else if (
          this.UploadedResponse.statuscode === 200 &&
          this.UploadedResponse.data.response === 'Failed to Skip.'
        ) {
          const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item.Error_Message ?? item.ERROR_MESSAGE ?? ''
          }));

          const worksheet: XLSX.WorkSheet =
            XLSX.utils.json_to_sheet(exportData);

          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };

          XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Skip.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed';
        }

        else {
          if (this.UploadedResponse.data.response != '') {
            alert(this.UploadedResponse.data.response);
            this.isLoading = false;
          }
          else {
            alert('Error while processing response.');
            this.isLoading = false;
          }
        }
      },
      error: err => {
        console.error('❌ Upload failed', err);
        this.isLoading = false;
      }
    });
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
    this.isLoading = false;
  }



}
export class InvoiceInitiateRequest {
  constructor(
    public companyId: string,
    public payPeriodId: string,
    public lotNumbers: string,
    public input_No: string,
    public employee_Head_Count: string,
    public map_Name_Id: string,
    public map_Name: string,
    public netPay: string,
    public invoice_Category_Id: string,
    public invoice_Category: string,
    public InvoiceType_Id: string,
    public Service_Charge_Master: string,
    public createdBy: string

  ) { }
}

export class MergeRequest {
  constructor(
    public CompanyId: string,
    public PayPeriodId: string,
    public MAP_NAME_ID: string,
    public MergeLot: string,
    public Merged_Input_No: string,
    public Invoice_Category_Id: string,
    public CreatedBy: string,
    public Remarks: string,
    public Data_From: string
  ) { }
}
