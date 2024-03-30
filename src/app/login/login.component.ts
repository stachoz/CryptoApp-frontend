import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../_services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(private fb:FormBuilder, private authService:AuthService, private router:Router){}

  get username(){
    return this.loginForm.controls['username'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  login() {
      const val = this.loginForm.value;
      if(val.username && val.password){
        this.authService.login(val.username, val.password)
          .subscribe(
              () => {
                  this.router.navigateByUrl('/');
              }
          )
      }
    }
}
