import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alertpopup',
  standalone: true,
  imports: [],
  templateUrl: './alertpopup.component.html',
  styleUrl: './alertpopup.component.css'
})
export class AlertpopupComponent {
@Input() message: string = '';
@Input() submessage:string='';
 @Output() close = new EventEmitter<void>();

  closePopup(){
    this.close.emit();
  }

}