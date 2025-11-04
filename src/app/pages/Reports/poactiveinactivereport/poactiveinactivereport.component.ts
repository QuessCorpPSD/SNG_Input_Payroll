import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IPOReportService } from '../../../Repository/Reports/Iporeports.service';
import { POReportService } from '../../../Service/Reports/POReports.service';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { POActiveInactiveGrid } from '../../../Models/POActiveInactiveGrid';
export const Report_TOKEN = new InjectionToken<IPOReportService>('Report_TOKEN');

@Component({
  selector: 'poactiveinactivereport',
  standalone: true,
  imports: [CommonModule, MatTableModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule, MatPaginator,
    MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule, CompanyallComponent, GroupnameComponent],
  templateUrl: './poactiveinactivereport.component.html',
  styleUrl: './poactiveinactivereport.component.css',
  providers: [{
    provide: Report_TOKEN,
    useClass: POReportService,
  }]
})
export class PoactiveinactivereportComponent {
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
  ddPOType: string = "REGULAR";
  ddActive: string = "1";
  ddYear: string = "0";
  YearName: any[] = [];
  ddVertical: string = "0";
  VerticalName: any;
  POActiveReport: any;

  dataSource = new MatTableDataSource<POActiveInactiveGrid>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'EMP_ID', 'CLIENT_EMP_ID', 'EMP_NAME', 'radarDOJ',
    'SITENAME', 'MonthlyRate', 'povalue'
  ];

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = company.companyId;

  }

  handleGroupNameEvent(sitename: any) {
    this.sitenameUI = sitename
    this.selectedGN = sitename.siteCode;
  }

  POTypeChange(potype: string) {
    this.BindVertical(potype);
  }

  constructor(@Inject(Report_TOKEN) private poreportService: IPOReportService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
  ) { }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }

    this.BindYearDD();

    if (this.ddPOType) {
      this.BindVertical(this.ddPOType);
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };
  }

  BindYearDD(): void {
    this.poreportService.GetPOYears().subscribe({
      next: res => {
        //console.log(res.Data);
        this.YearName = res.Data;
      },
      error: error => console.error('Error:', error)
    })
  }

  BindVertical(potype: string): void {
    this.poreportService.GetVerticals(this.userdetail.userId, potype).subscribe({
      next: res => {
        //console.log(res.Data);
        this.VerticalName = res.Data;
      },
      error: error => console.error('Error:', error)
    })
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
    this.isLoading = true;
    this.BindDashBoard()
  }

  ClearClick(): void {
    window.location.reload();
    // this.companyUI = {
    //   companyId: 0,
    //   companyCode: '',
    //   companyName: '',
    //   displayName: ''
    // };

    // this.sitenameUI = {
    //   siteCode: '0',
    //   siteName: ''
    // };

    // this.ddPOType = 'Regular',
    //   this.ddActive = 'Active',
    //   this.ddYear = '',
    //   this.ddVertical = ''

  }

  BindDashBoard() {
    const POActiveReportParams = {
      companyId: this.companyUI?.companyId,
      companyCode: this.companyUI?.companyCode,
      siteId: this.sitenameUI?.siteCode,
      isactive: this.ddActive,
      poType: this.ddPOType,
      poYear: this.ddYear,
      vertical: this.ddVertical,
      userId: this.userdetail.userId
    };
    this.poreportService.GetAllActiveInactivePO(POActiveReportParams).subscribe({
      next: res => {
        //console.log(res.Data);
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

  ExportClick() {
    this.isLoading=true;
    const POActiveReportParams = {
      companyId: this.companyUI?.companyId,
      companyCode: this.companyUI?.companyCode,
      siteId: this.sitenameUI?.siteCode,
      isactive: this.ddActive,
      poType: this.ddPOType,
      poYear: this.ddYear,
      vertical: this.ddVertical,
      userId: this.userdetail.userId
    };
    this.poreportService.GetAllActiveInactivePO(POActiveReportParams).subscribe({
      next: res => {
        //console.log(res.Data);
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        this.POActiveReport = res.Data;
        this.downloadExcel(this.POActiveReport, "PO_Employee_Active/Inactive_Report");
        this.isLoading = false;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
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

}
