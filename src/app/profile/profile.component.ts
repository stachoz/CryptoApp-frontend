import { Component, OnInit, createEnvironmentInjector } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { AuthService } from '../_services/auth/auth.service';
import { User } from '../_models/User';
import { UserCoin } from '../_models/UserCoin';
import { FormBuilder, Validators } from '@angular/forms';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';
import { WalletService } from '../_services/wallet/wallet.service';
import { Transaction } from '../_models/Transaction';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;
  userCoins: UserCoin[] = [];
  lastCoinsTransactions: Transaction[] = [];
  coinFormErrorResponse: string = "";
  walletValue: number = 0;
  transactionForm = this.fb.group({
    symbol: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    quantity: ['', [Validators.required, Validators.min(0)]],
    transactionType: ['BUY', [Validators.required]]
  });


  constructor(private userService:UserService, private authService:AuthService,
    private walletService:WalletService, private fb:FormBuilder, private bianceService:BinanceService           
  ) {}

  ngOnInit(): void {
    const credentials = this.authService.userValue;
    if(credentials){
      this.userService.getUserByUsername(credentials.username).subscribe(
        user => {
          this.user = user[0];
        }
      );
      this.getLastTransactionsOnUniqueCoins();
    }
  }

  getLastTransactionsOnUniqueCoins(): void{
    this.walletService.getUserLastTransactionOnUniqueCoins().subscribe(
      lastCoinsTransactions => {
        this.lastCoinsTransactions = lastCoinsTransactions;
        this.userCoins = lastCoinsTransactions.map(transaction => new UserCoin(transaction.symbol, transaction.totalAmount, transaction.roi));
      }
    )
  }

  onSubmit(){
    const {symbol, price, quantity, transactionType} = this.transactionForm.value;
    if(symbol && price && quantity && transactionType) {
      this.transactionForm.reset();
      this.transactionForm.controls["transactionType"].setValue("BUY");
      this.walletService.addUserCoin(symbol.toUpperCase(), Number.parseFloat(price), Number.parseFloat(quantity), transactionType)
        .subscribe({
          next: (reponse) => {
            this.getLastTransactionsOnUniqueCoins();
          },
          error: (error) => {
            this.coinFormErrorResponse = error;
          }
        })
    }
  }

  updateCoinList(symbol: string, totalAmount: number, roi: number){
    if(!this.bianceService.isBeingSubscribed(symbol)){
      this.bianceService.subscribeToNewStream(symbol);
      this.userCoins.push(new UserCoin(symbol, totalAmount, roi));
    } 
    const existingCoinIndex = this.userCoins.findIndex(coin => coin.symbol === symbol);
    if(existingCoinIndex !== -1){
      const coinToUpdate = this.userCoins[existingCoinIndex];
      coinToUpdate.roi = roi;
      coinToUpdate.totalAmount = totalAmount;
    } else {
      this.userCoins.push({
        symbol: symbol.toUpperCase(),
        roi: roi,
        totalAmount: totalAmount
      });
    }
  }

  getUserCoinsNames() : string[] {
    return Array.from(new Set(this.userCoins.map(userCoin => userCoin.symbol)));
  }

  getWalletValueFromEvent(value: number){
    this.walletValue = value;
  }

  countSummarizedRoi() : number {
    return this.userCoins.reduce((acc, coin) => acc + coin.roi, 0);
  }

  get quantity(){
    return this.transactionForm.controls['quantity'];
  }

  get symbol(){
    return this.transactionForm.controls['symbol'];
  }
}
