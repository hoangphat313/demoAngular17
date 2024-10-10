import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/model/common.model';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/notifications/notification.service';
import { SliderComponent } from '../../shared/slider/slider.component';
import { HammerModule } from '@angular/platform-browser';
import { FeedbackComponent } from '../feedback/feedback.component';
import { BannerComponent } from '../../shared/banner/banner.component';
import { FavouriteService } from '../../core/services/favourite.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { LottieComponent } from 'ngx-lottie';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
@Component({
  selector: 'app-user-favourite',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SliderComponent,
    HammerModule,
    FeedbackComponent,
    BannerComponent,
    FontAwesomeModule,
    LottieComponent,
    FormatCurrencyPipe,
  ],
  templateUrl: './user-favourite.component.html',
  styleUrl: './user-favourite.component.scss',
})
export class UserFavouriteComponent {
  authService = inject(AuthService);
  postService = inject(PostService);
  favouriteService = inject(FavouriteService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  user!: User;
  posts: Post[] = [];
  p: number = 1;
  searchControl = new FormControl();
  faHeart = faHeartRegular;
  faHeartFilled = faHeartSolid;
  favouritePostIds: Set<String> = new Set();
  lottieOptions: any;
  lottieLoadingOptions: any;
  isLoading: boolean = true;

  constructor() {
    this.lottieOptions = {
      path: 'assets/not_found_animation.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
    this.lottieLoadingOptions = {
      path: 'assets/loading.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }
  ngOnInit(): void {
    this.authService.userDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        if (this.user && this.user._id) {
          this.loadUserFavourites();
        }
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error fetching user details'
        );
      },
    });
  }
  navigateHome(): void {
    if (this.user) {
      this.router.navigate(['']);
    }
  }
  loadUserFavourites() {
    this.favouriteService.getAllFavourites(this.user._id).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.data) {
          this.posts = response.data;
          this.favouritePostIds = new Set(
            this.posts.map((post: Post) => post._id)
          );
        }
      },
      (error) => {
        this.isLoading = false;
        this.notificationService.showNotification('Error fetching favorites');
      }
    );
  }
  getPostById(id: string) {
    this.postService.getPostById(id).subscribe(
      (response) => {
        if (response.success && response.data) {
          this.router.navigate(['/post_detail', response.data._id]);
        }
      },
      (error) => console.log(error)
    );
  }
  toggleFavourite(postId: string) {
    if (!this.user || !this.user._id) {
      this.notificationService.showNotification(
        'Please login to add to favourites'
      );
      return;
    }
    if (this.favouritePostIds.has(postId)) {
      this.favouriteService.removeFavourite(this.user._id, postId).subscribe(
        (response) => {
          if (response.message) {
            this.favouritePostIds.delete(postId);
            this.loadUserFavourites();
            this.notificationService.showNotification(
              'Post removed from favourites'
            );
          } else {
            this.notificationService.showNotification(
              'Error removing from favourites'
            );
          }
        },
        (error) => {
          this.notificationService.showNotification(
            'Error removing from favourites'
          );
        }
      );
    } else {
      this.favouriteService.addFavourite(this.user._id, postId).subscribe(
        (response) => {
          if (response.success) {
            this.favouritePostIds.add(postId);

            this.notificationService.showNotification(
              'Post added to favourites'
            );
          } else {
            this.notificationService.showNotification(
              'Error adding to favourites'
            );
          }
        },
        (error) => {
          this.notificationService.showNotification(
            'Error adding to favourites'
          );
        }
      );
    }
  }
}
