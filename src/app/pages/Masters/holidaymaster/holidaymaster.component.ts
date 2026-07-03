import { Component, Inject, InjectionToken, ViewChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CompanyComponent } from '../../../common/company/company.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IHolidayService } from '../../../Repository/Master/iholiday.service';
import { HolidayService } from '../../../Service/Master/holiday.service';
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
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';

const hoildayservice = InjectionToken<IHolidayService>;
type RawRow = Record<string, any>;

@Component({
  selector: 'holidaymaster',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule,
    CompanyallComponent, GroupnameComponent, MatPaginatorModule, MatTableModule, MatRadioModule,
    StateComponent, MatDialogModule, MatButtonModule, AlertpopupComponent, MatTooltipModule],
  templateUrl: './holidaymaster.component.html',
  styleUrl: './holidaymaster.component.css',
  providers: [
    { provide: hoildayservice, useClass: HolidayService },
  ]
})
export class HolidaymasterComponent {


  @ViewChild('popupTpl', { static: false }) popupTpl!: TemplateRef<any>;

  dialogRef!: MatDialogRef<any>;
  companyId: number = 0;
  siteId: number = 0;
  userdetail!: any;
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  holidaysearchdeails: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  holidayForm: FormGroup;
  calendartypeselected: string = '';
  selectedCompanyCode: string = '';
  selectedSiteName: string = '';
  selectedState: string = '';
  selectedFromdate: string | Date | null = null;
  selectedTodate: string | Date | null = null;
  selectedrowCompanyCode: string = '';
  selectedrowSiteName: string = '';
  selectedrowState: string = '';
  selectedrowFromdate: string | Date | null = null;
  selectedrowTodate: string | Date | null = null;
  templateresponse: any;
  isLoading: boolean = false;
  UploadedResponse: any;
  SaveResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  excelFile: File | null = null;
  isNew: boolean = true;

