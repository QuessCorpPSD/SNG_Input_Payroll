import { CommonModule } from '@angular/common';
import { Component,Output,EventEmitter ,ViewEncapsulation, OnInit} from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule,FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule  } from '@angular/material/table';
import {provideNativeDateAdapter} from '@angular/material/core';


import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'fromtodate',
  standalone: true,
  imports: [MatCheckboxModule,MatTooltipModule,CommonModule,
              MatTableModule,MatFormFieldModule, MatDatepickerModule, FormsModule, 
              ReactiveFormsModule],
  templateUrl: './fromtodate.component.html',
  styleUrl: './fromtodate.component.css',
  encapsulation: ViewEncapsulation.None ,
  providers:[provideNativeDateAdapter()]
})
export class FromtodateComponent implements OnInit {
    @Output() from_Date = new EventEmitter<any>();
 readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
ngOnInit(): void {
  this.range.valueChanges.subscribe(val => {
    
    this.from_Date.emit(val);
    // Do something with startDate and endDate
  });
}
 
}
