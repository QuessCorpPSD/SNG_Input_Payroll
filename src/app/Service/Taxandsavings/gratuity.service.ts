import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IGratuity } from '../../Repository/TaxandSavings/IGratuity';

@Injectable({
  providedIn: 'root'
})
export class GratuityService implements IGratuity {
  env = environment;
  constructor(private http: HttpClient) {

  }
  GetFinancialyear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear',
    );
  }
  GetEmployee(comapnyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyProvidedBenefits/GetEmployeesList/' + comapnyid,
    );
  }
  Search(comapnyid: any, employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gratuity/Search/' + comapnyid + '/' + employeeid,
    );
  }
  GetPerkCodes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyProvidedBenefits/GetPerkCodes',
    );
  }
  GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetEligibleChildren/' + Effective_Date + '/' + Number_Of_Children,
    );
  }
  save(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Gratuity/Create',
      payload
    );
  }

  GetEmployeeadd(comapnyid: any, financialYearId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gratuity/GetEmployeeCodeForGratuity/' + comapnyid + '/' + financialYearId,
    );
  }
  GetEmployeeBind(employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gratuity/GetGratuityEmployeeByEmpId/' + employeeid,
    );
  }
  GetBasic(employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gratuity/GetBasicAmountByEmployeeId/' + employeeid,
    );
  }
  GetDAamount(employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Gratuity/GetDAAmountByEmployeeId/' + employeeid,
    );
  }
}
