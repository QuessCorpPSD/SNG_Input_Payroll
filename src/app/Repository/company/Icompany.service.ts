import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDepartment {
    searchCompany(companyCode: any): Observable<APIResponse>;
    exportCompany(payload: any): Observable<APIResponse>;
    getCompanyName(): Observable<APIResponse>;
    createCompany(payload: any): Observable<APIResponse>;
    getBankName(): Observable<APIResponse>;
    getCompanySearch(): Observable<APIResponse>;
    viewCompanyDetails(companyId: any): Observable<APIResponse>;
    updateCompany(payload: any): Observable<APIResponse>;
    deleteCompany(payload: any): Observable<APIResponse>;

}