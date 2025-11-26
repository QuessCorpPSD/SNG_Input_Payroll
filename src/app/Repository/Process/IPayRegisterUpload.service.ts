import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPayRegisterService {
    exportPayRegisterUpload(payload: any): Observable<APIResponse>;
    importPayRegisterUpload(payload: any): Observable<APIResponse>;
    downloadTemplate(payload: any): Observable<APIResponse>;
}