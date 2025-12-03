import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class CompanyserviceService {

  env = environment

  constructor(private http: HttpClient) { }

  searchCompany(companyCode: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Company/Search/' + companyCode + '/' + "''")
  }

  exportCompany(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Company/ExportToExcel/0/""')
  }

  getCompanyName(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + "Company/masters")
  }

  getBusinessUnitLoation(entityId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + "Company/GetBussinessunitLocation/" + entityId)
  }
}
