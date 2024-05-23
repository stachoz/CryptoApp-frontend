import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  isAuthenticated:boolean = false;

  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.authService.userCredentials.subscribe(UserCredentails => UserCredentails ? this.isAuthenticated = true : this.isAuthenticated = false);
  }
}
