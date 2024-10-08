import { Component, effect, inject, Injector, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/model/common.model';
import { NotificationService } from '../notifications/notification.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { fixedAdmin } from '../../core/constant/constant';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FavouriteService } from '../../core/services/favourite.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  postService = inject(PostService);
  favouriteService = inject(FavouriteService);
  notificationService = inject(NotificationService);
  cartService = inject(CartService);
  isLoggedIn = this.authService.isLoggedIn();
  injector = inject(Injector);
  user: User | null = null;
  router = inject(Router);
  searchControl = new FormControl();
  posts: Post[] = [];
  fixedAdmin = fixedAdmin;
  faHeart = faHeartRegular;
  faCart = faCartShopping;
  isDropdownOpen = false;
  isSystemDropdownOpen = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    effect(
      () => {
        this.isLoggedIn = this.authService.isLoggedIn();
        if (this.isLoggedIn) {
          this.authService.userDetails().subscribe(
            (response) => {
              this.user = response.data;
            },
            (error) => {
              console.log(error);
            }
          );
        }
      },
      { injector: this.injector }
    );
  }
  logout() {
    this.authService.logout();
  }
  toggleProfile() {
    this.router.navigate(['profile']);
  }
  toggleMyOrders() {
    this.router.navigate(['my-orders']);
  }
  togglePostManagement() {
    if (this.user && this.user.isAdmin) {
      this.router.navigate(['post_management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
  toggleOrderManagement() {
    if (this.user && this.user.isAdmin) {
      this.router.navigate(['order-management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
  toggleFeedbackManagement() {
    if (this.user && this.user.isAdmin) {
      this.router.navigate(['feedback_management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
  toggleUserManagement() {
    if (this.user && this.user.isAdmin) {
      this.router.navigate(['user_management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
  toggleNavigateFav() {
    if (this.user) {
      this.router.navigate(['user_favourite']);
      // this.favouriteService.getAllFavourites(this.user._id);
    }
  }
  toggleNavigateCart() {
    if (this.user) {
      this.router.navigate(['cart']);
    }
  }
  toggleNavHome() {
    this.router.navigate(['']);
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isSystemDropdownOpen = false; 
  }

  toggleSystemManagement() {
    this.isSystemDropdownOpen = !this.isSystemDropdownOpen;
  }
}
