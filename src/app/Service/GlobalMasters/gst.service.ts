import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IGstRepository } from '../../Repository/GlobalMasters/IGstRepository';

@Injectable({
  providedIn: 'root'
})
export class GSTService implements IGstRepository {
  env = environment
  constructor(private http: HttpClient) {
  }
  Search(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gst/SearchDetails/' + val1,
    );
  }
  ExporttoExcel(val1: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gst/ExporttoExcel/' + val1,
    );
  }

  Create(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Gst/Create',
      payload
    );
  }

  Edit(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Gst/Edit',
      payload
    );
  }
  Delete(gstmasterid: any, userid: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}Gst/Delete/${gstmasterid}/${userid}`,
      {}  
    );
  }


  GetEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Entity/Search',
    );
  }

}

