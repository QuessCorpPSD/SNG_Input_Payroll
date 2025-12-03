import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDepartment {
    searchCompany(companyCode: any): Observable<APIResponse>;
    exportCompany(payload: any): Observable<APIResponse>;
    getCompanyName(): Observable<APIResponse>

}