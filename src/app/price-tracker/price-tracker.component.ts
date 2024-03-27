import { Component, OnInit } from '@angular/core';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { CoinService } from '../_services/coin/coin-service.service';

@Component({
  selector: 'app-price-tracker',
  templateUrl: './price-tracker.component.html',
  styleUrl: './price-tracker.component.css'
})
export class PriceTrackerComponent implements OnInit{
  coinData:Map<string, number> = new Map();

  constructor(private binanceService:BinanceService, private coinService:CoinService) {}

  ngOnInit(): void {
    this.websocketConnection();
  }

  websocketConnection() {
    this.binanceService.getBinanceWebsocketConnection().then(ws => {

      ws.onopen = () => {
        console.log('Connected to Binance WebSocket API');
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.coinData = this.coinService.manageCoinData(data.s, data.w);
      }

      ws.onerror = (error) => {
        console.log('WebSocket error: ', error);
      }

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      }

    })
    .catch(error => {
      console.error('Error ', error);
    })
  }
}
