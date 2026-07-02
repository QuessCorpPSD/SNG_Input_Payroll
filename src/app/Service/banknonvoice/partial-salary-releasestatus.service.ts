import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IPartialSalaryReleaseStatus } from '../../Repository/banknonvoice/IPartialSalaryReleasestatus';

@Injectable({
  providedIn: 'root'
})
export class PartialSalaryReleasestatusService implements IPartialSalaryReleaseStatus {

  env = environment;

  constructor(private http: HttpClient) { }

  Search(
    companyId: any,
    payPeriodId: any,
    fromDate: any,
    toDate: any,
    employeeIdNo: any
  ): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'PartialSalaryReleaseStatus/Search/' +
      companyId + '/' +
      payPeriodId + '/' +
      fromDate + '/' +
      toDate + '/' +
      employeeIdNo
    );
  }
  ExportToExcel(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'PartialSalaryReleaseStatus/ExportToExcel',
      payload
    );
  }

  UploadSalaryReleaseStatus(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'PartialSalaryReleaseStatus/UploadSalaryReleaseStatus',
      payload
    );
  }
}
