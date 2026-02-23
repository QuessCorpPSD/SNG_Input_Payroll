import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseApproval {
    Search(batchtype: any, CollectionStatus: any, userid: any): Observable<APIResponse>;
    Batchtype(userid: any): Observable<APIResponse>;
    Export(batchtype: any, CollectionStatus: any, userid: any): Observable<APIResponse>;
    Apporoval(payload: any): Observable<APIResponse>;


}