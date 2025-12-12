import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { IincreamentReport } from '../../../Repository/Reports/IincreamnetReport';
import { IncreamentReportService } from '../../../Service/Reports/increament-report.service';
export const Pay_TOKEN = new InjectionToken<IincreamentReport>('Pay_TOKEN');

@Component({
  selector: 'app-increment-report',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, MatCardModule, FormsModule, CompanyallComponent, PayPeriodComponent],
  templateUrl: './increment-report.component.html',
  styleUrl: './increment-report.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: IncreamentReportService,
    }
  ]
})
export class IncrementReportComponent {
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
  EmployeeList: any[] = [];
  employeeCode: string = "";
  constructor(@Inject(Pay_TOKEN) private service: IncreamentReportService, private dialog: MatDialog,
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService,) { }

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

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyId;
    console.log(this.selectedCompanyCode);
    this.BindEmployeeCode();

  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payPeriodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log('payPeriodId', this.payPeriodId)
    console.log('payperiods', this.payperiods)
  }
  BindEmployeeCode() {
    const payload = { CompanyId: this.selectedCompanyId?.toString() };

    this.service.GetEmployeesByCompanyId(payload).subscribe({
      next: (res: any) => {
        this.EmployeeList = res.Data.data.Table0;
        console.log("Employee List:", this.EmployeeList);
      }
    });
  }
  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.payPeriodId) {
      alert("Please select Pay Period");
      return;
    }

    const employeeId = this.employeeCode || 0;
    const payload = {
      companyId: this.selectedCompanyId,
      payPeriodId: this.payPeriodId,
      employeeId: employeeId
    };
    console.log("Payload", payload);
    this.service.Exporttoexcel(this.selectedCompanyId, this.payPeriodId, employeeId).subscribe({
      next: (res: any) => {
        try {
          const jsonData = res?.Data?.data?.Table0 ?? [];
          const message = res?.Data?.message;

          if (jsonData.length === 0) {
            alert(message);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, "IncrementReport");

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `IncrementReport_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);

        } catch (err) {
          console.error("Export error:", err);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
