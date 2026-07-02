import { Injectable } from '@angular/core';
import { IncomeLoss } from '../../Repository/TaxAndSavings/IncomeLoss';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class IncomeLossService implements IncomeLoss {
  env = environment;
  constructor(private http: HttpClient) { }

  Search(companyId: number, employeeId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'IncomeLossHousingProperty/Search/' + companyId + '/' + employeeId
    );
  }
  UploadIncome(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'IncomeLossHousingProperty/Upload', formData);
  }
  GetTypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetAllType');
  }
  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear');
  }
  Create(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'IncomeLossHousingProperty/Create', payload)
  }
  GetEmployee(companyId: any, financialYearId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `ChildrenEducationAllowance/GetEmployeesList/${companyId}/${financialYearId}`
    );
  }
  GetEmployee2(companyId: any, financialYrID: number, employeeID: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `HRA/GetEmployeeListAdd/${companyId}/${financialYrID}/${employeeID}`
    );
  }

  getEmpCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `CompanyProvidedBenefits/GetEmployeesList/${companyId}`
    );

  }

}

