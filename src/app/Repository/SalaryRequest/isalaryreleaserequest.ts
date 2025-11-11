import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ISalaryReleaseRequest {

  SalaryReleaseSearch(payload: any): Observable<APIResponse>;
  SalaryReleaseRequest(payload: any): Observable<APIResponse>;
  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
  UploadSalaryRequest(formData: FormData): Observable<APIResponse>;
}
