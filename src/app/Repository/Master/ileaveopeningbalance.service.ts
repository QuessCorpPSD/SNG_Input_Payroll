import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';


export interface ILeaveOpeningBalance {

  GetLeaveOpeningCompanywise(CompanyId: string, SiteName:string): Observable<APIResponse>;
  PostLeaveOpeningTemplate(LeaveOpeningBalance:any): Observable<APIResponse>;
  UploadLeaveOpeningBalance(formData:FormData): Observable<APIResponse>;


  
}