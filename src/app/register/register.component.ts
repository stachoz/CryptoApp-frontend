import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../_services/user/user.service';
import { User } from '../_models/User';
import { passwordMatchValidator } from '../../shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  min:number = 4;
  max:number = 100;

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    password: ['', [Validators.required, Validators.minLength(this.min), Validators.maxLength(this.max)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  }
  );

  constructor(private fb:FormBuilder, private userService:UserService){}

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
      const user = new User(username, email, password);
      this.userService.registerUser(user)
        .subscribe(
          response => {
            console.log('registration succesfull', response);
          }
        )
    }
  }
}