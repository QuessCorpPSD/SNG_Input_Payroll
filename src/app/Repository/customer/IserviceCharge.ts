import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IServiceCharge {
    UploadOneTime(formData: FormData): Observable<APIResponse>;
    GetServiceCharge(): Observable<APIResponse>;
    GetServiceChargeNew(companyId: number): Observable<APIResponse>;
    GetServicechargetype(companyid: any): Observable<APIResponse>;
    SaveServiceCharge(request: any): Observable<APIResponse>;
    GetSearch(companyId: number, Service_Charge_Master_Id: number, Service_Charge_Type_Id: number): Observable<APIResponse>
    SaveSourcingType(request: any): Observable<APIResponse>;
    LoadUnitType(): Observable<APIResponse>;
    loadEmployee(companyid: any, employeeid: any): Observable<APIResponse>;
    deleteServiceCharge(payload: any): Observable<APIResponse>;
    upload(formData: FormData): Observable<APIResponse>;
}