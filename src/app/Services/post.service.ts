import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostDTO } from '../Models/post.dto';

interface updateResponse {
  affected: number;
}

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private urlBlogUocApi: string;
  private controller: string;
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.controller = 'posts';
    this.urlBlogUocApi = 'http://localhost:3000/' + this.controller;
    this.baseUrl = 'http://localhost:3000/';
  }

  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi);
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<PostDTO[]>(
      `http://localhost:3000/users/posts/${userId}`,
      {
        headers,
      }
    );
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    console.log('Datos del post:', post);

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Crea un nuevo objeto excluyendo postId
    const { postId, ...postWithoutId } = post;

    return this.http.post<PostDTO>(this.urlBlogUocApi, postWithoutId, { headers });
  }

  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<PostDTO>(`${this.baseUrl}posts/${postId}`, post, {
      headers,
    });
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http.get<PostDTO>(this.urlBlogUocApi + '/' + postId);
  }

  likePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(
      this.urlBlogUocApi + '/like/' + postId,
      {}
    );
  }

  dislikePost(postId: string): Observable<updateResponse> {
    return this.http.put<updateResponse>(
      this.urlBlogUocApi + '/dislike/' + postId,
      {}
    );
  }

  deletePost(postId: string): Observable<deleteResponse> {
    return this.http.delete<deleteResponse>(this.urlBlogUocApi + '/' + postId);
  }
}
