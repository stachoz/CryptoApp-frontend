import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { Alert } from '../_models/Alert';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  alerts: Alert[] = [];
  isAuthenticated:boolean = false;

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.authService.userCredentials.subscribe(UserCredentails => UserCredentails ? this.isAuthenticated = true : this.isAuthenticated = false);
  }

  handleAlertEvent(alert: Alert){
    this.alerts.unshift(alert);
  }

  handleDeletedAlert(id: number){
    if(id === -1) this.alerts = [];
    else {
      this.alerts = this.alerts.filter(alert => alert.id !== id);
    }
  }

  setOfAlerts() {
    return new Set(this.alerts);
  }

}
