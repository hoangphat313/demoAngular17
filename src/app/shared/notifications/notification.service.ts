import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackbar: MatSnackBar) {}
  showNotification(
    message: string,
    action: string = 'X',
    duration: number = 2000
  ) {
    this.snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
