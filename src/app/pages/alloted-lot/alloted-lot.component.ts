import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, InjectionToken, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {  } from '@angular/material/input';
import { SharepayregisterComponent } from './sharepayregister/sharepayregister.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../Shared/encryption.service';
import { TimerComponent } from './timer/timer.component';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { AssignmentService } from '../../Service/Assignment.service';
import { LoadingService } from './progress/LoadingService ';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { catchError, filter, interval, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimatetimeValidationComponent } from './estimatetime-validation/estimatetime-validation.component';



const auth= InjectionToken<IAssignmentService>;
@Component({
  selector: 'app-alloted-lot',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,SharepayregisterComponent,TimerComponent,ReactiveFormsModule,MatStepperModule,MatButtonModule,MatInputModule],
  templateUrl: './alloted-lot.component.html',
  styleUrl: './alloted-lot.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
   providers: [
          {
            provide: auth,
            useClass: AssignmentService,
          }
        ],
  animations: [
    trigger('growOnHover', [
      state('default', style({
        transform: 'scale(1)'
        
      })),
      state('hovered', style({
        transform: 'scale(5,5)',
        backgroundColor: 'White',
        borderRadius: '2px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        border:'1px solid #ccc',
        height:'15px',
        width:'10px',
        fontSize:'0.5em'
        
      })),
      transition('default <=> hovered', animate('300ms ease-in-out')),
    ])
  ]
})

export class AllotedLotComponent implements OnInit {
private destroy$ = new Subject<void>();
  isLinear:boolean=true;
  AllotmentForm!: FormGroup;
  lot: number | null = null;
  hc: string | null = '';
  companycode: string | null = '';
  category: string | null = '';
  estimateTime:string|null='';
  lotAssignment!:any ;
  bagroundColorCode:string='';
  TotalSecond!:number;
  RequestforModification:boolean=false;
  ishovered=false;
  sharepayregister:boolean=false;
  allotment:any=[];
  lotStatus:any;
  isLoading=false;
  isDisable=false;
  isPayDisable=false;
   allot:any=[];
   ismatching:boolean=false;
   isRevised:boolean=false;
   InputText:string="";
   showNodification:boolean=false; 
  constructor(private route:ActivatedRoute,
    private router:Router,
    private decry:EncryptionService,
    private loadingService:LoadingService,
    private _sessionStoreage:SessionStorageService ,
  @Inject(auth)private _authService:IAssignmentService,
  private snackBar: MatSnackBar,
  private fb: FormBuilder,

  ) {

    this.AllotmentForm = this.fb.group({
      allotemt: this.fb.array([]),
      "RaiseQuery" : new FormControl('')
    });

  }
  GetIsmatch(ismatching):boolean
  {
    if (ismatching == 'Matching') {
      return true;
    }
    else{
      return false;
    }
  }
  GetAllotmentByLots():FormArray
{
  this.allot=this.AllotmentForm.get("allotemt") as FormArray;    
  return this.allot;
}
  GetAllotmenetDetail(val):FormGroup{
    
  const matchingstatus=this.GetMatchingText(val.ismatching,val.input_Headcount,val.output_Headcount)
  return this.fb.group({
     InputLot_Id: new FormControl(val.inputLot_Id),
     CategoryListName: new FormControl(val.input_Category),
     Input: new FormControl(val.input_Headcount),
     Output:new FormControl(val.output_Headcount),
     Mismatch:new FormControl(matchingstatus),     
     Remarks:new FormControl(val.remarks)
  })
}
ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  LotestimateValidation(userId: string): void {
  const request = {
    "userId":userId,
    "companycode": this.lotAssignment.company_Id,
    "pay_period_Id": this.lotAssignment.pay_period_id,
    "lot_number": this.lotAssignment.lot_Number
  };


  // if (!this.showNodification) {
  // const startTime = new Date();
  // const startMinutes = startTime.getMinutes();

  // interval(1000).pipe(
  //   map(() => {
  //     console.log(this.estimateTime);
  //     console.log(startMinutes);
  //     const ratio =  ((startMinutes || 1)/Number(this.estimateTime) )*0.1; // Avoid divide-by-zero
  //     return ratio;
  //   }),
  //   takeUntil(this.destroy$)
  // ).subscribe({
  //   next: (ratio) => {
  //     console.log("Ratio:", ratio);
  //     // Do something with the calculated ratio
  //   },
  //   error: (err) => {
  //     console.error('Polling error:', err);
  //     this.destroy$.next();
  //   }
  // });
//}


   
      interval(1000).pipe(
        switchMap(() => this._authService.LotValidationEstimate(request)),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          const data = response?.Data; 
          if (!data || !data.mailType) {
//  console.error('Invalid data or missing mailType:', data);
  return;
}
//console.log('Detected mail type:', data.mailType);
          switch (data.mailType?.trim()?.toUpperCase()) {
            case 'S':
              this.showNodification = true;
              if(this.showNodification)
              {
              this.snackBar.openFromComponent(EstimatetimeValidationComponent, {
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
                duration: 50000000,
                data: {
                  estimateTime: this.estimateTime,
                  score: data.score,
                  TotalSecond: this.TotalSecond,
                  userId,
                  companycode: request.companycode,
                  pay_period_Id: request.pay_period_Id,
                  lot_number: request.lot_number
                },
                panelClass: ['custom-snackbar']
              });
            }
              break;

            case 'T':
               this.showNodification = false;
              this.sendFeedbackMail(data.teamLead_Email_Id, data);
              break;
                case 'M':
                  this.showNodification = false;
              this.sendFeedbackMail(data.manager_Email_Id, data);
              break;
                case 'F':
                  this.showNodification = false;
              this.sendFeedbackMail(data.fun_Head_EmailId, data);
              break;
              case 'N': this.showNodification=false;
              break;
            default:
              break;
            
          }

          //this.destroy$.next(); // Stop polling after handling response
        },
        error: (err) => {
          console.error('Polling error:', err);
          //this.destroy$.next(); // Stop polling on error too (optional)
        }
      });
    
}

