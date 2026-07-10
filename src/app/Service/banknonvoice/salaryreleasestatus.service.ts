import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISalaryReleaseStatus } from '../../Repository/banknonvoice/ISalaryReleaseStatus.service';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


@Injectable({
  providedIn: 'root'
})
export class SalaryreleasestatusService implements ISalaryReleaseStatus {

  env = environment
  getId: any;
  constructor(private http: HttpClient) { }

  search(CompanyId: any, PayPeriod_Id: any, fromdate: any, todate: any, EmployeeIdNo: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.env.apiUrl}SalaryReleaseStatus/Search/${CompanyId}/${PayPeriod_Id}/${fromdate}/${todate}/${EmployeeIdNo}`);
  }

  GetTemplate(userid: any, Flag: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetTemplate/' + Flag + '/' + userid
    );
  }

  GetBatchTypeList(userid): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetBatchTypeList/' + userid
    );
  }

  GetSalaryReleaseStatusdata(BatchType, FromDate, Todate, EmployeeCode, userid): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetSalaryReleaseStatusdata/' + BatchType + '/' + FromDate + '/' + Todate + '/' + EmployeeCode + '/' + userid
    );
  }

  GetSalaryReleaseStatusdataExport(BatchType, FromDate, Todate, EmployeeCode, userid): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'NIBatchGeneration/GetSalaryReleaseStatusdataExport/' + BatchType + '/' + FromDate + '/' + Todate + '/' + EmployeeCode + '/' + userid
    );
  }


  UtrUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'NIBatchGeneration/UtrUpload',
      formData
    );
  }

}
