import { ChangeDetectorRef, Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog'; // needed in standalone or if dialog is used

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CompanyComponent } from '../../../common/company/company.component';
import { PotypeComponent } from '../../../common/potype/potype.component';
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';
import { AddEpoComponent } from '../add-epo/add-epo.component';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EPoRespository } from '../../../Service/EPORepository';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CommonModule } from '@angular/common';
import { POStatusComponent } from '../../../common/postatus/postatus.component';
import { IPORespository } from '../../../Repository/IPORepository';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PoRespository } from '../../../Service/PoRespository';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

type RawRow = Record<string, any>;

interface ViewRow1 {
  EMployeeListID: number;
  EmployeeListSubID: number;
  PO_ID: number;
  "COMPANY CODE": string;
  "SITE NAME": string;
  "EMPLOYEE ID": string;
  "EMPLOYEE NAME": string;
  Employee_Code: string;
  DOJ: string;
  FixedRate: string;
  "PO START DATE": string;
  "PO END DATE": string;
  StatusID: number;
  EmployeePOAttachment: string;
  STATUS_NAME: string;
  PricingType: string;
  IsActive: number;
  PoNumber: string;
  ItemType: string;
  IS_POEXT: string;
  RevExt: string;
  companyId?: number;
}

@Component({
  selector: 'app-employee-po',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyComponent,
    PonumbersearchComponent,
    AlertpopupComponent,
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    POStatusComponent,
    PotypeComponent
  ],
  templateUrl: './employee-po.component.html',
  styleUrls: ['./employee-po.component.css'],
})
export class EmployeePOComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  comapnyId: number = 0;
  ponumber: string = '';
  statusId: number = 0;
  userdetail: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  EmployeePOsearchdeails: any;
  clientEmployeeId: string = '';
  dataSource = new MatTableDataSource<ViewRow1>([]);
  filteredRows: ViewRow1[] = [];
  PricingType: string = '';
  selectedOption: any;

  constructor(private dialog: MatDialog, private epoRespository: EPoRespository,
    private _sessionStoreage: SessionStorageService, private decry: EncryptionService,
    private poService: PoRespository, private cd: ChangeDetectorRef) { }

  AddPOOpen(rowData?: any) {
    console.log("PO popup opened with data:", rowData);
    this.dialog.open(AddEpoComponent, {
      width: '90%',
      height: '90vh',
      disableClose: true,
      data: {
        row: rowData
      },
    });
  }

  handleCompanyEvent(event: any) {
    this.comapnyId = event.companyId;
  }
  handleponumbersearchEvent(event: any) {
    this.selectedOption = event.ponumber;
    console.log(this.selectedOption);
  }
  PostatusEvent(event) {
    this.statusId = event.statuS_ID;
    console.log("PO Status:", this.statusId);
  }
  potypeEvent(event) {
    this.PricingType = event.company_Id;
    // this.PricingType = this.PricingType;
  }
  IsActiveEvent(event: any) { }
  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      console.log(this.userdetail.user_Id);
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName
    }

  }


  DownloadTemplate() {
    const userId = this.userdetail.user_Id;
    if (!userId) {
      alert('User ID not available');
      return;
    }
    this.epoRespository.GetEPODownloadTemplate(userId).subscribe({
      next: res => {
        const data = res?.Data?.data?.Table0 ?? [];
        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'EmployeePO': worksheet },
          SheetNames: ['EmployeePO']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `EmployeePO_Template_${Date.now()}.xlsx`);
      },
      error: err => {
        console.error('Error downloading template', err);
        alert('Failed to download template');
      }
    });
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
    formData.append('flag', 'Upload')
    // Use same key casing as other upload components and ensure string value
    const createdByVal = (this.userdetail && (this.userdetail.user_Id || this.userdetail.userId)) ? String(this.userdetail.user_Id || this.userdetail.userId) : '';
    formData.append('createdBy', createdByVal);
    console.log(formData);
    this.epoRespository.BulkPOUpload(formData).subscribe({
      next: (res) => {

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.showPopup = true;

          this.popupMessage = res?.Data?.response;
          this.isLoading = false;
          return;
        }
        console.log('Test success');
        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);
        console.log('Parsed Response:', parsed, 'Message:', msg);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'EmployeePO data uploaded successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Message?.trim() === successMsg);

        if (res?.StatusCode=== 200 && successMatch) {

          this.showPopup = true;

          this.popupMessage = successMsg;
          this.isLoading = false;
          return;
        }


        if (res?.StatusCode === 200 && msg?.trim() === 'Failed to import.') {

          try {
            const rawErr = res?.Data?.errors?.[0];
            console.log('Raw Errors:', rawErr);
            let errorArray: any[] = [];

            // Deep parse: it's a stringified JSON array
            if (typeof rawErr === 'string') {
              errorArray = JSON.parse(rawErr);
            }

            console.log('Parsed Errors:', errorArray);

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || 'Unknown error'
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, 'ErrorMessages_EmployeePO.xlsx');

            this.showPopup = true;
            this.popupMessage = 'Import Failed.';
            this.isLoading = false;
            return;
          } catch (e) {
            console.error('❌ Failed to generate Excel:', e);
            alert('Could not download error file.');
            this.isLoading = false;
            return;
          }
        }



        // CASE 3: Anything else → show whatever we have
        const fallback =
          msg ||
          (Array.isArray(parsed) ? JSON.stringify(parsed) :
            (parsed && typeof parsed === 'object' && parsed.Error_Message) ? parsed.Error_Message :
              (parsed ? JSON.stringify(parsed) : ''));

        if (fallback) {
          alert(fallback);
        } else {
          alert('Error while processing response.');
        }

      },
      error: (err) => {
        console.error('❌ Upload failed', err);

        this.showPopup = true;
        this.popupMessage = 'Upload failed.';
      }
    });
    this.isLoading = false;
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

  Searchclick() {
    if (this.comapnyId == 0) {
      alert('Please select Company');
      return;
    }
    console.log(this.statusId);
    console.log(this.PricingType);

    const requestPayload = {
      companyId: this.comapnyId,
      poNumber: this.selectedOption || "",
      clientEmployeeId: this.clientEmployeeId || "",
      status: this.statusId.toString() || "",
      pricingType: this.PricingType.toString() || "",
    }

    console.log('Request Payload:', JSON.stringify(requestPayload));

    this.poService.GetEmployeePOSerach(requestPayload).subscribe({
      next: res => {
        this.EmployeePOsearchdeails = res.Data;
        if (this.EmployeePOsearchdeails.data.Table0.length === 0 && this.EmployeePOsearchdeails.data.Table1.length === 0 && this.EmployeePOsearchdeails.data.Table2.length === 0) {
          alert('No data available');
        }
        console.log('Result:', JSON.stringify(this.EmployeePOsearchdeails));
        const table: RawRow[] = this.EmployeePOsearchdeails?.data?.Table0 ?? [];
        const table1: RawRow[] = this.EmployeePOsearchdeails?.data?.Table1 ?? [];
        const table2: RawRow[] = this.EmployeePOsearchdeails?.data?.Table2 ?? [];
        if (table.length > 0) {
        }


        if (table1.length > 0) {

          this.filteredRows = table1.map((r: RawRow): ViewRow1 => {
            return {
              EMployeeListID: r['EMployeeListID'],
              EmployeeListSubID: r['EmployeeListSubID'],
              PO_ID: r['PO_ID'],
              "COMPANY CODE": r['COMPANY CODE'],
              "SITE NAME": r['SITE NAME'],
              "EMPLOYEE ID": r['EMPLOYEE ID'],
              "EMPLOYEE NAME": r['EMPLOYEE NAME'],
              Employee_Code: r['Employee_Code'],
              DOJ: r['DOJ'],
              FixedRate: r['FixedRate'],
              "PO START DATE": r['PO START DATE'],
              "PO END DATE": r['PO END DATE'],
              StatusID: r['StatusID'],
              EmployeePOAttachment: r['EmployeePOAttachment'],
              STATUS_NAME: r['STATUS_NAME'],
              PricingType: r['PricingType'],
              IsActive: r['IsActive'],
              PoNumber: r['PoNumber'],
              ItemType: r['ItemType'],
              IS_POEXT: r['IS_POEXT'],
              RevExt: r['RevExt'],
              companyId: r['COMPANY_ID']
            };
          });

          this.dataSource.data = this.filteredRows;
          this.cd.markForCheck();

        }
        if (table2.length > 0) {

        }
      },
      error: err => {
        console.error('Error loading data', err);
      }
    });

  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getBorderColor(statusId: number): string {
    switch (statusId) {
      case 0:
        return 'lightgray';
      case 2:
        return 'Black';
      case 3:
        return 'green';
      case 4:
        return 'red';
      case 5:
        return 'blue';
      default:
        return 'lightgray';
    }
  }


}
