import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IinvoiceLegalEntity {
    InvoiceSearch(): Observable<APIResponse>;
    CreateInvoice(payload: any): Observable<APIResponse>
}