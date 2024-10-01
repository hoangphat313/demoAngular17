import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../core/model/common.model';
import { AuthService } from '../../core/services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '../../shared/notifications/notification.service';
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, MatSlideToggleModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  p: number = 1;
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  fixedAdmin = '66f6109e36b0575f7182d61c';
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.authService.getAllUsers().subscribe(
      (response) => {
        this.users = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  toggleAdmin(userId: string, currentAdmin: boolean) {
    if (userId === this.fixedAdmin) {
      this.notificationService.showNotification(
        'Cannot toggle admin status for this user'
      );
      return;
    }
    const newIsAdmin = !currentAdmin;
    this.authService.updateIsAdmin(userId, newIsAdmin).subscribe(
      (response) => {
        console.log(response);
        this.loadUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
