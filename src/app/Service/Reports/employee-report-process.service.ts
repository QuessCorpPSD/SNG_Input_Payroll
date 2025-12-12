import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IEmployeeReportProcess } from '../../Repository/Reports/IEmployeeReportService';



@Injectable({
  providedIn: 'root'
})
export class EmployeeReportProcessService implements IEmployeeReportProcess {

  env = environment;
  constructor(private http: HttpClient) { }

  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }
  // Exporttoexcel(PayPeriod: any): Observable<APIResponse> {
  //   return this.http.get<APIResponse>(
  //     `${this.env.apiUrl}ProcessEmployee/ExportToExcel//${PayPeriod}`
  //   );
  // }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ProcessEmployee/ExportToExcel',
      payload);
  }
}
