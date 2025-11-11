import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IHoldReleaseRequest {
  SalaryReleaseSearch(payload: any): Observable<APIResponse>;
  DownloadTemplate(Flag: any, Qzoneusername: any, createdBy: any): Observable<APIResponse>;
  UploadHoldRelease(formData: FormData): Observable<APIResponse>;
  HoldReleaseRequest(payload: any): Observable<APIResponse>;
  downloadExcel(payload: any): Observable<APIResponse>;

}
