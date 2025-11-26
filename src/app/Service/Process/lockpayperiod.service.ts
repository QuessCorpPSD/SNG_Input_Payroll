import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ILockPayPeriodService } from '../../Repository/Process/Ilockpayperiod.service';

@Injectable({
  providedIn: 'root'
})
export class LockpayperiodService implements ILockPayPeriodService {

  env = environment

  constructor(private http: HttpClient) { }

  SearchLockPayPeriod(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LockPayperiod/SearchDetails', payload)
  }

  exportLockPayPeriod(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LockPayperiod/ExporttoExcel', payload)
  }

  importLockPayPeriod(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LockPayperiod/ImportLockpayperiod', payload)
  }

  Getmonth(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod')
  }

  addLockPayPeriod(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LockPayperiod/Lock', payload)
  }

}
