import { Component, Inject, InjectionToken, ViewChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CompanyComponent } from '../../../common/company/company.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule, formatDate } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { StateComponent } from '../../../common/state/state.component';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ILeaveruleService } from '../../../Repository/Master/ileaverule.service';
import { LeaveruleService } from '../../../Service/Master/leaverule.service';

const leaveruleservice = InjectionToken<ILeaveruleService>;
type RawRow = Record<string, any>;

@Component({
  selector: 'leaverule',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule,
    CompanyallComponent, GroupnameComponent, MatPaginatorModule, MatTableModule, MatRadioModule,
    StateComponent, MatDialogModule, MatButtonModule, AlertpopupComponent, MatTooltipModule],
  templateUrl: './leaverule.component.html',
  styleUrl: './leaverule.component.css',
  providers: [
    { provide: leaveruleservice, useClass: LeaveruleService }
  ]
})

export class LeaveruleComponent {

  @ViewChild('popupTpl', { static: false }) popupTpl!: TemplateRef<any>;
  showTable: boolean = false;

  dialogRef!: MatDialogRef<any>;
  companyId: number = 0;
  siteId: string = '0';
  state: string = '0';
  companyIdpopup: number = 0;
  siteIdpopup: string = '0';
  statepopup: string = 'All';
  userdetail!: any;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  leaverulesearchdeails: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  leaveruleForm: FormGroup;
  calendartypeselected: string = '';
  selectedCompanyCode: string = '';
  selectedSiteName: string = '';
  selectedState: string = '';
  selectedFromdate: string | Date | null = null;
  selectedTodate: string | Date | null = null;
  selectedEffectiveDate: string | Date | null = null;
  selectedrowCompanyCode: string = '';
  selectedrowSiteName: string = '';
  selectedrowState: string = '';
  selectedrowFromdate: string = '';
  selectedrowTodate: string = '';
  seletecdrowCompanyId: string = '';
  selectedrowSiteId: string = '';
  templateresponse: any;
  isLoading: boolean = false;
  UploadedResponse: any;
  SaveResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  excelFile: File | null = null;
  isNew: boolean = true;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  fromMonthOptions: string[] = this.months.slice();
  toMonthOptions: string[] = this.months.slice();
  leavetypedetails: any;
  selectedleavetypes: string = '';
  decimalPattern = /^(?:\d+|\d+\.\d{1,2})$/;

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
    @Inject(leaveruleservice) private leaveruleService: ILeaveruleService,
    private fb: FormBuilder, private dialog: MatDialog
  ) {
    this.leaveruleForm = this.fb.group({
      leaverules: this.fb.array([this.createLeaveruleRow(false)]) // initially 1 editable row
    });
  }

  openLeaverulePopup(tpl: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tpl, {
      width: '90%',
      maxWidth: '1000px',
      autoFocus: false,
      disableClose: true   // optional
    });
  }

  get leaverules(): FormArray {
    return this.leaveruleForm.get('leaverules') as FormArray;
  }

  isPlaceholder(v: any): boolean {
    return v === null || v === undefined || v === '' || v === 'dd-mm-yyyy';
  }

  isRowMeaningful(g: FormGroup): boolean {
    // consider the row only if user started filling it
    const date = g.get('date')?.value;
    const type = g.get('type')?.value;
    const desc = g.get('description')?.value;
    return !this.isPlaceholder(date) || !!type || !!desc;
  }

  isRowValid(g: FormGroup): boolean {
    // your normal row validity (all required fields present)
    return g.valid && !this.isPlaceholder(g.get('date')?.value);
  }

  createLeaveruleRow(isSaved: boolean): FormGroup {
    const g = this.fb.group({
      leavetype: ['', Validators.required],
      credit: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      invoiceLeaveDetails: ['', [Validators.required, Validators.pattern(this.decimalPattern)]],
      carryForward: ['0', [this.selectRequired()]],  // ⬅️ '0' is invalid
      maxDays: ['', [Validators.pattern(this.decimalPattern)]], // becomes required when carryForward = '1'
      encashment: ['0', [this.selectRequired()]],    // ⬅️ '0' is invalid
      isSaved: [isSaved]
    });

    // When carryForward = Yes ('1'), maxDays becomes required
    g.get('carryForward')!.valueChanges.subscribe(val => {
      const maxCtrl = g.get('maxDays')!;
      if (val === '1') {
        maxCtrl.setValidators([Validators.required, Validators.pattern(this.decimalPattern)]);
      } else {
        maxCtrl.setValidators([Validators.pattern(this.decimalPattern)]);
        maxCtrl.setValue('');
      }
      maxCtrl.updateValueAndValidity({ emitEvent: false });
    });

    return g;
  }


  addRow(index: number) {
    const currentRow = this.leaverules.at(index) as FormGroup;

    if (currentRow.invalid) {
      currentRow.markAllAsTouched();
      return;
    }

    // prevent duplicate LeaveType among saved rows
    const newType = (currentRow.get('leavetype')?.value ?? '').toString().trim();
    if (newType) {
      const duplicate = this.leaverules.controls.some((ctrl, i) =>
        i !== index &&
        (ctrl.get('isSaved')?.value === true) &&
        ((ctrl.get('leavetype')?.value ?? '').toString().trim() === newType)
      );
      if (duplicate) {
        alert('Duplicate Leave Type is not allowed.');
        this.resetLeaveRuleRow(currentRow);
        return;
      }
    }

    currentRow.patchValue({ isSaved: true });
    this.leaverules.push(this.createLeaveruleRow(false));
  }

  resetLeaveRuleRow(g: FormGroup) {
    g.reset({
      leavetype: '',
      credit: '',
      invoiceLeaveDetails: '',
      carryForward: '0',
      maxDays: '',
      encashment: '0',
      isSaved: false
    });
    g.markAsPristine();
    g.markAsUntouched();
    g.updateValueAndValidity({ emitEvent: false });
  }

  deleteRow(index: number) {
    if (this.leaverules.length === 1) {
      (this.leaverules.at(0) as FormGroup).reset({
        leavetype: '',
        credit: '',
        invoiceLeaveDetails: '',
        carryForward: '0',
        maxDays: '',
        encashment: '0',
        isSaved: false
      });
      return;
    }
    this.leaverules.removeAt(index);
  }



  handleCompanyEvent(event) {
    this.companyId = event.companyId;
  }
  groupnameEvent(event) {
    this.siteId = event.siteCode;
  }

  handleCompanyEventpopup(event) {
    this.companyIdpopup = event.companyId;
    this.selectedCompanyCode = event.displayName;
    this.GetLeavetypeDetails(this.companyIdpopup);
  }
  groupnameEventpopup(event) {
    this.siteIdpopup = event.siteCode;
    this.selectedSiteName = event.siteName;
  }

  ngOnInit(): void {
    this.companyId = 0;
    this.siteId = '0';
    this.state = '0';

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

  }

  headerMap: { [key: string]: string } = {
    company_name: 'Company Name',
    state: 'State',
    Group_name: 'Group Name',
    EffectiveDate: 'Effective Date'
  };

  Searchclick() {
    this.leaveruleService.GetLeaveRuleCompanywise(String(this.companyId), String(this.siteId), String(this.state)).subscribe({
      next: res => {
        this.leaverulesearchdeails = res.Data;
        const table: RawRow[] = this.leaverulesearchdeails?.data?.Table0 ?? [];
        if (table.length > 0) {
          this.tableHeaders = Object.keys(table[0]); // not table itself
          //this.dynamicColumns = ['Company_ID', 'company_name', 'state', 'Group_name', 'GroupDetail_Id','EffectiveDate'];
          this.dynamicColumns = ['company_name', 'state', 'Group_name', 'EffectiveDate'];
          //this.dynamicColumns = [...this.tableHeaders];
          this.displayedColumns = [...this.dynamicColumns];
          this.showTable = true;
          // Update dynamic columns
          this.dataSource = new MatTableDataSource(table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }
      },
      error: err => {
        console.error('Error loading data', err);
      }
    });
  }

  stateEvent(event) {
    this.state = event.state_Name;
  }

  stateEventpopup(event) {
    this.statepopup = event.state_Name;
  }

  onTopRowClick(row: any) {
    this.isNew = false;

    // Display labels from Table0 row (fallbacks included)
    this.seletecdrowCompanyId = row.company_ID ?? row.Company_ID ?? '';
    this.selectedrowCompanyCode = row.company_name ?? row.Company_Name ?? row.CompanyCode ?? '';
    this.selectedrowSiteId = row.GroupDetail_Id ?? row.groupDetail_Id ?? '';
    this.selectedrowSiteName = row.Group_name ?? row.SiteName ?? '';
    this.selectedrowState = row.state ?? row.State ?? '';

    // Filter Table1 children by IDs and State
    const childRows = this.leaverulesearchdeails?.data?.Table1?.filter((c: any) =>
      c.Company_ID == row.Company_ID &&
      c.GroupDetail_Id == row.GroupDetail_Id &&
      (c.State ?? '').toString().trim() === (row.State ?? row.state ?? '').toString().trim()
    ) ?? [];

    this.GetLeavetypeDetails(this.seletecdrowCompanyId, () => {
      this.bindLeaveRows(childRows, row.EffectiveDate);
      this.openLeaverulePopup(this.popupTpl);
    });

  }

  bindLeaveRows(childRows: any[], EffectiveDate: any) {

    // ==== Distinct From / To months & Effective Date ====
    const fromSet = new Set<string>();
    const toSet = new Set<string>();
    const effSet = new Set<string>(); // ISO yyyy-MM-dd

    childRows.forEach((c: any) => {
      const fm = c.Start_Month;
      const tm = c.End_Month;
      if (this.isValidMonthShort(fm)) fromSet.add(fm);
      if (this.isValidMonthShort(tm)) toSet.add(tm);

      const iso = this.parseDdmmyyyyToIso(c.EffectiveDate);
      if (iso) effSet.add(iso);
    });

    // Build option arrays (sorted by calendar order)
    const byMonthOrder = (a: string, b: string) => this.months.indexOf(a) - this.months.indexOf(b);
    this.fromMonthOptions = fromSet.size ? Array.from(fromSet).sort(byMonthOrder) : this.months.slice();
    this.toMonthOptions = toSet.size ? Array.from(toSet).sort(byMonthOrder) : this.months.slice();

    // Choose current selections (first available or null)
    this.selectedFromdate = this.fromMonthOptions.length ? this.fromMonthOptions[0] : null;
    this.selectedTodate = this.toMonthOptions.length ? this.toMonthOptions[0] : null;

    if (effSet.size) {
      const sortedEff = Array.from(effSet).sort(); // ISO sorts chronologically
      this.selectedEffectiveDate = sortedEff[0];
    } else {
      // fallback: try EffectiveDate on the top row if present and dd/MM/yyyy
      const topIso = this.parseDdmmyyyyToIso(EffectiveDate);
      this.selectedEffectiveDate = topIso ?? null;
    }

    // ==== Load leave-rule rows from Table1 ====
    this.leaverules.clear();
    childRows.forEach((c: any) => {
      const g = this.createLeaveruleRow(true);
      g.patchValue({
        leavetype: this.canonLeaveType(c.leavetype),               // STRING
        credit: (c.Leavedetails ?? '').toString(),
        invoiceLeaveDetails: (c.Invoice_leavedetails ?? '').toString(),
        carryForward: (c.Carryforward ?? '0').toString(),
        maxDays: (c.MaxDays ?? '').toString(),
        encashment: (c.Encashment ?? '0').toString(),
        isSaved: true
      });
      g.get('carryForward')?.updateValueAndValidity({ emitEvent: true });
      this.leaverules.push(g);
    });

    // fresh editable row
    this.leaverules.push(this.createLeaveruleRow(false));
  }

  canonLeaveType(v: any): string {
    const s = (v ?? '').toString().trim();
    if (!s) return '';
    const arr = this.leavetypedetails ?? [];
    const found = arr.find((lt: any) =>
      (lt?.leavetype ?? '').toString().trim().toLowerCase() === s.toLowerCase()
    );
    if (found) return found.leavetype;   // use the exact option string

    // If not found, add it so the select can show it
    this.leavetypedetails = [...arr, { leavetype: s }];
    return s;
  }

  parseDdmmyyyyToIso(s: string | null | undefined): string | null {
    if (!s) return null;
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.trim());
    if (!m) return null;
    const [, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`; // ISO yyyy-MM-dd
  }

  isValidMonthShort(m: any): m is string {
    return typeof m === 'string' && this.months.includes(m);
  }

  onMainAddClick() {
    this.isNew = true;

    this.selectedrowCompanyCode = '';
    this.selectedrowSiteName = '';
    this.selectedrowState = '';
    this.selectedrowFromdate = '';
    this.selectedrowTodate = '';
    this.calendartypeselected = '';

    this.leaverules.clear();
    this.leaverules.push(this.createLeaveruleRow(false));

    this.openLeaverulePopup(this.popupTpl);
  }


  DownloadTemplate() {
    this.leaveruleService.GetLeaveRuleTemplate().subscribe({
      next: res => {
        this.templateresponse = res.Data?.data?.Table0;
        if (!this.templateresponse || !Array.isArray(this.templateresponse)) {
          console.warn('No data defined for selected template.');
          return;
        }

        const dataToExport = this.templateresponse.map((item: any) => {
          const upperCasedItem: any = {};
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              upperCasedItem[key] = item[key];
            }
          }
          return upperCasedItem;
        });

        this.downloadExcel(dataToExport);
      },
      error: err => {
        console.error('Error loading data', err);
      }
    });

  }

  downloadExcel(data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'LeaveRule': worksheet },
      SheetNames: ['LeaveRule']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    var fileName;
    fileName = `LeaveRule_Template.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileChange(event: Event): void {
    this.isLoading = true;

    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('User', this.userdetail.user_Id);

    this.leaveruleService.UploadLeaveRule(formData).subscribe({
      next: (res) => {
        this.UploadedResponse = res;

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Leave Rule data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.popupMessage = successMsg;
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          // Optional debug
          // alert('1');

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
            errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item?.MESSAGE || item?.Message || item?.message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_Leaverule.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Import Failed.';
          return;
        }

        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Message) ? parsed.Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Upload failed', err);
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Upload failed.';
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
  toDateInput(ddmmyyyy: string | null | undefined): string | null {
    if (!ddmmyyyy) return null;
    const parts = ddmmyyyy.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    // allow dd/MM/yyyy or dd-MM-yyyy
    const parts = dateStr.includes('/') ? dateStr.split('/') : dateStr.split('-');
    if (parts.length !== 3) return null;

    const [ddStr, mmStr, yyyyStr] = parts;
    const day = Number(ddStr);
    const month = Number(mmStr);
    const year = Number(yyyyStr);

    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return null;

    const d = new Date(year, month - 1, day);
    // validate (handles invalid like 31/02/2025)
    return (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) ? d : null;
  }

  Saveclick() {
    this.isLoading = true;

    // ---- Top-level requireds (same as Holiday) ----
    if (!this.selectedCompanyCode) {
      alert('Please select Company Code');
      this.isLoading = false; return;
    }
    if (!this.selectedSiteName) {
      alert('Please select Site Name');
      this.isLoading = false; return;
    }
    if (!this.statepopup) {
      this.statepopup = "All";
    }
    if (!this.selectedFromdate) {
      alert('Please select From Month');
      this.isLoading = false; return;
    }
    if (!this.selectedTodate) {
      alert('Please select To Month');
      this.isLoading = false; return;
    }

    if (!this.selectedEffectiveDate) {
      alert('Please select Effective Date');
      this.isLoading = false; return;
    }

    // Helpers
    const toNumberOrNull = (x: any) => {
      const n = Number((x ?? '').toString().trim());
      return Number.isFinite(n) ? n : null;
    };
    const to01 = (v: any) => (v === '1' || v === 1 || v === true ? '1' : '0');

    let hasValidRow = false;
    const seenLeaveTypes = new Set<string>();

    // ---- Row-level validation (use for loop) ----
    for (let index = 0; index < this.leaverules.length; index++) {
      const ctrl = this.leaverules.at(index);
      const v = ctrl.value ?? {};

      const leavetype = (v.leavetype ?? '').toString().trim();
      const credit = toNumberOrNull(v.credit);
      const invoiceLeaveDetails = (v.invoiceLeaveDetails ?? '').toString().trim();
      const carryForward = to01(v.carryForward);
      const maxDays = toNumberOrNull(v.maxDays);
      const encashment = to01(v.encashment);

      // Require at least a leave type to consider row
      if (!leavetype) continue;

      // Duplicate leave types not allowed
      if (seenLeaveTypes.has(leavetype)) {
        // Clear the dup row and stop
        ctrl.patchValue({
          leavetype: '0',
          credit: '',
          invoiceLeaveDetails: '',
          carryForward: '0',
          maxDays: '',
          encashment: '0',
          isSaved: false
        });
        ctrl.markAsPristine();
        ctrl.markAsUntouched();
        alert(`Duplicate Leave Type removed in row ${index + 1}`);
        this.isLoading = false;
        return;
      } else {
        hasValidRow = true;
        seenLeaveTypes.add(leavetype);
      }

      // Rule: if carry forward is ON, maxDays must be > 0
      if (carryForward === '1' && !(maxDays !== null && maxDays > 0)) {
        alert(`For "${leavetype}", Max Days is required when Carry Forward is enabled.`);
        this.isLoading = false;
        return;
      }


    }

    if (!hasValidRow) {
      alert('Please add at least one valid leave rules row');
      this.isLoading = false;
      return;
    }

    const commonData = {
      Company_ID: String(this.companyIdpopup),
      Company_Name: this.selectedCompanyCode,
      State: this.statepopup,
      Group_name: this.selectedSiteName,
      GroupDetail_Id: String(this.siteIdpopup),
      EffectiveDate: formatDate(this.selectedEffectiveDate, 'yyyy-MM-dd', 'en-US'),
      Start_Month: this.selectedFromdate,
      End_Month: this.selectedTodate
    };

    // ---- Build payload (keep API field casing) ----
    const normalizedRows = (this.leaverules.controls as any[]).map((fg, i) => {
      const v = fg.value ?? {};
      const leavetype = (v.leavetype ?? '').toString().trim();
      return {
        idx: i,
        leavetype: leavetype, // you already canonicalized while patching with this.canonLeaveType(...)
        Invoice_leavedetails: toNumberOrNull(v.invoiceLeaveDetails) !== null ? String(toNumberOrNull(v.invoiceLeaveDetails)) : '',
        Leavedetails: toNumberOrNull(v.credit) !== null ? String(toNumberOrNull(v.credit)) : '',
        Carryforward: to01(v.carryForward),
        MaxDays: toNumberOrNull(v.maxDays) !== null ? String(toNumberOrNull(v.maxDays)) : '',
        Encashment: to01(v.encashment)
      };
    });

    const leaverulePayload = normalizedRows
      .filter(r => r.leavetype) // only rows with a type
      .map((r, i) => ({
        SrNo: String(i + 1),
        ...commonData,
        leavetype: r.leavetype,
        Leavedetails: r.Leavedetails,
        Invoice_leavedetails: r.Invoice_leavedetails,
        Carryforward: r.Carryforward,
        MaxDays: r.MaxDays,
        Encashment: r.Encashment
      }));

    const requestPayload = {
      Created_By: String(this.userdetail.user_Id),
      Mode: 'Add', // or 'UPDATE'
      leaverulemaster: leaverulePayload
    };



    this.leaveruleService.SaveUpdateDeleteLeaveRule(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

        // --- parse defensively (reuse your existing helper if available) ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // Adjust this success string to match what your API returns
        const successMsg = 'Leave Rules data Added successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = successMsg;
          this.companyIdpopup = 0;
          this.selectedCompanyCode = '';
          this.statepopup = '';
          this.selectedSiteName = '';
          this.siteIdpopup = '0';
          this.selectedEffectiveDate = null;
          this.selectedFromdate = '';
          this.selectedTodate = '';
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.Searchclick(); // refresh
          return;
        }

        // Plain "Failed to save." case (same as Holiday)
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to Add.') {
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
            errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item?.MESSAGE || item?.Message || item?.message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_LeaveRule.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed.';
          return;
        }

        // Fallback
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Message) ? parsed.Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error:', err);
        this.isLoading = false;
      }
    });
  }

  Updateclick() {

    this.isLoading = true;


    // Helpers
    const toNumberOrNull = (x: any) => {
      const n = Number((x ?? '').toString().trim());
      return Number.isFinite(n) ? n : null;
    };
    const to01 = (v: any): string =>
      (v === 1 || v === '1') ? '1' :
        (v === 2 || v === '2') ? '2' :
          '0';

    let hasValidRow = false;
    const seenLeaveTypes = new Set<string>();

    // ---- Row-level validation (use for loop) ----
    for (let index = 0; index < this.leaverules.length; index++) {
      const ctrl = this.leaverules.at(index);
      const v = ctrl.value ?? {};

      const leavetype = (v.leavetype ?? '').toString().trim();
      const credit = toNumberOrNull(v.credit);
      const invoiceLeaveDetails = (v.invoiceLeaveDetails ?? '').toString().trim();
      const carryForward = to01(v.carryForward);
      const maxDays = toNumberOrNull(v.maxDays);
      const encashment = to01(v.encashment);

      // Require at least a leave type to consider row
      if (!leavetype) continue;

      // Duplicate leave types not allowed
      if (seenLeaveTypes.has(leavetype)) {
        // Clear the dup row and stop
        ctrl.patchValue({
          leavetype: '0',
          credit: '',
          invoiceLeaveDetails: '',
          carryForward: '0',
          maxDays: '',
          encashment: '0',
          isSaved: false
        });
        ctrl.markAsPristine();
        ctrl.markAsUntouched();
        alert(`Duplicate Leave Type removed in row ${index + 1}`);
        this.isLoading = false;
        return;
      } else {
        hasValidRow = true;
        seenLeaveTypes.add(leavetype);
      }

      // Rule: if carry forward is ON, maxDays must be > 0
      if (carryForward === '1' && !(maxDays !== null && maxDays > 0)) {
        alert(`For "${leavetype}", Max Days is required when Carry Forward is enabled.`);
        this.isLoading = false;
        return;
      }


    }

    if (!hasValidRow) {
      alert('Please add at least one valid leave rules row');
      this.isLoading = false;
      return;
    }

    const commonData = {
      Company_ID: String(this.seletecdrowCompanyId),
      Company_Name: this.selectedrowCompanyCode,
      State: this.selectedrowState,
      Group_name: this.selectedrowSiteName,
      GroupDetail_Id: String(this.selectedrowSiteId),
      EffectiveDate: formatDate(String(this.selectedEffectiveDate), 'yyyy-MM-dd', 'en-US'),
      Start_Month: this.selectedFromdate,
      End_Month: this.selectedTodate
    };

    // ---- Build payload (keep API field casing) ----
    const normalizedRows = (this.leaverules.controls as any[]).map((fg, i) => {
      const v = fg.value ?? {};
      const leavetype = (v.leavetype ?? '').toString().trim();
      return {
        idx: i,
        leavetype: leavetype, // you already canonicalized while patching with this.canonLeaveType(...)
        Invoice_leavedetails: toNumberOrNull(v.invoiceLeaveDetails) !== null ? String(toNumberOrNull(v.invoiceLeaveDetails)) : '',
        Leavedetails: toNumberOrNull(v.credit) !== null ? String(toNumberOrNull(v.credit)) : '',
        Carryforward: to01(v.carryForward),
        MaxDays: toNumberOrNull(v.maxDays) !== null ? String(toNumberOrNull(v.maxDays)) : '',
        Encashment: to01(v.encashment)
      };
    });

    const leaverulePayload = normalizedRows
      .filter(r => r.leavetype) // only rows with a type
      .map((r, i) => ({
        SrNo: String(i + 1),
        ...commonData,
        leavetype: r.leavetype,
        Leavedetails: r.Leavedetails,
        Invoice_leavedetails: r.Invoice_leavedetails,
        Carryforward: r.Carryforward,
        MaxDays: r.MaxDays,
        Encashment: r.Encashment
      }));

    const requestPayload = {
      Created_By: this.userdetail.user_Id,
      Mode: 'Edit', // or 'UPDATE'
      leaverulemaster: leaverulePayload
    };



    this.leaveruleService.SaveUpdateDeleteLeaveRule(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

        // --- parse defensively (reuse your existing helper if available) ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // Adjust this success string to match what your API returns
        const successMsg = 'Leave Rules data Updated successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = successMsg;
          this.seletecdrowCompanyId = '0';
          this.selectedrowCompanyCode = '';
          this.selectedrowState = '';
          this.selectedrowSiteName = '';
          this.selectedrowSiteId = '0',
            this.selectedEffectiveDate = null;
          this.selectedFromdate = '';
          this.selectedTodate = '';
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.Searchclick(); // refresh
          return;
        }

        // Plain "Failed to save." case (same as Holiday)
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to Edit.') {
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
            errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item?.MESSAGE || item?.Message || item?.message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_LeaveRule.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed.';
          return;
        }

        // Fallback
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Message) ? parsed.Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }
        this.isLoading = false;
      },
      error: err => {
        console.error('Error:', err);
        this.isLoading = false;
      }
    });
  }
  Deleteclick() {
    this.isLoading = true;

    const commonData = {
      Company_ID: String(this.seletecdrowCompanyId),
      Company_Name: this.selectedrowCompanyCode,
      State: this.selectedrowState,
      Group_name: this.selectedrowSiteName,
      GroupDetail_Id: String(this.selectedrowSiteId),
      EffectiveDate: formatDate(String(this.selectedEffectiveDate), 'yyyy-MM-dd', 'en-US'),
      Start_Month: this.selectedFromdate,
      End_Month: this.selectedTodate
    };


    let leaverulePayload: any[] = [];

    leaverulePayload = [{
      SrNo: "",
      ...commonData,
      leavetype: "",
      Leavedetails: "",
      Invoice_leavedetails: "",
      Carryforward: "",
      MaxDays: "",
      Encashment: ""
    }];


    const requestPayload = {
      Created_By: this.userdetail.user_Id,
      Mode: 'Delete',  // or Delete.
      leaverulemaster: leaverulePayload
    };

    // console.log('requestPayload', JSON.stringify(requestPayload));

    this.leaveruleService.SaveUpdateDeleteLeaveRule(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Leave Rules data Deleted successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = successMsg;
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.seletecdrowCompanyId = '0';
          this.selectedrowCompanyCode = '';
          this.selectedrowState = '';
          this.selectedrowSiteName = '';
          this.selectedrowSiteId = '0',
            this.selectedEffectiveDate = null;
          this.selectedFromdate = '';
          this.selectedTodate = '';
          this.Searchclick();
          return;
        }

        // CASE 2: Plain failure string
        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to Delete.') {
          // Optional debug
          // alert('1');

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
            errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            MESSAGE: item?.MESSAGE || item?.Message || item?.message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_HolidayMaster.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed.';
          return;
        }

        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Message) ? parsed.Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }
        this.isLoading = false;
      },
      error: err => console.error("Error:", err)
    });
  }

  coerceDate(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), val.getDate());

    const s = String(val).trim();

    // YYYY-MM-DD (from <input type="date">)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    // DD/MM/YYYY (your edit-mode labels / saved strings)
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
      const [d, m, y] = s.split('/').map(Number);
      return new Date(y, m - 1, d);
    }

    // Fallback (rarely used)
    const parsed = Date.parse(s);
    return isNaN(parsed) ? null : new Date(parsed);
  }

  cmpDate(a: Date, b: Date) {
    // normalize to YYYYMMDD number for robust comparisons
    const key = (dt: Date) => dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
    return key(a) - key(b);
  }
  onMonthChange(event: any) {
    // Browser gives value in YYYY-MM format
    this.selectedFromdate = event.target.value; // e.g. "2025-09"
  }

  GetLeavetypeDetails(CompanyId: any, done?: () => void): void {

    this.leaveruleService.GetLeaveType(CompanyId).subscribe({
      next: (res: any) => {
        this.leavetypedetails = (res?.Data ?? [])
          .map((r: any) => ({ leavetype: (r.leavetype ?? r.LeaveType ?? '').toString().trim() }))
          .filter((x: any) => !!x.leavetype);
        done?.();
      },
      error: err => {
        console.error('Error loading questions', err);
      }
    });
  }

  onDecimalInput(ev: Event, ctrl?: AbstractControl | null) {
    const el = ev.target as HTMLInputElement;
    const cleaned = el.value
      .replace(/[^\d.]/g, '')        // keep digits + dot
      .replace(/(\..*?)\./g, '$1');  // only one dot

    if (cleaned !== el.value) {
      const pos = el.selectionStart ?? cleaned.length;
      el.value = cleaned;
      // write back to the control (very important)
      ctrl?.setValue(cleaned, { emitEvent: true }); // triggers validation
      // keep caret position
      setTimeout(() => el.setSelectionRange(pos, pos));
    } else {
      // still make sure control has latest value
      ctrl?.setValue(cleaned, { emitEvent: true });
    }
  }

  selectRequired(): ValidatorFn {
    return (ctrl: AbstractControl): ValidationErrors | null => {
      const v = ctrl.value;
      // treat '', null, undefined, and '0' (Select) as invalid
      return (v === null || v === undefined || v === '' || v === '0')
        ? { required: true }
        : null;
    };
  }

  ExportClick(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);

    // Create a workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Generate a binary string
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

    // Create a download link
    const link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + wbout;
    link.download = 'LeaveRules.xlsx';
    link.click();
  }

}
