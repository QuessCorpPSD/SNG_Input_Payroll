import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IPermHireServiceCharge } from '../../Repository/customer/IPermhireServiceCharge.service';

@Injectable({
  providedIn: 'root'
})
export class PermhireservicechargetypeService implements IPermHireServiceCharge {
  environment = environment;

  constructor(private http: HttpClient) { }

  search(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/GetServiceChargeType`;
    return this.http.post<APIResponse>(url, payload);
  }

  create(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/ServiceChargeTypeCreate`;
    return this.http.post<APIResponse>(url, payload);
  }

  searchJobCategory(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/GetJobCategorySearch`;
    return this.http.post<APIResponse>(url, payload);
  }

  createJobCategory(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/JobCategoryCreate`;
    return this.http.post<APIResponse>(url, payload);
  }

  searchJobSubCategory(CompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PermHire/GetJobSubCategorySearch/' + CompanyId);
  }

  getJobCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PermHire/GetJobCategory')
  }

  exportJobSubCategory(CompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PermHire/GetJobSubCategoryExport/' + CompanyId);
  }

  createJobSubCategory(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/JobSubCategoryCreate`;
    return this.http.post<APIResponse>(url, payload);
  }

  GetPermHireMasterSearch(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/GetPermHireMasterSearch`;
    return this.http.post<APIResponse>(url, payload);
  }

  PermHireMasterApproveReject(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/PermHireMasterApproveReject`;
    return this.http.post<APIResponse>(url, payload);
  }

  GetPermHireRequestSearch(CompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'PermHire/GetPermHireRequestSearch/' + CompanyId);
  }

  PermHireRequest(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/PermHireRequest`;
    return this.http.post<APIResponse>(url, payload);
  }
}
