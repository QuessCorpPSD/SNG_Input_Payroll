import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBonusBatchGeneration {

    GetBonusReleaseProcessdata(entityId: number): Observable<APIResponse>;
    Batchgenerate(payload: any): Observable<APIResponse>;
    RejectBatch(payload: any): Observable<APIResponse>;
    GetNonInvoiceEntity(): Observable<APIResponse>

}