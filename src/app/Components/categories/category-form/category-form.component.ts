import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  category: CategoryDTO;
  title: UntypedFormControl;
  description: UntypedFormControl;
  css_color: UntypedFormControl;

  categoryForm: UntypedFormGroup;
  isValidForm: boolean | null;
  userId: string | undefined | null = null;
  isLoading: boolean = false; // Nueva variable para manejar el spinner

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private categoryId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.isValidForm = null;
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.category = new CategoryDTO('', '', '');
    this.isUpdateMode = false;
    this.validRequest = false;

    this.title = new UntypedFormControl(this.category.title, [
      Validators.required,
      Validators.maxLength(55),
    ]);

    this.description = new UntypedFormControl(this.category.description, [
      Validators.required,
      Validators.maxLength(255),
    ]);

    this.css_color = new UntypedFormControl(this.category.css_color, [
      Validators.required,
      Validators.maxLength(7),
    ]);

    this.categoryForm = this.formBuilder.group({
      title: this.title,
      description: this.description,
      css_color: this.css_color,
    });
  }

  ngOnInit(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
    });

    if (this.categoryId) {
      this.isUpdateMode = true;
      this.loadCategoryDetails();
    }
  }

  private loadCategoryDetails(): void {
    let errorResponse: any;

    this.categoryService.getCategoryById(this.categoryId!).subscribe({
      next: (category) => {
        this.category = category;
        this.title.setValue(this.category.title);
        this.description.setValue(this.category.description);
        this.css_color.setValue(this.category.css_color);
        this.categoryForm = this.formBuilder.group({
          title: this.title,
          description: this.description,
          css_color: this.css_color,
        });
      },
      error: (error) => {
        errorResponse = error.error;
        this.sharedService.errorLog(errorResponse);
      },
    });
  }

  private createCategory(): void {
    let errorResponse: any;
    let responseOK = false;

    if (this.userId) {
      this.isLoading = true; // Activa el spinner
      this.category.userId = this.userId;

      this.categoryService.createCategory(this.category).subscribe({
        next: () => {
          responseOK = true;
        },
        error: (error) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
        complete: async () => {
          this.isLoading = false; // Desactiva el spinner
          await this.sharedService.managementToast(
            'categoryFeedback',
            responseOK,
            errorResponse
          );
          if (responseOK) {
            this.router.navigateByUrl('categories');
          }
        },
      });
    } else {
      console.error('User ID is missing.');
    }
  }

  private editCategory(): void {
    let errorResponse: any;
    let responseOK = false;

    if (this.userId && this.categoryId) {
      this.isLoading = true; // Activa el spinner
      this.category.userId = this.userId;

      this.categoryService
        .updateCategory(this.categoryId, this.category)
        .subscribe({
          next: () => {
            responseOK = true;
          },
          error: (error) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          },
          complete: async () => {
            this.isLoading = false; // Desactiva el spinner
            await this.sharedService.managementToast(
              'categoryFeedback',
              responseOK,
              errorResponse
            );
            if (responseOK) {
              this.router.navigateByUrl('categories');
            }
          },
        });
    } else {
      console.error('User ID or Category ID is missing.');
    }
  }

  saveCategory(): void {
    this.isValidForm = false;

    if (this.categoryForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.category = this.categoryForm.value;

    if (this.isUpdateMode) {
      this.editCategory();
    } else {
      this.createCategory();
    }
  }
}
