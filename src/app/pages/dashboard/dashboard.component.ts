import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/model/common.model';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { NotificationService } from '../../shared/notifications/notification.service';
import { SliderComponent } from '../../shared/slider/slider.component';
import { HammerModule } from '@angular/platform-browser';
import { FeedbackComponent } from '../feedback/feedback.component';
import { BannerComponent } from '../../shared/banner/banner.component';
import { FavouriteService } from '../../core/services/favourite.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../core/services/cart.service';
import { AboutUsComponent } from "../about-us/about-us.component";

@Component({
  selector: 'app-dashboard',
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
    FormatCurrencyPipe,
    AboutUsComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  postService = inject(PostService);
  favouriteService = inject(FavouriteService);
  notificationService = inject(NotificationService);
  cartService = inject(CartService);
  router = inject(Router);
  user!: User;
  posts: Post[] = [];
  p: number = 1;
  searchControl = new FormControl();
  private searchSubscription: Subscription = new Subscription();
  faHeart = faHeartRegular;
  faHeartFilled = faHeartSolid;
  favouritePostIds: Set<String> = new Set();
  faCart = faCartShopping;
  quantity: number = 1;

  images = [
    {
      imageSrc: 'assets/banner_3.png',
      imageAlt: 'banner_3',
    },
    {
      imageSrc: 'assets/banner_1.png',
      imageAlt: 'banner_1',
    },
    {
      imageSrc: 'assets/banner_2.png',
      imageAlt: 'banner_2',
    },

    {
      imageSrc: 'assets/banner_4.png',
      imageAlt: 'banner_4',
    },
    {
      imageSrc: 'assets/banner_5.png',
      imageAlt: 'banner_5',
    },
  ];

  ngOnInit(): void {
    this.loadPosts();

    this.authService.userDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        if (this.user && this.user._id) {
          this.favouriteService.getAllFavourites(this.user._id).subscribe(
            (response) => {
              if (response.data) {
                response.data.forEach((fav: any) =>
                  this.favouritePostIds.add(fav._id)
                );
              }
            },
            (error) => {
              this.notificationService.showNotification(
                'Error fetching favorites'
              );
            }
          );
        }
      },
      error: (error) => {
        this.notificationService.showNotification(
          'Error fetching user details'
        );
      },
    });
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          if (!searchTerm) {
            return this.postService.getAllPosts();
          }
          return this.postService.searchPost(searchTerm);
        })
      )
      .subscribe(
        (response) => {
          if (response && response.data.length > 0) {
            this.posts = response.data.filter(
              (post: any) => post.featured === true
            );
            if (this.posts.length === 0) {
              this.notificationService.showNotification(
                'No featured posts found'
              );
            }
          } else {
            this.posts = [];
            this.notificationService.showNotification('No posts found');
          }
        },
        (error) => console.log(error)
      );
  }
  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
  addToCart(postId: string) {
    if (this.user._id) {
      this.cartService
        .addToCart(this.user._id, postId, this.quantity)
        .subscribe(
          (response) => {
            if (response.cartData) {
              this.notificationService.showNotification(response.message);

            }
          },
          (error) => {
            this.notificationService.showNotification(
              'Error adding item to cart'
            );
          }
        );
    } else {
      console.log('err');
    }
  }
  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (response) => {
        this.posts = response.data.filter(
          (post: any) => post.featured === true
        );
      },
      (error) => console.log(error)
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
