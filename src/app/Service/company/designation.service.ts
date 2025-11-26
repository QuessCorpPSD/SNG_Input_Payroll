import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  env = environment

  constructor(private http: HttpClient) { }

  searchDesignation(companyCode: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Designation/GetAllDesignationDetails/' + companyCode)
  }

  exportDesignation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Designation/DesignationExport', payload)
  }

  importDesignation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Designation/PostDesignationUpload', payload)
  }

  saveDesignation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Designation/SaveUpdateDeleteDesignation', payload)
  }

}
