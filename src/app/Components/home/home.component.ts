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
import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate(
                '0.3s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  posts!: PostDTO[]; // Lista de posts
  showButtons: boolean; // Mostrar botones dependiendo de la autenticación
  selectedFormat: number = 1; // Formato seleccionado (opcional)
  userId: string | undefined | null = null; // Usuario autenticado

  constructor(
    private postService: PostService,
    private sharedService: SharedService,
    private store: Store,
    private router: Router
  ) {
    this.showButtons = false;
    this.loadPosts(); // Cargar los posts al inicializar el componente
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
        // Encuentra el post y actualiza el número de likes localmente
        const post = this.posts.find((p) => p.postId === postId);
        if (post) {
          post.num_likes++;
        }
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  dislike(postId: string): void {
    this.postService.dislikePost(postId).subscribe({
      next: () => {
        // Encuentra el post y actualiza el número de dislikes localmente
        const post = this.posts.find((p) => p.postId === postId);
        if (post) {
          post.num_dislikes++;
        }
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
}
