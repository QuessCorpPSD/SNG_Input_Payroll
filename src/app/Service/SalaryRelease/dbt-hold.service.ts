import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDbtHold } from '../../Repository/SalaryRequest/IdbtHold';

@Injectable({
  providedIn: 'root'
})
export class DbtHoldService implements IDbtHold {
  env = environment

  constructor(private http: HttpClient) { }

   GetUploadType(Username): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/GetCommonDropDownList/DBTHRPList/' + Username);
    }
  
    DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
      return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
    }
  
    Upload(formData: FormData): Observable<APIResponse> {
      return this
        .http.post<APIResponse>(
          this.env.apiUrl + 'SalaryRequestInvoice/DBTHoldReleaseUpload',
          formData
        );
    }
  
}
