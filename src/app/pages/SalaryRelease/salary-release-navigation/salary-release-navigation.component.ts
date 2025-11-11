import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-salary-release-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './salary-release-navigation.component.html',
  styleUrl: './salary-release-navigation.component.css'
})
export class SalaryReleaseNavigationComponent {
  
}
