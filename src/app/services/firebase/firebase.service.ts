import { Injectable } from '@angular/core';
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';
// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private firebaseConfig = {
        apiKey: 'AIzaSyAhwXJ3W9O-Gk9b96FcZJEiBWWziNraLgI',
        authDomain: 'stepflow-d6a02.firebaseapp.com',
        databaseURL: 'https://stepflow-d6a02.firebaseio.com',
        projectId: 'stepflow-d6a02',
        storageBucket: 'stepflow-d6a02.appspot.com',
        messagingSenderId: '539731725055',
        appId: '1:539731725055:web:46c5cff639f4c4366e5aca',
        measurementId: 'G-7WQFDR9ZVR',
    };

    private readonly db: firebase.firestore.Firestore;
    private readonly auth: firebase.auth.Auth;

    constructor() {
        firebase.initializeApp(this.firebaseConfig);
        this.db = firebase.firestore();
        this.auth = firebase.auth();
    }

    public getDbInstance() {
        return this.db;
    }

    public getAuthInstance() {
        return this.auth;
    }
}
