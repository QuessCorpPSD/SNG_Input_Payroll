import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { IreportService } from '../../Repository/Reports/Ireportservice';

@Injectable({
  providedIn: 'root'
})
export class ReportService implements IreportService {
  env = "https://qzoneerp-dev-api.quesscorp.com/api/";
  constructor(private http: HttpClient) {
  }
  Reportlist(flag: string, username: string | number) {
    return this.http.get<any>(
      `${this.env}SalaryRequestInvoice/GetCommonDropDownList/${flag}/${username}`
    );
  }
  Exporttoexcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env + 'Report/DownloadQzoneReports', payload);
  }

}
