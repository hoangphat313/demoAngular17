import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { Observable } from 'rxjs';
import { Post, User } from '../model/common.model';
import { ApiEndpoint } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  constructor(
    private _http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllFavourites(
    userId: string
  ): Observable<{ success: boolean; data: Post[] }> {
    return this._http.get<{ success: boolean; data: Post[] }>(
      `${ApiEndpoint.Favourite.GetAllFavourites}?userId=${userId}`
    );
  }
  addFavourite(
    userId: string,
    postId: string
  ): Observable<{ success: boolean; data: User; message: string }> {
    return this._http.post<{ success: boolean; data: User; message: string }>(
      `${ApiEndpoint.Favourite.AddFavourite}`,
      { userId: userId, postId: postId }
    );
  }
  removeFavourite(
    userId: string,
    postId: string
  ): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      ApiEndpoint.Favourite.RemoveFavourite,
      {
        body: { userId, postId },
      }
    );
  }
}
