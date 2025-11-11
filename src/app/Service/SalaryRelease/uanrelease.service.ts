import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { IUANRelease } from '../../Repository/SalaryRequest/Iuanrelease';

@Injectable({
  providedIn: 'root'
})
export class UanreleaseService implements IUANRelease {

  env = environment
  constructor(private http: HttpClient) {
  }

  GetInvoiceDescription(Qzoneusername): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/GetCommonDropDownList/EntityList/' + Qzoneusername);
  }

  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/UanReleaseList',
      payload
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
    console.log(formData)

    const config = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/UanReleaseUpload',
      formData
    );
  }
    SendRequest(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/UanReleaseRequest',
      payload
    );
  }
}
