import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface INetpaysummary {
    ExporttoExcel(companycode: any, payperiodid: any): Observable<APIResponse>;
    GetEntityNames(): Observable<APIResponse>;
    GetPayperiod(): Observable<APIResponse>;
    ExporttoExcelByEntity(payload: any): Observable<APIResponse>;

}