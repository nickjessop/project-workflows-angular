import { Injectable } from '@angular/core';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import { from } from 'rxjs/internal/observable/from';
import { take } from 'rxjs/operators';

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

    constructor() {
        firebase.initializeApp(this.firebaseConfig);
        this.auth = firebase.auth();
    }

    public register(email: string, password: string) {
        return from(this.auth.createUserWithEmailAndPassword(email, password)).pipe(take(1));
    }

    public login(email: string, password: string) {
        return from(this.auth.signInWithEmailAndPassword(email, password)).pipe(take(1));
    }
}
