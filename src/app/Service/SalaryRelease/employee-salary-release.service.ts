import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IEmployeeSalaryRelease } from '../../Repository/SalaryRequest/IEmployeeSalaryRelease';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryReleaseService implements IEmployeeSalaryRelease {
   env = environment
  constructor(private http: HttpClient) {
  }
  EmployeeSalaryReleaseSearch(payload: any): Observable<APIResponse> {
      return this.http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestNoninvoice/GetSalaryProcessInitiationList',
        payload
      );
    }
    downloadExcel(payload: any): Observable<APIResponse> {
      return this.http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestNoninvoice/GetSalaryProcessInitiationList',
        payload,
        
      );
    }
  
     DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
    }
  
    UploadSalaryHoldRequest(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestNoninvoice/UploadNISalaryInitiate',
        formData 
      );
      }
  
  }
