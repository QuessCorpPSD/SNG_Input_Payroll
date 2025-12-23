import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment.development';
import { IcomputationRule } from '../../Repository/GlobalMasters/IComputationRule.service';

@Injectable({
  providedIn: 'root'
})
export class ComputationruleService implements IcomputationRule {
  env = environment

  constructor(private http: HttpClient) { }

  getFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ComputationRule/GetFinancialYear')
  }

  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ComputationRule/Search', payload)
  }

  exportToExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ComputationRule/ExporttoExcel', payload)
  }

  addCR(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'ComputationRule/Create', payload)
  }

}
