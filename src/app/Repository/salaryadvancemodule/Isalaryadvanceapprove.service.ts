import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISalaryadvanceapprove {
    DownloadTemplate(): Observable<APIResponse>;
    BulkPOUpload(formData: FormData): Observable<APIResponse> ;
      Search(companyId: any, payperiod:any): Observable<APIResponse> ;
}