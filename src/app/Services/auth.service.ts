import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDTO } from '../Models/auth.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBlogUocApi = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(auth: AuthDTO): Observable<AuthToken> {
    console.log('Datos de autenticación:', auth);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<AuthToken>(this.urlBlogUocApi, auth, { headers });
  }
}
