import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { UserCoin } from '../_models/UserCoin';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrl: './price-tracker.component.css'
})
export class PriceTrackerComponent implements OnInit{
  @Input() coinsToTrack: string[] = [];
  @Input() filtered: boolean = false; // set to false listen to all coins provided by Binance WebSocketApi
  @Input() coinsQuantity: UserCoin[] = [];
  @Output() totalCoinsPriceEmitter: EventEmitter<number> = new EventEmitter();

  private coinsPrice:Map<string, number> = new Map();

  constructor(private binanceService:BinanceService) {}

  ngOnInit(): void {
    if(this.coinsToTrack && this.filtered){
      this.filteredWebsocketConnection();
    } else {
      this.websocketConnection();
    }
    // this.coinData.set('BTC', 2137.22);
    // this.coinData.set('ETH', 2137.22);
    // this.coinData.set('DOGE', 2137.22);
    // this.coinData.set('LTC', 2137.22);

    // this.coinInfo = [
    //   { symbol: 'BTC', infoType: 'quantity', value: 10 },
    //   { symbol: 'ETH', infoType: 'volume', value: 500 },
    //   { symbol: 'DOGE', infoType: 'quantity', value: 1000 },
    //   { symbol: 'LTC', infoType: 'quantity', value: 2137 }
    // ]
  }

  websocketConnection() {
    this.subscribeToWebSocket((data: any) => {
      const currentPice = data.w;
      const symbol = data.s.replace('USDT', '');
      this.coinsPrice.set(symbol, currentPice);
    })
  }

  filteredWebsocketConnection() {
    this.subscribeToWebSocket((data: any) => {
      const symbol = data.s.replace('USDT', '');
      if(this.coinsToTrack.indexOf(symbol) !== -1) {
        const currentPice = data.w;
        this.coinsPrice.set(symbol, currentPice);
        this.totalCoinsValue();
      }
    })
  }

  private subscribeToWebSocket(callback: (data: any) => void){
    this.binanceService.getWebSocket().subscribe(ws => {
      ws.onmessage = (event: {data: any }) => {
        const data = JSON.parse(event.data);
        callback(data);
      }
    })
  }

  coinDataArray(): [string, number][] {
    return Array.from(this.coinsPrice.entries());
  }

  getCoinQuantity(symbol: string) : any | undefined {
    const coin = this.coinsQuantity.find(coin => coin.symbol == symbol);
    return coin?.quantity;
  }

  countTotalCoinValue(quantity: number, price: number){
    return quantity * price;
  }

  totalCoinsValue(){ 
    let totalValue = 0;
    this.coinsPrice.forEach((price, symbol) => {
      const quantity = this.getCoinQuantity(symbol);
      totalValue += price * quantity;
    });
    this.totalCoinsPriceEmitter.emit(totalValue);
  }
}
