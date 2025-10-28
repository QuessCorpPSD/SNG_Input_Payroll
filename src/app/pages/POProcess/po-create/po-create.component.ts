import { AfterViewInit, ViewChild, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from '../../../common/company/company.component';
import { PotypeComponent } from '../../../common/potype/potype.component';
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddPOComponent } from '../add-po/add-po.component';
import { BulkUploadComponent } from '../bulk-upload/bulk-upload.component';
import { IsActiveComponent } from '../../../common/is-active/is-active.component';
import { ExtensionComponent } from '../extension/extension.component';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CommonModule } from '@angular/common';
import { Company } from '../../../Models/Common';
import { PoRespository } from '../../../Service/PoRespository';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Console } from 'console';

@Component({
  selector: 'app-po-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    AlertpopupComponent,
    CommonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CompanyComponent,
    PotypeComponent,
    PonumbersearchComponent,
    IsActiveComponent,
    MatTableModule,
    MatPaginatorModule

  ],
  templateUrl: './po-create.component.html',
  styleUrls: ['./po-create.component.css']
})
export class PoCreateComponent {

  comapnyId: number = 0;
  PONumbber: string = '';
  ponumber: any;
  PricingType: any;
  IActive: any; 
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(PotypeComponent) potypeComponent!: PotypeComponent;
  selectedCompanyCode: any;
  selectedPONumbber: any;
  userdetail: any;
  @ViewChild(MatPaginator) paginator0!: MatPaginator;
  @ViewChild(MatSort) sort0!: MatSort;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;
  tableHeaders1: string[] = [];
  dynamicColumns1: string[] = [];
  displayedColumns1: any[] = [];
  dataSource1 = new MatTableDataSource<any>();
  tableHeaders2: string[] = [];
  dynamicColumns2: string[] = [];
  displayedColumns2: any[] = [];
  dataSource2 = new MatTableDataSource<any>();
  selectedPONumber: any;
    showPaginator = false;


  constructor(private dialog: MatDialog, private poRespository: PoRespository, private _sessionStoreage: SessionStorageService, private decry: EncryptionService) { }

  // ngAfterViewInit() {
  //   // Delay to ensure potypeComponent is ready before accessing
  //   setTimeout(() => {
  //     const defaultCompany = this.potypeComponent?.ponumber.find(x => x.displayName === 'Regular');
  //     if (defaultCompany) {
  //       this.potypeComponent.myControl.setValue(defaultCompany);
  //       this.PricingType = defaultCompany;
  //     }
  //   });
  // }
  potypeEvent(event) {
    this.PricingType = event.company_Id;
    console.log(this.PricingType);
    // this.PricingType = this.PricingType;
  }

