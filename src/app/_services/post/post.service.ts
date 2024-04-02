import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post } from '../../_models/Post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  getPosts(page:number, size:number) {
    const params = {
      'page': page,
      'size': size
    };
    return this.http.get<Post[]>(`${environment.apiUrl}/post/list`, {params});
  }

}
