import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Payperiodclass } from '../../../Models/Common';
import { PaytransactionaddComponent } from '../paytransactionadd/paytransactionadd.component';

@Component({
  selector: 'app-reimbrusmentcalenderadd',
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
    FormsModule,
    CompanyallComponent
  ],
  templateUrl: './reimbrusmentcalenderadd.component.html',
  styleUrl: './reimbrusmentcalenderadd.component.css'
})
export class ReimbrusmentcalenderaddComponent {

  AddReimbrusmentCalendar!: FormGroup
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;

  constructor(private dialogRef: MatDialogRef<ReimbrusmentcalenderaddComponent>) { }

  dataSource = new MatTableDataSource<any>([]); // Empty data (no rows)
  ngOnInit(): void {
    this.AddReimbrusmentCalendar = new FormGroup({
      CompanyName: new FormControl(''),
    })
    this.AddReimbrusmentCalendar.get('CompanyName')?.disable();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }

  onClose() {
    this.dialogRef.close();
  }


}
