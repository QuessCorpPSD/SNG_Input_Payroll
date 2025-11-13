import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';

@Component({
  selector: 'app-salaryadvacerequest-add',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './salaryadvacerequest-add.component.html',
  styleUrl: './salaryadvacerequest-add.component.css'
})
export class SalaryadvacerequestAddComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;

  constructor(private dialogRef: MatDialogRef<SalaryadvacerequestAddComponent>) { }

  onClose(): void {
    this.dialogRef.close();
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
  }

    ngOnInit(): void {
    this.payPeriodType = "All";

  }


}
