import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ICompanyPermission {
    bindEmployeeId(): Observable<APIResponse>;
    search(UserId: any, BusinessUnitId: any, CompanyPermissionId: any): Observable<APIResponse>;
    exportToExcel(UserId: any, Businessunitnameid: any): Observable<APIResponse>;
    addCompanyPermission(payload: any): Observable<APIResponse>;
    viewCompanyDetails(payload: any): Observable<APIResponse>;
    EditDetails(payload: any): Observable<APIResponse>
}