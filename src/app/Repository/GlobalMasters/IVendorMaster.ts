import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IVendorMaster {
    VendorSearch(): Observable<APIResponse>;
    CreateVendor(payload: any): Observable<APIResponse>;
}