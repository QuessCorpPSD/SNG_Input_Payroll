import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPayfrequencyservice {
    Search(companyId: any): Observable<APIResponse>;
    Exporttoexcel(companyId: any): Observable<APIResponse>;
    Getgrouptype(companyId: any): Observable<APIResponse>;
    GetAdddata(Startdate: Date, enddate: Date): Observable<APIResponse>;
    Addsave(payload: any): Observable<APIResponse>;
}