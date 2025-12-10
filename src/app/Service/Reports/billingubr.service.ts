import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBillingUbr } from '../../Repository/Reports/IBillingubr';

@Injectable({
  providedIn: 'root'
})
export class BillingubrService implements IBillingUbr {
  env = environment;
  constructor(private http: HttpClient) { }

  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }
  Exporttoexcel(payPeriodId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}BillingUBR/GetBillingReport/${payPeriodId}`
    );
  }
}
