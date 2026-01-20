import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IreportService {
    Reportlist(flag: any, Username: any): Observable<APIResponse>;
    Exporttoexcel(payload: any): Observable<APIResponse>;
}