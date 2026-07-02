import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IpartialHold } from '../../Repository/SalaryRequest/IpartialHold';

@Injectable({
  providedIn: 'root'
})
export class PatialHoldService implements IpartialHold {
  env = environment

  constructor(private http: HttpClient) { }

  GetUploadType(Username): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/GetCommonDropDownList/PartialHRPList/' + Username);
  }

  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'SalaryRequestInvoice/PartialHoldReleaseUpload',
        formData
      );
  }

}
