import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment.development";
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../Models/apiresponse';
import { Observable } from 'rxjs';
import { iperfomainvoiceservice } from '../Repository/iperfomainvoice.service';

@Injectable({
  providedIn: 'root'
})
export class perfomainvoiceservice implements iperfomainvoiceservice {

  environment = environment;
  constructor(private http: HttpClient) {
  }

  GetPerformaInvoice(CompanyId: string, PayPriod: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'Invoice/GetPerformaInvoice/' + CompanyId + '/' + PayPriod);
  }

  PerformaInvoiceSplit(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Invoice/PerformaInvoiceSplit',
      formData // send as FormData directly
    );
  }

  PerformaInvoiceMerge(payload: any): Observable<APIResponse> {
    //console.log('Sending PO save payload:', payload);
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Invoice/PerformaInvoiceMerge',
      payload
    );
  }

  PerformaInvoiceInitiate(payload: any): Observable<APIResponse> {
    //console.log('Sending PO save payload:', payload);
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'Invoice/PerformaInvoiceInitiate',
      payload
    );
  }


}
