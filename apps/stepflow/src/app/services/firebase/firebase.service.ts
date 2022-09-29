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

    private readonly _db: firebase.firestore.Firestore;
    private readonly _auth: firebase.auth.Auth;
    private readonly _provider = {
        emailAuth: firebase.auth.EmailAuthProvider,
    };
    private readonly _function: firebase.functions.Functions;
    private readonly _storage: firebase.storage.Storage;
    private readonly _fieldPathId: firebase.firestore.FieldPath;

    constructor() {
        firebase.initializeApp(this.stepflowAppFirebaseConfig);

        this._db = firebase.firestore();
        this._auth = firebase.auth();
        this._provider = {
            emailAuth: firebase.auth.EmailAuthProvider,
        };
        this.auth.setPersistence('local');

        this._function = firebase.functions();

        this._storage = firebase.storage();

        this._fieldPathId = firebase.firestore.FieldPath.documentId();
    }

    get db() {
        return this._db;
    }

    get auth() {
        return this._auth;
    }

    get provider() {
        return this._provider;
    }

    get function() {
        return this._function;
    }

    get storage() {
        return this._storage;
    }

    get fieldPathId() {
        return this._fieldPathId;
    }

    public getDeleteField() {
        return firebase.firestore.FieldValue.delete();
    }
}
