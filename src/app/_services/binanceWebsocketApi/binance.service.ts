import { Injectable, OnInit, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core';
import { CoinService } from '../coin/coin-service.service';

@Injectable({
  providedIn: 'root'
})
export class BinanceService implements OnInit{
  binanceWebSocketUrl:string = 'wss://stream.binance.com:9443/ws/';
  ws:WebSocket | undefined;

  constructor(private coinService:CoinService) { }

  ngOnInit(): void {
    this.getBinanceWebsocketConnection();
  }

  getBinanceWebsocketConnection(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      this.coinService.getCoins().subscribe(coins => {
        let coinStreams = coins.map(coin => coin + 'usdt@avgPrice').join('/');
        let webSocketUrl = 'wss://stream.binance.com:9443/ws/' + coinStreams;
        console.log('full url: ' + webSocketUrl);
        const ws = new WebSocket(webSocketUrl);
        ws.onopen = () => resolve(ws); 
        ws.onerror = error => reject(error); 
      });
    });
  }
}
