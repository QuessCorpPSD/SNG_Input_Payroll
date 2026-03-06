import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IBankInvoiceNEFTCulture {
    NeftCulturesearch(Company_Id: any, UserId: any): Observable<APIResponse>;
    NeftCultureExport(Company_Id: any, UserId: any): Observable<APIResponse>;
    NeftCultureSave(payload: any): Observable<APIResponse>;
    GetDetails(Company_Id: any, Mode: any, UserId: any): Observable<APIResponse>;


}