private sendFeedbackMail(email: string, data: any): void {
  const mailRequest = {
    email,
    mobileNumber: "6379793916",
    body: data.body,
    subject: data.subjects,
    ColorCode: "#FFB224"
  };

  this._authService.FeedBackMail(mailRequest).subscribe({
    next: (res) => console.log('Mail sent:', res.Data),
    error: (err) => console.error('Mail sending failed:', err)
  });
}

LotestimateValidation_Old(userId)
{
 
  var request={
    "userId":userId,
    "companycode":this.lotAssignment.company_Id,
    "pay_period_Id":this.lotAssignment.pay_period_id,
    "lot_number": this.lotAssignment.lot_Number
}
  if (!this.showNodification) {
    interval(1000) // every 1 second
      .pipe(
        switchMap(() => this._authService.LotValidationEstimate(request)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
         
          if (data?.Data?.mailType === 'Self') {
            this.showNodification = true;

            this.snackBar.openFromComponent(EstimatetimeValidationComponent, {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 50000000,
              data: {
                estimateTime: this.estimateTime,
                score: data?.Data.score,
                TotalSecond: this.TotalSecond,
                userId: userId,
                companycode: this.lotAssignment.company_Id,
                pay_period_Id: this.lotAssignment.pay_period_id,
                lot_number: this.lotAssignment.lot_Number
              },
              panelClass: ['custom-snackbar'] // Optional: for styling
            });
          }
          else if (data?.Data?.mailType === 'Manager') {
            var request = {
              "email": data?.Data?.manager_Email_Id
              ,
              "mobileNumber": "6379793916",
              "body": data?.Data?.body,
              "subject": data?.Data?.subjects,
              "ColorCode": "#FFB224"

            }
            this._authService.FeedBackMail(request).subscribe({
              next: res => { console.log(res.Data) }
            })
          }
          else {
            var requests = {
              "email": data?.Data?.fun_Head_EmailId
              ,
              "mobileNumber": "6379793916",
              "body": data?.Data?.body,
              "subject": data?.Data?.subjects,
              "ColorCode": "#FFB224"

            }
            this._authService.FeedBackMail(requests).subscribe({
              next: res => { console.log(res.Data) }
            })
          }
          this.destroy$.next();
        },
        error: (err) => console.error('Polling error:', err)
      });
  }

  
}
  ShareRegisterModelPopup(){
    this.sharepayregister=true;
  }
  closeModal(){
    this.sharepayregister=false;
  }
  downloadExcelFromBase64(base64: string, filename: string) {
      this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  PayregisterDownload()
  {
    this.isLoading=true;
   this.isPayDisable=true;
    this.loadingService.show();
   var request= {
      "companycode":this.lotAssignment.company_Id,
      "pay_period_Id":this.lotAssignment.pay_period_id,
      "lotNumber":this.lotAssignment.lot_Number,
      "payroll_input_type":this.lotAssignment.payroll_Input_Type,
      "pay_period":this.lotAssignment.pay_period
  }

  
  
    this._authService.ReconPayRegisterDownload(request).subscribe({
      next: res => { if(res.StatusCode==200){
       
        const data=res.Data;
        var base64=data.file;
         let fileName = `${'Recon_Pay_Register'}-${this.lotAssignment.company_code} _ ${this.lotAssignment.pay_period}_ ${this.lotAssignment.lot_Number}`;
        this.downloadExcelFromBase64(base64,fileName)
        this.isLoading=false;
        this.isPayDisable=false;
      }

      },
      error: error => { this.isLoading=false; console.error('Error:', error)}
    })
    this.GetLotStatus(this.lotAssignment.company_Id,this.lotAssignment.pay_period_id,this.lotAssignment.lot_Number,"R",this.lotAssignment.payroll_Input_Type,this.lotAssignment.createdOn);        
    this.loadingService.hide();
  }
ngOnInit(): void {
  const userdetail = this._sessionStoreage.getItem('UserProfile');

  if (!userdetail) return;

  const user = JSON.parse(this.decry.decrypt(userdetail));
  
  this.route.queryParams.subscribe(params => {
    const encryptedItem = params['items'];
    if (!encryptedItem) return;

    const param = this.decry.decrypt(encryptedItem);
    this.lotAssignment = JSON.parse(param);

    // Set input label and revised flag
    this.InputText = this.lotAssignment.revisedtime > 0 ? "Revised Input" : "Input";
    this.isRevised = this.lotAssignment.revisedtime > 0;

    // Start validation and data loading
  //  this.LotestimateValidation(user.user_Id);

//this.EstimateValidation(user.user_Id); selvaraj
//this.LotEstimatValidate(user.user_Id)
    this.GetAllotment(
      this.lotAssignment.company_code,
      this.lotAssignment.pay_period,
      this.lotAssignment.lot_Number
    );

    this.GetAllotmentByLots();

    this.GetLotStatus(
      this.lotAssignment.company_Id,
      this.lotAssignment.pay_period_id,
      this.lotAssignment.lot_Number,
      "M",
      this.lotAssignment.payroll_Input_Type,
      this.lotAssignment.createdOn
    );

    this.TotalSecond = this.convertToSeconds(this.lotAssignment.estimate_time);

    this.Reqeustformodification();
  });
}
 userresponses:any;
 countdown!:number;
EstimateValidation(userId: number) {
  const request = {
    "company_Id": this.lotAssignment.company_Id,
    "payperiodId": this.lotAssignment.pay_period_id,
    "lotnumber": this.lotAssignment.lot_Number,
    "Payroll_Input_Type": this.lotAssignment.payroll_Input_Type,
    "CreatedOn": this.lotAssignment.createdOn,
    "userId": userId,
    "ActionType":""
  };

  // First get the response
  this._authService.UserLotValidation(request).subscribe({
    next: (res) => {
      this.userresponses = res.Data;
     
     
     this.countdown = (this.userresponses.remainingMinutes || 0) * 60;
      // Start polling only after receiving response
      interval(1000).pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (!this.userresponses) return;
          this.showNodification = true;

            if (this.countdown <= 0) {
            this.showNodification = false;
            this.destroy$.next(); // ⛔ Stop timer
            const data = this.userresponses;
          if (!data?.actionType) return;

          const mailType = data.actionType.trim().toUpperCase();
          
            switch (mailType) {
            case 'S':
              if (!this.showNodification) {
                this.showNodification = true;
                this.snackBar.openFromComponent(EstimatetimeValidationComponent, {
                  horizontalPosition: 'right',
                  verticalPosition: 'bottom',
                  duration: 50000000,
                  data: {
                    estimateTime: this.estimateTime,
                    score: data.score,
                    TotalSecond: this.TotalSecond,
                    userId,
                    request : request,
                    actionType:'S'
                  },
                  panelClass: ['custom-snackbar']
                });
              }
              break;

            case 'T':
              this.showNodification = false;
              this.sendFeedbackMail(data.teamLead_Email_Id, data);
              break;

            case 'M':
              this.showNodification = false;
              this.sendFeedbackMail(data.manager_Email_Id, data);
              break;

            case 'F':
              this.showNodification = false;
              this.sendFeedbackMail(data.fun_Head_EmailId, data);
              break;

            case 'N':
              this.showNodification = false;
              break;

            default:
              console.warn(`Unhandled mailType: ${mailType}`);
              break;
          }
            return;
          }
          // if (currentMinute >= this.userresponses.remainingMinutes) {
          //   this.showNodification = false;
          //   this.destroy$.next(); // Stop
          // }

          

          
        })
      ).subscribe();
    },
    error: (err) => console.error(err)
  });

  
}

