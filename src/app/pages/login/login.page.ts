import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  emailInput = '';
  emailSubmitted = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  validateEmail(email: string): boolean {
    const emailPattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailPattern.test(email);
  }

  async signInWithMagicLink() {
    this.isLoading = true;

    if (!this.validateEmail(this.emailInput)) {
      alert('Invalid email entered!');
      this.isLoading = false;
      return;
    }

    await this.authService.signInWithMagicLink(this.emailInput);
  }

  resetForm() {
    this.emailSubmitted = false;
  }
}
