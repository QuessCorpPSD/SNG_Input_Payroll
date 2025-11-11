import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { InetpaySummary } from '../../Repository/SalaryRequest/InetpaySummary';

@Injectable({
  providedIn: 'root'
})
export class NetpaysummaryService implements InetpaySummary {
  env = environment
  constructor(private http: HttpClient) {
  }

  ExporttoExcel(companycode: any, payperiodid: any, Qzoneusername: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/NetPaysummary/' + companycode + '/' + payperiodid +'/'+ Qzoneusername );
  }


}
