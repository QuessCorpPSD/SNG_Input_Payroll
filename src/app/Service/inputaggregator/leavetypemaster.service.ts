import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { APIResponse } from '../../Models/apiresponse';
import { ILeaveMaster } from '../../Repository/Inputaggregator/ILeavemaster';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LeavetypemasterService implements ILeaveMaster {
  env = environment

  constructor(private http: HttpClient) { }

  getLeavetypes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Attendance/leaveTypeMaster'
    );
  }
  LeavemasterSave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/Createleavetype',
        payload
      );
  }

  getquessmaster(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Attendance/QuessLeaveMaster'
    );
  }

  GetLeavePolicy(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Attendance/LeavePolicyMaster'
    );
  }

  LeavemastermappingSave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/Createleavemapping',
        payload
      );
  }

  Searchleavetypemapping(companyid: any, siteid: any, Flag: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Attendance/SearchLeaveTypeMapping/' + companyid + '/'+siteid + '/' + Flag
    );
  }

  // -------------------------------Misc paycode------------------------------------------

  Getpaycode(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Billing/CompanyPaycode/' + companyid
    );
  }

  Miscsearch(companyid: any, siteid:any, Action: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Billing/MISCPaycodeSearch/' + companyid + '/' +siteid + '/' +Action
    );
  }

  MiscpaycodeSave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/MISCPaycodeMapping',
        payload
      );
  }



  LeaveCategorySave(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'LeaveCategory/SaveUpdateDeleteLeaveCategory',
        payload
      );
  }

  Searchleavecategory(companyid: any, siteid:any, Action:string): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'LeaveCategory/GetLeaveCategory/' + companyid + '/' + siteid + '/' + Action
    );
  }

  Getfeecode(companyid: any, siteid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Billing/MISCPaycodes/' + companyid + '/' + siteid
    );
  }
}
