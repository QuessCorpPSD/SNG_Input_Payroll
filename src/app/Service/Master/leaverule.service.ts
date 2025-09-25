import { Injectable } from '@angular/core';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILeaveruleService } from '../../Repository/Master/ileaverule.service';
import { environment } from '../../../Environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LeaveruleService implements ILeaveruleService {

  environment = environment;
  constructor(private http: HttpClient) {
  }

  GetLeaveRuleCompanywise(CompanyId: string, SiteId: string, State: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveRule/GetLeaveRuleCompanywise/' + CompanyId + '/' + SiteId + '/' + State);
  }

  GetLeaveRuleTemplate(): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveRule/GetLeaveRuleTemplate');
  } 
  
  UploadLeaveRule(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'LeaveRule/UploadLeaveRule',
      formData // send as FormData directly
    );
  }

   GetLeaveType(CompanyId: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.environment.apiUrl + 'LeaveRule/GetLeaveType/' + CompanyId);
  }

  SaveUpdateDeleteLeaveRule(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.environment.apiUrl + 'LeaveRule/SaveUpdateDeleteLeaveRule',
      formData // send as FormData directly
    );
  }
}
