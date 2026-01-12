import { Injectable } from '@angular/core';
import { APIResponse } from '../../Models/apiresponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ITadjustmentsService {

  env = environment;
  constructor(private http: HttpClient) {

  }
  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ITAdjustment/SearchDetails',
      payload
    );
  }

  Getemployeecode(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID',
      payload
    );
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'ITAdjustment/ImportITAdjustment',
      formData
    );
  }
  DeleteITAdjustment(IT_Adjustment_Id: any, user_Id: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'ITAdjustment/DeleteITAdjustment' + '/' + IT_Adjustment_Id + '/' + user_Id)
  }
}
