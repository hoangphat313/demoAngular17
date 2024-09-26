import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../model/common.model';
import { ApiEndpoint, LocalStorage } from '../constant/constant';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/notifications/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  isLoggedIn = signal<boolean>(false);

  constructor(
    private _http: HttpClient,
    private notificationService: NotificationService
  ) {
    if (this.getUserToken()) {
      this.isLoggedIn.update(() => true);
    }
  }
  register(payload: RegisterPayload) {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Register}`, payload)
      .pipe(
        map((response) => {
          if (response.status) {
            this.notificationService.showNotification('Register successful');
          }
        })
      );
  }
  login(payload: LoginPayload) {
    return this._http
      .post<ApiResponse<User>>(`${ApiEndpoint.Auth.Login}`, payload)
      .pipe(
        map((response) => {
          if (response.status && response.token) {
            this.notificationService.showNotification('Login successful');
            localStorage.setItem(LocalStorage.token, response.token);
            this.isLoggedIn.update(() => true);
          }
          return response;
        })
      );
  }
  userDetails() {
    return this._http.get<ApiResponse<User>>(`${ApiEndpoint.Auth.UserDetail}`);
  }
  getUserToken() {
    return localStorage.getItem(LocalStorage.token);
  }
  logout() {
    localStorage.removeItem(LocalStorage.token);
    this.notificationService.showNotification('Logout successful');
    this.isLoggedIn.update(() => false);
    this.router.navigate(['login']);
  }
}
