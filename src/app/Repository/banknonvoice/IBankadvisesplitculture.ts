import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBankAdviseSplitCulture {
    //GetBatchTypeList(userid: any): Observable<APIResponse>;
    getvendor(filter: any, Company_id: any): Observable<APIResponse>;
    getgroupname(Company_id:any,client_id:any);
    createbankadvisesplitculture(payload:any): Observable<APIResponse>;
    getsearcheditdata(payload:any): Observable<APIResponse>;
    uploadbankadvisesplitculture(formdata:FormData): Observable<APIResponse>;
}