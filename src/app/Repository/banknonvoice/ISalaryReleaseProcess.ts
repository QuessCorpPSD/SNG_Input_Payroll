import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseProcess {

  SearchDetails(batchId: string): Observable<APIResponse>;
  SalaryReleaseExport(payload: any): Observable<APIResponse>;
  GetBatchTypeList(userid: any): Observable<APIResponse>;
  GetSRPBatchList(BatchType:any,UserId:any): Observable<APIResponse>;
  GetSRPBatchData(BatchType:any,BatchId:any,UserId:any): Observable<APIResponse>;
  BatchIntitiate(payload:any): Observable<APIResponse>;
}