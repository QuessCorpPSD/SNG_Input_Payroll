import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IHoldReleaseRequest } from '../../Repository/SalaryRequest/Iholdreleaserequest';

@Injectable({
  providedIn: 'root'
})
export class HoldreleaserequestService implements IHoldReleaseRequest {
  env = environment
  constructor(private http: HttpClient) {
  }
  SalaryReleaseSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/InvoiceHoldReleaseList',
      payload
    );
  }

  downloadExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/InvoiceHoldReleaseListExport',
      payload,

    );
  }

  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  UploadHoldRelease(formData: FormData): Observable<APIResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestInvoice/HoldReleaseUpload',
        formData
      );
  }
  HoldReleaseRequest(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/HoldReleaseRequest',
      payload
    );
  }
}
