import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordMatchValidator } from '../../shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private fb:FormBuilder, private router: Router){}

  registerForm = this.fb.group({
    username: ['', Validators.min(4), Validators.max(100), Validators.required],
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.min(4), Validators.max(100), Validators.required],
    confirmPassword: ['', Validators.min(4), Validators.max(100), Validators.required]
  }, {validators: passwordMatchValidator})
}
