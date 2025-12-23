import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ITds {
    GetFinancialYear(): Observable<APIResponse>;
    GetCategory(): Observable<APIResponse>;
    Search(financialyearid: any, category: any, tdsslabid: any): Observable<APIResponse>;
    Exporttoexcel(financialyearid: any, category: any): Observable<APIResponse>;
    CreateupdateDelete(payload: any): Observable<APIResponse>;
}