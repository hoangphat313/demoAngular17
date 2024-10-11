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
import { FavouriteService } from '../../core/services/favourite.service';

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
  avatarPreview: string | null = null;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private favouriteService: FavouriteService
  ) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadUserDetail();
  }
  loadUserDetail(): void {
    this.authService.userDetails().subscribe(
      (response) => {
        if (response.data) {
          this.user = response.data;
          this.updateForm.patchValue({
            name: response.data.name,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            avatarUrl: response.data.avatarUrl,
          });
          this.avatarPreview = response.data.avatarUrl;
          this.loadUserFavourite();
        } else {
         this.notificationService.showNotification('User data is undefined');
        }
      },
      (error) => {
       this.notificationService.showNotification('User data is undefined');
      }
    );
  }
  loadUserFavourite() {
    if (this.user && this.user._id) {
      this.favouriteService.getAllFavourites(this.user._id).subscribe(
        (response) => {
          if (response.data) {
          }
        },
        (error) => {
         this.notificationService.showNotification('Error fetching favourites');
        }
      );
    }
  }
  openEditForm(): void {
    const modalEl = document.getElementById('editUserModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  async handleFileInput(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.avatarPreview = await this.getBase64(file);
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.notificationService.showNotification(
          'Kích thước hình ảnh quá lớn. Vui lòng chọn hình ảnh nhỏ hơn 10MB.'
        );
        return;
      }
    }
  }
  updateUserDetail(): void {
    if (this.updateForm.valid && this.user) {
      const updateData = {
        ...this.updateForm.value,
        avatarUrl: this.avatarPreview,
      };
      this.authService.updateUserDetail(this.user._id, updateData).subscribe({
        next: (response) => {
          if (response.data) {
            this.user = response.data;
            this.authService.setCurrentUser(this.user); //set current user
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
          this.notificationService.showNotification('Failed to update user')
        },
      });
    }
  }
  logout(): void {
    this.authService.logout();
  }
}
