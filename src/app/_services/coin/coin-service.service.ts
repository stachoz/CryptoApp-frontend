import { Injectable, numberAttribute } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private coinData: Map<string, number> = new Map();

  constructor(private http:HttpClient) { }
  
  getCoins(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/coins`);
  }
}