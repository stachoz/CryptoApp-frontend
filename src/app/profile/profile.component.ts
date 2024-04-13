import { Component, OnInit, createEnvironmentInjector } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { AuthService } from '../_services/auth/auth.service';
import { User } from '../_models/User';
import { UserCoin } from '../_models/UserCoin';
import { CoinService } from '../_services/coin/coin-service.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BinanceService } from '../_services/binanceWebsocketApi/binance.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;
  userCoins: UserCoin[] = [];
  totalCoinsValue: number = 0;
  coinFormErrorResponse: string = "";
  showFrom: boolean = false;
  coinForm = this.fb.group({
    symbol: ['', [Validators.required]],
    quantity: ['', Validators.required]
  });


  constructor(private userService:UserService, private authService:AuthService,
    private coinService:CoinService, private fb:FormBuilder, private bianceService:BinanceService           
  ) {}

  ngOnInit(): void {
    const credentials = this.authService.userValue;
    if(credentials){
      this.userService.getUserByUsername(credentials.username).subscribe(
        user => {
          this.user = user[0];
        }
      );
      this.loadUserCoins(credentials.username);
    }
    this.coinForm.get('symbol')?.setValidators([Validators.required, this.validateSymbol.bind(this)]);
    this.coinForm.get('symbol')?.updateValueAndValidity();
  }

  getUserCoinsNames() : string[] {
    return Array.from(new Set(this.userCoins.map(userCoin => userCoin.symbol)));
  }

  getTotalCoinsPrice(value: number){
    this.totalCoinsValue = value;
  }

  loadUserCoins(username: string) {
    this.coinService.getUserCoins(username).subscribe(
      userCoins => {
        this.userCoins = userCoins;
      }
    )
  }

  toggleForm(){
    this.showFrom = !this.showFrom;
  }

  onSubmit(){
    const {symbol, quantity} = this.coinForm.value;
    if(symbol && quantity) {
      const quantityNumberValue = Number.parseFloat(quantity);
      const upperCaseSymbol = symbol.toUpperCase();
      this.coinService.addUserCoin(symbol, quantityNumberValue)
        .subscribe({
          next: () => {
            this.updateCoinList(upperCaseSymbol, quantityNumberValue);
            this.quantity.setValue('');
            this.symbol.setValue('');
          },
          error: (error) => {
            this.coinFormErrorResponse = error;
          }
        })
    }
  }

  updateCoinList(symbol: string, quantity: number){
    if(this.bianceService.isBeingSubscribed(symbol)){
      this.userCoins.push(new UserCoin(symbol, quantity));
    } else {
      // implement subscribind to a new coin 
    }
  }

  get quantity(){
    return this.coinForm.controls['quantity'];
  }

  get symbol(){
    return this.coinForm.controls['symbol'];
  }

  validateSymbol(control: AbstractControl): ValidationErrors | null {
    const symbol = control.value;
    const symbolExists = this.userCoins.some(coin => coin.symbol.toLowerCase() === symbol.toLowerCase());
    return symbolExists ? {alreadyHaveCoin: true} : null;
  }
}
