import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IEmApproveRepository {

    GetEmployeePOSerach(payload:any):Observable<APIResponse>;
    downloadExcel(payload:any):Observable<Blob>;
    BulkApproveReject(payload:any):Observable<APIResponse>;

}
