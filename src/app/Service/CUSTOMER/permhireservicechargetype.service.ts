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
  getJobSubCategory(jobCategoryId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/GetJobSubCategory/' + jobCategoryId
    );
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
  GetPermHireServiceChargeType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/GetPermHireServiceChargeType'
    );
  }

  GetPermHireServiceChargeCategory(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/GetPermHireServiceChargeCategory'
    );
  }

  GetPermHireServiceChargeSearch(CompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/GetPermHireServiceCharge/' + CompanyId
    );
  }

  CreateUpdateDelete_PermHireServiceCharge(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/CreateUpdateDelete_PermHireServiceCharge`;
    return this.http.post<APIResponse>(url, payload);
  }

  GetMapNameByCompany(CompanyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/GetAllMapNameByCompanyId/' + CompanyId
    );
  }
  GetPermHireServiceChargeJobCategory(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/GetPermHireServiceChargeJobCategory`;
    return this.http.post<APIResponse>(url, payload);
  }

  GetPermHireServiceChargeJobSubCategory(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/GetPermHireServiceChargeJobSubCategory`;
    return this.http.post<APIResponse>(url, payload);
  }
  SearchPermHireInvoiceInitiate(companyId: number, payPeriodId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/SearchPermHireInvoiceInitiate/' + companyId + '/' + payPeriodId
    );
  }

  ExportPermHireInvoiceInitiate(companyId: number, payPeriodId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'PermHire/ExportPermHireInvoiceInitiate/' + companyId + '/' + payPeriodId
    );
  }

  PermHireInvoiceInitiate(payload: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}PermHire/PermHireInvoiceInitiate`;
    return this.http.post<APIResponse>(url, payload);
  }
}
