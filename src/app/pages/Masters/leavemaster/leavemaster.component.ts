import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { CommonModule } from '@angular/common';
export const LM_TOKEN = new InjectionToken<ILeaveMasterService>('LM_TOKEN');
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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ILeaveMasterService } from '../../../Repository/Master/ILeaveMasterService';
import { LeaveMasterService } from '../../../Service/Master/LeaveMasterService';
import { LeaveMasterGrid, LeavetypeDD } from '../../../Models/LeaveMaster';

@Component({
  selector: 'leavemaster',
  standalone: true,
  imports: [GroupnameComponent, CommonModule, MatPaginator, MatTableModule,
    MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckbox, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, CompanyallComponent, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './leavemaster.component.html',
  styleUrl: './leavemaster.component.css',
  providers: [{
    provide: LM_TOKEN,
    useClass: LeaveMasterService
  }]
})
export class LeavemasterComponent {
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
  leavetypedd?: LeavetypeDD | any;

  dataSource = new MatTableDataSource<LeaveMasterGrid>([]);
  leaveaMasterform!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'company_Code', 'siteName', 'leaveType', 'delete'
  ];

  constructor(@Inject(LM_TOKEN) private leavemaster: ILeaveMasterService, private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, private fb: FormBuilder
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    this.selectedCC = company.companyId;
    //console.log(this.selectedCC);

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

  selection = new SelectionModel<LeaveMasterGrid>(true, []);
  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.leavemasterid === sel.leavemasterid)
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

  toggleRow(row: LeaveMasterGrid) {
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
    this.GetLeaveTypeDD();    //load Leavetype by default
    this.leaveaMasterform = this.fb.group({
      company: [null],
      group: [null],
      leavetype: ['', Validators.required]
    });
    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: 0,
        siteName: ''
      }
    }
  }
  BindDashBoard(companyId: number, siteId: string) {
    this.leavemaster.GetAllLeaveMaster(companyId, siteId).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        //console.log(res.Data);
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

  GetLeaveTypeDD() {
    this.leavemaster.GetLeaveTypeDD().subscribe({
      next: res => {
        this.leavetypedd = res.Data;
      },
      error: err => {
        console.error('Error loading options', err);
      }
    });
  }
  deleteClick(leavemasterid: number) {
    //console.log(leavemasterid);
    if (confirm("Are you sure you want to delete this?")) {
      this.leavemaster.PostDeleteLeave(leavemasterid).subscribe({
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
    this.isAddclicked = false;
  }
  ExportClick() {
    this.isLoading = true;
    this.LeaveMasterExport();
  }

  LeaveMasterExport() {
    if (!this.companyUI) {
      this.companyUI = {
        companyId: 0,
        companyCode: ''
      }
    }
    if (!this.sitenameUI) {
      this.sitenameUI = {
        siteCode: 0,
        siteName: ''
      }
    }
    this.leavemaster.LeaveMasterExport(this.companyUI.companyId, this.sitenameUI.siteCode).subscribe({
      next: res => {
        //console.log(res);
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
  SaveData() {
    if (this.leaveaMasterform.invalid) {
      this.leaveaMasterform.markAllAsTouched();
      return;
    }
    const formValue = this.leaveaMasterform.value;
    const leaveMasterAdd = {
      "leavemasteradd": {
        companyId: this.companyUI?.companyId,
        companyCode: this.companyUI?.companyCode,
        siteId: this.sitenameUI?.siteCode,
        siteName: this.sitenameUI?.siteName,
        leavetype: formValue.leavetype,
        userId: this.userdetail.user_Id
      }
    };
    console.log(JSON.stringify(leaveMasterAdd));
    this.leavemaster.PostAddLeaveMaster(leaveMasterAdd).subscribe({
      next: (res) => {
        const errormsg = res.Data[0].msg;

        if (errormsg === 'false') {
          this.isAddclicked = false;
          this.showPopup = true;
          this.popupMessage = "Leave Master Added Successfully";
          this.BindDashBoard(this.companyUI.companyId, this.sitenameUI.siteCode)
        }
        else {
          alert("Leave Master already availabe for this company");
          this.leaveaMasterform.reset({
            leavetype: '',
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }
}
