import { Component, OnInit } from '@angular/core';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrl: './price-tracker.component.css'
})
export class PriceTrackerComponent implements OnInit{
  private coinData:Map<string, number> = new Map();

  constructor(private binanceService:BinanceService) {}

  ngOnInit(): void {
    // this.websocketConnection();
    this.coinData.set("BTC", 231.12);
    this.coinData.set("LTC", 231.12);
    this.coinData.set("BNB", 231.12);
    this.coinData.set("DOGE", 231.12);
    this.coinData.set("MATIC", 231.12);
    this.coinData.set("ALGO", 231.12);
    this.coinData.set("USDT", 231.12);
  }

  websocketConnection() {
    this.binanceService.getWebSocket().subscribe(
      ws => {
        ws.onmessage = (event: { data: any; }) => {
          const data =  JSON.parse(event.data);
          const currentPice = data.w;
          const symbol = data.s.replace('USDT', '');
          this.coinData.set(symbol, currentPice);
        }
      }
    )
  }

  coinDataArray(): [string, number][] {
    return Array.from(this.coinData.entries());
  }
}
