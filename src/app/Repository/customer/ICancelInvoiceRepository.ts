import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICancelInvoiceRepository {
    Search(companyId: any, payPeriodId: any): Observable<APIResponse>;
}