import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { take, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
// import { HttpClient } from '@angular/common/http';

import { Magic } from 'magic-sdk';
// import Magic from 'magic-sdk';
// eslint-disable-next-line @typescript-eslint/naming-convention
// const Magic = require('magic-sdk');

const magic = new Magic(environment.magicLinkApiKey);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private firebaseFuncs: AngularFireFunctions // private http: HttpClient
  ) {}

  getCurrentUser(): Observable<firebase.User> {
    return this.auth.user.pipe(take(1));
  }

  isCurrentUserAuthenticated(): Observable<boolean> {
    return this.getCurrentUser().pipe(map((currentUser) => !!currentUser));
  }

  async signInWithMagicLink(email: string) {
    // const helloWordFunc = this.firebaseFuncs.httpsCallable('helloWorld');
    // helloWordFunc({}).pipe(take(1)).subscribe((result) => {
    //   console.log('helloWord Firebase Function Called:', result);
    // });

    // this.http
    //   .get(
    //     'https://us-central1-tap-auth-demo-fireb-magiclink.cloudfunctions.net/helloWorld'
    //   )
    //   .subscribe((res) => console.log('helloWorld function called:', res));

    return new Promise<void>(async (resolve, reject) => {
      const didToken = await magic.auth.loginWithMagicLink({ email });

      const authFunc = this.firebaseFuncs.httpsCallable(
        'getFirebaseUserAccessToken'
      );
      authFunc({ didToken })
        .pipe(take(1))
        .subscribe(async (result) => {
          // console.log('firebase func executed:', result);
          const loginRes = await this.auth.signInWithCustomToken(result.token);
          // console.log('User logged in:', loginRes);
          this.router.navigate(['']);
          resolve();
        });
    });
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
