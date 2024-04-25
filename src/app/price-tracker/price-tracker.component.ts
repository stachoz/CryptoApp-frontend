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
  @Input() coinsInformation: UserCoin[] = [];
  @Output() totalCoinsPriceEmitter: EventEmitter<number> = new EventEmitter();

  private coinsPrice:Map<string, number> = new Map();

  constructor(private binanceService:BinanceService) {}

  ngOnInit(): void {
    if(this.coinsToTrack.length > 0){
      this.filteredWebsocketConnection();
    } else {
      this.websocketConnection();
    }
  }

  websocketConnection() {
    this.subscribeToWebSocket((data: any) => {
      const currentPrice = data.w;
      const symbol = data.s.replace('USDT', '');
      this.coinsPrice.set(symbol, currentPrice);
    })
  }

  filteredWebsocketConnection() {
    this.subscribeToWebSocket((data: any) => {
      if(data.s){
        const symbol = data.s.replace('USDT', '');
        if(this.coinsToTrack.indexOf(symbol) !== -1) {
          const currentPrice = data.w;
          this.coinsPrice.set(symbol, currentPrice);
          this.totalWalletValue();
        }
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

  getCoinTotalAmount(symbol: string) : any | undefined {
    const coin = this.coinsInformation.find(coin => coin.symbol == symbol);
    return coin?.totalAmount;
  }

  getCoinRoi(symbol: string) : any | undefined {
    const coin = this.coinsInformation.find(coin => coin.symbol == symbol);
    return coin?.roi;
  }

  countTotalCoinValue(quantity: number, price: number){
    return quantity * price;
  }

  totalWalletValue(){ 
    let totalValue = 0;
    this.coinsPrice.forEach((price, symbol) => {
      const quantity = this.getCoinTotalAmount(symbol);
      totalValue += price * quantity;
    });
    this.totalCoinsPriceEmitter.emit(totalValue);
  }
}
