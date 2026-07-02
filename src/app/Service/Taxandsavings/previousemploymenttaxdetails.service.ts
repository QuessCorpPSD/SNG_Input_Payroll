import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IPreviousEmployment } from '../../Repository/Taxandsavings/IPreviousEmployment.service';

@Injectable({
  providedIn: 'root'
})
export class PreviousemploymenttaxdetailsService implements IPreviousEmployment {

  env = environment
  constructor(private http: HttpClient) { }

  search(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}PreviousEmployment/Search/${companyId}/${employeeId}`);
  }

  exportToExcel(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}PreviousEmployment/Search/${companyId}/${employeeId}`);
  }

  importLtaCalculation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PreviousEmployment/Upload', payload)
  }

  getFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear')
  }

  addPeta(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'PreviousEmployment/Create', payload)
  }

  getType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetAllType')
  }

  getEmployeeCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CompanyProvidedBenefits/GetEmployeesList/${companyId}`)
  }

  getemployeename(financialYearId: any, EmployeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}ChildrenEducationAllowance/GetEligibleEmployee/${financialYearId}/${EmployeeId}`)
  }

}
