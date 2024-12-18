import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { UserService } from 'src/app/Services/user.service';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss'],
})
export class PostFormComponent implements OnInit {
  postForm!: FormGroup;
  categories: CategoryDTO[] = [];
  isEditMode = false;
  postId!: string;
  userId: string | undefined | null = null;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private categoryService: CategoryService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Obtener userId desde el estado de Redux
    this.store.select(selectUserId).subscribe((userId) => {
      console.log('User ID:', userId);
      this.userId = userId;
      if (this.userId) {
        this.loadCategories();
      }
    });

    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(55)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      publication_date: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
      ],
      categories: [[], Validators.required],
      newCategoryName: [''],
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.postId = params['id'];
        this.loadPostData(this.postId);
      }
    });
  }

  loadCategories(): void {
    if (this.userId) {
      this.categoryService.getCategoriesByUserId(this.userId).subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        },
      });
    }
  }

  loadPostData(postId: string): void {
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        const formattedDate = new Date(post.publication_date)
          .toISOString()
          .split('T')[0];

        this.postForm.patchValue({
          title: post.title,
          description: post.description,
          publication_date: formattedDate,
          categories: post.categories.map((category) => category.categoryId),
        });
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  editPost(): void {
    if (this.postForm.invalid) {
      return;
    }

    this.postService.getPostById(this.postId).subscribe({
      next: (originalPost) => {
        if (!originalPost) {
          console.error('Post not found');
          return;
        }

        const formValues = this.postForm.value;
        const updatedPost: PostDTO = {
          ...originalPost,
          title: formValues.title,
          description: formValues.description,
          publication_date: new Date(formValues.publication_date),
          categories: formValues.categories.map((categoryId: string) => ({
            categoryId,
          })),
        };

        this.postService.updatePost(this.postId, updatedPost).subscribe({
          next: () => {
            this.sharedService.managementToast(
              'Post updated successfully',
              true
            );
            this.router.navigateByUrl('/posts');
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          },
        });
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  createPost(): void {
    if (this.postForm.invalid || !this.userId) {
      return;
    }

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        const userAlias = user.alias;
        const formValues = this.postForm.value;
        const post: PostDTO = {
          title: formValues.title,
          description: formValues.description,
          userId: this.userId ?? '',
          publication_date: new Date(formValues.publication_date),
          categories: formValues.categories.map((categoryId: string) => ({
            categoryId,
          })),
          userAlias,
          num_likes: 0,
          num_dislikes: 0,
          postId: '',
        };

        this.postService.createPost(post).subscribe({
          next: () => {
            this.sharedService.managementToast(
              'Post created successfully',
              true
            );
            this.router.navigateByUrl('/home');
          },
          error: (error) => {
            this.sharedService.errorLog(error.error);
          },
        });
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }

  savePost(): void {
    if (this.isEditMode) {
      this.editPost();
    } else {
      this.createPost();
    }
  }

  addCategory(): void {
    const newCategoryName = this.postForm.get('newCategoryName')?.value.trim();
    if (!newCategoryName || !this.userId) {
      return;
    }

    const newCategory = new CategoryDTO(newCategoryName, '', '');
    this.categoryService.createCategory(newCategory).subscribe({
      next: (createdCategory) => {
        this.categories.push(createdCategory);
        this.postForm.get('newCategoryName')?.reset();
        this.sharedService.managementToast('Category added successfully', true);
      },
      error: (error) => {
        this.sharedService.errorLog(error.error);
      },
    });
  }
}
