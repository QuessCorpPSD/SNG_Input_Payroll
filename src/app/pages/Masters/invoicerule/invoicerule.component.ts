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
import { Console } from 'node:console';

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
  editInvoiceRuleId: number | null = null;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  datatable: Array<{ [key: string]: any }> = [];
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  editRow: any = null;

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
  invoiceruleEditform!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'companyCode', 'siteName', 'daysPerMonth', 'weekends',
    'holidays', 'compOff', 'action'
  ];

  constructor(@Inject(IR_TOKEN) private invoicerule: IinvoiceRuleService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = company.companyId;

  }
  onEditMonthChange(): void {
    const selected = this.invoiceruleEditform.get('editpayperiodfrom')?.value;
    if (selected && selected.id > 0) {

      const toIndex = (selected.id + 11) % 12;
      this.invoiceruleEditform.get('editpayperiodto')?.setValue(this.months[toIndex].text);
    } else {
      this.invoiceruleEditform.get('editpayperiodto')?.setValue('');
    }
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
    this.invoiceruleEditform = this.fb.group({
      company: [''],
      group: [''],
      editbillingType: ['', Validators.required],
      editdaysAsPerTimesheet: [false],
      editdayspermonth: ['', Validators.required],
      editweekendsrule: ['', Validators.required],
      editholidaysrule: ['', Validators.required],
      editcomppoffrule: ['', Validators.required],
      editmaternityleave: ['', Validators.required],
      editleavetypes: ['', Validators.required],
      editleavecredit: ['', Validators.required],
      editleaverule: ['', Validators.required],
      editpayperiodfrom: ['', Validators.required],
      editpayperiodto: ['', Validators.required],
      editcarryforward: ['', Validators.required],
      editnoofcarryforwards: [{ value: '', disabled: true }],
      editotrule: ['', Validators.required],
      editgratuity: ['', Validators.required],
      editreimbursement: ['', Validators.required],
      editservicefeeonexpenses: ['', Validators.required],
      editrebates: ['', Validators.required],
      editdiscounts: ['', Validators.required],
      editbillabledaysformula: ['', Validators.required]
    });

    this.invoiceruleform.get('daysAsPerTimesheet')?.valueChanges.subscribe((checked: boolean) => {
      const daysControl = this.invoiceruleform.get('dayspermonth');
      if (checked) {
        daysControl?.disable();
      } else {
        daysControl?.enable();
      }
    });
    this.invoiceruleEditform.get('editdaysAsPerTimesheet')?.valueChanges.subscribe((checked: boolean) => {
      const daysControl = this.invoiceruleEditform.get('editdayspermonth');
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
    this.invoiceruleEditform.get('editcarryforward')?.valueChanges.subscribe((value: string) => {
      const noOfCarryCtrl = this.invoiceruleEditform.get('editnoofcarryforwards');

      if (value === 'Yes') {
        noOfCarryCtrl?.enable();
      } else {
        noOfCarryCtrl?.disable();
        noOfCarryCtrl?.reset();
      }
    });

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
          this.companyUI = null;
          this.sitenameUI = null;
          this.searchClick();

        }
      });
    } else {
      //console.log("Cancelled");
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
  closeEditclick() {
    this.invoiceruleEditform.reset({
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
    this.isEditMode = false;

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
    this.isLoading = true;
    this.InvoiceRuleExport();
  }

  InvoiceRuleExport() {
    const formData = new FormData();

    if (!this.companyUI) {
      this.companyUI = {
        companyId: 0,
        companyCode: ''
      };
    }

    formData.append('companyId', this.companyUI.companyId);
    formData.append('companyCode', this.companyUI.companyCode);

    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: 0,
        siteName: ''
      };
    }

    formData.append('siteCode', this.sitenameUI.siteCode);

    this.invoicerule.InvoiceRuleExport(formData).subscribe({
      next: res => {
        if (res.StatusCode == 200) {
          const data = res.Data;
          var base64 = data.file;
          this.downloadExcelFromBase64(base64, data.fileName);

          this.companyUI = {};
          this.sitenameUI = {};
        }

        this.isLoading = false;
      },
      error: error => {
        console.error('Error:', error);
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
      userId: String(this.userdetail.user_Id)
    };
    


    this.invoicerule.PostAddInvoiceRule(InvoiceRuleAdd).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;

        if (errormsg === 'false') {
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
  editClick(row: any) {
    this.isEditMode = true;
    this.isAddclicked = false;
    this.editRow = row;


    this.editInvoiceRuleId = row.invoicingRulesID;
    //console.log("Invoice Rule ID:", this.editInvoiceRuleId);

    this.companyUI = {
      companyId: row.companyId,
      companyCode: row.companyCode,
      companyName: row.companyName ?? ''
    };

    this.sitenameUI = {
      siteCode: row.siteId,
      siteName: row.siteName
    };

    // console.log("EDIT ROW:", row);

    const [fromMonth, toMonth] = row.leavePeriod.split('-');

    this.invoiceruleEditform.patchValue({
      company: this.editRow.companyCode,
      group: this.editRow.siteName,
      editbillingType: row.billingType,
      editdaysAsPerTimesheet: row.asPerTimesheet == 1 ? true : false,
      editdayspermonth: row.daysPerMonth,
      editweekendsrule: row.weekends,
      editholidaysrule: row.holidays,
      editcomppoffrule: row.compOff,
      editmaternityleave: row.maternity,
      editleavetypes: row.leavetypes,
      editleavecredit: row.leaveAddition,
      editleaverule: row.leaveRule,
      editpayperiodfrom: fromMonth.trim(),
      editpayperiodto: toMonth.trim(),
      editcarryforward: row.carryfarward,
      editnoofcarryforwards: row.noOfCarryForwards,
      editotrule: row.ot,
      editgratuity: row.gratuity,
      editreimbursement: row.reimbursement,
      editservicefeeonexpenses: row.serviceFee,
      editrebates: row.rebates,
      editdiscounts: row.discounts,
      editbillabledaysformula: row.billableDaysFormula
    });

    this.onMonthChangeedit(fromMonth);
  }


  onMonthChangeedit(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const fromMonth = selectElement.value;

    const fromMonthIndex = this.months.findIndex(month => month.text.toLowerCase() === fromMonth.toLowerCase());

    if (fromMonthIndex >= 0) {
      const toIndex = (fromMonthIndex + 11) % 12; // Ensures circular calculation
      const toMonthText = this.months[toIndex].text;

      this.invoiceruleEditform.get('editpayperiodto')?.setValue(toMonthText);  // Set value for "Pay Period To"
    } else {
      this.invoiceruleEditform.get('editpayperiodto')?.setValue('');  // Reset "Pay Period To" if no valid month selected
    }
  }


  SaveEditData() {
    // if (this.invoiceruleform.invalid) {
    //   this.invoiceruleform.markAllAsTouched();
    //   return;
    // // }
    // console.log("companyUI:", this.companyUI);
    // console.log("sitenameUI:", this.sitenameUI);
    const formValue = this.invoiceruleEditform.value;
    const invoiceRuleEdit = {
      InvoicingRulesID: String(this.editRow.invoicingRulesID),
      companyId: this.editRow.companyId,
      companyCode: this.editRow.companyCode,
      siteId: this.editRow.siteId,
      siteName: this.editRow.siteName,
      billingtype: formValue.editbillingType,
      daysAsPerTimesheet: formValue.editdaysAsPerTimesheet,
      dayspermonth: formValue.editdayspermonth ?? null,
      weekendsrule: formValue.editweekendsrule,
      holidaysrule: formValue.editholidaysrule,
      comppoffrule: formValue.editcomppoffrule,
      maternityleave: formValue.editmaternityleave,
      leavetypes: formValue.editleavetypes,
      leavecredit: formValue.editleavecredit,
      leaverule: formValue.editleaverule,
      payperiodfrom: formValue.editpayperiodfrom,
      payperiodto: formValue.editpayperiodto,
      carryforward: formValue.editcarryforward,
      noofcarryforwards: formValue.editnoofcarryforwards ?? null,
      otrule: formValue.editotrule,
      gratuity: formValue.editgratuity,
      reimbursement: formValue.editreimbursement,
      servicefeeonexpenses: formValue.editservicefeeonexpenses,
      rebates: formValue.editrebates,
      discounts: formValue.editdiscounts,
      billabledaysformula: formValue.editbillabledaysformula,
      userId: String(this.userdetail.user_Id)
    };

    //console.log("FORM VALUE:", JSON.stringify(invoiceRuleEdit));

    this.invoicerule.PostUpdateInvoiceRule(invoiceRuleEdit).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;
        //console.log('console', errormsg)
        if (errormsg.includes('false')) {
          this.isAddclicked = false;
          this.showPopup = true;
          this.closeEditclick();
          this.invoiceruleEditform.reset();
          this.companyUI = null;
          this.sitenameUI = null;
          this.searchClick();
          this.popupMessage = "Invoice Updated Successfully";
        } else {
          alert("Invoice Rule already available for this company");
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error("Error saving:", err);
        this.isLoading = false;
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
        this.excelPreviewData = top100;
        this.showPreviewModal = true;
        this.showSearchGrid = false;
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

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

     const fileName = `${templateId}.xlsx`;
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
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
          console.error(' Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }
}
