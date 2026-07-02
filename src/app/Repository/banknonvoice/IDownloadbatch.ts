import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IDownloadBatch {

    GetBatchTypeList(userid: any): Observable<APIResponse>;
    GetBatchList(BatchType:any,BatchDate:any,UserId:any): Observable<APIResponse>;
    DownloadBatchFile(BatchId): Observable<Blob>;
}