import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ISalaryReleaseApproval } from '../../Repository/SalaryRequestNew/ISalaryReleaseApproval';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class SalaryReleaseApprovalService implements ISalaryReleaseApproval {

  env = environment

  constructor(private http: HttpClient) { }

  Search(batchtype: any, CollectionStatus: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}SalaryReleasePendingApproval/BankAdviceList/${batchtype}/${CollectionStatus}/${userid}`
    );
  }
  Batchtype(userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + 'SalaryRequestInvoice/GetCommonDropDownList/BatchTypeList/' + userid);
  }

  Export(batchtype: any, CollectionStatus: any, userid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      `${this.env.apiUrl}SalaryReleasePendingApproval/BankAdviceListExport/${batchtype}/${CollectionStatus}/${userid}`
    );
  }
  Apporoval(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.env.apiUrl + 'SalaryReleasePendingApproval/BankAdviceApprove', payload)
  }






}