LotEstimatValidate(userId)
{
  const request = {
    "company_Id": this.lotAssignment.company_Id,
    "payperiodId": this.lotAssignment.pay_period_id,
    "lotnumber": this.lotAssignment.lot_Number,
    "Payroll_Input_Type": this.lotAssignment.payroll_Input_Type,
    "CreatedOn": this.lotAssignment.createdOn,
    "userId": userId,
    "ActionType":""
  };
  this._authService.UserLotValidation(request).subscribe({
    next: (res) => {
      this.userresponses = res.Data;
      console.log(this.userresponses);
      this.countdown = (this.userresponses.remainingMinutes || 0) * 60;
    interval(5000).pipe(
  takeUntil(this.destroy$),
  tap(() => {
    //console.log(this.countdown)
    this.countdown--;
    if (this.countdown <= 0) {
      this.destroy$.next(); // Stop the timer
      this.callFinalValidation(request, userId);
    }
  })
).subscribe();
    },
      error:err=>console.log(err)
    })
}

callFinalValidation(request: any, userId: number) {
  this._authService.UserLotValidation(request).subscribe({
    next: (res) => {
      const data = res?.Data;
      if (!data?.actionType) return;

      const mailType = data.actionType.trim().toUpperCase();

      switch (mailType) {
        case 'S':
          if (!this.showNodification) {
            this.showNodification = true;
            this.snackBar.openFromComponent(EstimatetimeValidationComponent, {
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              duration: 50000000,
              data: {
                estimateTime: this.estimateTime,
                score: data.score,
                TotalSecond: this.TotalSecond,
                userId,
                request: request,
                actionType: 'S'
              },
              panelClass: ['custom-snackbar']
            });
          }
          break;

        case 'T':
          if(data.teamLead_Email_Id)
          {
            this.sendFeedbackMail(data.teamLead_Email_Id, data);
          }
         
          break;

        case 'M':
          if(data.manager_Email_Id)
          {
            this.sendFeedbackMail(data.manager_Email_Id, data);
          }
         
          break;

        case 'F':
          if(data.fun_Head_EmailId)
          {
          this.sendFeedbackMail(data.fun_Head_EmailId, data);
          }
          break;

        case 'N':
          break;

        default:
          console.warn(`Unhandled mailType: ${mailType}`);
          break;
      }
    },
    error: (err) => console.error('Final validation failed', err)
  });
}