  handleCompanyEvent(event: any) {
    console.log(event);
    this.comapnyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;

  }
  getReadableColumnName(column: string): string {
    return column ? column.replace(/_/g, ' ') : column;
  }
  columnMap1: { [key: string]: string } = {
    'PO TOTAL': 'Total PO Value :',
    'TOTALTAGGEDVALUE': 'PO Tagged Value :',
    'PO Balance': 'PO Balance :',
    'UTILIZED AMOUNT': 'PO Utilized :'
  };
  MainPOSearch() {
    const companyidstr = this.comapnyId === 0 ? '""' : this.comapnyId;
    
    const pricingtypestr = this.PricingType === '' ? '""' : this.PricingType;
    const ponumberstr = this.ponumber === '' ? '""' : this.ponumber;
    // const ponumberstr1 = ponumberstr.replace('/', '_');

    console.log("API Params =>", companyidstr, pricingtypestr, ponumberstr);

    if (companyidstr === 0) {
      alert('Please select a valid Company');
      return;
    }
    if (!pricingtypestr) {
      alert('Please select a Pricing Type');
      return;
    }
    if (!ponumberstr) {
      alert('Please enter a PO Number');
      return;
    }

    this.poRespository
      .Mainposearch(
        String(companyidstr), String(pricingtypestr), String(ponumberstr)
      )
      .subscribe({
        next: (res) => {
          const table0 = res?.Data?.data?.Table0 ?? [];
          const table1 = res?.Data?.data?.Table1 ?? [];
          const table2 = res?.Data?.data?.Table2 ?? [];

          console.log('Table0:', table0);
          console.log('Table1:', table1);
          console.log('Table2:', table2);

          if (table0.length > 0 || table1.length > 0 || table2.length > 0) {

            // Table0 processing
            if (table0.length > 0) {
              this.tableHeaders = Object.keys(table0[0]);
              this.dynamicColumns = Object.keys(table0[0]);
              this.displayedColumns = [...this.dynamicColumns];
              this.dataSource = new MatTableDataSource(table0);
              this.dataSource.paginator = this.paginator0;  // make sure paginator0 defined
              this.dataSource.sort = this.sort0;            // make sure sort0 defined
            } else {
              this.dataSource.data = [];
            }

            // Table1 processing
            if (table1.length > 0) {
              this.tableHeaders1 = Object.keys(table1[0]);
              this.dynamicColumns1 = ['PO TOTAL', 'TOTALTAGGEDVALUE', 'PO Balance', 'UTILIZED AMOUNT'];
              this.displayedColumns1 = [...this.dynamicColumns1];
              this.dataSource1 = new MatTableDataSource(table1);
              this.dataSource1.paginator = this.paginator1; // make sure paginator1 defined
              this.dataSource1.sort = this.sort1;           // make sure sort1 defined
            } else {
              this.dataSource1.data = [];
            }


            if (table2.length > 0) {
              this.tableHeaders2 = Object.keys(table2[0]);
              this.dynamicColumns2 = Object.keys(table2[0]);
              this.displayedColumns2 = [...this.dynamicColumns2];
              console.log('Table2 Columns:', this.displayedColumns2);

              this.dataSource2 = new MatTableDataSource(table2);
              this.dataSource2.paginator = this.paginator2; // make sure paginator2 defined
              this.dataSource2.sort = this.sort2;           // make sure sort2 defined
              console.log('Table2 dataSource:', this.dataSource2);
              console.log('Full API Response:', res);
              console.log('Table2:', res?.Data?.data?.Table2);

            } else {
              this.dataSource2.data = [];
            }

            // Optionally set flag to show tables in template
            // this.hasSearchResults = true;
          } else {
            this.dataSource.data = [];
            this.dataSource1.data = [];
            this.dataSource2.data = [];
            // this.hasSearchResults = false;
            alert('No data found');
          }
        },
        error: (err) => {
          console.error('Error loading PO Form', err);
          alert('Failed to load PO Table');
        }
      });
  }
  ExtensionPO() {
    this.dialog.open(ExtensionComponent, {
      width: '90%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  AddPOOpen() {
    this.dialog.open(AddPOComponent, {
      width: '90%',
      height: '90vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }

  // BulkUpload() {
  //   this.dialog.open(BulkUploadComponent, {
  //     width: '90%',
  //     height: '90vh',
  //     disableClose: true,
  //     data: { example: 'Hello from parent!' }
  //   });
  // }

  handleponumbersearchEvent(event: any) {
    this.ponumber = event.ponumber;
    console.log(this.ponumber);
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    }

  }

  DownloadTemplate() {
    const userId = this.userdetail?.userId;
    if (!userId) {
      alert('User ID not available');
      return;
    }
    this.poRespository.GetPOCreateDownloadTemplate(userId).subscribe({
      next: res => {
        const data = res?.data?.data?.Table0 ?? [];
        if (!data.length) {
          alert('No template data available.');
          return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook: XLSX.WorkBook = {
          Sheets: { 'BULKPO': worksheet },
          SheetNames: ['BULKPO']
        };

        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, `MAINPO_Template_${Date.now()}.xlsx`);
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
    formData.append('CreatedBy', this.userdetail.userId);

    this.poRespository.BulkPOUpload(formData).subscribe({
      next: (res) => {

        if (res?.Data?.response?.includes("Row(s) Uploaded Successfully.")) {
          this.showPopup = true;

          this.popupMessage = res?.Data?.response;
          this.isLoading = false;
          return;
        }

        // --- parse response defensively ---
        const { parsed, msg } = this.tryParseResponse(res?.Data?.response);

        // CASE 1: Success message inside parsed JSON array/object
        const successMsg = 'Row(s) Uploaded Successfully.';
        const successMatch =
          (Array.isArray(parsed) && parsed[0]?.Error_Message?.trim() === successMsg) ||
          (parsed && typeof parsed === 'object' && parsed?.Error_Message?.trim() === successMsg);

        if (res?.StatusCode === 200 && successMatch) {

          this.showPopup = true;

          this.popupMessage = successMsg;
          this.isLoading = false;
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
            errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
          }

          const exportData = errorArray.map((item: any) => ({
            Error_Message: item?.Error_Message || item?.Error_Message || item?.Error_Message || ''
          }));

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
          const workbook: XLSX.WorkBook = {
            Sheets: { ErrorMessages: worksheet },
            SheetNames: ['ErrorMessages']
          };
          XLSX.writeFile(workbook, 'ErrorMessages_MAINPO.xlsx');

          this.showPopup = true;
          this.popupMessage = 'Import Failed.';
          this.isLoading = false;
          return;
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



}
