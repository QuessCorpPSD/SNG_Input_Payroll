import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IEmployeeservice {
    search(companyid: any, employeeid: any): Observable<APIResponse>;
    Getsprstatus(): Observable<APIResponse>;
    GetMaterialStatus(): Observable<APIResponse>;
    GetMapname(companyid: any): Observable<APIResponse>;
    GetPaycategory(companyid: any): Observable<APIResponse>;
    Getcostcenter(companyid: any): Observable<APIResponse>;
    GetDepartment(companyid: any): Observable<APIResponse>;
    GetBusinessunit(): Observable<APIResponse>;
    GetDesignation(companyid: any): Observable<APIResponse>;
    GetBillingDesignation(companyid: any): Observable<APIResponse>;
    GetGroupName(companyid: any): Observable<APIResponse>;
    GetHiringstatus(): Observable<APIResponse>;
    GetEmploymenttype(): Observable<APIResponse>;
    GetBloodGroup(): Observable<APIResponse>;
    Exporttoexcel(companyid: any): Observable<APIResponse>;
    Getfundlevy(): Observable<APIResponse>;
    BulkPOUpload(formData: FormData): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    GetBankname(): Observable<APIResponse>;
    Getreligion(): Observable<APIResponse>;
    GetRfundcode(): Observable<APIResponse>;
    Addemployeesave(payload: any): Observable<APIResponse>;
    AddemployeeBanksave(payload: any): Observable<APIResponse>;
    Addemployeecontactsave(payload: any): Observable<APIResponse>;
    AddemployeeINFOsave(payload: any): Observable<APIResponse>;
    AddemployeePersonalsave(payload: any): Observable<APIResponse>;
    AddemployeePrevioussave(payload: any): Observable<APIResponse>;
    GetEmployeesByCompanyId(payload: any): Observable<any>;
    SalarySearch(Employeeid: any,): Observable<APIResponse>;

}