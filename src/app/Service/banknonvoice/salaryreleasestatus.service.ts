import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISalaryReleaseStatus } from '../../Repository/banknonvoice/ISalaryReleaseStatus.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class SalaryreleasestatusService implements ISalaryReleaseStatus {

  env = environment
  getId: any;
  constructor(private http: HttpClient) { }

    search(CompanyId: any, PayPeriod_Id: any, fromdate: any, todate: any, EmployeeIdNo:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}SalaryReleaseStatus/Search/${CompanyId}/${PayPeriod_Id}/${fromdate}/${todate}/${EmployeeIdNo}`);
  }
}
