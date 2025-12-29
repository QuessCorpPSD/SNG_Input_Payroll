import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IHoldRequest } from '../../Repository/SalaryRequestNew/IHoldRequest';

@Injectable({
  providedIn: 'root'
})
export class HoldRequestService implements IHoldRequest {
  env = environment

  constructor(private http: HttpClient) { }

  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  SearchInvoiceHoldList(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/InvoiceHoldList',
      payload // send as FormData directly
    );
  }

  HoldRequestUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/HoldRequestUpload',
      formData // send as FormData directly
    );
  }

  PartialHoldRequest(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/PartialHoldRequest',
      formData // send as FormData directly
    );
  }

  DBTHoldRequest(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/DBTHoldRequest',
      formData // send as FormData directly
    );
  }
}
