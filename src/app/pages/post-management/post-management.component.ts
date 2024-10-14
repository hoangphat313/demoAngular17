import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../shared/notifications/notification.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { CurrencyFormatDirective } from '../../directives/currency-format.directive';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LottieComponent } from 'ngx-lottie';
@Component({
  selector: 'app-post-management',
  imports: [
    SafeHtmlPipe,
    CurrencyFormatDirective,
    FormatCurrencyPipe,
    MatSlideToggleModule,
    FontAwesomeModule,
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CKEditorModule,
    LottieComponent,
  ],
  standalone: true,

  templateUrl: './post-management.component.html',
  styleUrl: './post-management.component.scss',
})
export class PostManagementComponent implements OnInit  {
  postService = inject(PostService);
  posts: Post[] = [];
  fb = inject(FormBuilder);
  postForm!: FormGroup;
  isEditMode: boolean = false;
  selectedPost: Post | null = null;
  p: number = 1;
  searchControl = new FormControl();
  private searchSubscription = new Subscription();
  avatarPreview: string[] = [];
  faBars = faBarsProgress;
  public Editor:any =  ClassicEditor;
  lottieLoadingOptions: any;
  isLoading: boolean = true;

  constructor(private notificationService: NotificationService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.lottieLoadingOptions = {
      path: 'assets/loading.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }
  ngOnInit(): void {
    this.loadPosts();
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
      .subscribe((response) => {
        if (response && response.data.length > 0) {
          this.posts = response.data;
        } else {
          this.posts = [];
          this.notificationService.showNotification('No posts found');
        }
      });
  }

  loadPosts() {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe(
      (response) => {
        this.isLoading = false;
        this.posts = response.data;
      },
      (error) => {
        this.isLoading = false;
        this.notificationService.showNotification('Error fetching posts');
      }
    );
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
      this.avatarPreview = [];
      const maxSize = 10 * 1024 * 1024;
      for (const file of Array.from(target.files)) {
        if (file.size > maxSize) {
          this.notificationService.showNotification(
            'Kích thước hình ảnh quá lớn. Vui lòng chọn hình ảnh nhỏ hơn 10MB.'
          );
          continue;
        }
        const base64 = await this.getBase64(file);
        this.avatarPreview.push(base64);
      }
    }
  }
  editPost(post: Post) {
    this.isEditMode = true;
    this.selectedPost = post;
    this.postForm.patchValue(post);
    this.avatarPreview = post.images;
    this.toggleModal(true);
  }
  openAddPost() {
    this.isEditMode = false;
    this.postForm.reset();
    this.avatarPreview = [];
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
            const modalEl = document.getElementById('deleteConfirmModal');
            if (modalEl) {
              const modal = bootstrap.Modal.getInstance(modalEl);
              if (modal) {
                modal.hide();
              }
            }
            this.selectedPost = null;
          }
        },
        (error) => {
          this.notificationService.showNotification(error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedPost) {
      const updateData = {
        ...this.postForm.value,
        images: this.avatarPreview,
      };
      this.postService.updatePost(this.selectedPost._id, updateData).subscribe(
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
                images: this.avatarPreview,
              };
            }
            this.selectedPost = null;
            this.postForm.reset();
            this.avatarPreview = [];
            this.toggleModal(false);
            this.loadPosts();
          }
        },
        (error) => {
          this.notificationService.showNotification(error);
        }
      );
    } else {
      if (this.postForm.valid) {
        const updateData = {
          ...this.postForm.value,
          images: this.avatarPreview,
        };
        this.postService.addPost(updateData).subscribe((response) => {
          if (response.success) {
            this.notificationService.showNotification(
              'Post added successfully'
            );
            this.postForm.reset();
            this.avatarPreview = [];
            this.toggleModal(false);
            this.loadPosts();
          } else {
            this.notificationService.showNotification('Failed to add post');
          }
        });
      }
    }
  }
  toggleModal(open: boolean): void {
    const modalEl = document.getElementById('editPostModal');
    if (modalEl) {
      const modal =
        bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      if (modal && open) {
        modal.show();
      } else {
        modal.hide();
      }
    }
  }
  toggleFeaturedPost(postId: string, currentFeatured: boolean) {
    const newFeatured = !currentFeatured;
    this.postService.updateFeaturedPost(postId, newFeatured).subscribe(
      (response) => {
        this.notificationService.showNotification('Featured post updated');
        this.loadPosts();
      },
      (error) => {
        this.notificationService.showNotification(
          'Failed to update featured post'
        );
      }
    );
  }
}
