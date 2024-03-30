import { Component, OnInit, createEnvironmentInjector } from '@angular/core';
import { UserService } from '../_services/user/user.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  email: string = 'init value';

  constructor(private userService:UserService, private authService:AuthService) {}


  ngOnInit(): void {
    const credentials = this.authService.userValue;
    if(credentials){
      this.userService.getUserByUsername(credentials.username).subscribe(
        user => {
          this.email = user[0].email;
        }
      );
    }
  }

}
