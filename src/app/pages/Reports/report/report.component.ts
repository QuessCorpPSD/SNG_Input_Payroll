import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { IreportService } from '../../../Repository/Reports/Ireportservice';
import { ReportService } from '../../../Service/Reports/report.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { Payperiodclass } from '../../../Models/Common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
export const Pay_TOKEN = new InjectionToken<IreportService>('Pay_TOKEN');

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule, CompanyallComponent, PayPeriodComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: ReportService,
    }
  ]
})
export class ReportComponent {
  isLoading = false;
  userdetail: any;
  reportlist: any;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  CompanyIdsoa: any;
  CompanyCodesoa: any;
  CompanyIdclient: any;
  CompanyCodeclient: any;
  CompanyIdtds: any;
  CompanyCodetds: any;
  payPeriod!: Payperiodclass;
  payperiodId: any;
  payperiods: any;
  payPeriodType!: string;
  payPeriodclient!: Payperiodclass;
  payperiodIdclient: any;
  payperiodsclient: any;
  fromDate: string = '';
  toDate: string = '';
  Date: string = '';
  constructor(@Inject(Pay_TOKEN) private service: IreportService, private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) { }
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
    this.BindReport();
    this.payPeriodType = "All";
  }
  handleCompanyEvent1(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
  }

  handleCompanyEvent2(company) {
    this.CompanyIdsoa = company.companyId;
    this.CompanyCodesoa = company.companyCode
  }
  handleCompanyEvent3(company) {
    this.CompanyIdclient = company.companyId;
    this.CompanyCodeclient = company.companyCode
  }
  handleCompanyEvent4(company) {
    this.CompanyIdtds = company.companyId;
    this.CompanyCodetds = company.companyCode
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;

  }
  handlePayperiodEvent2(payperiod: Payperiodclass) {
    this.payPeriodclient = payperiod;
    this.payperiodIdclient = payperiod.payfrequencyid;
    this.payperiodsclient = payperiod.payPeriod;

  }

  BindReport() {
    const flag = 'ReportList';
    const username = this.userdetail.user_Id;
    this.service.Reportlist(flag, username).subscribe({
      next: res => {
        this.reportlist = res?.data

      }
    });
  }
  selectedReport: string = '';

  onReportChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedReport = value;
  }

  exportToExcel(): void {
    this.isLoading = true;

    const payload: any = {
      Report_Type: this.selectedReport || '',
      QZoneUserName: this.userdetail?.user_Id.toString() || '',
      Company_Id: '',

      Company_Code: '',
      Pay_Period: '',
      Pay_Period_Id: '',
      From_Date: '',
      To_date: '',
      Financial_Year: ''
    };

    switch (this.selectedReport) {

      // ✅ Paid Invoice Report
      case 'Paid Invoice Report':
        payload.From_Date = this.Date || '';
        break;

      // ✅ Unpaid Invoice Report
      case 'Unpaid Invoice Report':
        payload.Company_Id = this.selectedCompanyId.toString() || '';
        payload.Company_Code = this.selectedCompanyCode || '';
        break;

      // ✅ SOA Report
      case 'SOA Report':
        payload.Company_Id = this.CompanyIdsoa.toString() || '';
        payload.Company_Code = this.CompanyCodesoa || '';
        payload.Pay_Period = this.payperiods || '';
        payload.Pay_Period_Id = this.payperiodId.toString() || '';
        break;

      // ✅ Client Ledger Report
      case 'Client Ledger Report':
        payload.Company_Id = this.CompanyIdclient.toString() || '';
        payload.Company_Code = this.CompanyCodeclient || '';
        payload.Pay_Period = this.payperiodsclient || '';
        payload.Pay_Period_Id = this.payperiodIdclient.toString() || '';
        payload.From_Date = this.fromDate || '';
        payload.To_date = this.toDate || '';
        break;

      // ✅ Client TDS Slab Master
      case 'Client TDS Slab Master':
        payload.Company_Id = this.CompanyIdtds.toString() || '';
        payload.Company_Code = this.CompanyCodetds || '';
        break;
    }

    console.log('Export Payload:', payload);

    this.service.Exporttoexcel(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.Data?.statusCode === 400) {
          alert(res.Data.message || 'No records found');
          return;
        }

        const jsonData = res?.data?.data?.Table0;
        if (!jsonData || jsonData.length === 0) {
          alert('No data available for export');
          return;
        }

        const ws = XLSX.utils.json_to_sheet(jsonData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, this.selectedReport);

        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `${this.selectedReport}_${date}.xlsx`);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Export failed', err);
      }
    });
  }

}
