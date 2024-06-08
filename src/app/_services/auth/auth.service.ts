import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserCredentails } from '../../_models/UserCredentials';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../_models/LoginResponse';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../_models/JwtPayload';

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
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, {username, email, password});
  }

  login(username:string, password: string){
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {username, password})
      .pipe(map((response) => {
        const decoded = this.decodeToken(response.accessToken);
        localStorage.setItem('authorities', decoded.authorities.toString());
        const userCredentials = new UserCredentails(username, response.accessToken);
        localStorage.setItem('user', JSON.stringify(userCredentials));
        this.userCredentialsSubject.next(userCredentials);
        return userCredentials;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authorities');
    this.userCredentialsSubject.next(null);
    window.location.reload();
    this.router.navigate(['/login']);
  }

  get userValue() {
    return this.userCredentialsSubject.value;
  }

  isAuthenticated() : boolean {
    return this.userValue ? true : false;
  }
  
  isAdmin(): boolean {
    const authorities = localStorage.getItem('authorities');
    if(authorities) return authorities.includes('ROLE_ADMIN');
    return false;
  }

  decodeToken(token: string){
    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded);
    return decoded;
  }
}
