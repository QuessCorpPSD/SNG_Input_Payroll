import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-salaryadvancemodulenavigation',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl: './salaryadvancemodulenavigation.component.html',
  styleUrl: './salaryadvancemodulenavigation.component.css'
})
export class SalaryadvancemodulenavigationComponent {

}
