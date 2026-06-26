import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPartialBatchCreation {
    GetNonInvoiceEntity(): Observable<APIResponse>;
    GetSalaryreleaseProcessdata(companyId: any): Observable<APIResponse>;
    Batchgenerate(payload: any): Observable<APIResponse>;
    ExportToExcel(
        companyId: any
    ): Observable<APIResponse>;

}