import { Component, OnInit, createEnvironmentInjector } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { AuthService } from '../_services/auth/auth.service';
import { User } from '../_models/User';
import { UserCoin } from '../_models/UserCoin';
import { CoinService } from '../_services/coin/coin-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;
  userCoins: UserCoin[] = [];
  totalCoinsValue: number = 0;

  constructor(private userService:UserService, private authService:AuthService,
    private coinService:CoinService           
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
}
