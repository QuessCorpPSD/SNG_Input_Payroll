import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICpfsummary } from '../../Repository/Reports/ICpfSummaryservice';

@Injectable({
  providedIn: 'root'
})
export class CpfsummaryService implements ICpfsummary {
  env = environment
  constructor(private http: HttpClient) {
  }
  // EntitySearch(): Observable<APIResponse> {
  //   return this.http.get<APIResponse>(this.env.apiUrl + 'Entity/Search');
  // }
  InvoiceSearch(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'InvoiceLegalEntity/Search',
    );
  }
  GetPayPeriod(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Common/GetPayPeriod');
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      `${this.env.apiUrl}CPF/CPFFileGeneration`, payload
    );
  }
}
