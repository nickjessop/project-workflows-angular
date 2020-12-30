import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase';
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';
// Add the Firebase products that you want to use
import 'firebase/auth';
import { from } from 'rxjs/internal/observable/from';
import { take } from 'rxjs/operators';

export interface User {
    id: string;
    email: string | null;
    emailVerified: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private firebaseConfig = {
        apiKey: 'AIzaSyAhwXJ3W9O-Gk9b96FcZJEiBWWziNraLgI',
        authDomain: 'stepflow-d6a02.firebaseapp.com',
        databaseURL: 'https://stepflow-d6a02.firebaseio.com',
        projectId: 'stepflow-d6a02',
        storageBucket: 'stepflow-d6a02.appspot.com',
        messagingSenderId: '539731725055',
        appId: '1:539731725055:web:dac75c01a58ff8016e5aca',
        measurementId: 'G-3KY262229M',
    };

    private readonly auth: firebase.auth.Auth;
    // private readonly functions: firebase.functions.Functions;

    constructor(private router: Router) {
        firebase.initializeApp(this.firebaseConfig);
        // this.functions = firebase.functions();

        this.auth = firebase.auth();
    }

    public register(email: string, password: string) {
        return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(take(1));
    }

    public login(email: string, password: string) {
        return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(take(1));
    }

    public logout() {
        from(this.auth.signOut())
            .pipe(take(1))
            .subscribe(
                success => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.log('error signing user out');
                }
            );
    }

    public getCurrentUser() {
        return this.auth.currentUser;
    }

    // public getUserTotal() {
    //     const userTotal = this.functions.httpsCallable('userTotal');

    //     return from(userTotal()).pipe(take(1));
    // }

    /*
addMessage({text: messageText}).then(function(result) {
  // Read result of the Cloud Function.
  var sanitizedMessage = result.data.text;
  // ...
});

    */
}
