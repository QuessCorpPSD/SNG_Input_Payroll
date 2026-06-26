import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IGenericUpload {
    GetUploadTypes(userid: number): Observable<APIResponse>;
    UploadFile(formData: FormData): Observable<APIResponse>;
    DownloadTemplate(uploadType: string): Observable<HttpResponse<Blob>>;
}