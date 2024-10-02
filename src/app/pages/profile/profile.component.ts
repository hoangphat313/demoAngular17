import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/model/common.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../shared/notifications/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  updateForm!: FormGroup;
  notificationService = inject(NotificationService);
  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      avatarUrl: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadUserDetail();
  }

  loadUserDetail(): void {
    this.authService.userDetails().subscribe(
      (response) => {
        console.log(response);
        if (response.data) {
          this.user = response.data;
          this.updateForm.patchValue({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            avatarUrl: response.data.avatarUrl,
          });
        } else {
          console.log('User data is undefined');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  openEditForm(): void {
    const modalEl = document.getElementById('editUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  updateUserDetail(): void {
    if (this.updateForm.valid && this.user) {
      const updateData = this.updateForm.value;
      this.authService.updateUserDetail(this.user._id, updateData).subscribe({
        next: (response) => {
          if (response.data) {
            this.user = response.data;
            this.notificationService.showNotification(
              'User updated successfully'
            );
            const modalEl = document.getElementById('editUserModal');
            if (modalEl) {
              const modal = bootstrap.Modal.getInstance(modalEl);
              if (modal) {
                modal.hide();
              }
            }
          } else {
            this.notificationService.showNotification('Failed to update user');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
