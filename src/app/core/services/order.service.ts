import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { IOrder, IOrderData, User } from '../model/common.model';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private _http: HttpClient,
    private notificationService: NotificationService
  ) {}
  placeOrder(
    orderData: IOrderData
  ): Observable<{ success: string; message: string; data: any }> {
    return this._http.post<{ success: string; message: string; data: any }>(
      `${ApiEndpoint.Order.PlaceOrder}`,
      {
        userId: orderData.userId,
        items: orderData.items,
        amount: orderData.amount,
        address: orderData.address,
        paymentMethod: orderData.paymentMethod,
      }
    );
  }
  getAllUserOrders(
    userId: string
  ): Observable<{ success: boolean; data: any }> {
    return this._http.get<{ success: boolean; data: any }>(
      `${ApiEndpoint.Order.GetAllOrdersForUser}?userId=${userId}`
    );
  }
  getAllOrderForAdmin(): Observable<{ success: boolean; data: any }> {
    return this._http.get<{ success: boolean; data: any }>(
      `${ApiEndpoint.Order.GetAllOrdersForAdmin}`
    );
  }
  searchOrder(
    searchTerm: string
  ): Observable<{ success: boolean; message: string; data: IOrderData[] }> {
    return this._http.get<{
      success: boolean;
      message: string;
      data: IOrderData[];
    }>(`${ApiEndpoint.Order.SearchOrder}?name=${searchTerm}`);
  }
  deleteOrder(
    orderId: string
  ): Observable<{ success: boolean; message: string }> {
    return this._http.delete<{ success: boolean; message: string }>(
      `${ApiEndpoint.Order.DeleteOrder}?orderId=${orderId}`
    );
  }
  updateOrderStatus(
    orderId: string,
    status: string
  ): Observable<{ success: boolean; data: IOrder }> {
    return this._http.put<{ success: boolean; data: IOrder }>(
      `${ApiEndpoint.Order.UpdateStatusOrder}`,
      { orderId: orderId, status: status }
    );
  }
}
