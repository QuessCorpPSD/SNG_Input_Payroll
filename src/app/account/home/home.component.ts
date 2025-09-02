import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../Shared/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  constructor(private _Auth:AuthService,private router: Router,){}


  ngOnInit(): void {

    // if(!this._Auth.isAuthenticated())
    // {
    //   this.router.navigate(['/Login']);
    // }
    
    
  }
 
}
