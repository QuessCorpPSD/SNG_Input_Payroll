import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IutrDetails {

    DownloadUtrDetails(companyId: any, payPeriodId: any, EntityId: any): Observable<APIResponse>;
    EntitySearch(): Observable<APIResponse>;
}