import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IItcalender {
    Search(val1:any,val2:any): Observable<APIResponse>;
    GetFinancialYear(): Observable<APIResponse>;
    Create(payload:any): Observable<APIResponse>;
}