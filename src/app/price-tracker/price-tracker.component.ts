import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { UserCoin } from '../_models/UserCoin';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrl: './price-tracker.component.css'
})
export class PriceTrackerComponent implements OnInit{
  @Input() coinsInformation: UserCoin[] = [];
  @Output() totalCoinsActualValueEmitter: EventEmitter<number> = new EventEmitter<number>();

  private coinsPrice:Map<string, number> = new Map();

  constructor(private binanceService:BinanceService) {}

  ngOnInit(): void {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.subscribeToWebSocket()
  }

  private subscribeToWebSocket(){
    this.binanceService.getWebSocketMessages().subscribe((data:any) => {
      if(data.s){
        const symbol = data.s.replace('USDT', '');
        if(this.coinsInformation.find(coin => coin.symbol === symbol)) {
          const currentPrice = data.w;
          this.coinsPrice.set(symbol, currentPrice);
          this.totalWalletValue();
        }
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

  coinPriceByName(symbol: string){
    const price = this.coinsPrice.get(symbol);
    return price !== undefined ? price : 0;
  }

  totalWalletValue(){
    let totalValue = 0;
    this.coinsInformation.forEach(coin => {
      const quantity = this.getCoinTotalAmount(coin.symbol);
      const priceOptional = this.coinsPrice.get(coin.symbol);
      const price = priceOptional !== undefined ? priceOptional : 0;
      totalValue += this.countTotalCoinValue(quantity, price);
    })
    this.totalCoinsActualValueEmitter.emit(totalValue);
  }
}
