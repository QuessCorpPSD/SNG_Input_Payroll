import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IPermHireServiceCharge {

    search(payload: any): Observable<APIResponse>;
    create(payload: any): Observable<APIResponse>;
    searchJobCategory(payload: any): Observable<APIResponse>;
    createJobCategory(payload: any): Observable<APIResponse>;
    searchJobSubCategory(CompanyId: number): Observable<APIResponse>;
    getJobCategory(): Observable<APIResponse>;
    getJobSubCategory(companyid: number, jobCategoryId: number): Observable<APIResponse>;
    exportJobSubCategory(CompanyId: number): Observable<APIResponse>;
    createJobSubCategory(payload: any): Observable<APIResponse>;
    GetPermHireMasterSearch(payload: any): Observable<APIResponse>;
    PermHireMasterApproveReject(payload: any): Observable<APIResponse>;
    GetPermHireRequestSearch(CompanyId: number): Observable<APIResponse>;
    PermHireRequest(payload: any): Observable<APIResponse>;
    GetPermHireServiceChargeType(): Observable<APIResponse>;
    GetPermHireServiceChargeCategory(): Observable<APIResponse>;
    GetPermHireServiceChargeSearch(CompanyId: number): Observable<APIResponse>;
    CreateUpdateDelete_PermHireServiceCharge(payload: any): Observable<APIResponse>;
    GetMapNameByCompany(CompanyId: number): Observable<APIResponse>;
    GetPermHireServiceChargeJobCategory(payload: any): Observable<APIResponse>;
    GetPermHireServiceChargeJobSubCategory(payload: any): Observable<APIResponse>;
    SearchPermHireInvoiceInitiate(companyId: number, payPeriodId: number): Observable<APIResponse>;
    ExportPermHireInvoiceInitiate(companyId: number, payPeriodId: number): Observable<APIResponse>;
    PermHireInvoiceInitiate(payload: any): Observable<APIResponse>;
    Getdetails(payload: any): Observable<APIResponse>;
}
