import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IFeedback } from '../../core/model/common.model';
import { FeedbackService } from '../../core/services/feedback.service';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { IconService } from '../../core/services/icon.service';
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-feedback-management',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './feedback-management.component.html',
  styleUrl: './feedback-management.component.scss',
})
export class FeedbackManagementComponent implements OnInit {
  feedbacks: IFeedback[] = [];
  p: number = 1;
  searchControl = new FormControl();
  private searchSubscription = new Subscription();
  selectedFeedback: IFeedback | null = null;
  feedbackService = inject(FeedbackService);
  notificationService = inject(NotificationService);
  iconService = inject(IconService);
  faBars = faBarsProgress;
  ngOnInit(): void {
    this.loadFeedbacks();
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          if (!searchTerm) {
            return this.feedbackService.getAllFeedback();
          }
          return this.feedbackService.searchFeedback(searchTerm);
        })
      )
      .subscribe((response) => {
        if (response && response.data.length > 0) {
          this.feedbacks = response.data;
        } else {
          this.feedbacks = [];
          this.notificationService.showNotification('No feedbacks found');
        }
      });
  }
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
  openDeleteForm(feedback: IFeedback): void {
    this.selectedFeedback = feedback;
    const modalEl = document.getElementById('deleteConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  onDelete(): void {
    if (this.selectedFeedback) {
      this.feedbackService.deleteFeedback(this.selectedFeedback._id).subscribe(
        (response) => {
          if (response.success) {
            this.feedbacks = this.feedbacks.filter(
              (p) => p._id !== this.selectedFeedback?._id
            );
          }
          this.notificationService.showNotification(
            'Feedback deleted successfully'
          );
          const modalEl = document.getElementById('deleteConfirmModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) {
              modal.hide();
            }
          }
          this.loadFeedbacks();
          this.selectedFeedback = null;
        },
        (error) => {
          this.notificationService.showNotification(error);
        }
      );
    }
  }
  updateStatusFeedback(feedback: IFeedback) {
    this.feedbackService
      .updateFeedbackStatus(feedback._id, feedback.status!)
      .subscribe(
        (response) => {
          if (response.success) {
            if (this.selectedFeedback) {
              this.selectedFeedback.status = response.data.status;
            }
            this.loadFeedbacks();
            this.notificationService.showNotification(
              'Feedback status updated successfully'
            );
          } else {
            this.notificationService.showNotification(
              'Failed to update feedback status'
            );
          }
        },
        (error) => {
         this.notificationService.showNotification('Failed to update feedback status')
        }
      );
  }

  onDetailFeedback(feedback: IFeedback): void {
    this.selectedFeedback = { ...feedback };
    const modalEl = document.getElementById('feedbackDetailModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      if (modal) {
        modal.show();
      }
    }
  }
  loadFeedbacks(): void {
    this.feedbackService.getAllFeedback().subscribe((response) => {
      if (response.success) {
        this.feedbacks = response.data;
      } else {
        this.notificationService.showNotification('Failed to load feedbacks');
      }
    });
  }
}
