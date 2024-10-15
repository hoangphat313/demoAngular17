import { Injectable } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiEndpoint } from '../constant/constant';
import { IOrderItem } from '../model/common.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private _http: HttpClient) {}

  sendEmail(email: string): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(
      `${ApiEndpoint.Email.SendEmail}`,
      {
        email: email,
      }
    );
  }
  sendEmailOrder(
    email: string,
    orderItems: IOrderItem[],
    totalAmount: number,
    address: {
      houseNumber: string;
      street: string;
      city: string;
    },
    paymentMethod: string
  ): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(
      `${ApiEndpoint.Email.SendEmailOrder}`,
      {
        email: email,
        orderItems: orderItems,
        totalAmount: totalAmount,
        address: address,
        paymentMethod: paymentMethod,
      }
    );
  }
}
