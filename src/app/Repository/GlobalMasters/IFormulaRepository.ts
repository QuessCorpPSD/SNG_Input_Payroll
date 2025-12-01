import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IFormulaRepository {
    GetFormulaSearch(paycode_Id:number): Observable<APIResponse>;
    payCategory(selectedCompanyId: number): Observable<APIResponse>;
    payCode(): Observable<APIResponse>;
}