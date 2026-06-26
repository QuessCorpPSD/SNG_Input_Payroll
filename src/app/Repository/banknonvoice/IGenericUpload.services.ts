import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IGenericUpload {
    GetUploadType(): Observable<APIResponse>;
    DownloadTemplate(uploadType: any): Observable<APIResponse>;
    Importgenericupload(payload: any): Observable<APIResponse>;
}