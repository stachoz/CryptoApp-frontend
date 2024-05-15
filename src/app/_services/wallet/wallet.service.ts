import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Transaction } from '../../_models/Transaction';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private coinData: Map<string, number> = new Map();

  constructor(private http:HttpClient) { }
  
  getCoins(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/coins`);
  }

  getUserLastTransactionOnUniqueCoins() {
    return this.http.get<Transaction[]>(`${environment.apiUrl}/wallet/transactions/lastOnCoins`);
  }

  addUserCoin(symbol: string, price: number, quantity: number, type: string){
    return this.http.post<any>(`${environment.apiUrl}/wallet/transactions`, {symbol, price, quantity, type});
  }

  deleteLastTransactionOnCoin(symbol: string){
    return this.http.delete<any>(`${environment.apiUrl}/wallet/transactions/lastOnCoins/${symbol}`);
  }

  updateLastTransactionOnCoin(symbol: string, price: number, quantity: number, type: string){
    return this.http.put<any>(`${environment}/wallet/transactions/lastOnCoins`, {symbol, price, quantity, type});
  }
}   