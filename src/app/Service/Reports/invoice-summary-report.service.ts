import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IinvoiceRuleService } from '../../Repository/Master/IinvoiceRuleService';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IinvoiceSummaryReport } from '../../Repository/Reports/IinvoiceSummaryReport';

@Injectable({
  providedIn: 'root'
})
export class InvoiceSummaryReportService implements IinvoiceSummaryReport {
  env = environment
  constructor(private http: HttpClient) {
  }
  ExporttoExcel(
    companycode: any,
    startDate: string,
    endDate: string,
    reportType: any,
    userId: any
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'InvoiceSummary/ExportToExcel/' +
      companycode + '/' +
      startDate + '/' +
      endDate + '/' +
      reportType + '/' +
      userId
    );
  }




  GetTaxTypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'InvoiceSummary/GetTaxTypes')
  }
}
