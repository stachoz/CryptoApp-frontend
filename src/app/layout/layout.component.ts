import { Component } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isAuthenticated = false;
  constructor(private authService:AuthService){
    this.authService.isLoggedIn.subscribe(isLoggedIn => this.isAuthenticated = isLoggedIn);
  }
}
