import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class NetpaysummaryNonvoiceService {
  env = environment
  constructor(private http: HttpClient) { }

    DownloadTemplate(companycode: any, payperiodid: any, Qzoneusername: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestNoninvoice/NINetPaysummary/' + companycode + '/' + payperiodid +'/'+ Qzoneusername );
}
}