  calendartype = [
    { label: 'Normal Calendar' },
    { label: 'Financial Calendar' }
  ];

  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(hoildayservice) private holidayService: IHolidayService,
    private fb: FormBuilder, private dialog: MatDialog
  ) {
    this.holidayForm = this.fb.group({
      holidays: this.fb.array([this.createHolidayRow(false)]) // initially 1 editable row
    });
  }

  openHolidayPopup(tpl: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(tpl, {
      width: '90%',
      maxWidth: '1000px',
      autoFocus: false,
      disableClose: true   
    });
  }

  get holidays(): FormArray {
    return this.holidayForm.get('holidays') as FormArray;
  }

  isPlaceholder(v: any): boolean {
    return v === null || v === undefined || v === '' || v === 'dd-mm-yyyy';
  }

  isRowMeaningful(g: FormGroup): boolean {
    const date = g.get('date')?.value;
    const type = g.get('type')?.value;
    const desc = g.get('description')?.value;
    return !this.isPlaceholder(date) || !!type || !!desc;
  }

  isRowValid(g: FormGroup): boolean {
    return g.valid && !this.isPlaceholder(g.get('date')?.value);
  }

  createHolidayRow(isSaved: boolean): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      type: ['NH', Validators.required],
      description: ['', Validators.required],
      isSaved: [isSaved]
    });
  }
  addRow(index: number) {
    const currentRow = this.holidays.at(index);

    if (currentRow.invalid) {
      return; 
    }

    const newDate = currentRow.get('date')?.value;

   
    const duplicate = this.holidays.controls.some(
      (ctrl, i) => i !== index && ctrl.get('date')?.value === newDate
    );

    if (duplicate) {
      alert('Duplicate holiday date is not allowed');

     
      currentRow.patchValue({
        date: '',
        type: 'NH',
        description: ''
      });

      currentRow.markAsPristine();
      currentRow.markAsUntouched();
      return;
    }

    
    currentRow.patchValue({ isSaved: true }); 
    this.holidays.push(this.createHolidayRow(false));
  }

  deleteRow(index: number) {
    this.holidays.removeAt(index);
  }


  handleCompanyEvent(event) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }
  groupnameEvent(event) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }

  ngOnInit(): void {
    this.companyId = 0;
    this.siteId = 0;

    this.tableHeaders = ['CompanyCode', 'SiteName', 'State', 'FromDate', 'Todate'];
    this.dynamicColumns = [...this.tableHeaders];
    this.displayedColumns = [...this.dynamicColumns];
    this.dataSource = new MatTableDataSource<RawRow>([]);

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      userId: this.userdetail?.user_Id ?? 0,
      userName: this.userdetail?.userName ?? ''
    };
  }


  // Searchclick() {
  //   if (!this.companyId) {
  //     alert('Please select Company Code');
  //     this.isLoading = false;
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.holidayService.GetHolidayCompanywise(String(this.companyId), String(this.siteId)).subscribe({
  //     next: res => {
  //       this.holidaysearchdeails = res.Data;
  //       const table: RawRow[] = this.holidaysearchdeails?.data?.Table0 ?? [];
  //       if (table.length > 0) {
  //         this.tableHeaders = Object.keys(table[0]); // not table itself
  //         this.dynamicColumns = ['CompanyCode', 'SiteName', 'State', 'FromDate', 'Todate'];
  //         //this.dynamicColumns = [...this.tableHeaders];
  //         this.displayedColumns = [...this.dynamicColumns];
  //         // Update dynamic columns
  //         this.dataSource = new MatTableDataSource(table);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;

  //       }
  //     },
  //     error: err => {
  //       console.error('Error loading data', err);
  //     }
  //   });
  // }
  Searchclick() {
    if (!this.companyId) {
      alert('Please select Company Code');
      this.isLoading = false; 
      return;
    }

    this.isLoading = true;

    this.holidayService.GetHolidayCompanywise(
      String(this.companyId),
      String(this.siteId)
    ).subscribe({
      next: res => {
        this.isLoading = false;
        this.holidaysearchdeails = res.Data;
        const table: RawRow[] = this.holidaysearchdeails?.data?.Table0 ?? [];

        if (table.length > 0) {
         
          this.tableHeaders = Object.keys(table[0]);
          // this.dynamicColumns = ['CompanyCode', 'SiteName', 'State', 'FromDate', 'Todate'];
          // this.displayedColumns = [...this.dynamicColumns];
          this.dataSource = new MatTableDataSource<RawRow>(table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          alert('No data found');
          this.dataSource = new MatTableDataSource<RawRow>([]);
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('Error loading data', err);
      }
    });
  }

  stateEvent(event) {
    this.selectedState = event.state_Name;
  }

  onTopRowClick(row: any) {
    this.isNew = false;
    this.selectedrowCompanyCode = row.CompanyCode;
    this.selectedrowSiteName = row.SiteName;
    this.selectedrowState = row.State;
    this.selectedrowFromdate = this.parseDate(row.FromDate);
    this.selectedrowTodate = this.parseDate(row.Todate);

   
    const childRows = this.holidaysearchdeails?.data?.Table1
      ?.filter((c: any) =>
        c.CompanyCode == row.CompanyCode &&
        c.SiteName == row.SiteName &&
        c.State == row.State &&
        c.Fromdate == row.FromDate &&
        c.Todate == row.Todate
      ) ?? [];



    const toISODate = (d: string) =>
      d.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");

    this.holidays.clear();
    childRows.forEach((c: any) => {
      this.holidays.push(this.fb.group({
        date: [c.HolidayDate ? toISODate(c.HolidayDate) : '', Validators.required],
        type: [c.HolidayType, Validators.required],
        description: [c.HolidayDescription, Validators.required],
        isSaved: [true]
      }));
    });

    this.holidays.push(this.createHolidayRow(false));

    this.openHolidayPopup(this.popupTpl);
  }



  private dmyToISO(val: string | Date | null | undefined): string {
    if (!val) return '';
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    // supports "dd/MM/yyyy" or "dd-MM-yyyy"
    const parts = val.split(/[\/-]/);
    if (parts.length !== 3) return '';
    const [dd, mm, yyyy] = parts;
    return `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  onMainAddClick() {

    this.isNew = true;

    this.selectedrowCompanyCode = '';
    this.selectedrowSiteName = '';
    this.selectedrowState = '';
    this.selectedrowFromdate = '';
    this.selectedrowTodate = '';
    this.calendartypeselected = '';

   
    this.holidays.clear();
    this.holidays.push(this.createHolidayRow(false));
    this.openHolidayPopup(this.popupTpl);
  }

  DownloadTemplate() {
    this.holidayService.GetHolidayTemplate().subscribe({
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
              upperCasedItem[key.toUpperCase()] = item[key];
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
      Sheets: { 'HolidayMaster': worksheet },
      SheetNames: ['HolidayMaster']
    };

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

     var fileName;
     fileName = `Holiday_Master_Template.xlsx`;
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
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

    this.holidayService.UploadHolidayMaster(formData).subscribe({
      next: (res) => {
        this.UploadedResponse = res;
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        const successMsg = 'Holiday Master data uploaded successfully.';
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


        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {
          
          // alert('1')
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
          this.popupMessage = 'Import Failed.';
          return;
        }
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
        console.error(' Upload failed', err);
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
    return (d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day) ? d : null;
  }

  Saveclick() {
    this.isLoading = true;
    if (this.selectedCompanyCode == '') {
      alert('Please select Company Code');
      this.isLoading = false;
      return;
    }

    if (this.selectedSiteName == '') {
      alert('Please select Site Name');
      this.isLoading = false;
      return;
    }
    if (this.selectedState == '') {
      alert('Please select State');
      this.isLoading = false;
      return;
    }

    if (this.selectedFromdate == '' || this.selectedFromdate == null) {
      alert('Please select From date');
      this.isLoading = false;
      return;
    }

    if (this.selectedTodate == '' || this.selectedTodate == null) {
      alert('Please select To date');
      this.isLoading = false;
      return;
    }

    let hasValidRow = false;
    const seenDates = new Set<string>();

   
    for (let index = 0; index < this.holidays.length; index++) {
      const ctrl = this.holidays.at(index);
      const date = ctrl.get('date')?.value;

      const fromRaw = this.isNew ? this.selectedFromdate : this.selectedrowFromdate;
      const toRaw = this.isNew ? this.selectedTodate : this.selectedrowTodate;

      const fromDate = this.coerceDate(fromRaw);
      const toDate = this.coerceDate(toRaw);
      const date1 = this.coerceDate(ctrl.get('date')?.value);

      if (date1 != null) {
        if (!fromDate || !toDate || !date1) {
          alert('Please provide valid From/To dates and row date.');
          this.isLoading = false;
          return;
        }

        if (this.cmpDate(date1, fromDate) < 0 || this.cmpDate(date1, toDate) > 0) {
          alert(`Row ${index + 1} holiday date must be between FromDate and ToDate`);
          this.isLoading = false;
          return;
        }
      }

      if (ctrl.valid) {
        if (date && seenDates.has(date)) {
         
          ctrl.patchValue({
            date: '',
            type: 'NH',
            description: '',
            isSaved: false
          });
          ctrl.markAsPristine();
          ctrl.markAsUntouched();

          alert(`Duplicate holiday date removed in row ${index + 1}`);
          this.isLoading = false;
          return;
        } else {
          hasValidRow = true;
          if (date) {
            seenDates.add(date);
          }
        }
      }
    }

    if (!hasValidRow) {
      alert('Please add at least one valid holiday row');
      this.isLoading = false;
      return;
    }
    const commonData = {
      CompanyCode: this.selectedCompanyCode,
      SiteName: this.selectedSiteName,
      State: this.selectedState,
      Fromdate: formatDate(this.selectedFromdate, 'dd/MM/yyyy', 'en-US'),
      Todate: formatDate(this.selectedTodate, 'dd/MM/yyyy', 'en-US')
    };

    const holidaysPayload = this.holidays.value
      
      .filter((row: any) => row.date && row.type && row.description)
      .map((row: any, index: number) => ({
        SrNo: (index + 1).toString(),
        ...commonData,
        HolidayDate: formatDate(row.date, 'dd/MM/yyyy', 'en-US'),
        HolidayType: row.type,
        HolidayDescription: row.description
      }));

    const requestPayload = {
      Created_By: this.userdetail.user_Id,
      Mode: "Add", 
      holidaymaster: holidaysPayload
    };

    this.holidayService.SaveUpdateDeleteHolidayMaster(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        const successMsg = 'Holiday Master data Added successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = successMsg;
          this.companyId = 0;
          this.siteId = 0;
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.Searchclick();
          return;
        }

        
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
          XLSX.writeFile(workbook, 'ErrorMessages_HolidayMaster.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed.';
          return;
        }

       
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
  Updateclick() {
    this.isLoading = true;
    let hasValidRow = false;
    const seenDates = new Set<string>();

    
    for (let index = 0; index < this.holidays.length; index++) {
      const ctrl = this.holidays.at(index);
      const date = ctrl.get('date')?.value;

      const fromRaw = this.isNew ? this.selectedFromdate : this.selectedrowFromdate;
      const toRaw = this.isNew ? this.selectedTodate : this.selectedrowTodate;

      const fromDate = this.coerceDate(fromRaw);
      const toDate = this.coerceDate(toRaw);
      const date1 = this.coerceDate(ctrl.get('date')?.value);

      if (date1 != null) {

        if (!fromDate || !toDate || !date1) {
          alert('Please provide valid From/To dates and row date.');
          this.isLoading = false;
          return;
        }

        if (this.cmpDate(date1, fromDate) < 0 || this.cmpDate(date1, toDate) > 0) {
          alert(`Row ${index + 1} holiday date must be between FromDate and ToDate`);
          this.isLoading = false;
          return;
        }
      }

      if (ctrl.valid) {
        if (date && seenDates.has(date)) {
          
          ctrl.patchValue({
            date: '',
            type: 'NH',
            description: '',
            isSaved: false
          });
          ctrl.markAsPristine();
          ctrl.markAsUntouched();

          alert(`Duplicate holiday date removed in row ${index + 1}`);
          this.isLoading = false;
          return;
        } else {
          hasValidRow = true;
          if (date) {
            seenDates.add(date);
          }
        }
      }
    }

    if (!hasValidRow) {
      alert('Please add at least one valid holiday row');
      this.isLoading = false;
      return;
    }

    const commonData = {
      CompanyCode: this.selectedrowCompanyCode,
      SiteName: this.selectedrowSiteName,
      State: this.selectedrowState,
      Fromdate: formatDate(String(this.selectedrowFromdate), 'dd/MM/yyyy', 'en-US'),
      Todate: formatDate(String(this.selectedrowTodate), 'dd/MM/yyyy', 'en-US')
    };

    const holidaysPayload = this.holidays.value
      
      .filter((row: any) => row.date && row.type && row.description)
     
      .map((row: any, index: number) => ({
        SrNo: (index + 1).toString(),
        ...commonData,
        HolidayDate: formatDate(row.date, 'dd/MM/yyyy', 'en-US'),
        HolidayType: row.type,
        HolidayDescription: row.description
      }));

    const requestPayload = {
      Created_By: this.userdetail.user_Id,
      Mode: "Edit",  
      holidaymaster: holidaysPayload
    };

    this.holidayService.SaveUpdateDeleteHolidayMaster(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

       
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

       
        const successMsg = 'Holiday Master data Updated successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {
          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = successMsg;
          this.companyId = 0;
          this.siteId = 0;
          this.Searchclick();
          return;
        }

        
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
          XLSX.writeFile(workbook, 'ErrorMessages_HolidayMaster.xlsx');

          this.isLoading = false;
          this.showPopup = true;
          this.popupMessage = 'Failed.';
          return;
        }

        
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
  Deleteclick() {
    this.isLoading = true;

    const commonData = {
      CompanyCode: this.selectedrowCompanyCode,
      SiteName: this.selectedrowSiteName,
      State: this.selectedrowState,
      Fromdate: formatDate(String(this.selectedrowFromdate), 'dd/MM/yyyy', 'en-US'),
      Todate: formatDate(String(this.selectedrowTodate), 'dd/MM/yyyy', 'en-US')
    };

    const filledRows = this.holidays?.value
      ?.filter((row: any) => row.date && row.type && row.description) ?? [];

    let holidaysPayload: any[] = [];

  
    if (filledRows.length > 0) {
      holidaysPayload = filledRows.map((row: any, index: number) => ({
        SrNo: (index + 1).toString(),
        ...commonData,
        HolidayDate: formatDate(row.date, 'dd/MM/yyyy', 'en-US'),
        HolidayType: row.type,
        HolidayDescription: row.description
      }));
    } else {
     
      holidaysPayload = [{
        ...commonData,
        SrNo: "",
        HolidayDate: "",
        HolidayType: "",
        HolidayDescription: ""
      }];
    }

    const requestPayload = {
      Created_By: this.userdetail.user_Id,
      Mode: "Delete", 
      holidaymaster: holidaysPayload
    };


    this.holidayService.SaveUpdateDeleteHolidayMaster(requestPayload).subscribe({
      next: res => {
        this.SaveResponse = res;

      
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        
        const successMsg = 'Holiday Master data Deleted successfully.';
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
          this.companyId = 0;
          this.siteId = 0;
          this.Searchclick();
          return;
        }

        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to Delete.') {
        
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

    
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

   
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
      const [d, m, y] = s.split('/').map(Number);
      return new Date(y, m - 1, d);
    }

   
    const parsed = Date.parse(s);
    return isNaN(parsed) ? null : new Date(parsed);
  }

  cmpDate(a: Date, b: Date) {
   
    const key = (dt: Date) => dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
    return key(a) - key(b);
  }

  ExportClick(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);

   
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

    
    const link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + wbout;
    link.download = 'HolidayMaster.xlsx';
    link.click();
  }
}
