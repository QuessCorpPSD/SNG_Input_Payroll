import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';
import { environment } from '../../../environments/environment.development';
import { IInputaggregator } from '../../Repository/Inputaggregator/Iinputaggregator';

@Injectable({
  providedIn: 'root'
})
export class InputaggregatorService implements IInputaggregator {
  env = environment

  constructor(private http: HttpClient) { }
  getmapname(companyid: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `CostCenterMapping/GetAllCostCentertDetails/${companyid}`
    );
  }
  SiteSearch(companyId: any, groupId: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(this.env.apiUrl + `SiteMaster/Search/${companyId}/${groupId}`);
  }
  getQuessMasterAttributes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Billing/QuessAttributeMaster'
    );
  }
  search(companyId: number, siteid: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Billing/Search/${companyId}/${siteid}`);
  }

  getClientAttributes(companyId: number, siteid: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Billing/ClientAttributes/${companyId}/${siteid}`);
  }
  Uploadcli(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/ClientAttributesUpload',
        formData
      );
  }
  Upload(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/AttributesMappingUpload',
        formData
      );
  }
  downloadBillableReport(companyId: number, payPeriodId: number) {
    return this.http.get(
      `${this.env.apiUrl}Billing/billableReport/${companyId}/${payPeriodId}`
    );
  }
  Uploadclient(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/Upload',
        formData
      );
  }
  UploadMSC(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/miscUpload',
        formData
      );
  }

  UploadOTC(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/OTRateUpload',
        formData
      );
  }
  UploadOI(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/UploadOI',
        formData
      );
  }

  ClientattributesUploadOI(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/ClientAttributesUploadOI',
        formData
      );
  }
  attributesMappingUploadOI(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Billing/AttributesMappingUploadOI',
        formData
      );
  }
  downloadFinalSubmission(companyId: number, payPeriodId: number) {
    return this.http.get(
      `${this.env.apiUrl}Billing/FinalSubmission/${companyId}/${payPeriodId}`
    );
  }

  clientattributeMaster(companyId: number, siteid:number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Billing/ClientAttributesMaster/${companyId}/${siteid}`);
  }
  clientattributeMasterdelete(companyId: any, siteid: number, templateId: any, CreatedBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Billing/ClientAttributesDelete/${companyId}/${siteid}/${templateId}/${CreatedBy}`);
  }
  MappingAttributesDelete(companyId: any, templateId: any, Quess_Template_Field_Id: any, CreatedBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Billing/MappingAttributesDelete/${companyId}/${templateId}/${Quess_Template_Field_Id}/${CreatedBy}`);
  }


  // This is for Input Aggregator Attendance

  getQuessAttendanceAttributes(): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + 'Attendance/QuessAttendanceAttributeMaster'
    );
  }
  Uploadattendancecli(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/ClientAttributesUpload',
        formData
      );
  }
  Uploadattendanceattributes(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/AttributesMappingUpload',
        formData
      );
  }
  downloadBillableReportattendance(companyId: number, payPeriodId: number, siteid: number) {
    return this.http.get(
      `${this.env.apiUrl}Attendance/AttendanceReport/${companyId}/${payPeriodId}/${siteid}`
    );
  }

  downloadBillableReportbilling(companyId: number, payPeriodId: number, siteid: number) {
    return this.http.get(
      `${this.env.apiUrl}Attendance/billableReport/${companyId}/${payPeriodId}/${siteid}`
    );
  }
  Uploadclientattendance(formData: FormData): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/Upload',
        formData
      );
  }

  searchattendance(companyId: number, siteid: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Attendance/Search/${companyId}/${siteid}`);
  }

  ClientAttendanceAttributeMaster(companyId: number, siteid: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Attendance/ClientAttendanceAttribute/${companyId}/${siteid}`);
  }

  QuessAttendanceAttributeClient(companyId: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Attendance/QuessAttendanceAttributeClient/${companyId}`);
  }

  saveClientAttribute(payload: any): Observable<APIResponse> {
    return this
      .http.post<APIResponse>(
        this.env.apiUrl + 'Attendance/AttributesMappingCreate',
        payload
      );
  }
  attclientattributeMasterdelete(companyId: any,siteid: number, templateId: any, CreatedBy: any): Observable<APIResponse> {
    return this.http.get<APIResponse>(
      this.env.apiUrl + `Attendance/ClientAttributesDelete/${companyId}/${siteid}/${templateId}/${CreatedBy}`);
  }

  downloadFinalSubmissionattendance(companyId: number, payPeriodId: number) {
    return this.http.get(
      `${this.env.apiUrl}Attendance/FinalSubmission/${companyId}/${payPeriodId}`
    );
  }
}

