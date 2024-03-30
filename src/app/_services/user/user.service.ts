import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../_models/User';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) {};

  getUserByUsername(username: string){
    const params = {
      'username': username,
    }
    return this.http.get<User[]>(`${environment.apiUrl}/user/list`, { params });
  }
}
