import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IpayregisterentitywiseService } from '../../Repository/Reports/Ipayregisterentitywise';

@Injectable({
  providedIn: 'root'
})
export class PayregisterentitywiseService implements IpayregisterentitywiseService {
  env = environment;
  constructor(private http: HttpClient) { }


  EntitySearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Entity/Search');
  }
  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}PayregisterEntitywise/ExportToExcel`, payload
    );
  }
}
