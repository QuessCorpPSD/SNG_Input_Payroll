import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class SalaryadvancerequestService {
  env = environment

  constructor(private http: HttpClient) { }

  DownloadTemplate(companycode: any,payperiodid: any, Qzoneusername: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryAdvanceTemplate/' + companycode + '/' + payperiodid +'/'+ Qzoneusername );
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestInvoice/SalaryAdvanceUpload',
        formData
      );
  }

}
