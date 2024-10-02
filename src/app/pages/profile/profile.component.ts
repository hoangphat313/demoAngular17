import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/model/common.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  user!: User;
  ngOnInit(): void {
    this.loadUserDetail();
  }
  loadUserDetail(): void {
    this.authService.userDetails().subscribe((response) => {
      this.user = response.data;
    });
  }
}
