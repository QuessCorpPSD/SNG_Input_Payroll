import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


export interface ILeaveruleService {

  GetLeaveRuleCompanywise(CompanyId: string, SiteId: string, State: string): Observable<APIResponse>;
  GetLeaveRuleTemplate(): Observable<APIResponse>;
  UploadLeaveRule(formData:FormData): Observable<APIResponse>;
  GetLeaveType(CompanyId: string): Observable<APIResponse>;
  SaveUpdateDeleteLeaveRule(payload:any):Observable<APIResponse>;
}
