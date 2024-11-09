import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent {
  categories!: CategoryDTO[];
  userId: string | undefined | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.loadCategories();
      }
    });
  }

  private loadCategories(): void {
    let errorResponse: any;
    if (this.userId) {
      this.categoryService.getCategoriesByUserId(this.userId).subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
      });
    }
  }

  createCategory(): void {
    this.router.navigateByUrl('/user/category/');
  }

  updateCategory(categoryId: string): void {
    this.router.navigateByUrl('/user/category/' + categoryId);
  }

  deleteCategory(categoryId: string): void {
    let errorResponse: any;

    const result = confirm(
      'Confirm delete category with id: ' + categoryId + ' .'
    );
    if (result) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: (rowsAffected) => {
          if (rowsAffected.affected > 0) {
            this.loadCategories(); // Recargar la lista de categorías
          }
        },
        error: (error) => {
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
      });
    }
  }
}
