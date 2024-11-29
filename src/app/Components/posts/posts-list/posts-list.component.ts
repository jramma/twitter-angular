import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { PostDTO } from 'src/app/Models/post.dto';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: PostDTO[] = [];
  displayedColumns: string[] = [
    'title',
    'description',
    'num_likes',
    'num_dislikes',
    'publication_date',

    'actions',
  ];
  dataSource = new MatTableDataSource<PostDTO>();

  userId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Suscribirse al selector para obtener el userId
    const userIdSub = this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
      this.loadPosts();
    });

    this.subscriptions.add(userIdSub);
  }

  loadPosts(): void {
    if (this.userId) {
      const postsSub = this.postService
        .getPostsByUserId(this.userId)
        .subscribe({
          next: (posts) => {
            this.posts = posts;
            this.dataSource.data = posts; // Actualizar el dataSource para la tabla
            console.log('Posts loaded:', this.posts);
          },
          error: (error) => {
            console.error('Error loading posts:', error);
            this.sharedService.errorLog(error.error);
          },
        });

      this.subscriptions.add(postsSub);
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

    const deleteSub = this.postService.deletePost(postId).subscribe({
      next: () => {
        console.log(`Post with ID ${postId} deleted successfully.`);
        this.loadPosts(); // Recargar la lista de posts tras eliminar
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        this.sharedService.errorLog(error.error);
      },
    });

    this.subscriptions.add(deleteSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
