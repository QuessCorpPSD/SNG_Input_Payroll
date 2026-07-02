import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ICompanyPermission } from '../../Repository/Admin/ICompanyPermission.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyPermissionService implements ICompanyPermission {

  env = environment

  constructor(private http: HttpClient) { }

  bindEmployeeId(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'CompanyPermission/GetUsername')
  }

  search(UserId: any, BusinessUnitId: any, CompanyPermissionId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + "CompanyPermission/Search" + '/' + UserId + '/' + BusinessUnitId + '/' + CompanyPermissionId)
  }

  exportToExcel(UserId: any, Businessunitnameid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + "CompanyPermission/ExportToExcel" + '/' + UserId + '/' + Businessunitnameid)
  }

  addCompanyPermission(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + "CompanyPermission/CreateUpdateDelete", payload)
  }

  viewCompanyDetails(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'CompanyPermission/LoadCompany', payload)
  }

  EditDetails(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'CompanyPermission/Editdetails', payload)
  }


}
