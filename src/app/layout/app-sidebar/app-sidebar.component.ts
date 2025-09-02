import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';




@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,MatCardModule],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.css'
})


export class AppSidebarComponent {
  menuId!:string;
  @Output() menuCode = new EventEmitter<string>();
  onNavigate(event: Event,menuId:any) {
   // console.log(menuId);
    this.menuId=menuId
    this.menuCode.emit(this.menuId.toString());
  }
  toggleSidebar(): void {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.classList.toggle("d-none");  // Hide/Show Sidebar
    }
  }
   ngOnChanges(changes: SimpleChanges) {
    this.menuCode.emit(this.menuId.toString());
     // console.log('Changes detected:', changes);
    }
}
