import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Post } from '../model/common.model';
import { ApiEndpoint } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private _http: HttpClient,
    private notification: NotificationService
  ) {}
  addToCart(
    userId: string,
    postId: string,
    quantity: number
  ): Observable<{ success: boolean; cartData: Post[]; message: string }> {
    return this._http.post<{
      success: boolean;
      cartData: Post[];
      message: string;
    }>(`${ApiEndpoint.Cart.AddToCart}`, {
      userId: userId,
      postId: postId,
      quantity: quantity,
    });
  }

  getCartItems(
    userId: string
  ): Observable<{ success: boolean; cartData: Post[] }> {
    return this._http.get<{ success: boolean; cartData: Post[] }>(
      `${ApiEndpoint.Cart.GetCartItems}?userId=${userId}`
    );
  }
  removeFromCart(
    userId: string,
    postId: string
  ): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      `${ApiEndpoint.Cart.RemoveFromCart}`,
      {
        body: { userId, postId },
      }
    );
  }
  deleteItem(
    userId: string,
    postId: string
  ): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      `${ApiEndpoint.Cart.DeleteItem}`,
      {
        body: { userId, postId },
      }
    );
  }
  updateCartItemQuantity(
    userId: string,
    postId: string,
    quantity: number
  ): Observable<{ success: boolean; message: string }> {
    return this._http.put<{ success: boolean; message: string }>(
      `${ApiEndpoint.Cart.UpdateCart}`,
      { userId, postId, quantity }
    );
  }
  clearCart(
    userId: string
  ): Observable<{ success: boolean; message: string; cartData: any }> {
    return this._http.delete<{
      success: boolean;
      message: string;
      cartData: any;
    }>(`${ApiEndpoint.Cart.ClearCart}`, {
      body: { userId },
    });
  }
}
