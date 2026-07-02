import { Injectable } from '@angular/core';
import { Iincrement } from '../../Repository/Promotion/Increment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class promotionIncrementService implements Iincrement {
  env = environment;
  constructor(private http: HttpClient) { }

  GetPayperiod(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Promotion/GetAllPayPeriodByCompanyID/${companyId}`
    );
  }
  GetEmployeeCode(companyId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Promotion/GetEmployeeDetailsByCompanyID/${companyId}`
    );
  }
  Search(companyId: any, employeeId: any, payPeriodId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Promotion/Search/' + companyId + '/' + employeeId + '/' + payPeriodId);
  }

  BulkPOUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Promotion/Upload',
      formData
    );
  }
  IncrementSearch(incrementId: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Promotion/GetAllIncrementDetailsByIncrementID/' + incrementId);
  }

}

