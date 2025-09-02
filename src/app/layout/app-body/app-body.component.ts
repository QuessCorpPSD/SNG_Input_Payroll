import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [],
  templateUrl: './app-body.component.html',
  styleUrl: './app-body.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppBodyComponent {
@Input() menuCode!:string
}
