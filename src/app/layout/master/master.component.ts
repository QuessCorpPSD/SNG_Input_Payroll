import { Component, Input, OnInit,CUSTOM_ELEMENTS_SCHEMA, signal, InjectionToken, Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';

import { AppHeaderComponent } from '../app-header/app-header.component';

import { SessionStorageService } from '../../Shared/SessionStorageService';
import { EncryptionService } from '../../Shared/encryption.service';
@Component({
  selector: 'app-master',
  standalone: true,
  imports: [CommonModule, RouterModule,AppHeaderComponent ],
  templateUrl: './master.component.html',
  styleUrl: './master.component.css',  
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
  
})
export class MasterComponent implements  OnInit {
  username = '';
  menuCode:string='1';
  menuHideVisibility=false;
  userRole:any;
constructor( private _sessionStoreage:SessionStorageService, 
  
  private _encry:EncryptionService, private router: Router,){

}
 isActive(route: string): boolean {    
    return this.router.url === route;
  }
  onNavigate(event: Event,menuId:any) {
    // console.log(menuId);
    //  this.menuId=menuId
    //  this.menuCode.emit(this.menuId.toString());
   }
   Logout():void{
    this._sessionStoreage.removeItem("userId");
    this._sessionStoreage.clear();
    this.router.navigateByUrl('/Login');
   }
 
  ngOnInit(): void {
  const userdetail= this._sessionStoreage.getItem('UserProfile');
  var user = JSON.parse(this._encry.decrypt(userdetail!)); 


   
  this.userRole=this.getUserRole(user.role_Id);
  
    
  }
   roleIdGroups: Record<Role, number[]> = {
  [Role.Admin]: [ 1,12, 14, 17, 20,38, 52, 263],
  [Role.SOP]: [0],
  [Role.Manager]: [] // fallback
};
   getUserRole(roleId: number): Role {
  for (const role in this.roleIdGroups) {
    if (this.roleIdGroups[role as Role].includes(roleId)) {
      return role as Role;
    }
  }
  return Role.Manager;
}
  
  receiveData(data: string) {

  //  console.log('Master data received the values : '+data)
    this.menuCode = data; // Update parent property with received data
  }
}
//   enum RoleIds {
//   Admin = 12,
//   SOP = 38
// }

enum Role {
  Admin = 'admin',
  SOP = 'SOP',
  Manager = 'manager'
}
