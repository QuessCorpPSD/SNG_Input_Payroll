import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBankRepository {
    Search(): Observable<APIResponse>;
    // ExporttoExcel(val:any): Observable<APIResponse>
     PostAddBank(BankRequest: any): Observable<APIResponse>;
    // Edit(payload: any): Observable<APIResponse>;
}