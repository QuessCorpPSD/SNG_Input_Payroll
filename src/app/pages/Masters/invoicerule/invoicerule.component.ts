import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { CommonModule } from '@angular/common';
export const IR_TOKEN = new InjectionToken<IinvoiceRuleService>('IR_TOKEN');
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceRuleGrid } from '../../../Models/InvoiceRuleGrid';
import { InvoiceForm } from '../../../Models/InvoiceRuleGrid';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { Company, Groupnameclass } from '../../../Models/Common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { invoiceRuleService } from '../../../Service/Master/invoiceRuleService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { IinvoiceRuleService } from '../../../Repository/Master/IinvoiceRuleService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'invoicerule',
  standalone: true,
  imports: [GroupnameComponent, CommonModule, MatPaginator, MatTableModule,
    MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckbox, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, CompanyallComponent, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './invoicerule.component.html',
  styleUrl: './invoicerule.component.css',
  providers: [{
    provide: IR_TOKEN,
    useClass: invoiceRuleService
  }]
})

export class InvoiceruleComponent {
  selectedCC?: number;
  selectedGN?: string;
  companyUI?: any;
  sitenameUI?: any;
  isLoading = false;
  isAddclicked = false;
  userdetail!: any;
  isChecked = false;
  isCarryForward = false;
  previousMonthText: string = '';
  isEditMode = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  datatable: Array<{ [key: string]: any }> = [];
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  months = [
    { id: 1, text: 'January' },
    { id: 2, text: 'February' },
    { id: 3, text: 'March' },
    { id: 4, text: 'April' },
    { id: 5, text: 'May' },
    { id: 6, text: 'June' },
    { id: 7, text: 'July' },
    { id: 8, text: 'August' },
    { id: 9, text: 'September' },
    { id: 10, text: 'October' },
    { id: 11, text: 'November' },
    { id: 12, text: 'December' }
  ];

  billingType = [
    { id: 1, text: 'Hourly' },
    { id: 2, text: 'Daily' },
    { id: 3, text: 'Monthly' },
    { id: 4, text: 'Networking Days' }
  ];

