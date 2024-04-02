import { Component, OnInit } from '@angular/core';
import { Post } from '../_models/Post';
import { PostService } from '../_services/post/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  size:number = 10;
  page:number = 0;
  posts:Post[] = [];

  constructor(private postService:PostService) {};

  ngOnInit(): void {
    this.postService.getPosts(this.page, this.size)
      .subscribe(posts => {
        this.posts = posts;
      })
  }

  getPosts(){
    // return [
    //   {
    //     id: 1,
    //     content: "Pierszy post napisany przez Stanisław Zdybla. Twórca aplikacji stowrzonej na potrzeby przedmiotu projektu."
    //               + " Do halvingu pozostało mniej niż miesiąc. Sprzedam swoje coiny w myśl zasadzie buy the roumor sell the news.",
    //     timeAdded: "2024-03-26T20:31:33.620+00:00",
    //     author: "stasiek",
    //     isVerified: true
    //   }
    // ]
  }


}
