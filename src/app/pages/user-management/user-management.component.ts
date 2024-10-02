import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../core/model/common.model';
import { AuthService } from '../../core/services/auth.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { fixedAdmin } from '../../core/constant/constant';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  p: number = 1;
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  fixedAdmin = fixedAdmin;
  searchControl = new FormControl();
  private searchSubscription = new Subscription();
  selectedUser: User | null = null;

  ngOnInit(): void {
    this.loadUsers();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          if (!searchTerm) {
            return this.authService.getAllUsers();
          }
          return this.authService.searchUser(searchTerm);
        })
      )
      .subscribe(
        (response) => {
          if (response && response.data.length > 0) {
            this.users = response.data;
          } else {
            this.users = [];
            this.notificationService.showNotification('No users found');
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
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
  openDeleteUser(user: User): void {
    this.selectedUser = user;
    const modalEl = document.getElementById('deleteConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  onDelete(): void {
    if (this.selectedUser) {
      this.authService.deleteUser(this.selectedUser._id).subscribe(
        (response) => {
          if (response.success) {
            this.users = this.users.filter(
              (p) => p._id !== this.selectedUser?._id
            );
            this.notificationService.showNotification(
              'User deleted successfully'
            );
            this.selectedUser = null;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
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
        this.notificationService.showNotification('Admin status updated successfully')
        this.loadUsers();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
