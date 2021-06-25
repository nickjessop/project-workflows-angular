import { Injectable } from '@angular/core';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from 'firebase';
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import 'firebase/analytics';
// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private authenticationFirebaseConfig = {
        apiKey: 'AIzaSyAhwXJ3W9O-Gk9b96FcZJEiBWWziNraLgI',
        authDomain: 'stepflow-d6a02.firebaseapp.com',
        databaseURL: 'https://stepflow-d6a02.firebaseio.com',
        projectId: 'stepflow-d6a02',
        storageBucket: 'stepflow-d6a02.appspot.com',
        messagingSenderId: '539731725055',
        appId: '1:539731725055:web:46c5cff639f4c4366e5aca',
        measurementId: 'G-7WQFDR9ZVR',
    };

    private stepflowAppFirebaseConfig = {
        apiKey: 'AIzaSyAhwXJ3W9O-Gk9b96FcZJEiBWWziNraLgI',
        authDomain: 'stepflow-d6a02.firebaseapp.com',
        databaseURL: 'https://stepflow-d6a02.firebaseio.com',
        projectId: 'stepflow-d6a02',
        storageBucket: 'stepflow-d6a02.appspot.com',
        messagingSenderId: '539731725055',
        appId: '1:539731725055:web:55df8145cb1ceb5b6e5aca',
        measurementId: 'G-YBLTH5VRQ9',
    };

    private readonly db: firebase.firestore.Firestore;
    private readonly auth: firebase.auth.Auth;
    private readonly provider = {
        emailAuth: firebase.auth.EmailAuthProvider,
        //GoogleAuth, etc.
    };
    private readonly functions: firebase.functions.Functions;
    private readonly storage: firebase.storage.Storage;
    private readonly fieldPathId: firebase.firestore.FieldPath;

    constructor() {
        firebase.initializeApp(this.stepflowAppFirebaseConfig);

        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.provider = {
            emailAuth: firebase.auth.EmailAuthProvider,
        };
        this.auth.setPersistence('local');

        this.functions = firebase.functions();

        this.storage = firebase.storage();

        this.fieldPathId = firebase.firestore.FieldPath.documentId();
    }

    public getDbInstance() {
        return this.db;
    }

    public getAuthInstance() {
        return this.auth;
    }

    public getProviderInstance() {
        return this.provider;
    }

    public getFunctionsInstance() {
        return this.functions;
    }

    public getStorageInstance() {
        return this.storage;
    }

    public getFieldPathId() {
        return this.fieldPathId;
    }
}
