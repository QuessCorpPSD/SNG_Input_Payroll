import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IEmployeeservice } from '../../Repository/customer/Iemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService implements IEmployeeservice {
  env = environment;
  httpClient: any;
  constructor(private http: HttpClient) {

  }

  search(companyid: any, employeeid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/SearchDetails/' + companyid + '/' + employeeid);
  }
  Getsprstatus(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GetCategory');
  }
  GetMaterialStatus(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/MaritalStatus');
  }
  GetMapname(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/Costcentermapping/' + companyid);
  }
  GetPaycategory(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/Band/' + companyid);
  }
  Getcostcenter(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GetCostCenter/' + companyid);
  }
  GetDepartment(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/Department/' + companyid);
  }
  GetBusinessunit(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Entity/Search');
  }
  GetDesignation(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/Designation/' + companyid);
  }
  GetBillingDesignation(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/BillingDesignation/' + companyid);
  }
  GetGroupName(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GroupMater/' + companyid);
  }
  GetHiringstatus(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/HiringStatus');
  }
  GetEmploymenttype(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GetEmploymentType');
  }
  GetBloodGroup(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/Bloodgroup');
  }
  Exporttoexcel(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/ExportToExcel/' + companyid);
  }

  Getfundlevy(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SHG/GetCategory');
  }
  BulkPOUpload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/PostEmployeeUpload',
      formData
    );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/PostEmployeeSalaryUpload',
      formData
    );
  }
  GetBankname(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Bank/Search');
  }
  Getreligion(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GetReligion');
  }
  GetRfundcode(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'SHG/GetCategory');
  }
  Addemployeesave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/Create',
      payload,
    );
  }
  AddemployeeBanksave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/BankCreate',
      payload,
    );
  }
  AddemployeeINFOsave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/InformationCreate',
      payload,
    );
  }
  Addemployeecontactsave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/ContactCreate',
      payload,
    );
  }
  AddemployeePersonalsave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/PersonalCreate',
      payload,
    );
  }
  AddemployeePrevioussave(payload: any): Observable<APIResponse> {
    return this.http.post<APIResponse>(
      this.env.apiUrl + 'Employee/PreviousCreate',
      payload,
    );
  }
  SalarySearch(Employeeid: any,): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/SearchSalary/' + Employeeid);
  }
  GetEmployeesByCompanyId(payload: any): Observable<any> {
    return this.http.post<any>(
      this.env.apiUrl + 'PayTransaction/GetEmployeeDetailsByCompanyID',
      payload
    );
  }
    GetInvoiceLegalEntity(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Employee/GetLegalEntity');
  }

}
