import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IHRAcalculation } from '../../Repository/TaxAndSavings/HRAcalculations';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class HRAcalculationsService implements IHRAcalculation {
  env = environment;
  constructor(private http: HttpClient) { }


  GetFinancialYear(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ChildrenEducationAllowance/GetFinancialYear');
  }
  Search(companyId: number, employeeId: number, finYearId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'HRA/Search/' + companyId + '/' + employeeId + '/' + finYearId
    );
  }
  UploadHRA(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'HRA/Upload',
      formData
    );
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

  GetDeclarationTypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'HRA/GetDeclarationType');
  }
  CreateupdateDelete(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'HRA/Create', payload)
  }


}


