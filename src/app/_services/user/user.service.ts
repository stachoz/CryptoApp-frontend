import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../_models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl:string = 'http://localhost:8080/api/v1/auth/';

  constructor(private http:HttpClient) { }

  registerUser(user: User) {
    return this.http.post<User>(this.baseUrl + 'register', user);
  }
}
