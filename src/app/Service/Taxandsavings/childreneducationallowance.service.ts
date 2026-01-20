import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IChildreneducationallowance } from '../../Repository/TaxandSavings/IChildreneducationallowance.service';

@Injectable({
  providedIn: 'root'
})
export class ChildreneducationallowanceService implements IChildreneducationallowance {
  env = environment;
  constructor(private http: HttpClient) {

  }
  GetFinancialyear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear',
    );
  }
  GetEmployee(comapnyid: any, financialyearid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetEmployeesList/' + comapnyid + '/' + financialyearid,
    );
  }
  Search(comapnyid: any, financialyearid: any, employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/Search/' + comapnyid + '/' + financialyearid + '/' + employeeid,
    );
  }
  GetEligibleemployee(financialYearId: any, employeeId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetEligibleEmployee/' + financialYearId + '/' + employeeId,
    );
  }
  GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetEligibleChildren/' + Effective_Date + '/' + Number_Of_Children,
    );
  }
  save(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/Create',
      payload
    );
  }
}