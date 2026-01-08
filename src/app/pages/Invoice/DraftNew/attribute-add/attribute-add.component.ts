import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { IDraftNewRepository } from '../../../../Repository/invoice/IDraftNewRepository';
import { DraftNewRepository } from '../../../../Service/invoice/DraftNewRepository';
import { FormsModule } from '@angular/forms';
import { retry } from 'rxjs';
const invoiceservice = InjectionToken<IDraftNewRepository>;
@Component({
  selector: 'attribute-add',
  standalone: true,
  imports: [CommonModule,FormsModule,MatCardModule,MatIconModule],
  templateUrl: './attribute-add.component.html',
  styleUrl: './attribute-add.component.css',
providers:[
   { provide: invoiceservice, useClass: DraftNewRepository }]
})
export class AttributeAddComponent {

  @Output() close = new EventEmitter<void>();
  @Input() Company_Code?: string;
  @Input() pay_period?: string;
  attributeName:string='';
  isLoading:boolean=false;
  constructor( @Inject(invoiceservice) private invoiceService: IDraftNewRepository){}
  AttributeAdd() {
    if (this.attributeName == undefined || this.attributeName == '') {
      alert("Enter the Attribute Name");
      return;
    }
    this.isLoading=true;
    const request = {
      "id": 0,
      "AttributeName": this.attributeName,
      "ActionType": "I",
      "IsActive": true,
      "CreatedBy": 3,
      "DateTime": new Date()
    }

    this.invoiceService.GetAllAttributeAddAndUpdate(request).subscribe({
      next: res => {

        if (!res.Data) {
          alert("Attribute not added");
          return;
        }
        console.log()
        if (res.Data.length > 0) {
          alert(res.Data[0].messages)
        }
        this.isLoading=false;
      }, error: err => { this.isLoading=false; console.log(err) }
    })
  }
  closeclick(){
    this.close.emit();
  }
}
