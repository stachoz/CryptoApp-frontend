import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from '../_models/Transaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from '../_services/wallet/wallet.service';

@Component({
  selector: 'app-edit-transaction-form',
  templateUrl: './edit-transaction-form.component.html',
  styleUrl: './edit-transaction-form.component.css'
})
export class EditTransactionFormComponent implements OnInit{
  @Input() transaction!: Transaction;
  @Output() closeFormEmitter:EventEmitter<void> = new EventEmitter<void>();
  @Output() updatedTransactionEmitter:EventEmitter<void> = new EventEmitter<void>();
  editTransactionForm!: FormGroup;
  showForm:boolean = false;
  formErrorResponse: string = "";

  constructor(private fb:FormBuilder, private walletService:WalletService) {}
  ngOnInit(): void {
    this.editTransactionForm = this.fb.group({
      symbol: [this.transaction.symbol, [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
      price: [this.transaction.price, [Validators.required, Validators.min(0)]],
      quantity: [this.transaction.quantity, [Validators.required, Validators.min(0)]],
      transactionType: [this.transaction.type, [Validators.required]]
    });
    this.showForm = true;
  }

  closeForm(){
    this.formErrorResponse = "";
    this.showForm = false;
    this.closeFormEmitter.emit();
  }

  onSubmit(){
    const {symbol, price, quantity, transactionType} = this.editTransactionForm.value;
    if(symbol && price && quantity && transactionType) {

      this.walletService.addUserCoin(symbol.toUpperCase().trim(), Number.parseFloat(price), Number.parseFloat(quantity), transactionType)
        .subscribe({
          next: (reponse) => {
            this.updatedTransactionEmitter.emit();
            this.closeForm();
          },
          error: (error) => {
            this.formErrorResponse = error.message;
          }
        })
    }
  }

  get symbol(){
    return this.editTransactionForm.controls['symbol'];
  }

  get price(){
    return this.editTransactionForm.controls['price'];
  }

  get quantity(){
    return this.editTransactionForm.controls['quantity'];
  }
}