  leavetypes = [
    { id: 1, text: 'Cumulative' },
    { id: 2, text: 'Non-Cumulative' },
    { id: 3, text: 'Not Billable' },
  ];
  standardSelect = [
    { id: 1, text: 'Yes' },
    { id: 2, text: 'No' },
  ]
  dataSource = new MatTableDataSource<InvoiceRuleGrid>([]);
  invoiceruleform!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'companyCode', 'siteName', 'daysPerMonth', 'weekends',
    'holidays', 'compOff','delete'
  ];

  constructor(@Inject(IR_TOKEN) private invoicerule: IinvoiceRuleService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = company.companyId;

  }

  handleGroupNameEvent(sitename: any) {
    this.sitenameUI = sitename
    this.selectedGN = sitename.siteCode;
  }
  searchClick() {
    if (!this.companyUI) {
      this.companyUI = {
        companyId: 0,
        companyCode: '',
        companyName: '',
        displayName: ''
      };
    }
    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: '0',
        siteName: ''
      };
    }

    if (this.companyUI) {
      this.isLoading = true;
      this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
    }
  }
  
  selection = new SelectionModel<InvoiceRuleGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.invoicingRulesID === sel.invoicingRulesID)
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

  toggleRow(row: InvoiceRuleGrid) {
    this.selection.toggle(row);
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.invoiceruleform = this.fb.group({
      company: [null],
      group: [null],
      billingType: ['', Validators.required],
      daysAsPerTimesheet: [false],
      dayspermonth: ['', Validators.required],
      weekendsrule: ['', Validators.required],
      holidaysrule: ['', Validators.required],
      comppoffrule: ['', Validators.required],
      maternityleave: ['', Validators.required],
      leavetypes: ['', Validators.required],
      leavecredit: ['', Validators.required],
      leaverule: ['', Validators.required],
      payperiodfrom: ['', Validators.required],
      payperiodto: ['', Validators.required],
      carryforward: ['', Validators.required],
      noofcarryforwards: [{ value: '', disabled: true }],
      otrule: ['', Validators.required],
      gratuity: ['', Validators.required],
      reimbursement: ['', Validators.required],
      servicefeeonexpenses: ['', Validators.required],
      rebates: ['', Validators.required],
      discounts: ['', Validators.required],
      billabledaysformula: ['', Validators.required]
    });

    this.invoiceruleform.get('daysAsPerTimesheet')?.valueChanges.subscribe((checked: boolean) => {
      const daysControl = this.invoiceruleform.get('dayspermonth');
      if (checked) {
        daysControl?.disable();
      } else {
        daysControl?.enable();
      }
    });
    this.invoiceruleform.get('carryforward')?.valueChanges.subscribe((value: any) => {
      const noOfCarryCtrl = this.invoiceruleform.get('noofcarryforwards');
      if (value.id === 1) {
        noOfCarryCtrl?.enable();
      } else {
        noOfCarryCtrl?.disable();
        noOfCarryCtrl?.reset();
      }
    });
    //this.invoiceruleform.get('payperiodto')?.disable();
  }
  BindDashBoard(companyId: number, siteId: string) {
    this.invoicerule.GetAllInvoiceRule(companyId, siteId).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        this.dataSource = new MatTableDataSource<any>(res.Data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  Addclicked(): void {
    this.isAddclicked = true;
  }
  deleteClick(invoicingRulesID: number) {
    if (confirm("Are you sure you want to delete this?")) {
      this.invoicerule.PostDeleteInvoiceRule(invoicingRulesID).subscribe({
        next: (res) => {
          const errormsg = res.Data[0].msg;
          alert(errormsg);
          this.isLoading = true;
          this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
        }
      });
    } else {
      console.log("Cancelled");
    }

  }

  closeclick() {
    this.invoiceruleform.reset({
      billingType: '',
      daysAsPerTimesheet: false,
      dayspermonth: '',
      weekendsrule: '',
      holidaysrule: '',
      comppoffrule: '',
      maternityleave: '',
      leavetypes: '',
      leavecredit: '',
      leaverule: '',
      payperiodfrom: '',
      payperiodto: '',
      carryforward: '',
      noofcarryforwards: '',
      otrule: '',
      gratuity: '',
      reimbursement: '',
      servicefeeonexpenses: '',
      rebates: '',
      discounts: '',
      billabledaysformula: ''
    });
    this.isAddclicked = false;
  }

  TemplateClick(): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }
    else {
      this.InvoiceRuleDownload();
    }
  }
  InvoiceRuleDownload() {
    const formData = new FormData();
    if (this.companyUI) {
      formData.append('companyId', this.companyUI.companyId);
      formData.append('companyCode', this.companyUI.companyCode);
      if (!this.sitenameUI) {
        this.sitenameUI = {
          siteCode: 0,
          siteName: '** Select **'
        }
      }
      formData.append('siteName', this.sitenameUI.siteName);

      this.invoicerule.GetInvoiceRuleTemplate(formData).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            //console.log(data.FileName);
            this.downloadExcelFromBase64(base64, data.fileName)
            this.isLoading = false;
          }
        },
        error: error => console.error('Error:', error)
      })
    }
    this.isLoading = false;
    return;
  }

  ExportClick(): void {
    this.isLoading=true;
    this.InvoiceRuleExport();
  }

  InvoiceRuleExport() {
    const formData = new FormData();
      if (!this.companyUI) {
        this.companyUI = {
          companyId: 0,
          companyCode: ''
        }
      }
      formData.append('companyId', this.companyUI.companyId);
      formData.append('companyCode', this.companyUI.companyCode);
      if (!this.sitenameUI) {
        this.sitenameUI = {
          siteCode: 0,
          siteName: ''
        }
      formData.append('siteCode', this.sitenameUI.siteCode);
      this.invoicerule.InvoiceRuleExport(formData).subscribe({
        next: res => {
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName)
            this.companyUI = {};
            this.sitenameUI = {};
            this.isLoading = false;
            
          }
        },
        error: error => console.error('Error:', error)
      })
    }
    this.isLoading = false;
    return;
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  CarryforwardChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    if (value == "1") {
      this.isCarryForward = true;
    }
    else {
      this.isCarryForward = false;
    }
  }
  onMonthChange() {
    const selected = this.invoiceruleform.get('payperiodfrom')?.value;

    if (selected && selected.id > 0) {
      const prevIndex = (selected.id - 2 + 12) % 12;
      this.previousMonthText = this.months[prevIndex].text;
    } else {
      this.previousMonthText = '';
    }
    this.invoiceruleform.get('payperiodto')?.setValue(this.previousMonthText);
  }
  onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isChecked = input.checked;
  }

  SaveData() {
    if (this.invoiceruleform.invalid) {
      this.invoiceruleform.markAllAsTouched();
      return;
    }
    const formValue = this.invoiceruleform.value;
    const InvoiceRuleAdd = {
      companyId: this.companyUI?.companyId,
      companyCode: this.companyUI?.companyCode,
      siteId: this.sitenameUI?.siteCode,
      siteName: this.sitenameUI?.siteName,
      billingtype: formValue.billingType.text,
      daysAsPerTimesheet: formValue.daysAsPerTimesheet,
      dayspermonth: formValue.dayspermonth,
      weekendsrule: formValue.weekendsrule.text,
      holidaysrule: formValue.holidaysrule.text,
      comppoffrule: formValue.comppoffrule.text,
      maternityleave: formValue.maternityleave.text,
      leavetypes: formValue.leavetypes.id,
      leavecredit: formValue.leavecredit,
      leaverule: formValue.leaverule.text,
      payperiodfrom: formValue.payperiodfrom.text,
      payperiodto: formValue.payperiodto,
      carryforward: formValue.carryforward.text,
      noofcarryforwards: formValue.noofcarryforwards,
      otrule: formValue.otrule.text,
      gratuity: formValue.gratuity.text,
      reimbursement: formValue.reimbursement.text,
      servicefeeonexpenses: formValue.servicefeeonexpenses.text,
      rebates: formValue.rebates.text,
      discounts: formValue.discounts.text,
      billabledaysformula: formValue.billabledaysformula,
      userId: this.userdetail.user_Id
    };

    this.invoicerule.PostAddInvoiceRule(InvoiceRuleAdd).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;

        if (errormsg === 'true') {
          this.isAddclicked = false;
          this.showPopup = true;
          this.popupMessage = "Invoice Rule Added Successfully";
          this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
        }
        else {
          alert("Invoice Rule already availabe for this company");
          this.invoiceruleform.reset({
            billingType: '',
            daysAsPerTimesheet: false,
            dayspermonth: '',
            weekendsrule: '',
            holidaysrule: '',
            comppoffrule: '',
            maternityleave: '',
            leavetypes: '',
            leavecredit: '',
            leaverule: '',
            payperiodfrom: '',
            payperiodto: '',
            carryforward: '',
            noofcarryforwards: '',
            otrule: '',
            gratuity: '',
            reimbursement: '',
            servicefeeonexpenses: '',
            rebates: '',
            discounts: '',
            billabledaysformula: ''
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }
  onImportClick(fileInput: HTMLInputElement): void {
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
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
  }



  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
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
      formData.append('userId', this.userdetail.user_Id);

      this.invoicerule.PostInvoiceRuleUpload(formData).subscribe({
        next: res => {
          this.datatable = res.Data;
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "InvoiceRule_Validations");
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
}
