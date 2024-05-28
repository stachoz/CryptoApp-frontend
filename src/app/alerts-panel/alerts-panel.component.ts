import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Alert } from '../_models/Alert';
import { AlertService } from '../_services/alert/alert.service';
import { FormBuilder, Validators } from '@angular/forms';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { AuthService } from '../_services/auth/auth.service';
import { EMPTY, concatMap, from } from 'rxjs';

@Component({
  selector: 'app-alerts-panel',
  templateUrl: './alerts-panel.component.html',
  styleUrl: './alerts-panel.component.css'
})
export class AlertsPanelComponent implements OnInit{
  @Output() alertEventEmitter:EventEmitter<Alert> = new EventEmitter<Alert>();
  isAuthenticated: boolean = this.authService.isAuthenticated();
  isExpanded: boolean = false;
  alerts: Alert[] = [];
  alertForm = this.fb.group({
    symbol: ['', [Validators.required, Validators.maxLength(20)]],
    price: ['', [Validators.required, Validators.min(0)]],
  });
  lastCoinPrice: Map<string, number> = new Map<string, number>();
  errorResponse: string = "";

  constructor(private alertService:AlertService, private fb: FormBuilder, private binanceService:BinanceService, private authService: AuthService){}

  ngOnInit(): void {
    this.loadUserAlerts();
    this.binanceService.getWebSocketMessages().subscribe((data:any) => {
      if(data.s){
        const symbol = data.s.replace('USDT', '');
        const price = data.w;
        this.lastCoinPrice.set(symbol, price);
        
        from(this.alerts).pipe(
          concatMap(alert => this.processAlert(alert, symbol, price))
        )
        .subscribe({
          next: ()=> {
            this.loadUserAlerts();
          }
        }
        );
      }
    })
  }

  processAlert(alert: Alert, symbol: string, price: string){
    if(alert.symbol ===  symbol){
      if(this.alertService.isAlertCompleted(alert.initialPrice, Number.parseFloat(price), alert.alertPrice)){
        this.alerts = this.alerts.filter(a => a.id != alert.id);
        this.alertEventEmitter.emit(alert);
        return this.alertService.sendAlert(alert.id);
      }
    }
    return EMPTY;
  }

  sendAlertAndReload(alert: Alert) : void {
    this.alertService.sendAlert(alert.id).subscribe({
      next: () => {
        this.loadUserAlerts();
      },
      error: (err) => {
        console.log(err);
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
    const { symbol, price } = this.alertForm.value;
    if(symbol && price){
      const initialPrice = this.lastCoinPrice.get(symbol.toUpperCase().trim()) ?? null;
      this.alertService.addAlert(initialPrice, Number.parseFloat(price), symbol.toUpperCase().trim()).subscribe({
        next: () => {
          this.alertForm.reset();
          this.errorResponse = "";
          this.loadUserAlerts();
          this.binanceService.subscribeToNewStreamIfNeeded(symbol);
        },
        error: (erorr) => {
          this.errorResponse = erorr.message;
        }
      })
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
}
