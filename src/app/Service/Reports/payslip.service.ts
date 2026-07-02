
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IpayslipService } from '../../Repository/Reports/ipayslip.service';

@Injectable({
  providedIn: 'root'  // ✅ makes the service available app-wide
})
export class PayslipService implements IpayslipService {
  environment = environment;
  constructor(private http: HttpClient) {
  }
  GetEmployee(CompanyId: string, PayperiodId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PayslipReport/GetEmployee/' + CompanyId + '/' + PayperiodId);
  }

  DownloadPayslip(EmployeeId: string, Payperiod: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PayslipReport/DownloadPayslip/' + EmployeeId + '/' + Payperiod);
  }
}
