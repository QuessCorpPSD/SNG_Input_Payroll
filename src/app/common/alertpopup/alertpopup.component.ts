import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-alertpopup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertpopup.component.html',
  styleUrl: './alertpopup.component.css'
})
export class AlertpopupComponent {
@Input() message: string = '';
@Input() submessage:string='';
 @Output() close = new EventEmitter<void>();

 isfailed=false; 

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.isfailed = this.message.toLowerCase().includes('failed');
    }
  }
  closePopup(){
    this.close.emit();
  }

}