import { Component, Inject,EventEmitter, OnInit, Output, InjectionToken } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TimerComponent } from '../timer/timer.component';
import { IAssignmentService } from '../../../Repository/IAssignment.service';
import { AssignmentService } from '../../../Service/Assignment.service';
const auth= InjectionToken<IAssignmentService>;
@Component({
  selector: 'app-estimatetime-validation',
  standalone: true,
  imports: [],
  templateUrl: './estimatetime-validation.component.html',
  styleUrl: './estimatetime-validation.component.css',
   providers: [
            {
              provide: auth,
              useClass: AssignmentService,
            }
          ]
})
export class EstimatetimeValidationComponent implements OnInit {
  TotalSecond:any;
  @Output() unterstoods = new EventEmitter<boolean>();
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    @Inject(auth)private _authService:IAssignmentService,
    public snackBarRef: MatSnackBarRef<EstimatetimeValidationComponent>
  ) {
   // console.log(this.data);

  
  }
ngOnInit(): void {
  this.TotalSecond=this.data.TotalSecond
}
matsnackbarClose()
{
   const request = {
    "company_Id": this.data.request.company_Id,
    "payperiodId": this.data.request.payperiodId,
    "lotnumber": this.data.request.lotnumber,
    "Payroll_Input_Type": this.data.request.Payroll_Input_Type,
    "CreatedOn": this.data.request.CreatedOn,
    "userId": this.data.request.userId,
    "ActionType":this.data.actionType

  };
  this._authService.UserLotValidationAdd(request).subscribe({
    next:res=>{res.Data},
    error:err=>{console.log(err);}
  })
  this.unterstoods.emit(false);
  this.snackBarRef.dismiss();
}
Understood()
{
  
  const request = {
    "company_Id": this.data.request.company_Id,
    "payperiodId": this.data.request.payperiodId,
    "lotnumber": this.data.request.lotnumber,
    "Payroll_Input_Type": this.data.request.Payroll_Input_Type,
    "CreatedOn": this.data.request.CreatedOn,
    "userId": this.data.request.userId,
    "ActionType":this.data.actionType

  };
  this._authService.UserLotValidationAdd(request).subscribe({
    next:res=>{res.Data},
    error:err=>{console.log(err);}
  })
  this.unterstoods.emit(false);
  this.snackBarRef.dismiss();
}
}
