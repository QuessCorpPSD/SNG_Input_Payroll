import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IFormulaRepository {
    GetFormulaSearch(paycode_Id: number): Observable<APIResponse>;
    payCategory(selectedCompanyId: number): Observable<APIResponse>;
    payCode(): Observable<APIResponse>;
    CreateFormula(payload: any): Observable<APIResponse>
    PaycodeSearch(payload: any): Observable<APIResponse>;
    PayrollType(): Observable<APIResponse>;
    CreateMCFormula(payload: any): Observable<APIResponse>;
    MultiCommercialPaycodes(): Observable<APIResponse>;
    GetMCFormulaSearch(): Observable<APIResponse>;
}