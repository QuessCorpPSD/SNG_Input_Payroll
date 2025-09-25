import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ILeaveMasterService {
    GetAllLeaveMaster(companyId:number, siteId:string):Observable<APIResponse>;
    GetLeaveTypeDD():Observable<APIResponse>;
    PostAddLeaveMaster(leaveMasterAdd: any):Observable<APIResponse>;
    LeaveMasterExport(companyId: number, siteCode: number):Observable<APIResponse>;
    PostDeleteLeave(leavemasterid: number):Observable<APIResponse>;
}