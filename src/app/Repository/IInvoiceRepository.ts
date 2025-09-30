import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IInvoiceRepository  {

    Search(val):Observable<APIResponse>;
    InvoiceInitiate(val): Observable<APIResponse> ;
    ExportToExcel(val): Observable<APIResponse>;
}