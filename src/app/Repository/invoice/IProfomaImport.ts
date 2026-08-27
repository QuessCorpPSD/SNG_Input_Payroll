import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IProfomaImport {
    importProforma(formData: FormData): Observable<APIResponse>;
    search(CompanyId: number, PayperiodId: number, flag: string): Observable<APIResponse>;
    ProformaInitiate(payload: any): Observable<APIResponse>

}