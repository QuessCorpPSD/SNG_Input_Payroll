import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IotherincomeentitywiseService } from '../../Repository/Reports/IOtherIncomeReportEntitywise.service';

@Injectable({
  providedIn: 'root'
})
export class OtherincomereportentitywiseService implements IotherincomeentitywiseService {

  env = environment;
  constructor(private http: HttpClient) { }


  getEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'OtherIncomeEntitywise/GetEntity');
  }

  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }

  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'OtherIncomeEntitywise/ExportToExcel', payload)
  }
}
