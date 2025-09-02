import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const hour: number = Math.floor(minutes / 60);
    const calculatedMinute = minutes - hour * 60;
    return (
      ('00' + hour).slice(-2) +
      ':' +
      ('00' + calculatedMinute).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

}
