import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { PostService } from 'src/app/Services/post.service';
import { SharedService } from 'src/app/Services/shared.service';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { PostDTO } from 'src/app/Models/post.dto';
import { UserService } from 'src/app/Services/user.service';
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
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(55)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      publication_date: [
        '',
        [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)],
      ],
      categories: [[], Validators.required],
      newCategoryName: [''], // Agregar el control newCategoryName
    });

    this.loadCategories();

    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.postId = params['id'];
        this.loadPostData(this.postId);
      }
    });
  }

  async loadCategories(): Promise<void> {
    const userId = this.localStorageService.get('user_id');
    if (userId) {
      try {
        this.categories = await this.categoryService.getCategoriesByUserId(
          userId
        );
      } catch (error: any) {
        this.sharedService.errorLog(error.error);
      }
    }
  }

  async loadPostData(postId: string): Promise<void> {
    try {
      const post = await this.postService.getPostById(postId);
      // Convertir la fecha a formato YYYY-MM-DD
      const formattedDate = new Date(post.publication_date)
        .toISOString()
        .split('T')[0];

      this.postForm.patchValue({
        title: post.title,
        description: post.description,
        publication_date: formattedDate, // Asegurarse de que la fecha esté en formato adecuado
        categories: post.categories.map((category) => category.categoryId),
      });
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  async editPost(): Promise<void> {
    if (this.postForm.invalid) {
      return;
    }

    try {
      // Primero obtén el post actual para obtener likes y dislikes
      const originalPost = await this.postService.getPostById(this.postId);

      // Si no se encuentra el post, no continuar
      if (!originalPost) {
        console.error('Post not found');
        return;
      }

      // Transformar los datos del formulario para que coincidan con el formato que espera el backend
      const formValues = this.postForm.value;
      const updatedPost: PostDTO = {
        ...originalPost, // Copia todos los datos del post original (incluyendo likes y dislikes)
        title: formValues.title,
        description: formValues.description,
        publication_date: new Date(formValues.publication_date), // Convertir a tipo Date
        categories: formValues.categories.map((categoryId: string) => ({
          categoryId,
        })), // Transformar las categorías si es necesario
      };

      // Llamar al servicio para actualizar el post
      await this.postService.updatePost(this.postId, updatedPost);
      this.sharedService.managementToast('Post updated successfully', true);
      this.router.navigateByUrl('/posts');
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  async createPost(): Promise<void> {
    if (this.postForm.invalid) {
      return;
    }

    // Obtén el user_id del LocalStorage
    const user_id = this.localStorageService.get('user_id');
    if (!user_id) {
      console.error('User ID not found');
      return;
    }

    try {
      // Obtén el alias del usuario utilizando el servicio UserService
      const user = await this.userService.getUserById(user_id);
      const userAlias = user.alias;

      // Transformar los datos del formulario para que coincidan con el formato que espera el backend
      const formValues = this.postForm.value;
      const post: any = {
        title: formValues.title,
        description: formValues.description,
        userId: user_id, // Utiliza el campo `user_id` como lo espera el backend
        publication_date: new Date(formValues.publication_date), // Convertir a tipo Date
        categories:
          formValues.categories.map((categoryId: string) => ({ categoryId })) ||
          [], // Transformar las categorías si es necesario
      };

      // Llamar al servicio para crear el post
      await this.postService.createPost(post);
      this.sharedService.managementToast('Post created successfully', true);
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }

  savePost(): void {
    if (this.isEditMode) {
      this.editPost();
    } else {
      this.createPost();
    }
  }

  async addCategory(): Promise<void> {
    const newCategoryName = this.postForm.get('newCategoryName')?.value.trim();
    if (!newCategoryName) {
      return;
    }

    const userId = this.localStorageService.get('user_id');
    if (!userId) {
      console.error('User not found');
      return;
    }

    const newCategory = new CategoryDTO(newCategoryName, '', '');
    try {
      const createdCategory = await this.categoryService.createCategory(
        newCategory
      );
      this.categories.push(createdCategory);
      this.postForm.get('newCategoryName')?.reset();
      this.sharedService.managementToast('Category added successfully', true);
    } catch (error: any) {
      this.sharedService.errorLog(error.error);
    }
  }
}
