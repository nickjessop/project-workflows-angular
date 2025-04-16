import { TestBed } from '@angular/core/testing';

import { FirebaseService } from './firebase.service';
import { Test } from 'tslint';
import * as firebase from 'firebase';

describe('FirebaseService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: FirebaseService = TestBed.get(FirebaseService);
        expect(service).toBeTruthy();
    });

    it('should save user and delete user', () => {
        // const firebaseService: FirebaseService = TestBed.get(FirebaseService);
        // const db = firebaseService.getDbInstance();
        // let docRefCopy;
        //
        // db!
        //     .collection('users')
        //     .add({
        //         first: 'Ada',
        //         last: 'Lovelace',
        //         born: 1815,
        //     })
        //     .then(docRef => {
        //         console.log('Document written with ID: ', docRef.id);
        //         docRefCopy = docRef;
        //     })
        //     .catch(error => {
        //         console.error('Error adding document: ', error);
        //     });
        //
        // docRefCopy.delete().then((success) => {}, (error) => {
        //
        // });
    });
});
