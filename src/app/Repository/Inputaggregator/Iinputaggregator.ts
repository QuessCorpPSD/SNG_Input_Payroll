import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IInputaggregator {
    getmapname(companyid: any): Observable<APIResponse>;
    SiteSearch(companyId: any, groupId: any): Observable<APIResponse>;
    getQuessMasterAttributes(): Observable<APIResponse>;
    search(companyId: number, siteid: number): Observable<APIResponse>;
    getClientAttributes(companyId: number, siteid: number): Observable<APIResponse>;
    Uploadcli(formData: FormData): Observable<APIResponse>;
    Upload(formData: FormData): Observable<APIResponse>;
    downloadBillableReport(companyId: number, payPeriodId: number);
    Uploadclient(formData: FormData): Observable<APIResponse>;
    downloadBillableReportbilling(companyId: number, payPeriodId: number, siteid: number);
    UploadMSC(formData: FormData): Observable<APIResponse>;
    UploadOTC(formData: FormData): Observable<APIResponse>;
    downloadFinalSubmission(companyId: number, payPeriodId: number);
    clientattributeMaster(companyId: number, siteid: number): Observable<APIResponse>;
    clientattributeMasterdelete(companyId: any, siteid: number, templateId: any, CreatedBy: any): Observable<APIResponse>;
    MappingAttributesDelete(companyId: any, templateId: any, Quess_Template_Field_Id: any, CreatedBy: any): Observable<APIResponse>;
    // this is for Input aggregator attendance

    getQuessAttendanceAttributes(): Observable<APIResponse>;
    Uploadclientattendance(formData: FormData): Observable<APIResponse>;
    downloadBillableReportattendance(companyId: number, payPeriodId: number, siteid: number);
    Uploadattendanceattributes(formData: FormData): Observable<APIResponse>;
    Uploadattendancecli(formData: FormData): Observable<APIResponse>;
    searchattendance(companyId: number, siteid: number): Observable<APIResponse>;
    attclientattributeMasterdelete(companyId: any,siteid: number, templateId: any, CreatedBy: any): Observable<APIResponse>;
    downloadFinalSubmissionattendance(companyId: number, payPeriodId: number);

}