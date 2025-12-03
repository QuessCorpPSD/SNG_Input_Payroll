import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IsiteMaster {
    SiteSearch(companyId: any, groupId: any): Observable<APIResponse>;
    SiteExportExcel(companyId: any, groupId: any): Observable<APIResponse>;
    GetPortalPayslipFormat(): Observable<APIResponse>;
    CreateSiteMaster(payload: any): Observable<APIResponse>;
}