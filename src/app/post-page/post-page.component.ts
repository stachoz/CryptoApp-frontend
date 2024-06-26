import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Post } from '../_models/Post';
import { PostService } from '../_services/post/post.service';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../_models/Comment';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

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
  showReportForm:boolean = false;
  reportedPostId!:number; // for report form
  reportedCommentId?:number; // for report form
  comentToSelectId:string= ""; // for admin tasks. Type of string because it is taken from url 

  constructor(private postService:PostService, private activatedRoute:ActivatedRoute, private fb:FormBuilder) {}

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
        this.selectReportedCommentId();
        console.log(this.comentToSelectId);
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

  openReportForm(postId: number, commmentId: number | undefined){
    this.reportedPostId = postId;
    if(commmentId) this.reportedCommentId = commmentId;
    this.showReportForm = true;
  }

  closeReportForm(){
    this.showReportForm = false;
  }

  selectReportedCommentId(){
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.comentToSelectId = params.get('reportedCommentId') ?? "";
    })
  }
}
