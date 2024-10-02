import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { Observable } from 'rxjs';
import { Post } from '../model/common.model';
import { ApiEndpoint } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private _http: HttpClient,
    private notificationService: NotificationService
  ) {}
  getAllPosts(): Observable<{ success: boolean; data: Post[] }> {
    return this._http.get<{ success: boolean; data: Post[] }>(
      `${ApiEndpoint.Post.GetAllPosts}`
    );
  }
  getPostById(id: string): Observable<{ success: boolean; data: Post }> {
    return this._http.get<{ success: boolean; data: Post }>(
      `${ApiEndpoint.Post.GetPostById}?id=${id}`
    );
  }
  addPost(post: Post): Observable<{ success: boolean; data: Post }> {
    return this._http.post<{ success: boolean; data: Post }>(
      `${ApiEndpoint.Post.CreatePost}`,
      post
    );
  }
  updatePost(
    id: string,
    post: Post
  ): Observable<{ success: boolean; data: Post }> {
    return this._http.put<{ success: boolean; data: Post }>(
      `${ApiEndpoint.Post.UpdatePost}?id=${id}`,
      post
    );
  }
  deletePost(id: string): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      `${ApiEndpoint.Post.DeletePost}?id=${id}`
    );
  }
  searchPost(
    searchTerm: string
  ): Observable<{ success: boolean; message: string; data: Post[] }> {
    return this._http.get<{ success: boolean; message: string; data: Post[] }>(
      `${ApiEndpoint.Post.SearchPost}?name=${searchTerm}`
    );
  }
  updateFeaturedPost(
    postId: string,
    featured: boolean
  ): Observable<{ success: boolean; data: Post }> {
    return this._http.put<{ success: boolean; data: Post }>(
      `${ApiEndpoint.Post.UpdateFeaturedPost}`,
      { postId: postId, featured: featured }
    );
  }
}
