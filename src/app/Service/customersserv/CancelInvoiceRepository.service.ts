import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { ICancelInvoiceRepository } from '../../Repository/customer/ICancelInvoiceRepository';

@Injectable({
  providedIn: 'root'
})

export class CancelInvoiceRepository implements ICancelInvoiceRepository {
  env = environment

  constructor(private http: HttpClient) { }

  Search(companyId: number, payPeriodId: number): Observable<APIResponse> {
    const url = `${this.env.apiUrl}CancelDocument/Search/${companyId}/${payPeriodId}`;
    console.log(url);
    return this.http.get<APIResponse>(url); 
  }

  UploadDocument(formData: FormData): Observable<APIResponse> {
    const url = `${this.env.apiUrl}CancelDocument/UploadDocument`;
    console.log(url);
    return this.http.post<APIResponse>(url, formData); 
  }
}