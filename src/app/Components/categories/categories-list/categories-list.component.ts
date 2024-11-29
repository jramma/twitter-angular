import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryDTO } from 'src/app/Models/category.dto';
import { CategoryService } from 'src/app/Services/category.service';
import { SharedService } from 'src/app/Services/shared.service';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
  categories: CategoryDTO[] = [];
  displayedColumns: string[] = ['id', 'title', 'description', 'css_color', 'actions'];
  dataSource = new MatTableDataSource<CategoryDTO>();
  userId: string | undefined | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private sharedService: SharedService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;
      if (this.userId) {
        this.loadCategories();
      }
    });
  }

  private loadCategories(): void {
    if (this.userId) {
      this.categoryService.getCategoriesByUserId(this.userId).subscribe({
        next: (categories) => {
          this.categories = categories;
          this.dataSource.data = categories; // Actualizar la tabla con los datos
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
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
    const confirmation = confirm('Confirm delete category with id: ' + categoryId + '.');
    if (confirmation) {
      this.categoryService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.loadCategories(); // Recargar la lista de categorías tras eliminar
        },
        error: (error) => {
          this.sharedService.errorLog(error.error);
        },
      });
    }
  }
}
