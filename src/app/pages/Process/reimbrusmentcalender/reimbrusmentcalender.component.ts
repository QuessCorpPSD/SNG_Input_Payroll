import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialog } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ReimbrusmentcalenderaddComponent } from '../reimbrusmentcalenderadd/reimbrusmentcalenderadd.component';

@Component({
  selector: 'app-reimbrusmentcalender',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, MatTooltipModule, CompanyallComponent,],
  templateUrl: './reimbrusmentcalender.component.html',
  styleUrl: './reimbrusmentcalender.component.css'
})
export class ReimbrusmentcalenderComponent {

  showTable = false;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, private dialog: MatDialog) {

  }

  uploadDisplayedColumns: string[] = [
    'slNo', 'companycode', 'companyname', 'carryforward', 'financialyearname', 'fromdate', 'todate',];

  // uploadFilteredColumns: string[] = [
  //   'Actionfilter', 'slNoFilter', 'companycodeFilter', 'employeecodeFilter', 'employeenameFilter', 'paysequenceFilter', 'payperiodFilter', 'paycodeFilter','paycategoryFilter'
  // ];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', companycode: '', employeecode: '', employeename: '', paysequence: '', payperiod: '', paycode: '', paycategory: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
  }

  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
  }

  applyFilter() {
    this.uploadedDataSource.filter = JSON.stringify({
      category: this.filterValues.category.trim().toLowerCase(),
      date: this.filterValues.date.trim().toLowerCase(),
      fromvalue: this.filterValues.fromvalue.trim().toLowerCase(),
      tovalue: this.filterValues.tovalue.trim().toLowerCase(),
      criteria: this.filterValues.criteria.trim().toLowerCase(),
      criterianame: this.filterValues.criterianame.trim().toLowerCase(),
    });

    if (this.uploadedDataSource.paginator) {
      this.uploadedDataSource.paginator.firstPage();
    }
  }

  onsearch() {
    this.showTable = true;
    this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
    this.uploadedDataSource.paginator = this.paginator;
  }

  AddReimbrusmentCalendar() {
    this.dialog.open(ReimbrusmentcalenderaddComponent, {
      width: '90%',
      height: '49vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }


}
