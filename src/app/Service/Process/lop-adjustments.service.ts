import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class LopAdjustmentsService {
  env = environment;
  constructor(private http: HttpClient) {

  }
  Search(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'LOPAdjustmentProcess/SearchDetails',
      payload
    );
  }

  Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'LOPAdjustmentProcess/ImportLOPAdjustment',
      formData
    );
  }

  Export(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'LOPAdjustmentProcess/ExporttoExcel',
      payload
    );
  }
}
