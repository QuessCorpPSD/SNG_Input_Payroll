import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true // ✅ if you're using Angular 17 standalone components
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => this.el.nativeElement.focus(), 0); // Delay ensures DOM is ready
  }
}
