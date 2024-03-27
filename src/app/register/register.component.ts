import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { zip } from 'rxjs';
import { UserService } from '../_services/user/user.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  registerForm = this.fb.group({
    username: [''],
    email: [''],
    password: ['']
  });

  constructor(private fb:FormBuilder, private userService:UserService){}
  
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
