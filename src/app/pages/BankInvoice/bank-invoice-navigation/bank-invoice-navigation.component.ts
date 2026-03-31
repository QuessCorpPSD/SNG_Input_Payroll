import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'bankinvoicenavigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './bank-invoice-navigation.component.html',
  styleUrl: './bank-invoice-navigation.component.css'
})
export class BankInvoiceNavigationComponent {

}
