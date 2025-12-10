import { Observable } from 'rxjs';
import { APIResponse } from '../../Models/apiresponse';

export interface IinvoiceSummaryReport {
    ExporttoExcel(
        companycode: any,
        startDate: string,
        endDate: string,
        reportType: any,
        userId: any
    ): Observable<APIResponse>;
    ExporttoExcelByEntity(
        EntityId: any,
        startDate: string,
        endDate: string,
        reportType: any,
        userId: any
    ): Observable<APIResponse>;
    GetTaxTypes(): Observable<APIResponse>;
    GetEntityNames(): Observable<APIResponse>;

}