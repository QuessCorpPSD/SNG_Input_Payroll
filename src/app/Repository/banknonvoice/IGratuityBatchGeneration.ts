import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IGratuityBatchGeneration {

    Search(fromDate: any, toDate: any): Observable<APIResponse>;
    Generate(payload: any): Observable<APIResponse>;
    ExportToExcel(payload: any): Observable<APIResponse>;
    NonInvoiceGratuityUTRUpload(payload: any): Observable<APIResponse>;
    NonInvoiceGratuityUTRColumnNames(createdBy: number): Observable<APIResponse>;

}