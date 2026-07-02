import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class UserCreationService {

  env = environment

  constructor(private http: HttpClient) { }

  bindRoles(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'UserManagement/getroletypes')
  }

  bindReportingTo(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'UserManagement/GetReportingTo')
  }

  bindAccessType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'UserManagement/GetAccessType')
  }

  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'UserManagement/Search', payload)
  }

  CreateupdateDelete(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'UserManagement/Create', payload)
  }

  UnLockUser(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'UserManagement/Unlock', payload)
  }
}
