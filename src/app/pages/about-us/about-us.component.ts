import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { EmailService } from '../../core/services/email.service';
import { NotificationService } from '../../shared/notifications/notification.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  faCheck = faCheckCircle;
  emailForm!: FormGroup;
  showForm: boolean = false;
  faPaperPlane = faPaperPlane;
  emailService = inject(EmailService);
  notificationService = inject(NotificationService);
  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  toggleOpenForm(): void {
    this.showForm = !this.showForm;
  }
  sendEmail(): void {
    if (this.emailForm.valid) {
      this.emailService
        .sendEmail(this.emailForm.value.email)
        .pipe(
          catchError((error) => {
            this.notificationService.showNotification('Lỗi gửi email.');
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.notificationService.showNotification(
              'Gửi email đăng ký thành công'
            );
            this.emailForm.reset();
            this.showForm = false;
          }
        });
    } else {
      this.notificationService.showNotification('Lỗi gửi email');
    }
  }
}
