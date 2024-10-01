import {
  Component,
  effect,
  HostListener,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/model/common.model';
import { NotificationService } from '../notifications/notification.service';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  postService = inject(PostService);
  notificationService = inject(NotificationService);
  isLoggedIn = this.authService.isLoggedIn();
  injector = inject(Injector);
  user!: User;
  router = inject(Router);
  searchControl = new FormControl();
  posts: Post[] = [];

  ngOnInit() {
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
  togglePostManagement() {
    if (this.user.isAdmin) {
      this.router.navigate(['post_management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
  toggleUserManagement() {
    if (this.user.isAdmin) {
      this.router.navigate(['user_management']);
    } else
      this.notificationService.showNotification(
        'You are not authorized to access this page'
      );
  }
}
