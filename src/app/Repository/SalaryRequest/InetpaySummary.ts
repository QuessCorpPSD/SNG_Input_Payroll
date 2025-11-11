import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface InetpaySummary{
        ExporttoExcel(companycode: any, payperiodid: any, Qzoneusername: any): Observable<APIResponse> ;

}