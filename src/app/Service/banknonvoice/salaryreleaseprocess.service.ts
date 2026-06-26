import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ISalaryReleaseProcess } from '../../Repository/banknonvoice/ISalaryReleaseProcess';


@Injectable({
  providedIn: 'root'
})
export class SalaryreleaseprocessService implements ISalaryReleaseProcess {

  env = environment;

  constructor(private http: HttpClient) { }

  SearchDetails(batchId: string): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'SalaryReleaseProcess/SearchDetails/' +
      batchId
    );
  }

  GetNonInvoiceBatchid(
    companyId: number
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'SalaryReleaseProcess/GetNonInvoiceBatchid/' +
      companyId
    );
  }

  SalaryReleaseExport(
    payload: any
  ): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'SalaryReleaseProcess/SalaryReleaseExport',
      payload
    );
  }

  Initiate(payload: any): Observable<any> {

    return this.http.post(
      this.env.apiUrl +
      'SalaryReleaseProcess/Initiate',
      payload,
      {
        observe: 'response',
        responseType: 'blob'
      }
    );
  }
}