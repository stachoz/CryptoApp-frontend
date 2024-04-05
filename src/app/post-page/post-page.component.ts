import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/Post';
import { PostService } from '../_services/post/post.service';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../_models/Comment';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.css'
})
export class PostPageComponent implements OnInit{
  size:number = 10;
  page:number = 0;
  totalPages: number = this.page;
  post!:Post;
  comments:Comment[] = []
  commentForm = this.fb.group({
    content: ['', Validators.required]
  })

  constructor(private postService:PostService, private activatedRoute:ActivatedRoute, private fb:FormBuilder) {
  };

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params["id"]) {
        this.postService.getPostById(params["id"]).subscribe({
          next: (post) => {
            this.post = post;
            this.getComments(post.id, this.page, this.size);
          }
        })
      }
    })
  }

  getComments(id: number, page: number, size: number) {
    this.postService.getPostComments(id, page, size).subscribe({
      next: (pagedResponse) => {
        this.comments = pagedResponse.content;
        this.totalPages = pagedResponse.totalPages;
      }
    })
  }

  get content(){
    return this.commentForm.controls['content'];
  }

  addComment(){
    const val = this.commentForm.value;
    if(val.content){
      this.postService.addComment(val.content, this.post.id)
        .subscribe(
          {
            next: (r) => {
              console.log(r);
              this.getComments(this.post.id, this.page, this.size);
              this.content.setValue('');
            },
            error: (e) => {
              console.log(e);
            }
          }
        )
    }
  }

  onPageChange(page: number){
    this.page = page;
    this.getComments(this.post.id, page, this.size);
  }
}
