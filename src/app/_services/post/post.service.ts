import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post } from '../../_models/Post';
import { PagedResponse } from '../../_models/PagedResponse';
import { Comment } from '../../_models/Comment';

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

  getPostById(id: number){
    return this.http.get<Post>(`${environment.apiUrl}/post/${id}`);
  }

  addPost(content: string){
    return this.http.post<Post>(`${environment.apiUrl}/post`, {content});
  }

  reportPost(cause: string, postId: number){
    return this.http.post<any>(`${environment.apiUrl}/post/${postId}/report`, {cause});
  }

  getPostComments(postId: number, page: number, size: number){
    const params = {
      'page': page,
      'size': size
    };
    return this.http.get<PagedResponse<Comment>>(`${environment.apiUrl}/post/${postId}/comment/list`, {params});
  }

  addComment(content: string, postId: number){
    return this.http.post<any>(`${environment.apiUrl}/post/${postId}/comment`, {content});
  }

  reportComment(cause: string, commendId:number){
    return this.http.post<any>(`${environment.apiUrl}/post/comment/${commendId}/report`, {cause});
  }
}
