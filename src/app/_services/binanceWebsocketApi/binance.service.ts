import { Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class BinanceService{
  private binanceWebSocketUrl:string = 'wss://stream.binance.com:9443/ws/';
  private ws:WebSocket | undefined;
  private messageSubject: Subject<any> = new Subject<any>();
  private subscribedCoins: String[] = [];
  private avgPriceStreamName = 'usdt@avgPrice';

  constructor(private walletService:WalletService) { 
    this.connect();
  }

  private connect(): void {
    this.walletService.getCoins().subscribe(coins => {
      this.subscribedCoins = coins;
      let coinStreams = coins.map(coin => coin.toString().toLowerCase() + this.avgPriceStreamName).join('/');
      let webSocketUrl = this.binanceWebSocketUrl + coinStreams;
      console.log(webSocketUrl);
      this.ws = new WebSocket(webSocketUrl);
      this.ws.onerror = (error) => {
        console.error(error);
      }
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.messageSubject.next(data);
      }
    });
  }

  subscribeToNewStreamIfNeeded(coinSymbol: string){
    if(!this.isBeingSubscribed(coinSymbol)){
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
  }

  getWebSocketMessages(): Observable<any>{
    return this.messageSubject.asObservable();
  }

  isBeingSubscribed(coinSymbol: string) : boolean {
    return this.subscribedCoins.indexOf(coinSymbol.toUpperCase()) !== -1;
  }
}
