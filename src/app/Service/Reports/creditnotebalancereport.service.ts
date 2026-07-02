import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { ICreditNoteBalanceReport } from '../../Repository/Reports/ICreditNoteBalanceReport.service';

@Injectable({
  providedIn: 'root'
})
export class CreditnotebalancereportService implements ICreditNoteBalanceReport {
  env = environment
  constructor(private http: HttpClient) { }

  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'CreditNoteBalanceReport/ExportToExcel', payload)
  }
}
