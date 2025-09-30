import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface ICommonService {
    GetProcessCategory(): Observable<APIResponse>
    GetReporting(): Observable<APIResponse>
    GetTeamLeader(): Observable<APIResponse>
    GetMangers(): Observable<APIResponse>
    GetFun_Head(): Observable<APIResponse>
    GetRoles(): Observable<APIResponse>
    GetAccessType(): Observable<APIResponse>
    GetUserById(userId): Observable<APIResponse>
    GetAllUser(): Observable<APIResponse>
    GetUserByEmployeeId(employeeID): Observable<APIResponse>
    UserCreate(val): Observable<APIResponse>
    GetFinancialYears(): Observable<APIResponse>
    GetCompanyCodes(userId: number): Observable<APIResponse>
    UserCreate(val: any): Observable<APIResponse>
    GetPayperiodbyCompany(companyId: any): Observable<APIResponse>
    GetCurrentPayperiod(companyId: any): Observable<APIResponse>
    GetMapNamebyCompany(companyId: any): Observable<APIResponse>
    GetInputType(): Observable<APIResponse>
    LotStatus(formData: FormData): Observable<APIResponse>
    GetSitesByCompanyId(companyId: any): Observable<APIResponse>
    GetCityByCompanyCode(companyId: any, Group_Id: any): Observable<APIResponse>
    GetAllState(): Observable<APIResponse>;
    GetCityByStateId(stateId): Observable<APIResponse>;
         GetInvoiceType():Observable<APIResponse>;

}