import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-customernavigation',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './customernavigation.component.html',
  styleUrl: './customernavigation.component.css'
})
export class CustomernavigationComponent {

}
