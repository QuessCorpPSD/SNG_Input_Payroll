import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {  interval, Subscription, take, timer } from 'rxjs';
import {FormatTimePipe} from '../timer/format-time.pipe';



@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule,FormatTimePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent implements OnInit, OnDestroy {
  
  @Input() TotalSecond:number=0;
  subscription!: Subscription;
  counter:number = 0;
  tick = 1000;
  remainingTime =40; //this.TotalSecond;
  progress = 0;
  ngOnInit() {
    
    this.counter=this.TotalSecond;
    const totalTicks = this.TotalSecond;
    this.subscription = interval(this.tick)
    .pipe(take(totalTicks + 1))
    .subscribe(tick => {
      this.remainingTime = this.TotalSecond - tick;
      this.progress = (tick / totalTicks) * 100;
    });
    if(this.counter>0)
    {
      this.subscription = timer(0, this.tick).subscribe(() => {
       
        if (this.counter == 60) {
          alert("Estimated Time has elapsed")
          //this.counter=0;
          
        }
        if(this.counter == 0)
        {
          this.tick=0;
          timer(0,0);
          this.subscription.unsubscribe;
        }
        --this.counter
      });
    }
  }
  ngOnDestroy() {
   
    this.subscription.unsubscribe();
  }
}

