import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../Models/user.dto';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'users';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  register(user: UserDTO): Observable<HttpResponse<UserDTO>> {
    return this.http.post<UserDTO>(this.urlBlogUocApi, user, {
      observe: 'response',
    });
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(this.urlBlogUocApi + '/' + userId, user);
  }

  getUserById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(this.urlBlogUocApi + '/' + userId);
  }
}
