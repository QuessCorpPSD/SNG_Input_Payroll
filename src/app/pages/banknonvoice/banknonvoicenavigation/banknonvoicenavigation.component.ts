import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-banknonvoicenavigation',
  standalone:true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './banknonvoicenavigation.component.html',
  styleUrl: './banknonvoicenavigation.component.css'
})
export class BanknonvoicenavigationComponent {

}
