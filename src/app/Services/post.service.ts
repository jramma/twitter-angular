import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';
import { Injectable } from '@angular/core';
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

  getPosts(): Promise<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.urlBlogUocApi).toPromise();
  }
  // TODO 22
  getPostsByUserId(userId: string): Promise<PostDTO[]> {
    const token = localStorage.getItem('access_token');
    console.log(token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<PostDTO[]>(`http://localhost:3000/users/posts/${userId}`, {
        headers,
      })
      .toPromise();
  }

  createPost(post: PostDTO): Promise<PostDTO> {
    return this.http.post<PostDTO>(this.urlBlogUocApi, post).toPromise();
  }

  getPostById(postId: string): Promise<PostDTO> {
    return this.http
      .get<PostDTO>(this.urlBlogUocApi + '/' + postId)
      .toPromise();
  }

  updatePost(postId: string, post: PostDTO): Promise<PostDTO> {
    return this.http
      .put<PostDTO>(this.baseUrl+ 'posts/' + postId, post)
      .toPromise();
  }

  likePost(postId: string): Promise<updateResponse> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/like/' + postId, NONE_TYPE)
      .toPromise();
  }

  dislikePost(postId: string): Promise<updateResponse> {
    return this.http
      .put<updateResponse>(this.urlBlogUocApi + '/dislike/' + postId, NONE_TYPE)
      .toPromise();
  }

  deletePost(postId: string): Promise<deleteResponse> {
    return this.http
      .delete<deleteResponse>(this.urlBlogUocApi + '/' + postId)
      .toPromise();
  }
}
