import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ITds } from '../../Repository/GlobalMasters/Itds';

@Injectable({
  providedIn: 'root'
})
export class TdsService implements ITds {
  env = environment
  constructor(private http: HttpClient) {
  }

  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'TDSSlabMaster/GetFinancialYear');
  }
  GetCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'TDSSlabMaster/Category');
  }
  Search(financialyearid: any, category: any, tdsslabid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'TDSSlabMaster/Search/' + financialyearid + '/' + category + '/' + tdsslabid);
  }
  Exporttoexcel(financialyearid: any, category: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'TDSSlabMaster/ExporttoExcel/' + financialyearid + '/' + category);
  }
  CreateupdateDelete(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'TDSSlabMaster/Create', payload)
  }
}
