import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { INetpaysummary } from '../../Repository/Reports/INetpaysummary';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class NetpaysummaryService implements INetpaysummary {
  env = environment
  constructor(private http: HttpClient) {
  }

  ExporttoExcel(companycode: any, payperiodid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'NetpaySummary/ExportToExcel/' + companycode + '/' + payperiodid);
  }

}
