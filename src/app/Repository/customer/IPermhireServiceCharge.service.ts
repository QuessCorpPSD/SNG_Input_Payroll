import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IPermHireServiceCharge {

    search(payload: any): Observable<APIResponse>;
    create(payload: any): Observable<APIResponse>;
    searchJobCategory(payload: any): Observable<APIResponse>;
    createJobCategory(payload: any): Observable<APIResponse>;
    searchJobSubCategory(CompanyId: number): Observable<APIResponse>;
    getJobCategory(): Observable<APIResponse>;
    exportJobSubCategory(CompanyId: number): Observable<APIResponse>;
    createJobSubCategory(payload: any): Observable<APIResponse>;
    GetPermHireMasterSearch(payload: any): Observable<APIResponse>;
    PermHireMasterApproveReject(payload: any): Observable<APIResponse>;
}