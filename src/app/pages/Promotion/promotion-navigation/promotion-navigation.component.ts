import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-promotion-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './promotion-navigation.component.html',
  styleUrl: './promotion-navigation.component.css'
})
export class PromotionNavigationComponent {

}
