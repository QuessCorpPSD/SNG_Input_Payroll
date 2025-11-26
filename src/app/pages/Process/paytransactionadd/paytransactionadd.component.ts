import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortHeader, MatSort } from "@angular/material/sort";
import { Payperiodclass } from '../../../Models/Common';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";

@Component({
  selector: 'app-paytransactionadd',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatSort,
    FormsModule,
    CompanyallComponent
],
  templateUrl: './paytransactionadd.component.html',
  styleUrl: './paytransactionadd.component.css'
})
export class PaytransactionaddComponent {

  AddPayTransactionForm!: FormGroup
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;

  constructor(private dialogRef: MatDialogRef<PaytransactionaddComponent>) { }

  dataSource = new MatTableDataSource<any>([]); // Empty data (no rows)
  ngOnInit(): void {
    this.AddPayTransactionForm = new FormGroup({
      PayPeriod: new FormControl(''),
    })
    this.AddPayTransactionForm.get('PayPeriod')?.disable();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }


  onClose() {
    this.dialogRef.close();
  }

}
