import { Component, OnInit } from '@angular/core';
import { Alert } from '../_models/Alert';
import { AlertService } from '../_services/alert/alert.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-alerts-panel',
  templateUrl: './alerts-panel.component.html',
  styleUrl: './alerts-panel.component.css'
})
export class AlertsPanelComponent implements OnInit{
  isAuthenticated: boolean = false;
  isExpanded: boolean = false;
  alerts: Alert[] = [];
  alertForm = this.fb.group({
    symbol: ['', [Validators.required, Validators.maxLength(20)]],
    price: ['', [Validators.required, Validators.min(0)]],
    repeat: ['', [Validators.required, Validators.min(1), Validators.max(200)]]
  });
  lastCoinPrice: Map<string, number> = new Map<string, number>();
  errorResponse: string = "";

  constructor(private alertService:AlertService, private fb: FormBuilder, private binanceService:BinanceService, private authService: AuthService){
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
        this.isAuthenticated = isLoggedIn;
      }
    );
  }

  ngOnInit(): void {
    this.loadUserAlerts();
    this.binanceService.getWebSocketMessages().subscribe((data:any) => {
      if(data.s){
        console.log(data);
        const symbol = data.s.replace('USDT', '');
        const price = data.w;
        this.lastCoinPrice.set(symbol, price);
        this.alerts.forEach(
          alert => {
            if(alert.symbol ===  symbol){
              if(this.alertService.isAlertCompleted(alert.initialPrice, Number.parseFloat(price), alert.alertPrice)){
                // console.log(`Alert completed. ${JSON.stringify(alert)}, current price: ${data.w}`);
              } else {
                // console.log(`Not alert. ${JSON.stringify(alert)}, current price: ${data.w}`);
              }
            }
          }
        )
      }
    })
  }

  togglePanel() {
    this.isExpanded = !this.isExpanded;
    if(this.isExpanded){
      this.loadUserAlerts();
    }
  }

  loadUserAlerts(){
    this.alertService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onSumbit(){
    const { symbol, price, repeat } = this.alertForm.value;
    if(symbol && price && repeat){
      const initialPrice = this.lastCoinPrice.get(symbol.toUpperCase().trim());
      if(initialPrice){
        console.log(typeof(initialPrice));
        this.alertService.addAlert(initialPrice, Number.parseFloat(price), Number.parseInt(repeat), symbol.toUpperCase().trim()).subscribe({
          next: () => {
            this.loadUserAlerts();
          },
          error: (erorr) => {
            this.errorResponse = erorr.message;
          }
        })
      }
    }
  }

  deleteAlert(alertId: number){
    this.alertService.deleteAlert(alertId).subscribe({
      next: () => {
        this.loadUserAlerts();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  get symbol(){
    return this.alertForm.controls['symbol'];
  }

  get price(){
    return this.alertForm.controls['price'];
  }
  get repeat(){
    return this.alertForm.controls['repeat'];
  }
}
