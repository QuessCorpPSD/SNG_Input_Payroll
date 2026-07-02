import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class BonusflushService {
  env = environment

  constructor(private http: HttpClient) { }

  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestInvoice/BonusReleaseUpload',
        formData
      );
  }

  downloadExcel(companyId: any,FromDate:any,ToDate:any,QZoneUserName:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/BonusAccumatedReport/'+companyId+'/'+FromDate+'/'+ToDate+'/'+QZoneUserName );
  }

}
