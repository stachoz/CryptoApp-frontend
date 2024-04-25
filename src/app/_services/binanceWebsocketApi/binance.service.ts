import { Injectable} from '@angular/core';
import { CoinService } from '../coin/coin-service.service';
import { Observable, ReplaySubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BinanceService{
  private binanceWebSocketUrl:string = 'wss://stream.binance.com:9443/ws/';
  private ws:WebSocket | undefined;
  private wsSubject: ReplaySubject<WebSocket> = new ReplaySubject<WebSocket>(1);
  private subscribedCoins: String[] = [];
  private avgPriceStreamName = 'usdt@avgPrice';

  constructor(private coinService:CoinService) { 
    this.connect();
  }

  private connect(): void {
    this.coinService.getCoins().subscribe(coins => {
      this.subscribedCoins = coins;
      let coinStreams = coins.map(coin => coin.toString().toLowerCase() + this.avgPriceStreamName).join('/');
      let webSocketUrl = this.binanceWebSocketUrl + coinStreams;
      console.log(webSocketUrl);
      this.ws = new WebSocket(webSocketUrl);
      this.ws.onerror = (error) => {
        console.error(error);
      }
      this.wsSubject.next(this.ws);
    });
  }

  subscribeToNewStream(coinSymbol: string){
    if(this.ws && this.ws.readyState == WebSocket.OPEN){
      const subscriptionMessage = JSON.stringify({
        method: 'SUBSCRIBE',
        params: [coinSymbol.toLowerCase() + this.avgPriceStreamName],
        id: 1
      });
      this.ws.send(subscriptionMessage);
      console.log('message sended');
      this.subscribedCoins.push(coinSymbol);
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  getWebSocket(): Observable<any> {
    return this.wsSubject.asObservable();
  }

  getFileterdWebSocket(coinSymbol: string) : Observable<any> {
    return this.getWebSocket().pipe(
      filter(data => data && data.s && data.s.toLowerCase() === coinSymbol.replace('USDT', '').toLowerCase())
    );
  }

  isBeingSubscribed(coinSymbol: string) : boolean {
    return this.subscribedCoins.indexOf(coinSymbol) !== -1;
  }
}
