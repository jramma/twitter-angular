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

  async loadPosts(): Promise<void> {
    try {
      // Consumir el endpoint para obtener todos los posts
      this.posts = await this.postService.getPosts();

      // Calcular el total de likes y dislikes
      this.totalLikes = this.posts.reduce((sum, post) => sum + post.num_likes, 0);
      this.totalDislikes = this.posts.reduce((sum, post) => sum + post.num_dislikes, 0);
    } catch (error: any) {
      console.error('Error loading posts:', error);
    }
  }
}
