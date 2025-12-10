import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IClientaddress {
    ExporttoExcel(userid: any): Observable<APIResponse>;
    Search(payload: any): Observable<APIResponse>;
    clientaddressaddsave(payload: any): Observable<string>;
    getcostcenter(): Observable<APIResponse>;
    PostClientAddressUpload(payload: any): Observable<APIResponse>;
    PostClientAddressDelete(clientaddressid: any, userid: any): Observable<string>
}