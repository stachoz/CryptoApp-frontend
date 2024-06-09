import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post/post.service';
import { PostReport } from '../_models/PostReport';
import { CommentReport } from '../_models/CommentReport';
import { Router } from '@angular/router';
import { UserService } from '../_services/user/user.service';
import { User } from '../_models/User';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{
  postRoute: string = "/post/"
  reportedPosts: PostReport[] = [];
  reportedComments: CommentReport[] = [];
  blockUserAction:string = "BLOCK";
  ublockUserAction:string = "UNBLOCK";
  blockedUsers: User[] = [];

  constructor(private postService:PostService, private router:Router, private userService:UserService){}

  ngOnInit(): void {
    this.postService.getReportedComments().subscribe({
      next: (reported) => {
        this.reportedComments = reported;
      },
      error: (error) => {
        console.log(error);
      }
    })

    this.postService.getRerportedPosts().subscribe({
      next: (reported) => {
        this.reportedPosts = reported;
        this.loadBlockedUsers();
      },
      error:(error) => {
        console.log(error);
      }
    })
  }

  loadBlockedUsers(){
    this.userService.getAllBlockedUsers().subscribe({
      next: (users) =>{
        this.blockedUsers = users;
      }
    })
  }

  navigateToReportedComment(postId: number, commentId: number){
    this.router.navigate([`${this.postRoute}/${postId}`], {queryParams: {reportedCommentId: commentId}});
  }

  deletePostReport(reportId: number) {
    console.log("delete post report");
    this.postService.deleteReport(reportId).subscribe({
      next: () => this.reportedPosts = this.reportedPosts.filter(report => report.reportId !== reportId)
    })
  }

  deleteCommentReport(reportId: number){
    console.log(reportId);
    this.postService.deleteReport(reportId).subscribe({
      next:() => this.reportedComments.filter(report => report.id !== reportId)
    })
  }

  deletePost(postId: number){
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.reportedPosts = this.reportedPosts.filter(report => report.post.id !== postId);
        this.reportedComments = this.reportedComments.filter(report => report.comment.postId !== postId);
      }
    })
  }

  deleteComment(commentId: number){
    this.postService.deleteComment(commentId).subscribe({
      next: () => this.reportedComments = this.reportedComments.filter(report => report.comment.id !== commentId)
    })
  }

  changeUserAccess(username: string, action: string){
    this.userService.changeUserAcess(action, username).subscribe({
      next: () => {
        this.loadBlockedUsers();
      }
    })
  }
}
