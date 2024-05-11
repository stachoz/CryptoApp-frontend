import { Component, Input } from '@angular/core';
import { Transaction } from '../_models/Transaction';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  @Input() transactions:Transaction[] = [];
}
