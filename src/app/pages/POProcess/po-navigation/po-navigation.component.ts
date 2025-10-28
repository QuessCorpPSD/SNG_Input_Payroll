import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'po-navigation',
  standalone:true,
  imports: [CommonModule,RouterLink,RouterModule],
  templateUrl:'./po-navigation.component.html',
  styleUrl: './po-navigation.component.css'
})
export class PoNavigationComponent {

//   isSidebarOpen: boolean = false;

//   navItems = [
//     { label: 'Main PO', route: '/layout/PO/Entry' },
//     { label: 'Employee PO', route: '/layout/PO/Employee' },
//     { label: 'Employee PO Approval', route: '/layout/PO/Approve' }
//   ];

//   activeItem: string = 'Holiday';

//   setActive(item: string): void {
//     this.activeItem = item;
//   }

//   constructor(private router: Router) { }

//   ngOnInit(): void {

//   }

//   toggleSidebar() {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }

}
