import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  constructor(private authService: AuthService) {}

  confirmLogout(): void {
    this.authService.logout();
    this.closeModal();
  }

  closeModal(): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) as bootstrap.Modal;
      if (modal) {
        modal.hide();
      }
    }
  }
}
