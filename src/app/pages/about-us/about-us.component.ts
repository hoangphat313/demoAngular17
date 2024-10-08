import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  faCheck = faCheckCircle
}
