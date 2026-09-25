import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IPayHistoryService {
    downloadPayHistory(CompanyId: string, year: string): Observable<APIResponse>;
    GetEntity(): Observable<APIResponse>;
    bindYear(): Observable<APIResponse>;
    downloadPayHistoryPDF(CompanyId: string, year: string): Observable<HttpResponse<Blob>>;
    downloadPayVarience(CompanyId: string,month: string, year: string): Observable<APIResponse>;
}