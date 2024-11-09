import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { PostDTO } from 'src/app/Models/post.dto';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts!: PostDTO[];
  
  userId: string | undefined | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
      this.loadPosts(); // Cargar los posts cuando se obtenga el userId
    });
  }

  loadPosts(): void {
    if (this.userId) {
      this.postService.getPostsByUserId(this.userId).subscribe({
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
