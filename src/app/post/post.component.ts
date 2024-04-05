import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/Post';
import { PostService } from '../_services/post/post.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  size:number = 7;
  page:number = 0;
  posts:Post[] = [];
  totalPages:number = this.page;
  postForm = this.fb.group({
    content: ['', Validators.required]
  })

  constructor(private postService:PostService, private fb:FormBuilder) {};

  ngOnInit(): void {
    this.getPosts();
  }

  addPost() {
    const val = this.postForm.value;
    if(val.content){
      this.postService.addPost(val.content)
        .subscribe(
          {
            next: (r) => {
              console.log(r);
              this.getPosts();
              this.content.setValue('');
            },
            error: (e) => {
              console.log(e);
            }
          }
        )
    }
  }

  getPosts(){
    this.postService.getPosts(this.page, this.size)
      .subscribe(
        {
          next: (pagedResponse) => { 
            this.posts = pagedResponse.content;
            this.totalPages = pagedResponse.totalPages;
          },
          error: (e) => {this.page--;}
        }
      )
        
  }

  onPageChange(page: number){
    this.page = page;
    this.getPosts();
  }

  get content(){
    return this.postForm.controls['content'];
  }
}
