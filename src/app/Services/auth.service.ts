import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Importa Observable
import { AuthDTO } from '../Models/auth.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi: string;
  private controller: string;

  constructor(private http: HttpClient) {
    this.controller = 'auth';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
  }

  login(auth: AuthDTO): Observable<AuthToken> {
    // Cambiar Promise a Observable
    return this.http.post<AuthToken>(this.urlBlogUocApi, auth);
  }
}
