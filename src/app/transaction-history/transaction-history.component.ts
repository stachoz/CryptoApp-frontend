import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../_models/Transaction';
import { WalletService } from '../_services/wallet/wallet.service';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  @Input() transactions:Transaction[] = [];
  @Output() transactionDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() transactionUpdated: EventEmitter<void> = new EventEmitter<void>();
  transactionToEdit?:Transaction;

  constructor(private walletService:WalletService, private binanceService:BinanceService) {}

  deleteCoinByName(coinSymbol:string) : void {
    this.walletService.deleteLastTransactionOnCoin(coinSymbol).subscribe(
      {
        next: () => {
          this.transactionDeleted.emit(coinSymbol);
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  showTransactionEditForm(transaction:Transaction){
    this.transactionToEdit = transaction;
    console.log(this.transactionToEdit);
  }

  hideTransactionEditForm(){
    this.transactionToEdit = undefined;
  }

  passTransactionUpdated(){
    this.transactionUpdated.emit();
  }
}
