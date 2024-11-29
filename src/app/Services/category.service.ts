import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Importamos Observable
import { CategoryDTO } from '../Models/category.dto';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'categories';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  getCategoriesByUserId(userId: string): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(
      'http://localhost:3000/users/categories/' + userId
    );
  }

  createCategory(category: CategoryDTO): Observable<CategoryDTO> {
    console.log('Datos de la categoría:', category);
    // Cambiamos Promise a Observable
    return this.http.post<CategoryDTO>(this.urlBlogUocApi, category);
  }

  getCategoryById(categoryId: string): Observable<CategoryDTO> {
    // Cambiamos Promise a Observable
    return this.http.get<CategoryDTO>(this.urlBlogUocApi + '/' + categoryId);
  }

  updateCategory(
    categoryId: string,
    category: CategoryDTO
  ): Observable<CategoryDTO> {
    // Cambiamos Promise a Observable
    return this.http.put<CategoryDTO>(
      this.urlBlogUocApi + '/' + categoryId,
      category
    );
  }

  deleteCategory(categoryId: string): Observable<deleteResponse> {
    // Cambiamos Promise a Observable
    return this.http.delete<deleteResponse>(
      this.urlBlogUocApi + '/' + categoryId
    );
  }
}
