import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBillingpayfrequency } from '../../Repository/invoice/IBillingpayfrequency';

@Injectable({
  providedIn: 'root'
})
export class BillingpayfrequencyService implements IBillingpayfrequency {
  env = environment;
  constructor(private http: HttpClient) { }


  Search(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BillingPayFrequency/Search/' + companyId);
  }
  CopySearch(companyId: any, Startdate: any, enddate: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BillingPayFrequency/CopySearch/' + companyId + '/' + Startdate + '/' + enddate);
  }
  Exporttoexcel(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BillingPayFrequency/ExportToExcel/' + companyId);
  }
  Getgrouptype(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BillingPayFrequency/GetGroupName/' + companyId);
  }
  GetAdddata(Startdate: Date, enddate: Date): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'BillingPayFrequency/GetData/' + Startdate + '/' + enddate);
  }
  Addsave(BillingPayFrequencyRequest: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'BillingPayFrequency/Create',
        BillingPayFrequencyRequest
      );
  }
}
