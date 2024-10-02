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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  postService = inject(PostService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  user!: User;
  posts: Post[] = [];
  p: number = 1;
  searchControl = new FormControl();
  private searchSubscription: Subscription = new Subscription();

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
              this.notificationService.showNotification('No featured posts found');
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
  logout() {
    this.authService.logout();
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
}
