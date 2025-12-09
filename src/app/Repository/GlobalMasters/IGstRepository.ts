import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IGstRepository {
    Search(val: any): Observable<APIResponse>;
    ExporttoExcel(val: any): Observable<APIResponse>
    Create(payload: any): Observable<APIResponse>;
    Edit(payload: any): Observable<APIResponse>;
    GetEntity(): Observable<APIResponse>;
    Delete(gstmasterid: any, userid: any): Observable<APIResponse>;

}