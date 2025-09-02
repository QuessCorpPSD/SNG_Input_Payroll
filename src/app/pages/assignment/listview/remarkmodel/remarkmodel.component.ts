import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-remarkmodel',
  standalone: true,
  imports: [],
  templateUrl: './remarkmodel.component.html',
  styleUrl: './remarkmodel.component.css'
})
export class RemarkmodelComponent {
  @Output() close = new EventEmitter<void>();
  constructor( public dialog: MatDialog){}
  closeModal(){
    this.close.emit();
  }
}
