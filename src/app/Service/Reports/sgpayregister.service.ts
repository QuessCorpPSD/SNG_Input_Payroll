import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { ISgPayRegisterService } from '../../Repository/Reports/ISgpayRegister.service';

@Injectable({
  providedIn: 'root'
})
export class SgpayregisterService implements ISgPayRegisterService {

  environment = environment;
  constructor(private http: HttpClient) { }

  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Common/GetPayPeriod');
  }

  downloadReport(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.environment.apiUrl + 'SGPayRegister/ReportDownload', payload);
  }
}
