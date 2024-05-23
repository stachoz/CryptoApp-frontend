import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Alert } from '../../_models/Alert';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http:HttpClient) { }

  getAlerts() {
    return this.http.get<Alert[]>(`${environment.apiUrl}/alert`);
  }

  addAlert(initialPrice: number | null, alertPrice: number, repeatTimes: number, symbol: string){
    return this.http.post<Alert>(`${environment.apiUrl}/alert`, {initialPrice, alertPrice, repeatTimes, symbol});
  }

  deleteAlert(alertId: number){
    return this.http.delete(`${environment.apiUrl}/alert/${alertId}`);
  }

  sendAlert(alertId: number){
    return this.http.post<any>(`${environment.apiUrl}/alert/send/${alertId}`, {});
  }

  isAlertCompleted(initialPrice:number, currentPrice: number, alertPrice: number) : boolean {
    if(initialPrice < alertPrice){
      return currentPrice >= alertPrice; 
    } 
    return currentPrice <= alertPrice;
  }
}
