import { Injectable } from '@angular/core';
import { IReleaseholdemployeesalary } from '../../Repository/BankNonInvoice/IReleaseholdemployeesalary';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../Environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ReleaseholdemployeesalaryService implements IReleaseholdemployeesalary {
  environment = environment;

  constructor(private http: HttpClient) { }

  SearchReleaseHoldSalary(Company_Id: any, Pay_Period_Id: any, Employee_Id: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl +
      'Releaseholdemployeesalary/search/' +
      Company_Id + '/' +
      Pay_Period_Id + '/' +
      Employee_Id
    );
  }

  ExportReleaseHoldSalary(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Releaseholdemployeesalary/ReleaseHoldSalaryExport',
      payload
    );
  }
  SaveReleaseHoldSalary(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Releaseholdemployeesalary/SaveReleaseHoldSalary',
      payload
    );
  }
  UploadReleaseHoldSalary(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Releaseholdemployeesalary/UploadReleaseholdsalary',
      formData
    );
  }

  DownloadReleaseHoldTemplate(flag: any, userId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl +
      'SalaryRequestInvoice/SalaryReleaseTemplate/' + flag + '/' + userId
    );
  }
}
