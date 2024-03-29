import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../_models/User';
import { LoginResponse } from '../../_models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl:string = 'http://localhost:8080/api/v1/auth/';

  constructor(private http:HttpClient) { }

  registerUser(username: string, email: string, password: string) {
    return this.http.post<User>(this.baseUrl + 'register', {username, email, password});
  }

  login(username:string, password: string){
    return this.http.post<LoginResponse>(this.baseUrl + 'login', {username, password});
  }
}
