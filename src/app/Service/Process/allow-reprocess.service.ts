import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class AllowReprocessService {
  env = environment
  constructor(private http: HttpClient) {
  }
  Allowsearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'AllowReprocess/SearchDetails',
      payload
    );
  }
  downloadExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'AllowReprocess/ExporttoExcel',
      payload,

    );
  }
  AllowReprocess(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'AllowReprocess/Create',
      payload
    );
  }



}
