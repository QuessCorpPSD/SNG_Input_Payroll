import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IEPORepository {
    GetEPODownloadTemplate(userId: string): Observable<APIResponse>
    BulkPOUpload(formData: FormData): Observable<APIResponse>
    SearchEmployeePO(CompanyId: string, PONumber: string, clientEmployeeId: string, EActive: string,pricingtype_Id:string): Observable<APIResponse>;
}