import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';

export interface ILeaveMaster {
    LeavemasterSave(payload: any): Observable<APIResponse>;
    getLeavetypes(): Observable<APIResponse>;
    Searchleavetypemapping(companyid: any, siteid: any, action:string): Observable<APIResponse>;
    getquessmaster(): Observable<APIResponse>;
    LeavemastermappingSave(payload: any): Observable<APIResponse>;
    GetLeavePolicy(): Observable<APIResponse>;

    Getpaycode(companyid: any): Observable<APIResponse>;
    MiscpaycodeSave(payload: any): Observable<APIResponse>;
    Miscsearch(companyid: any, siteid: any, Action: string): Observable<APIResponse>;
    LeaveCategorySave(payload: any):Observable<APIResponse>;
    Searchleavecategory(companyid: any, siteid:any, Action): Observable<APIResponse>;
    Getfeecode(companyid: any, siteid: any): Observable<APIResponse>;
}