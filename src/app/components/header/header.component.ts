import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isCollapsed = true;

  constructor(public authService: AuthService) {}


  showMenu(): boolean {

    return true;
  }

  logout(): void {
    this.authService.logout();
  }
}
