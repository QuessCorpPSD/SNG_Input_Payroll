import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IinvoiceLegalEntity } from '../../Repository/GlobalMasters/IinvoiceLegalEntity';

@Injectable({
  providedIn: 'root'
})
export class InvoiceLegalEntityService implements IinvoiceLegalEntity {
  env = environment
  constructor(private http: HttpClient) {
  }
  InvoiceSearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceLegalEntity/Search',
    );
  }
  CreateInvoice(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'InvoiceLegalEntity/Create',
      payload
    );
  }
}
