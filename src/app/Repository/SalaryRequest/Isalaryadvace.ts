import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryAdvance {
    DownloadTemplate(companycode: any, payperiodid: any, Qzoneusername: any): Observable<APIResponse> ;
    Upload(formData: FormData): Observable<APIResponse>;


}