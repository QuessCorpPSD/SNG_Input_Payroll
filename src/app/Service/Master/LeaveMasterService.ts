import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IinvoiceRuleService } from "../../Repository/Master/IinvoiceRuleService";
import { ILeaveMasterService } from "../../Repository/Master/ILeaveMasterService";
@Injectable({
  providedIn: 'root'
})
export class LeaveMasterService implements ILeaveMasterService {
  environment = environment
  constructor(private http: HttpClient) {
  }
  GetAllLeaveMaster(companyId: number, siteId: string): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}LeaveMaster/GetAllLeaveMaster/${companyId}/${siteId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  GetLeaveTypeDD(): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}LeaveMaster/GetLeaveTypeDD`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }

  PostAddLeaveMaster(leaveMasterAdd: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}LeaveMaster/PostAddLeaveMaster`;
    return this.http.post<APIResponse>(url, leaveMasterAdd);
  }
  
  LeaveMasterExport(companyId: number, siteCode: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}LeaveMaster/LeaveMasterExport/${companyId}/${siteCode}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  PostDeleteLeave(leavemasterid: number):Observable<APIResponse>{
    const url = `${this.environment.apiUrl}LeaveMaster/PostDeleteLeave`;
    return this.http.post<APIResponse>(url, leavemasterid);
  }
} 