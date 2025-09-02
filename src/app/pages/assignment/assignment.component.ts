import { AfterViewInit, Component,  CUSTOM_ELEMENTS_SCHEMA,  Inject,  InjectionToken,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { GridviewComponent } from './gridview/gridview.component';
import { ListviewComponent } from './listview/listview.component';
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { AssignmentService } from '../../Service/Assignment.service';
import { EncryptionService } from '../../Shared/encryption.service';
import { of } from 'rxjs';
import { SessionStorageService } from '../../Shared/SessionStorageService';



const auth= InjectionToken<IAssignmentService>;

@Component({
  selector: 'assignment',
  standalone: true,
  imports: [CommonModule,MatTabsModule,GridviewComponent,ListviewComponent],
  templateUrl: './assignment.component.html',
  styleUrl: './assignment.component.css',
   providers: [
        {
          provide: auth,
          useClass: AssignmentService,
        }
      ],
  
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class AssignmentComponent implements OnInit, AfterViewInit {
  isDropdownOpen = false;
  private isDragging = false;
  isGridDarkMode: boolean = true;
  data:any;
  constructor(@Inject(auth)private _authService:IAssignmentService 
  ,private _decrypt:EncryptionService,
private _sessionStoreage:SessionStorageService){

  }
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnInit(): void {
    const user_id=this._sessionStoreage.getItem("userId");   
   this.GetCompanyData(user_id);
  }

  GetCompanyData(UserId) {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    var user = JSON.parse(this._decrypt.decrypt(userdetail!));
    this._authService.GetAssignmentLot(user.user_Id, 'A').subscribe(
      {
        next: data => { this.data = data.Data; },
        error: error => console.error('Error:', error)
      });
  }
  FilterLayout(filterType):void{
const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this._decrypt.decrypt(userdetail!));
    this._authService.GetAssignmentLot(user.user_Id,filterType).subscribe(
      {
        next: data => { this.data = data.Data;  },
        error: error => console.error('Error:', error)
      });
  }
  GridActive(){
this.isGridDarkMode=true;

  }
  ListActive(){
    this.isGridDarkMode=false;

  }

  // onMouseDown(event: MouseEvent) {
  //   this.isDragging = false; // Reset dragging state
  // }
  // onMouseOver(e) {
  //   console.log(e);
  //   this.hovered = true;
    
  // }
  // onMouseMove(event: MouseEvent) {

  //   this.isDragging = true; // If mouse moves, set dragging to true
  // }

  // onMouseUp(event: MouseEvent) {
  //   if (!this.isDragging) {
  //     this.onCardClick();
  //   }
  //   this.isDragging = false; // Reset after mouse is released
  // }

  onCardClick(event:any) {
 
  }
  ngAfterViewInit(): void {
   
    
  }
 
}
