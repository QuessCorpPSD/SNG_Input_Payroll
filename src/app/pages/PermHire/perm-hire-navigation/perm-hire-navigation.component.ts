import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perm-hire-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './perm-hire-navigation.component.html',
  styleUrl: './perm-hire-navigation.component.css'
})
export class PermHireNavigationComponent {

}
