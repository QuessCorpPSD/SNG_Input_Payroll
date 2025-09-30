import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';


export interface iperfomainvoiceservice {

    GetPerformaInvoice(CompanyId: string, PayPriod: string): Observable<APIResponse>;
    PerformaInvoiceSplit(formData: FormData): Observable<APIResponse>;
    PerformaInvoiceMerge(payload: any): Observable<APIResponse>;
    PerformaInvoiceInitiate(payload: any): Observable<APIResponse>;
}
