import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { Payperiodclass } from '../../../Models/Common';
import { SalaryadvancereportService } from '../../../Service/salaryadvancemodule/salaryadvancereport.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ISalaryadvancerequest } from '../../../Repository/salaryadvancemodule/Isalaryadvancerequest.service';
import { SalaryadvacerequestComponent } from '../salaryadvacerequest/salaryadvacerequest.component';

export const Salary_TOKEN = new InjectionToken<ISalaryadvancerequest>('Salary_TOKEN');

@Component({
  selector: 'app-salaryadvancereport',
  standalone: true,
  imports: [MatIconModule, PayPeriodComponent, CompanyallComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './salaryadvancereport.component.html',
  styleUrl: './salaryadvancereport.component.css',
  providers: [{
    provide: Salary_TOKEN,
    useClass: SalaryadvancereportService
  }]
})
export class SalaryadvancereportComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  userdetail: any;
  selectedcompanycode: any;
  payperiodId: any;
  payperiods: string = '';
  selectedCompanyCode: any;
  isLoading=false;
  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode
    console.log(this.selectedCompanyCode)
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.payPeriod = payperiod;
    this.payperiodId = payperiod.payfrequencyid;
    this.payperiods = payperiod.payPeriod;
    console.log('pay', this.payperiodId)
    console.log('payperiods', this.payperiods)
  }

  constructor(@Inject(Salary_TOKEN) private service: SalaryadvancereportService, private decry: EncryptionService, private _sessionStoreage: SessionStorageService) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }
    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.payPeriodType = "All";

  }

  exportToExcel(): void {
    if (!this.selectedCompanyId) {
      alert('Please select a company.');
      return;
    }
    if (!this.payperiodId) {
      alert('Please select a pay period.');
      return;
    }
    this.isLoading=true;
    const Companyid = this.selectedCompanyId;
    const PayPeriod = this.payperiodId;

    console.log('Export Payload:', Companyid, PayPeriod);

    this.service.Search(Companyid, PayPeriod).subscribe({
      next: (res) => {
        try {
          console.log('🔍 API Response:', res);
          const jsonData = res?.Data.data.Table0;
          
          if (!jsonData) {
            alert('No data found.');
            this.isLoading=false;
            return;
          }

          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available for the selected company and pay period.');
            this.isLoading=false;
            return;
          }

          // ✅ Create Excel file
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'salaryData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `salary_Advancereport_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
          this.isLoading=false;
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
          this.isLoading=false;
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        alert('Failed to load data from server.');
        this.isLoading=false;
      },
    });
  }


}
