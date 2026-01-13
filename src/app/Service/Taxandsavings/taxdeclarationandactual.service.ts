import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ITaxdeclarationandactual } from '../../Repository/Taxandsavings/ITaxdecalarationandactual.service';

@Injectable({
  providedIn: 'root'
})
export class TaxdeclarationandactualService implements ITaxdeclarationandactual {

  env = environment
  constructor(private http: HttpClient) { }

  search(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}TaxDeclarationAndActual/Search/${companyId}/${employeeId}`);
  }

  exportToExcel(companyId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}TaxDeclarationAndActual/Search/${companyId}/${employeeId}`);
  }

  importLtaCalculation(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'TaxDeclarationAndActual/Upload', payload)
  }

  addTax(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'TaxDeclarationAndActual/Create', payload)
  }

  getFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear')
  }

  getTaxCode(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'TaxDeclarationAndActual/GetAllTaxCodes')
  }

  getEmployeeCode(companyId: any, financialYearId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}ChildrenEducationAllowance/GetEmployeesList/${companyId}/${financialYearId}`)
  }

  getType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetAllType')
  }

  getemployeename(financialYearId: any, EmployeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}ChildrenEducationAllowance/GetEligibleEmployee/${financialYearId}/${EmployeeId}`)
  }

  getEligibleAmount(Employee_Id: any, Financial_Year_Id: any, Computation_Rule_Id: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}TaxDeclarationAndActual/GetEligibleAmtByEmpIDTaxCode/${Employee_Id}/${Financial_Year_Id}/${Computation_Rule_Id}`)
  }

  getEmpCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}CompanyProvidedBenefits/GetEmployeesList/${companyId}`)
  }

}
