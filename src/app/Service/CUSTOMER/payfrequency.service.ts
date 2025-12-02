import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class PayfrequencyService {
 env = environment;
  constructor(private http: HttpClient) { }


  Search(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PayFrequency/Search/' + companyId);
  }
  Exporttoexcel(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PayFrequency/ExportToExcel/' + companyId);
  }
  Getgrouptype(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PayFrequency/GetGroupName/' + companyId);
  }
  GetAdddata(Startdate: Date, enddate: Date): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'PayFrequency/GetData/' + Startdate + '/' + enddate);
  }
}
