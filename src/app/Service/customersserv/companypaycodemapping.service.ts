import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class CompanypaycodemappingService {
  env = environment;
  httpClient: any;
  constructor(private http: HttpClient) {

  }

  paycodeSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Paycode/Search',
      payload
    );
  }
  companypaycodesearch(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyPaycodeMapping/Search/' + companyid);
  }
  Pickfrom(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyPaycodeMapping/GetAllCompanyPayCodePickFrom');
  }
  Exporttoexcel(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyPaycodeMapping/ExportToExcel/' + companyid);
  }
    PostAddPaycodeMapping(payloadCreate: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CompanyPaycodeMapping/Create',
      payloadCreate
    );
  }
}
