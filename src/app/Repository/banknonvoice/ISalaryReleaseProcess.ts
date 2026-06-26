import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseProcess {

  SearchDetails(batchId: string): Observable<APIResponse>;
  GetNonInvoiceBatchid(companyId: number): Observable<APIResponse>;
  SalaryReleaseExport(payload: any): Observable<APIResponse>;

}