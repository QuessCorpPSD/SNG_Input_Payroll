import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IDepartment {
    searchDepartment(companyCode: any): Observable<APIResponse>
    exportDepartment(payload: any): Observable<APIResponse>
    importDepartment(payload: any): Observable<APIResponse>
    saveDepartment(payload: any): Observable<APIResponse>

}