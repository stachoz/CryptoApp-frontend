import { Injectable, numberAttribute } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private coinData: Map<string, number> = new Map();

  constructor(private http:HttpClient) { }
  
  getCoins(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8080/api/v1/coins');
  }
}