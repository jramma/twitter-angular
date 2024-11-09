import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { PostDTO } from 'src/app/Models/post.dto';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts!: PostDTO[];

  constructor(
    private postService: PostService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      this.postService.getPostsByUserId(userId).subscribe({
        next: (posts) => {
          this.posts = posts;
          console.log(this.posts);
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        },
      });
    }
  }

  createPost(): void {
    this.router.navigateByUrl('/user/post/');
  }

  updatePost(postId: string): void {
    this.router.navigateByUrl(`/user/post/${postId}`);
  }

  deletePost(postId: string): void {
    const confirmation = confirm('Are you sure you want to delete this post?');
    if (!confirmation) {
      return;
    }

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.loadPosts(); // Recargar la lista de posts tras eliminar
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
}
