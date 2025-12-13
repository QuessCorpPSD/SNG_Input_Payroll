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
    return this.http.get<APIResponse>(this.env.apiUrl + `CancelDocument/Search/${companyId}/${payPeriodId}`)
  }
}