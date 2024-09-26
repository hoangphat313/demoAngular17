import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../../shared/notifications/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    notificationService.showNotification(
      'You are not authorized to access this page'
    );
    router.navigate(['login']);
  }
  return true;
};
