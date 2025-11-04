import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IEPORepository {
    GetEPODownloadTemplate(userId: string): Observable<APIResponse>
    BulkPOUpload(formData: FormData): Observable<APIResponse>
    SearchEmployeePO(CompanyId: string, PONumber: string, clientEmployeeId: string, EActive: string, pricingtype_Id: string): Observable<APIResponse>;
    PODetailView(payload: any): Observable<APIResponse>;
    GetInvoiceDescription(groupName: string): Observable<APIResponse>;
    GetPOQuantyValues(val): Observable<APIResponse>;
    SaveEmployeePO(payload: any): Observable<APIResponse>;
    GetPoEmpDuration(payload: any): Observable<APIResponse>;
    GetPoEmpCalculation(payload: any): Observable<APIResponse>;
    GetPoEmpValue(payload: any): Observable<APIResponse>;
}