GetMatchingText(ismatch,output,input):string
{ 
  if (output == null || input == null) {
    return "Pending"
  }
  
  else {
    if (ismatch) {
      return "Matching"
    }
    else {
      this.RequestforModification=true;
      return "Variance"
    }
  }
}
QCVerifyButtonDisable(val)
{
  this.isDisable=val;
}
QCVerify(){
  this.isLoading=true;
  const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this.decry.decrypt(userdetail!));  
  this.isDisable=true;
const catg=this.AllotmentForm.get("allotemt")?.value;   
  var request={
    "Company_Id":this.lotAssignment.company_Id,
    "CompanyCode":this.lotAssignment.company_code,
    "Pay_Period":this.lotAssignment.pay_period,
    "pay_period_id":this.lotAssignment.pay_period_id,
    "lotnumber":this.lotAssignment.lot_Number,
    "UpdateStatus":"Q",
    "Payroll_Input_Type":this.lotAssignment.payroll_Input_Type,
    "createdon":this.lotAssignment.createdOn,
    "userId":user.user_Id,
    "allotments":catg,
    "RaiseQuery":this.AllotmentForm.get("RaiseQuery")?.value 
}

  this._authService.QCLotVerify(request).subscribe({
    next: res => {
      
      this.lotStatus = res.Data;
      this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);   
      if(res.Data.qC_Verified_Status)
      {
        const inputType = this.lotAssignment.payroll_Input_Type;
        const label = inputType === 'Salary' ? inputType : 'ONETIME';
        let fileName = `${this.lotAssignment.company_code}_${this.lotAssignment.company_name}_${label}_${this.lotAssignment.pay_period}_${this.lotAssignment.lot_Number}`;
        fileName = fileName.replace(/\s+/g, '_'); 
        this.downloadExcelFromBase64(this.lotStatus.fileResponse.file,fileName);
      }   
      else{
         this.isLoading=false;
        window.alert("Pay Register not download");
      }
      
      
    },
    error: error =>{ this.isLoading=false; console.error('Error:', error)}
  });
}



