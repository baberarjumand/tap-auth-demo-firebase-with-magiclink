import { MAGIC_LINK_API_KEY } from './magic-link-api-key';

// for the magic link api key, create an account on Magic.Link and get your API key
// Then create a file named 'magic-link-api-key.ts' in this folder.
// Then copy and paste the following code into it:

// export const MAGIC_LINK_API_KEY = 'pk_live_XXXXXXXXXXXXXXXXXXXXX';

export const environment = {
  firebase: {
    projectId: 'tap-auth-demo-fireb-magiclink',
    appId: '1:932041818255:web:1fc8f46cef8f202b7930fa',
    storageBucket: 'tap-auth-demo-fireb-magiclink.appspot.com',
    apiKey: 'AIzaSyA52r_vX6wIeHRJmLzGKi5CufIiSKBJZ_A',
    authDomain: 'tap-auth-demo-fireb-magiclink.firebaseapp.com',
    messagingSenderId: '932041818255',
    measurementId: 'G-4S3N1FV308',
  },
  production: true,
  magicLinkApiKey: MAGIC_LINK_API_KEY,
};
