import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICPFslabDetails } from '../../Repository/GlobalMasters/ICPFslabDetails';

@Injectable({
  providedIn: 'root'
})
export class CPFslabDetailsService implements ICPFslabDetails {
  env = environment
  constructor(private http: HttpClient) {
  }
  GetPayCodeList(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CPF/GetPaycode',
    );
  }

  CDFSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CPF/Search',
      payload
    );
  }
  GetCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CPF/GetCategory`);
  }
  GetCriteriaType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CPF/GetCriteria`);
  }
  CreateCPF(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CPF/Create',
      payload
    );
  }

}




