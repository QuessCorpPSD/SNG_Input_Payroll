import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-is-active',
  standalone: true, // since you're using standalone imports
  templateUrl: './is-active.component.html',
  styleUrls: ['./is-active.component.css']
})
export class IsActiveComponent {
  @Output() isActiveChange = new EventEmitter<number>();

  onSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.isActiveChange.emit(Number(value)); // emit as number (-1, 0, 1)
  }
}
