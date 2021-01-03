import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private url = '';

    constructor(private firebaseService: FirebaseService, private http: HttpClient) {}
}
