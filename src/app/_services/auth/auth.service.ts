import { HttpClient } from '@angular/common/http';
import { Injectable, createNgModule } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../../_models/User';
import { UserCredentails } from '../../_models/UserCredentials';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../_models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCredentialsSubject: BehaviorSubject<UserCredentails | null>;
  public userCredentials: Observable<UserCredentails | null>; 

  constructor(private http:HttpClient, private router:Router) { 
    this.userCredentialsSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!))
    this.userCredentials = this.userCredentialsSubject.asObservable();
  }

  registerUser(username: string, email: string, password: string) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, {username, email, password});
  }

  login(username:string, password: string){
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {username, password})
      
      .pipe(map((response) => {
        const userCredentials = new UserCredentails(username, response.accessToken);
        localStorage.setItem('user', JSON.stringify(userCredentials));
        this.userCredentialsSubject.next(userCredentials);
        return userCredentials;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userCredentialsSubject.next(null);
    this.router.navigate(['/login']);
  }

  get userValue() {
    return this.userCredentialsSubject.value;
  }
}
