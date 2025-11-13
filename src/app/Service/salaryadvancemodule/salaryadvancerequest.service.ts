import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { ISalaryadvancerequest } from '../../Repository/salaryadvancemodule/Isalaryadvancerequest.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryadvancerequestService implements ISalaryadvancerequest {
  env = environment;
  constructor(private http: HttpClient) { }

  DownloadTemplate(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Request/GetTemplate');
  }

  BulkPOUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Request/Upload',
      formData
    );
  }
  Search(companyId: any, payperiod:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Request/Search/' + companyId + '/' + payperiod);
  }

}
