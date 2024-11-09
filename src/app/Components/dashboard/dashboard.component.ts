import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/Services/post.service';
import { PostDTO } from 'src/app/Models/post.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  posts: PostDTO[] = [];
  totalLikes: number = 0;
  totalDislikes: number = 0;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.totalLikes = this.posts.reduce(
          (sum, post) => sum + post.num_likes,
          0
        );
        this.totalDislikes = this.posts.reduce(
          (sum, post) => sum + post.num_dislikes,
          0
        );
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
  }
}
