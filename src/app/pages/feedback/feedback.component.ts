import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FeedbackService } from '../../core/services/feedback.service';
import { FormsModule } from '@angular/forms';
import { IFeedback } from '../../core/model/common.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  isOpen: boolean = false;
  faComment = faComment;
  feedbackData: IFeedback = {
    name: '',
    email: '',
    message: '',
    _id: '',
    status: '',
  };
  constructor(
    private feedbackService: FeedbackService,
    private notificationService: NotificationService
  ) {}
  toggleOpenForm() {
    this.isOpen = !this.isOpen;
    const chatBubble = document.querySelector('.chat-bubble');
    if (this.isOpen) {
      chatBubble?.classList.add('open');
    } else {
      chatBubble?.classList.remove('open');
    }
  }
  onSubmit() {
    {
      this.feedbackService.addFeedback(this.feedbackData).subscribe({
        next: () => {
          this.notificationService.showNotification(
            'Feedback submitted successfully'
          );
          this.isOpen = false;
          this.feedbackData = {
            name: '',
            email: '',
            message: '',
            _id: '',
            status: '',
          };
        },
        error: (error) => {
          this.notificationService.showNotification(
            'Failed to submit feedback'
          );
        },
      });
    }
  }
}
