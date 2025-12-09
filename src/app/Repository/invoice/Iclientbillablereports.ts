import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IClientBillableReport {
    EntitySearch(): Observable<APIResponse>;

Exporttoexcel(entityid: any, fromdate: string, todate: string): Observable<APIResponse> ;

}