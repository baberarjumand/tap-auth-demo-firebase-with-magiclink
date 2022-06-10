import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  emailInput = '';
  emailSubmitted = false;

  constructor() {}

  ngOnInit() {}

  validateEmail(email: string): boolean {
    const emailPattern =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return emailPattern.test(email);
  }

  signInWithMagicLink() {
    this.isLoading = true;

    if (!this.validateEmail(this.emailInput)) {
      alert('Invalid email entered!');
      this.isLoading = false;
      return;
    }

  }

  resetForm() {
    this.emailSubmitted = false;
  }
}
