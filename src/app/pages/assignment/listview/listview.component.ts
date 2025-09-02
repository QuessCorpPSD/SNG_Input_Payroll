import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../../Shared/encryption.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RemarkmodelComponent } from './remarkmodel/remarkmodel.component';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [CommonModule,RemarkmodelComponent],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css'
})
export class ListviewComponent implements OnInit {
 @Input() data!:any;
constructor(private route:Router,private _encry:EncryptionService,private dialog: MatDialog){

  }
 ngOnInit(): void {
   console.log(this.data)
 }
 onCardClick(item:any) {
  var a=JSON.stringify(item);
  const en=this._encry.encrypt(a);
 
  this.route.navigate(['/Master/AllottedLot'],{ 
   queryParams: { items:en } 
 });
 }
 isPopupVisible = false;

showPopup() {
  this.isPopupVisible = true;
}

hidePopup() {
  this.isPopupVisible = false;
}
openModalOnHover() {
  this.dialog.open(RemarkmodelComponent, {
    width: '300px',
    height: '200px',
    hasBackdrop: false // optional: no black background
  });
}
}
