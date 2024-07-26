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
        apiKey: '[api_key]',
        authDomain: '[auth_domain]',
        databaseURL: '[database_url]',
        projectId: '[project_id]',
        storageBucket: '[storage_bucket]',
        messagingSenderId: '[message_sender_id]',
        appId: '[app_id]',
        measurementId: '[measurement_id]',
    };

    private stepflowAppFirebaseConfig = {
        apiKey: '[api_key]',
        authDomain: '[auth_domain]',
        databaseURL: '[database_url]',
        projectId: '[project_id]',
        storageBucket: '[storage_bucket]',
        messagingSenderId: '[message_sender_id]',
        appId: '[app_id]',
        measurementId: '[measurement_id]',
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
}
