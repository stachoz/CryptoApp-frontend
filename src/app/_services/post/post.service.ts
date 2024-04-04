import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post } from '../../_models/Post';
import { PagedResponse } from '../../_models/PagedResponse';

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
    return this.http.get<PagedResponse<Post>>(`${environment.apiUrl}/post/list`, {params});
  }

  addPost(content: string){
    return this.http.post<Post>(`${environment.apiUrl}/post`, {content});
  }

}
