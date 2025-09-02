import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Inject, InjectionToken, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { IAssignmentService } from '../../../Repository/IAssignment.service';
import { AssignmentService } from '../../../Service/Assignment.service';
import { stringify } from 'node:querystring';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

const auth= InjectionToken<IAssignmentService>;
@Component({
  selector: 'sharepayregister',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sharepayregister.component.html',
  styleUrl: './sharepayregister.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
   providers: [
            {
              provide: auth,
              useClass: AssignmentService,
            }
          ]
})
export class SharepayregisterComponent {
  @Output() close = new EventEmitter<void>();
  files: File[]=[] ;
  filebase64:any=[];

  isDragging = false;
  @Input()lotAssignment!:any ;
isLoading=false;
  constructor(private _snackBar: MatSnackBar, 
     @Inject(auth)private _authService:IAssignmentService,
     private _sessionStoreage:SessionStorageService,
    public dialog: MatDialog){}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
 
    if (input.files) {
     
      this.files.push(...Array.from(input.files));
    
    }
  }
  ngOnInit(): void {
   
  }
  BulkFileUpload(){
this.isLoading=true;
    const user_id=this._sessionStoreage.getItem("userId");  
    this.files.forEach(element => {
      
      this.ConvertFile(element).subscribe((res) => {
        console.log(this.lotAssignment);
        var files_docs={
          "CompanyId":this.lotAssignment.company_Id,
          "Pay_Period_id":this.lotAssignment.pay_period_id,
          "LotNumber":this.lotAssignment.lot_Number,
          "FileName":element.name,
          "FileType":element.type,
          "Docs":res,
          "LoginUser":user_id,
          "Input_type":this.lotAssignment.payroll_Input_Type,
          "CompanyCode":this.lotAssignment.company_code,
          "Pay_Period":this.lotAssignment.pay_period,

        }
        //console.log( "JSON Created : " +JSON.stringify(files_docs));
        this._authService.PayRegisterUpload(files_docs).subscribe({
          next:res=>{ 
            
            
if(res.StatusCode==200)
{
  let data= res.Data;
  if(data.status=="200")
  {
    window.alert("File uploaded");
   this.closeModal();
  }
}
else{
  window.alert("File not uploaded");
}
          
          },
          error:err=>{}
        })
      })
    });

   this.files.slice();

   this.isLoading=false;
  

  }
  ConvertFile(file:File):Observable<string>{
    const result=new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsDataURL(file);    
    reader.onload = (event: ProgressEvent<FileReader>) => {
      result.next(btoa(event.target?.result as string));
    };
   
    return result;
  }
 

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.handleFile(file);
    }
  }
  handleFile(file: File) {
    console.log('Dropped/Selected file:', file);
    // Upload logic goes here
  }
  
  

  deleteFile(f){
    this.files = this.files.filter(function(w){ return w.name == f.name });
    // this._snackBar.open("Successfully delete!", 'Close', {
    //   duration: 2000,
    // });
  }


  deleteFromArray(index) {
    
    index=index++;
    console.log(index);
    this.files.splice(index, 1);
  }
  closeModal(){
    this.close.emit();
  }
}

export interface files{
FileName:string;
FileType:string;
Docs:any
}
