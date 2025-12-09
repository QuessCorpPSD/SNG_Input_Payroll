import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ClientBillableReportDatewiseService {
  env = environment;
  constructor(private http: HttpClient) { }


  EntitySearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Entity/Search');
  }
  Exporttoexcel(entityid: any,fromdate:Date,todate:Date): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ClientBillableReport/Search/' + entityid+'/'+fromdate+'/'+todate);
  }
}
