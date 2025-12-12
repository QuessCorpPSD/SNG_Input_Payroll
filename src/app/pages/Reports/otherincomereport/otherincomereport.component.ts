import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { IPobalancereport } from '../../../Repository/Reports/IPobalance.service';
import { PobalancereportService } from '../../../Service/Reports/pobalancereport.service';
import { Pay_TOKEN } from '../payregisterentitywise/payregisterentitywise.component';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import * as XLSX from 'xlsx';
import { IOtherIncomeReport } from '../../../Repository/Reports/IOtherIncomeReport.service';
import { OtherincomereportService } from '../../../Service/Reports/otherincomereport.service';

@Component({
  selector: 'app-otherincomereport',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CommonModule, FormsModule, CompanyallComponent, AlertpopupComponent, PayPeriodComponent],
  templateUrl: './otherincomereport.component.html',
  styleUrl: './otherincomereport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: OtherincomereportService,
    }
  ]
})
export class OtherincomereportComponent {

  isLoading = false;
  selectedCompanyId!: number;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopupalert = false;
  InputNo: any;
  payperiodId: any;
  PayPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedPayPeriod: any;
  getInputNo: any;

  constructor(@Inject(Pay_TOKEN) private service: IOtherIncomeReport,) { }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopupalert = true;
  }

  closePoopup() {
    this.showPopupalert = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.payperiodId;
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPayPeriod = payperiod.payPeriod;
    this.payperiodId = payperiod.payfrequencyid;
    console.log(this.payperiodId)
    this.bindGetInputNo();
  }

  inputNoList: any[] = [];

  bindGetInputNo() {
    const CompanyId = this.selectedCompanyId;
    const payPeriodId = this.payperiodId;
    this.service.getInputNo(CompanyId, payPeriodId).subscribe({
      next: res => { this.getInputNo = res.Data.data.Table0 }
    })
  }

  ngOnInit(): void {
    this.payPeriodType = "All";
  }

  exportToExcel(): void {

    if (!this.selectedCompanyId) {
      alert("Please select Company");
      return;
    }

    if (!this.selectedPayPeriod) {
      alert("Please select Pay Period");
      return;
    }

    if (!this.InputNo) {
      alert("Please select Input Number");
      return;
    }

    this.isLoading = true;
    const payCode = 0;

    this.service.Exporttoexcel(this.selectedCompanyId, this.payperiodId, payCode, this.InputNo).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.Data?.statusCode === 400) {
          alert(res.Data.message || "No records found.");
          return;
        }

        const jsonData = res.Data?.data?.Table0;
        const msg = res.Data?.message;

        if (!jsonData || jsonData.length === 0) {
          alert("No records available for export.");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "OtherIncomeReport");

        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `OtherIncomeReport_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);

        this.showAlertPopup(msg || "Export successful!");
      },

      error: (err) => {
        console.error("Error loading data for export", err);
        this.isLoading = false;
      }
    });
  }

}
