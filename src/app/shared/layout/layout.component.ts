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
import { User } from '../../core/model/common.model';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  isLoggedIn = this.authService.isLoggedIn();
  injector = inject(Injector);
  user!: User;
  router = inject(Router);
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
  toggleAdmin() {
    if (this.user.isAdmin) {
      this.router.navigate(['profile']);
    } else this.notificationService.showNotification('You are not authorized');
  }
}
