import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { ICompanyProvidedBenefits } from '../../Repository/TaxAndSavings/Icompanyprovidedbenefits';

@Injectable({
  providedIn: 'root'
})
export class CompanyprovidedbenefitsService implements ICompanyProvidedBenefits {
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
      this.env.apiUrl + 'CompanyProvidedBenefits/Search/' + comapnyid +'/' + employeeid,
    );
  }
  GetPerkCodes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'CompanyProvidedBenefits/GetPerkCodes' ,
    );
  }
  GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'ChildrenEducationAllowance/GetEligibleChildren/' + Effective_Date + '/' + Number_Of_Children,
    );
  }
  save(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CompanyProvidedBenefits/Create',
      payload
    );
  }
   Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'CompanyProvidedBenefits/Upload',
      formData
    );
  }
}