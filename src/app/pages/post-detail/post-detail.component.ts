import { Component, inject, OnInit } from '@angular/core';
import { Post, User } from '../../core/model/common.model';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FavouriteService } from '../../core/services/favourite.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { CartService } from '../../core/services/cart.service';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormatCurrencyPipe, FontAwesomeModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  postId: string = '';
  formattedContent: string[] = [];
  expanded: boolean = false;
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  favouriteService = inject(FavouriteService);
  user!: User;
  favouritePostIds: Set<String> = new Set();
  faHeart = faHeartRegular;
  faHeartFilled = faHeartSolid;
  cartService = inject(CartService);
  quantity: number = 1;
  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}
  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';
    this.postService.getPostById(this.postId).subscribe(
      (response) => {
        if (response.success && response.data) {
          this.post = response.data;
          if (this.post && this.post.content) {
            this.formattedContent = this.post.content
              .split('\n')
              .map((paragraph) => paragraph.trim());
          }
        }
      },
      (error) => console.log(error)
    );
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
  }
  toggleContent() {
    this.expanded = !this.expanded;
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
}
