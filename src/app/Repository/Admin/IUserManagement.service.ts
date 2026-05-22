import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IUserManagement {
    bindRoles(): Observable<APIResponse>;
    bindReportingTo(): Observable<APIResponse>;
    bindAccessType(): Observable<APIResponse>;
    Search(payload: any): Observable<APIResponse>;
    CreateupdateDelete(payload: any): Observable<APIResponse>;
    UnLockUser(payload: any): Observable<APIResponse>
}