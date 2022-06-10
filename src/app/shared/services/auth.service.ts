import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public auth: AngularFireAuth, private router: Router) {}

  getCurrentUser(): Observable<firebase.User> {
    return this.auth.user.pipe(take(1));
  }

  isCurrentUserAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(map((currentUser) => !!currentUser));
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
