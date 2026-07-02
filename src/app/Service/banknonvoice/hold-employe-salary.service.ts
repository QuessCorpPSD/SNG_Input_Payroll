import { Injectable } from '@angular/core';
import { IHoldEmployeeSalary } from '../../Repository/banknonvoice/IHoldEmployeeSalary';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class HoldEmployeSalaryService implements IHoldEmployeeSalary {

  environment = environment;

  constructor(private http: HttpClient) { }

  GetSalaryHoldType(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.environment.apiUrl}HoldEmpSalary/GetSalaryHoldType`
    );
  }

  SearchHoldEmpSalary(companyId: any, payPeriodId: any, status: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.environment.apiUrl}HoldEmpSalary/SearchHoldEmpSalary/${companyId}/${payPeriodId}/${status}`
    );
  }

  ExportHoldEmpSalary(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.environment.apiUrl}HoldEmpSalary/HoldEmpSalaryExport`,
      payload
    );
  }

  UploadHoldEmpSalary(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.environment.apiUrl}HoldEmpSalary/UploadHoldEmpSalary`,
      formData
    );
  }

  DownloadHoldTemplate(flag: string, userId: string) {
    return this.http.get(
      this.environment.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + flag + '/' + userId
    );
  }
}