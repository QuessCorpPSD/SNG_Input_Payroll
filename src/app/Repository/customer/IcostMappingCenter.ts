import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICostMappingCenter {
    SaveCostCenterDetails(payload: any): Observable<APIResponse>
    GetAllCostDetails(): Observable<APIResponse>;
    ExportCostCenterMapping(payload: any): Observable<any>;
    UploadCostCenterMapping(formData: FormData): Observable<APIResponse>

}