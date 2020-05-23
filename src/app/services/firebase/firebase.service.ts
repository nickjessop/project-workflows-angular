import { Injectable } from '@angular/core';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import { FieldConfig } from '../../models/interfaces/core-component';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private firebaseConfig = {
        apiKey: 'AIzaSyAejSkkVrvn4kWYtgbrL_UJCpyAKOaqXuA',
        authDomain: 'steppy-4d4a7.firebaseapp.com',
        databaseURL: 'https://steppy-4d4a7.firebaseio.com',
        projectId: 'steppy-4d4a7',
        storageBucket: 'steppy-4d4a7.appspot.com',
        messagingSenderId: '905912458711',
        appId: '1:905912458711:web:85211e6e32a8a6e6cebf92',
        measurementId: 'G-FK7JVL5776',
    };

    private readonly db?: firebase.firestore.Firestore;
    private readonly auth?: firebase.auth.Auth;

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
