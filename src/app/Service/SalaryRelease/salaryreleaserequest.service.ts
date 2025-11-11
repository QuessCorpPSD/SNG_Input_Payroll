import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryReleaseRequest } from '../../Repository/SalaryRequest/isalaryreleaserequest';

@Injectable({
  providedIn: 'root'
})
export class SalaryreleaserequestService implements ISalaryReleaseRequest {
  env = environment
  constructor(private http: HttpClient) {
  }

  SalaryReleaseSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/GetBankAdviceApproveList',
      payload
    );
  }
  SalaryReleaseRequest(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/CreateRequestSalaryRelease',
      payload
    );
  }
  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  UploadSalaryRequest(formData: FormData): Observable<APIResponse> {
  return this
    .http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/UploadSalaryReleaseRequest',
      formData 
    );
    }
}
