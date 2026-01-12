import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IOneTimeReplacement } from '../../Repository/Process/IOneTimeReplacement';

@Injectable({
  providedIn: 'root'
})
export class OneTimeReplacementService implements IOneTimeReplacement {
  env = environment
  constructor(private http: HttpClient) {
  }
  OneTimeSearch(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'OnetimeReplacement/SearchDetails',
      payload
    );
  }
  downloadExcel(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'OnetimeReplacement/ExporttoExcel',
      payload,

    );
  }
  UploadOneTime(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'OnetimeReplacement/ImportOnetimeReplacement',
        formData
      );
  }
  GetEmployeesByCompanyId(payload: any): Observable<any> {
    return this.http.post<any>(
      this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID',
      payload
    );
  }
  deleteOneTimeReplacement(One_Time_Replacement_Id: any, user_Id: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'OnetimeReplacement/DeleteOnetimeReplacement' + '/' + One_Time_Replacement_Id + '/' + user_Id)
  }
}