InputDownload(){
  this.isLoading=true;
   
    this.loadingService.show();
   var request= {
      "companycode":this.lotAssignment.company_Id,
      "pay_period_Id":this.lotAssignment.pay_period_id,
      "lotNumber":this.lotAssignment.lot_Number,
      "InputType":this.lotAssignment.payroll_Input_Type
  }
    this._authService.InputFileDownload(request).subscribe({
      next: res => { if(res.StatusCode==200){
        const data=res.Data;
        var base64=data.file;
        let fileName = `${this.lotAssignment.company_code} _ ${this.lotAssignment.pay_period}_ ${this.lotAssignment.lot_Number}`;
        this.downloadExcelFromBase64(base64,fileName)
        this.isLoading=false;
      }

      },
      error: error => console.error('Error:', error)
    })

}
GetLotStatus(Company_Id,pay_period_id,lotnumber,UpdateType,payroll_Input_Type,createdOn){
const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this.decry.decrypt(userdetail!)); 
  var request={
    "Company_Id":Company_Id,
    "pay_period_id":pay_period_id,
    "lotnumber":lotnumber,
    "UpdateStatus":UpdateType,
    "Payroll_Input_Type":payroll_Input_Type,
    "createdOn":createdOn,
    "userId":user.user_Id
};

  this._authService.LotStatus(request).subscribe({
    next: res => { this.lotStatus = res.Data;
      this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);
    },
    error: error => console.error('Error:', error)
  });
}

GetAllotment(companyCode,payPeriod,lot)
{

  var request={
    "companyCode":companyCode,
    "payPeriod":payPeriod,
    "lot":lot
  }
  this._authService.GetAllotment(request).subscribe({
    next: res => {
      // if(this.lotAssignment.payroll_Input_Type =="Other Input")
      // {
      //   this.isPayDisable = true;
      // }
      // else {
      //   this.isPayDisable = false;
      // }
      
      this.allotment = res.Data;
      this.allotment.forEach(element => {
        this.allot.push(this.GetAllotmenetDetail(element));
      });

    },
    error: error => console.error('Error:', error)
  });
  

}
RequestForRevised(lotAllocated):void{
  this.isLoading=true;
    
    const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this.decry.decrypt(userdetail!));
  
  this.isDisable=true;
const catg=this.AllotmentForm.get("allotemt")?.value;   
  var request={
    "Company_Id":this.lotAssignment.company_Id,
    "CompanyCode":this.lotAssignment.company_code,
    "Pay_Period":this.lotAssignment.pay_period,
    "pay_period_id":this.lotAssignment.pay_period_id,
    "lotnumber":this.lotAssignment.lot_Number,
    "UpdateStatus":"R",
    "Payroll_Input_Type":this.lotAssignment.payroll_Input_Type,
    "createdon":this.lotAssignment.createdOn,
    "userId":user.user_Id,
    "allotments":catg
}
  this._authService.QCLotVerify(request).subscribe({
    next: res => {
      
      
      this.lotStatus = res.Data;
      
      // if(res.Data.qC_Verified_Status)
      // {
      //   this.QCVerifyButtonDisable(res.Data.qC_Verified_Status);
      //   this.downloadExcelFromBase64(this.lotStatus.fileResponse.file, "PayRegister");
      // }
      // else{
      //   window.alert("Pay Register not download")
      // }
      
      
    },
    error: error =>{ this.isLoading=false; console.error('Error:', error)}
  });
  

}

PayResgisterDownload(){

}
SharedPayRegisterUpload()
{

}
convertToSeconds(time: number): number {
  // const parts = time.split(':');
 
  // if (parts.length !== 3) return 0;

  // const [h, m, s] = parts.map(Number);
  // if (isNaN(h) || isNaN(m) || isNaN(s)) return 0;

  // return h * 3600 + m * 60 + s;

  const seconds = time * 60;

 return  seconds;
   
}
  Reqeustformodification() {
    // if (this.lotAssignment?.newJoinee.ismatching && this.lotAssignment?.attendance.ismatching &&
    //   this.lotAssignment?.adhoc.ismatching && this.lotAssignment?.increment && this.lotAssignment?.otherInput.ismatching) {
      this.RequestforModification = false;
    //}
  }
RetuenHome(){
  this.router.navigate(['/Master/Assignment'])
}


   
}

export interface LotAllotmentStatus { 
  InputLot_Id:number;
  company_Code: string;
  company_name: string;
  pay_period:string;
  lot_Number: number;
  payroll_Input_Type: string;
  revisedtime: string;
  assignment:string;  
  headCount: string;
  category: string;
  estimateTime:string;
}



