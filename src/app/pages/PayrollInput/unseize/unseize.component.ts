import { Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation, ViewChild, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { OnboardingStateService } from "../../../onboarding-state.service";
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { ITimesheetService } from "../../../Repository/itimesheet.service";
import { UnseizeGrid } from "../../../Models/UnseizeGrid";
import { SelectionModel } from "@angular/cdk/collections";
import { TimesheetComponent } from '../timesheet/timesheet.component';
import { TimesheetService } from '../../../Service/timesheet.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { finalize } from 'rxjs';
import { PayrollinputComponent } from "../payrollinput.component";

const timesheetservice = InjectionToken<ITimesheetService>;
export interface AttachmentItem {
  timesheet_Document_ID: string;
  employeeID: string;
  fileName: string;
  documentPath: string;
}

@Component({
  selector: 'unseize',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, AlertpopupComponent, PayrollinputComponent],
  templateUrl: './unseize.component.html',
  styleUrl: './unseize.component.css',
  providers: [
    { provide: timesheetservice, useClass: TimesheetService },
  ]
})

export class UnseizeComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  sitenameUI: any;
  citynameUI: any;
  selectedTemplate: string = '';
  selectedImport: string = '';
  companyCode: any;
  payPeriod: any;
  mapName: any;
  selectedPayPeriodFromApi?: PayPeriodComponent;
  isLoading = false;
  dataSource = new MatTableDataSource<UnseizeGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  excelFiledaily: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  payPeriodTypefromParent: string = '';
  payPeriodTypefromParentall: string = '';
  userdetail!: any;
  statusOptions = ['Assigned', 'UnAssigned', 'Saparated', 'Seized'];
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  showAttachmentPopup = false;
  isAttachmentsLoading = false;
  attachmentresponse: AttachmentItem[] = [];
  selectedAttachmentEmpCode: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(timesheetservice) private timesheetService: ITimesheetService,
    public stateService: OnboardingStateService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService
  ) { }

  displayedColumns: string[] = [
    'select', 'employeeID', 'axpertEmployeeId', 'firstName', 'dateOfJoining', 'resignationDate', 'attachment'];

  handleCompanyEvent(company: any) {

    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handleGroupNameEvent(siteName: any) {
    this.sitenameUI = siteName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handleCityEvent(cityName: any) {
    this.citynameUI = cityName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.sitenameUI) {
      alert("Select Group Name");
      return;
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
    this.citynameUI = {
      city_Name: '',
      city_Id: 0
    };

    this.payPeriodTypefromParent = "Current";

  }
  selection = new SelectionModel<UnseizeGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.employeeID === sel.employeeID)
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

  toggleRow(row: UnseizeGrid) {
    this.selection.toggle(row);
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.sitenameUI) {
      alert("Select Group Name");
      return;
    }

    if (!this.citynameUI) {
      this.citynameUI = {
        cityid: 0
      };
    }
    this.isLoading = true;
    this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payfrequencyid, this.sitenameUI.siteCode, this.citynameUI.city_Id)
  }

  BindDashBoard(companyCode: string, payPeriod: number, siteCode: string,
    city_Id: number) {
    this.timesheetService.GetUnseizeData(companyCode, payPeriod, siteCode,
      city_Id, this.userdetail.user_Id).subscribe({
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
  UnseizeClick(): void {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedEmpIds = filteredSelected.map(item => item.employeeID);
    this.offerIdJson = JSON.stringify(selectedEmpIds);
    if (this.offerIdJson.length > 0) {
      this.timesheetService.PostUnseize(this.offerIdJson, this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.sitenameUI.siteCode, this.userdetail.user_Id).subscribe({
        next: res => {
          const errormsg = res.Data[0].result?.toString();
          if (errormsg === 'Records UnSeized Successfully') {
            this.showPopup = true;
            this.popupMessage = "UnSeize Successful Submitted";
            this.popupSubMessage = "";
            this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payfrequencyid, this.sitenameUI.siteCode, this.citynameUI.city_Id)
            this.isLoading = false;
          }
          else {
            alert(errormsg);
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
      alert("Please select atleast one Record");
      this.isLoading = false;
      return;
    }
  }
  
  openAttachmentsPopup(employeeID: string): void {
    const companyCode = this.companyUI?.companyCode;
    const siteId = this.sitenameUI?.siteCode;
    const empCode = employeeID;
    const payPeriod = this.payperiodUI?.payPeriod;

    if (!companyCode || !siteId || !empCode || !payPeriod) return;

    this.selectedAttachmentEmpCode = empCode;
    this.showAttachmentPopup = true;
    this.isAttachmentsLoading = true;

    this.timesheetService
      .GetUnseizeAttachment(companyCode, siteId, empCode, payPeriod)
      .subscribe({
        next: res => {
          this.attachmentresponse = res?.Data ?? [];
          this.isAttachmentsLoading = false;
        },
        error: () => {
          this.isAttachmentsLoading = false;
          this.showAttachmentPopup = false;
        }
      });
  }
  closeAttachmentsPopup() {
    this.showAttachmentPopup = false;
    this.attachmentresponse = [];
    this.selectedAttachmentEmpCode = null;
  }
  extractName(path: string): string {
    return (path || '').split(/[\\/]/).pop() || '';
  }
  extractExt(path: string): string {
    const name = this.extractName(path);
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toUpperCase() : '';
  }
  downloadAttachment(filename: string, filpath: string) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('filePath', filpath);
    formData.append('fileName', filename);

    this.timesheetService.GetUnseizeFile(formData)
      .pipe(
        finalize(() => this.isLoading = false) 
      )
      .subscribe({
        next: res => {
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadFileFromBase64(base64, data.fileName);
          } 
          else {
            alert(res.Data[0].message);
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }
  
  downloadFileFromBase64(base64: string, filename: string) {
    // decode base64 to binary
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // create blob with generic MIME type
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    // create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // cleanup
    window.URL.revokeObjectURL(url);
  }

}
