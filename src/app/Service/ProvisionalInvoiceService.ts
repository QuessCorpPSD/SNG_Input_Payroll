import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../Models/apiresponse';
import { Observable } from 'rxjs';
import { IProvisionalInvoiceRepository } from '../Repository/iprovisionalinvoicerepository';

@Injectable({
  providedIn: 'root'
})
export class ProvisionalInvoiceService implements IProvisionalInvoiceRepository {

  environment = environment;
  constructor(private http: HttpClient) {
  }

  GetProvisionalInvoice(CompanyId: string, payPeriodId: string, userId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'ProvisionalInvoice/GetProvisionalInvoice/' + CompanyId + '/' + payPeriodId + '/' + userId);
  }

  ProvisionalInvoiceSplit(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'ProvisionalInvoice/ProvisionalInvoiceSplit',
      formData
    );
  }

//   PerformaInvoiceMerge(payload: any): Observable<APIResponse> {
//     return this.http.post<APIResponse>(
//       this.environment.apiUrl + 'Invoice/PerformaInvoiceMerge',
//       payload
//     );
//   }

  ProvisionalInvoiceInitiate(requestPayload: any): Observable<APIResponse> {
    //console.log('Sending PO save payload:', payload);
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'ProvisionalInvoice/ProvisionalInvoiceInitiate', requestPayload);
  }

//   UpdateMapName(formData: FormData): Observable<APIResponse> {
//     return this.http.post<APIResponse>(
//       this.environment.apiUrl + 'Invoice/UpdateMapName',
//       formData
//     );
//   }
  
//   UploadAttributes(formData: FormData): Observable<APIResponse> {
//     return this.http.post<APIResponse>(
//       this.environment.apiUrl + 'Invoice/UploadAttributes',
//       formData
//     );
//   }
}
