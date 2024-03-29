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
    this.websocketConnection();
  }

  websocketConnection() {
    this.binanceService.getWebSocket().subscribe(
      ws => {
        ws.onmessage = (event: { data: any; }) => {
          const data =  JSON.parse(event.data);
          const symbol = data.s.replace('USDT', '');
          this.coinData.set(symbol, data.w);
        }
      }
    )
  }

  coinDataArray(): [string, number][] {
    return Array.from(this.coinData.entries());
  }
}
