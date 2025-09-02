import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBodyComponent } from '../app-body/app-body.component';
@Component({
  selector: 'app-pageheader',
  standalone: true,
  imports: [CommonModule,AppBodyComponent],
  templateUrl: './pageheader.component.html',
  styleUrl: './pageheader.component.css'
})
export class PageheaderComponent implements OnChanges  {
  @Input() menuCode!:string;
  ngOnChanges(changes: SimpleChanges) {
  //  console.log('Changes detected:', changes);
  }
}
