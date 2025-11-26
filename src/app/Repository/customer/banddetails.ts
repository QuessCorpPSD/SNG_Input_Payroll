import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBanddetails {
    GetAllBandDetails(companyId: any): Observable<APIResponse>;
    SaveBandDetails(payload: any): Observable<APIResponse>
}