import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserCoin } from '../../_models/UserCoin';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private coinData: Map<string, number> = new Map();

  constructor(private http:HttpClient) { }
  
  getCoins(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/coins`);
  }

  getUserCoins() {
    return this.http.get<UserCoin[]>(`${environment.apiUrl}/wallet`);
  }

  addUserCoin(symbol: string, price: number, quantity: number, type: string){
    return this.http.post<any>(`${environment.apiUrl}/wallet/transactions`, {symbol, price, quantity, type});
  }
}   