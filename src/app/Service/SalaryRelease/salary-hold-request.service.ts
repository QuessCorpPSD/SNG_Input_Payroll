import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryHoldRequest } from '../../Repository/SalaryRequest/Isalaryholdrequest';

@Injectable({
  providedIn: 'root'
})
export class SalaryHoldRequestService implements ISalaryHoldRequest {
 env = environment
  constructor(private http: HttpClient) {
  }

   SalaryHoldRequestSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/InvoiceHoldList',
      payload
    );
  }
  downloadExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/InvoiceHoldListExport',
      payload,
      
    );
  }

   DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/SalaryReleaseTemplate/' + Flag + '/' + Qzoneusername + '/' + createdBy);
  }

  UploadSalaryHoldRequest(formData: FormData): Observable<APIResponse> {
  return this
    .http.post<APIResponse>(
      this.env.apiUrl + 'SalaryRequestInvoice/HoldRequestUpload',
      formData 
    );
    }

}
