import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssignmentService{
private responseSubject = new Subject<any>();
response$ = this.responseSubject.asObservable();

emitResponse(value: any) {
  this.responseSubject.next(value);
}
}