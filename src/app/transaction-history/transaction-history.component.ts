import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../_models/Transaction';
import { WalletService } from '../_services/wallet/wallet.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  @Input() transactions:Transaction[] = [];
  @Output() transactionDeleted: EventEmitter<string> = new EventEmitter<string>();

  constructor(private walletService:WalletService) {}

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
}
