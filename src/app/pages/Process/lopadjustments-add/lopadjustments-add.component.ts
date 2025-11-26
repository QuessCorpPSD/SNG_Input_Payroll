import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-lopadjustments-add',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, MatCardModule, CommonModule, FormsModule, ReactiveFormsModule, CompanyallComponent, PayPeriodComponent, MatTooltipModule],
  templateUrl: './lopadjustments-add.component.html',
  styleUrl: './lopadjustments-add.component.css'
})
export class LOPAdjustmentsAddComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  selectedCompanyCode: any;
  index: number = 0;
  constructor(private dialogRef: MatDialogRef<LOPAdjustmentsAddComponent>, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService, private snackBar: MatSnackBar) { }

  onClose(): void {
    this.dialogRef.close();
  }

  isUploadGridVisible = false;

  uploadDisplayedColumns: string[] = ['SNo', 'Employee Code', 'LOP/LOPR Month', 'LOP', 'LOP Restoration', 'Attn LOP', 'Month Days', 'Work Days', 'Attendance Work Days'];
  uploadedData: any[] = []; // your uploaded Excel data

  uploadedDataSource = new MatTableDataSource(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  onsearch() {
    this.isUploadGridVisible = true;
    this.uploadedDataSource = new MatTableDataSource(this.uploadedData);
    this.uploadedDataSource.paginator = this.paginator;


  }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

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
    this.payPeriodType = "All";
  }



  onAddRow(): void {
    if (!this.selectedCompanyCode || !this.payperiodId) {
      this.snackBar.open('⚠️ Please select both Company Code and Pay Period before adding a row.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const newRow = {
      SNo: this.uploadedData.length + 1,
      'Employee Code': '',
      'LOP/LOPR Month': '',
      'LOP': '',
      'LOP Restoration': '',
      'Attn LOP': '',
      'Month Days': '',
      'Work Days': '',
      'Attendance Work Days': ''
    };

    this.uploadedData.push(newRow);
    this.uploadedDataSource.data = [...this.uploadedData];

    this.snackBar.open('✅ Row added successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  onDeleteRow(index: number): void {
    if (index < 0 || index >= this.uploadedData.length) {
      this.snackBar.open('❌ Invalid row index. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    if (confirm('Are you sure you want to delete this row?')) {
      this.uploadedData.splice(index, 1);
      // Reindex serial numbers (SNo)
      this.uploadedData.forEach((row, i) => (row.SNo = i + 1));
      this.uploadedDataSource.data = [...this.uploadedData];

      this.snackBar.open('✅ Row deleted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}
