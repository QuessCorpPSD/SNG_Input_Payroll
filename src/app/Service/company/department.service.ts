import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  env = environment

  constructor(private http: HttpClient) { }


  searchDepartment(companyCode: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Department/GetAllDepartmentDetails/' + companyCode)
  }

  exportDepartment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Department/DepartmentExport', payload)
  }

  importDepartment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Department/PostDepartmentUpload', payload)
  }

  saveDepartment(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'Department/SaveUpdateDeleteDepartment', payload)
  }

}
