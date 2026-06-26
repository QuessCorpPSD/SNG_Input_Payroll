import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IGratuityDownloadBatch {
    GetBatchid(BatchDate: any, GetBatch: any): Observable<APIResponse>;
     ExporttoExcel(filename: any): Observable<Blob>

}