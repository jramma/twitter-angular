import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from 'src/app/Models/post.dto';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Store } from '@ngrx/store';
import {
  selectUserId,
  selectShowAuthSection,
} from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[];
  showButtons: boolean;
  selectedFormat: number = 1;
  userId: string | undefined | null = null;

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private store: Store,
    private router: Router
  ) {
    this.showButtons = false;
    this.loadPosts();
  }

  ngOnInit(): void {
    // Suscribirse al estado de autenticación para mostrar u ocultar botones
    this.store.select(selectShowAuthSection).subscribe((showAuth) => {
      this.showButtons = showAuth;
    });

    // Obtener userId del estado de Redux
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
    });
  }

  private loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  like(postId: string): void {
    this.postService.likePost(postId).subscribe({
      next: () => {
        this.loadPosts(); // Recargar la lista de posts después de dar "like"
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  dislike(postId: string): void {
    this.postService.dislikePost(postId).subscribe({
      next: () => {
        this.loadPosts(); // Recargar la lista de posts después de dar "dislike"
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
}
