import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../shared/notifications/notification.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  postService = inject(PostService);
  posts: Post[] = [];
  fb = inject(FormBuilder);
  postForm!: FormGroup;
  isEditMoe: boolean = false;
  selectedPost: Post | null = null;
  p: number = 1;

  constructor(private notificationService: NotificationService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      images: ['', Validators.required],
      author: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(
      (response) => {
        this.posts = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  editPost(post: Post) {
    this.isEditMoe = true;
    this.selectedPost = post;
    this.postForm.patchValue(post);
    this.toggleModal(true);
  }
  openAddPost() {
    this.isEditMoe = false;
    this.postForm.reset();
    this.toggleModal(true);
  }
  openDeletePost(post: Post): void {
    this.selectedPost = post;
    const modalEl = document.getElementById('deleteConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  onDelete(): void {
    if (this.selectedPost) {
      this.postService.deletePost(this.selectedPost._id).subscribe(
        (response) => {
          if (response.success) {
            this.posts = this.posts.filter(
              (p) => p._id !== this.selectedPost?._id
            );
            this.notificationService.showNotification(
              'Post deleted successfully'
            );
            this.selectedPost = null;
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMoe && this.selectedPost) {
      this.postService
        .updatePost(this.selectedPost._id, this.postForm.value)
        .subscribe(
          (response) => {
            if (response.success) {
              const index = this.posts.findIndex(
                (p) => p._id === this.selectedPost!._id
              );
              this.notificationService.showNotification(
                'Post updated successfully'
              );
              if (index !== -1) {
                this.posts[index] = {
                  ...this.posts[index],
                  ...this.postForm.value,
                };
              }
              this.selectedPost = null;
              this.postForm.reset();
              this.loadPosts();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.postService.addPost(this.postForm.value).subscribe((response) => {
        if (response.success) {
          this.posts.push(response.data);
          this.notificationService.showNotification('Post added successfully');
          this.postForm.reset();
        }
      });
    }
  }
  toggleModal(open: boolean): void {
    const modalEl = document.getElementById('editPostModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      if (open) {
        modal.show();
      } else {
        modal.hide();
      }
    }
  }
}
