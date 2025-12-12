import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IincreamentReport } from '../../Repository/Reports/IincreamnetReport';

@Injectable({
  providedIn: 'root'
})
export class IncreamentReportService implements IincreamentReport {
  env = environment;
  constructor(private http: HttpClient) { }

  GetEmployeesByCompanyId(payload: any): Observable<any> {
    return this.http.post<any>(
      this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID',
      payload
    );
  }
  // Exporttoexcel(PayPeriod: any): Observable<APIResponse> {
  //   return this.http.get<APIResponse>(
  //     `${this.env.apiUrl}ProcessEmployee/ExportToExcel//${PayPeriod}`
  //   );
  // }
  Exporttoexcel(companyId: any, payPeriodId: any, employeeId: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}IncrementReport/ExportToExcel/${companyId}/${payPeriodId}/${employeeId}`,
      {}  
    );
  }

}

