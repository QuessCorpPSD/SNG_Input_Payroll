import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryadvanceapprove } from '../../Repository/salaryadvancemodule/Isalaryadvanceapprove.service';

@Injectable({
  providedIn: 'root'
})
export class SalaryadvanceapproveService implements ISalaryadvanceapprove {
 env = environment;
  constructor(private http: HttpClient) { }

  DownloadTemplate(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Approve/GetTemplate');
  }

  BulkPOUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Approve/Upload',
      formData
    );
  }
  Search(companyId: any, payperiod:any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'Approve/Search/' + companyId + '/' + payperiod);
  }

}
