import { Injectable, OnInit, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { CoinService } from '../coin/coin-service.service';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService{
  private binanceWebSocketUrl:string = 'wss://stream.binance.com:9443/ws/';
  private ws:WebSocket | undefined;
  private wsSubject: ReplaySubject<WebSocket> = new ReplaySubject<WebSocket>(1);

  constructor(private coinService:CoinService) { 
    this.connect();
  }


  private connect(): void {
    this.coinService.getCoins().subscribe(coins => {
      let coinStreams = coins.map(coin => coin + 'usdt@avgPrice').join('/');
      let webSocketUrl = this.binanceWebSocketUrl + coinStreams;
      this.ws = new WebSocket(webSocketUrl);
      this.ws.onerror = (error) => {
        console.error(error);
      }
      this.wsSubject.next(this.ws);
    });
  }

  getWebSocket(): Observable<any> {
    return this.wsSubject.asObservable();
  }
}
