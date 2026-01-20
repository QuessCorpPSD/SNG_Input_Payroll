import { Data } from "@angular/router";

export interface APIResponse {
  StatusCode: number
  Message: string
  Data: any
  Error: any
  data:any
    
}

export interface ErrorMessage{
    ErrorCode:number;
    ErrorMessages:string;
}  
