import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IBonusBatchGeneration } from '../../Repository/banknonvoice/IBonusBatchCreation';


@Injectable({
  providedIn: 'root'
})
export class BonusBatchGenerationService
  implements IBonusBatchGeneration {

  env = environment;

  constructor(private http: HttpClient) { }

  GetNonInvoiceEntity(): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'PartialBatchCreation/GetNonInvoiceEntity'
    );
  }

  GetBonusReleaseProcessdata(entityId: number): Observable<APIResponse> {

    return this.http.get<APIResponse>(
      this.env.apiUrl +
      'BonusBatchGeneration/GetBonusReleaseProcessdata/' +
      entityId
    );
  }

  Batchgenerate(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'BonusBatchGeneration/Batchgenerate',
      payload
    );
  }

  RejectBatch(payload: any): Observable<APIResponse> {

    return this.http.post<APIResponse>(
      this.env.apiUrl +
      'BonusBatchGeneration/RejectBatch',
      payload
    );
  }
}