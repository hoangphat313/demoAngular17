import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Post, User } from '../../core/model/common.model';
import { PostService } from '../../core/services/post.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  postService = inject(PostService);
  router = inject(Router);
  user!: User;
  posts: Post[] = [];
  ngOnInit(): void {
    this.loadPosts();
    this.authService.userDetails().subscribe({
      next: (response) => {
        this.user = response.data;
      },
    });
  }
  logout() {
    this.authService.logout();
  }
  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (response) => {
        this.posts = response.data;
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
