import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../_helpers/password-match.directive';
import { AuthService } from '../_services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  min:number = 4;
  max:number = 100;
  errorsResponse:string[] = [];

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    password: ['', [Validators.required, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  }
  );

  constructor(private fb:FormBuilder, private authService:AuthService, private router: Router){}

  get username(){
    return this.registerForm.controls['username'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }

  get password(){
    return this.registerForm.controls['password'];
  }

  get confirmPassword(){
    return this.registerForm.controls['confirmPassword'];
  }
  
  onSubmit() {
    const {username, email, password} = this.registerForm.value;
    if(username && email && password){
      this.authService.registerUser(username, email, password)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/login');
          },
          error: (error) => {
            this.errorsResponse = error.error.errors;
          }
        });
    }
  }


}
