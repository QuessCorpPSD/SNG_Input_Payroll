import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IBillingpayfrequency {
    Search(companyId: any): Observable<APIResponse>;
    CopySearch(companyId: any, Startdate: any, enddate: any): Observable<APIResponse>;
    Exporttoexcel(companyId: any): Observable<APIResponse>;
    Getgrouptype(companyId: any): Observable<APIResponse>;
    GetAdddata(Startdate: Date, enddate: Date): Observable<APIResponse>;
    Addsave(BillingPayFrequencyRequest: any): Observable<APIResponse>;
}