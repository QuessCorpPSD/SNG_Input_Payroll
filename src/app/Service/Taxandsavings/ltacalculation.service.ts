import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ILtaCalculation } from '../../Repository/Taxandsavings/Ilta.service';

@Injectable({
  providedIn: 'root'
})

export class LtacalculationService implements ILtaCalculation {

  env = environment
  constructor(private http: HttpClient) { }

  search(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}LTACalculation/Search/${companyId}/${employeeId}`);
  }

  exportToExcel(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}LTACalculation/Search/${companyId}/${employeeId}`);
  }

  importLtaCalculation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LTACalculation/Upload', payload)
  }

  getBlockPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'LTACalculation/GetLTABlockPayPeriod')
  }

  getFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear')
  }

  addLta(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'LTACalculation/Create', payload)
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
