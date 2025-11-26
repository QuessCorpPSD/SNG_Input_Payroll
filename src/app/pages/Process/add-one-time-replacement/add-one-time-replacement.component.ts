import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-add-one-time-replacement',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule,
    MatCardModule,
    CompanyallComponent,
  ],
  templateUrl: './add-one-time-replacement.component.html',
  styleUrls: ['./add-one-time-replacement.component.css']
})
export class AddOneTimeReplacementComponent implements AfterViewInit {

  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCompanyCode: any;
  payperiods: String = '';
  selectedcompanycode: any;
  uploadedData: any[] = [];
  showTable: boolean = false;
  payPeriodId: number = 0;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<AddOneTimeReplacementComponent>,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isUploadGridVisible = false;

  uploadDisplayedColumns: string[] = [
    'SNo',
    'Pay Code',
    'Amount',
    'Mode Of Entry',
    'Type',
    'Arrear Pay Sequence Number',
    'Arrear Pay Period',
    'Pay_Type'
  ];

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.uploadedDataSource.sort = this.sort;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }

    const userInfo = {
      userId: this.userdetail.user_Id,
      userName: this.userdetail.userName,
    };

    this.payPeriodType = "All";
  }

  onClose(): void {
    this.dialogRef.close();
  }

 
  OnAddRow(): void {
    if (!this.selectedCompanyCode) {
      setTimeout(() => alert('Please select Company Code before adding a new row'), 0);
      return;
    }

    const newRow = {
      SNo: this.uploadedData.length + 1,
      PayCode: '',
      Amount: '',
      ModeOfEntry: '',
      Type: '',
      ArrearPaySequenceNumber: '',
      ArrearPayPeriod: '',
      Pay_Type: ''
    };

    this.uploadedData.push(newRow);
    this.uploadedDataSource.data = [...this.uploadedData];

    setTimeout(() => {
      this.uploadedDataSource.paginator = this.paginator;
      this.uploadedDataSource.sort = this.sort;

      alert('Row added successfully');
    });
  }



  OnDeleteRow(index: number): void {
    if (this.uploadedData.length === 0) {
      setTimeout(() => alert('No rows to delete'), 0);
      return;
    }

    this.uploadedData.splice(index, 1);

    this.uploadedData = this.uploadedData.map((item, i) => ({
      ...item,
      SNo: i + 1
    }));

    this.uploadedDataSource.data = [...this.uploadedData];

    setTimeout(() => {
      this.uploadedDataSource.paginator = this.paginator;
      this.uploadedDataSource.sort = this.sort;

      alert('Row deleted successfully');
    });
  }

}
