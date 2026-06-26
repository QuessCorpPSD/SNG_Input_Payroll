import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IemployeeSalaryRelease } from '../../Repository/BankNonInvoice/IemployeeSalaryRelease';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryReleaseServices implements IemployeeSalaryRelease {
  environment = environment;

  constructor(private http: HttpClient) { }

  GetEmployeeSalaryReleaseSearch(companyId: any, payPeriodId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl +
      'EmployeeSalaryRelease/SearchEmployeeSalaryRelease/' +
      companyId + '/' +
      payPeriodId
    );
  }

  ExportEmployeeSalaryRelease(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.environment.apiUrl}EmployeeSalaryRelease/EmployeeSalaryReleaseExport`,
      payload
    );
  }

  UploadEmployeeSalaryRelease(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.environment.apiUrl}EmployeeSalaryRelease/UploadEmployeeSalaryRelease`,
      formData
    );
  }


  DownloadSalaryReleaseTemplate(Flag: any, Qzoneusername: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.environment.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername
    );
  }
}