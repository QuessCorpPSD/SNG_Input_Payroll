import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface ICompanyProvidedBenefits {
    GetFinancialyear(): Observable<APIResponse>;
    GetEmployee(comapnyid: any): Observable<APIResponse>;
    Search(comapnyid: any, employeeid: any): Observable<APIResponse>;
    GetPerkCodes(): Observable<APIResponse>;
    GetEligibleChildren(Effective_Date: any, Number_Of_Children: any): Observable<APIResponse>;
    save(payload: any): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
}