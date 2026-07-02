import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class OtherincomeService {
  env = environment;
  constructor(private http: HttpClient) {

  }
  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'OtherIncome/SearchDetails',
      payload
    );
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'OtherIncome/ImportOtherIncome',
      formData
    );
  }

  Delete(id: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'OtherIncome/DeleteOtherIncome/' + id + '/' + userid,
    );
  }
}
