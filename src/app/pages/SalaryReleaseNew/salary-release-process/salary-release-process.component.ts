import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ReleaseGrid } from '../../../Models/SalaryRelease/Release';
import { ReleaseImportGrid } from '../../../Models/SalaryRelease/ReleaseImportGrid';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { Common_TOKEN } from '../hold-request/hold-request.component';

import { CommonService } from '../../../Service/CommonService';
import { COMM_TOKEN } from '../../PayrollInput/onboarding/onboarding.component';

@Component({
  selector: 'app-salary-release-process',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, PayrollinputComponent
  ],
  templateUrl: './salary-release-process.component.html',
  styleUrl: './salary-release-process.component.css',

})

export class SalaryReleaseProcessComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  showSearchGrid: boolean = true;

  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  BatchType: any;
  user_Id: any;

  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  srpBatchList: any[] = [];
  SelectedBatch: any = "";

  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'EmployeeCode', 'EmployeeName',
    'BatchId', 'InvoiceNo', 'NetPay', 'BankName', 'NeftBankName'

  ];



  @ViewChild(MatPaginator) holdpaginator!: MatPaginator;



  constructor(
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,

    private dialog: MatDialog
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
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

    this.payPeriodTypefromParent = "All";

  }
  selection = new SelectionModel<any>(true, []);



  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

  }

  search() {
    this.istablevisible = true;
    this.dataSource.data = [];

  }


}
