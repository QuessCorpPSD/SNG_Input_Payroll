import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIResponse } from '../Models/apiresponse';

export interface IProvisionalInvoiceRepository {
  GetProvisionalInvoice(ComapnayId: string, payPeriodId: string, userId: string): Observable<APIResponse>;
  ProvisionalInvoiceInitiate(requestPayload: any): Observable<APIResponse>;
}
